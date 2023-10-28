// #ifndef H5
import TIM from "../lib/tim-wx";
import COS from "../lib/cos-wx-sdk-v5";
// #endif

// #ifdef H5
import TIM from "../lib/tim-js";
import COS from "../lib/cos-js-sdk-v5.min";
// #endif

let TLS = null;
let SDKAppID = null;
let userSig = null;
let userID = null;
let groupID = null;
let uid = null;

//直播间信息
let roomInfo = {
  room_no: ""
};

// 群组信息
let groupInfo = {
  group_id: "",
  join_time: "",
  quit_time: ""
};

// 监听接收消息方法名，具名，取消监听需要
let onSdkReady = null;
let onMessageReceived = null;

const setLogLevel = process.env.NODE_ENV === "production" ? 1 : 4;

import { GET_LIVEUSERSIGN, SAVE_LIVEIMGROUPID } from "../interface";
import { encodeUriParams, decodeUriParams } from "@/common/utils";

export default {
  data() {
    return {
      memberNum: 0,
      likeCount: 0,
      isMute: false, //是否全体禁言
      isLeaveFlag: false //主播离开标识
    };
  },
  computed: {
    muteText() {
      return this.isMute ? "全体禁言中" : "已解除禁言";
    }
  },
  onLoad() {},
  onShow() {
    // #ifndef H5
    // 保持屏幕常亮
    uni.setKeepScreenOn({
      keepScreenOn: true
    });
    // #endif
  },
  onHide() {
    console.log("onHide");
    // #ifndef H5
    uni.setKeepScreenOn({
      keepScreenOn: false
    });
    // #endif
  },
  onUnload() {
    console.log("onUnload", TLS);
    // #ifndef H5
    uni.setKeepScreenOn({
      keepScreenOn: false
    });
    // #endif
  },
  methods: {
    // 获取签名
    getUserSig() {
      return new Promise((resolve, reject) => {
        GET_LIVEUSERSIGN()
          .then(({ data }) => {
            SDKAppID = data.sdkAppid;
            userSig = data.userSig;
            userID = data.uname;
            uid = data.uid;
            resolve();
          })
          .catch(() => {
            console.log("获取签名失败");
          });
      });
    },
    // 初始直播im
    initTLS(info) {
      roomInfo = info;
      this.getUserSig().then(() => {
        TLS = TIM.create({ SDKAppID: SDKAppID });
        TLS.setLogLevel(setLogLevel);
        TLS.registerPlugin({ "cos-js-sdk": COS });

        let onLoginEd = TLS.login({
          userID: userID,
          userSig: userSig
        });
        onLoginEd
          .then(({ data }) => {
            console.log("im登录成功", data);
            if (data.repeatLogin === true) {
              // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
              console.log(data.errorInfo);
              TLS.logout().then(res => {
                console.log("重新登录");
                TLS.login({
                  userID: userID,
                  userSig: userSig
                });
              });
            }
          })
          .catch(error => {
            console.log("login error:", error); // 登录失败的相关信息
            TLS = null;
            this.$Prompt
              .modal({
                content: JSON.stringify(error),
                showCancel: false
              })
              .then(() => {
                this.$Navigate.back();
              });
          });

        onSdkReady = async res => {
          // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
          // event.name - TIM.EVENT.SDK_READY
          console.log("onSdkReady完成");
          typeof this.onTLSReady === "function" &&
            this.onTLSReady({ SDKAppID });
        };
        TLS.on(TIM.EVENT.SDK_READY, onSdkReady, this);

        onMessageReceived = ({ data }) => {
          // 收到推送的单聊、群聊、群提示、群系统通知的新消息
          data.forEach(e => {
            console.log(e);
            if (e.payload.data) {
              console.log("[监听自定义消息]", e.payload.data);
            }
            if (e.payload.data == "banned") {
              console.log("主播已被禁播");
              this.destroyTLS();
              return this.$Prompt
                .modal({
                  title: "提示",
                  showCancel: false,
                  content: "抱歉，主播已被禁播"
                })
                .then(() => {
                  this.$Navigate.replace("/pages/live/index");
                });
            }
            if (e.payload.data == "abnormal") {
              console.log("直播间异常");
              this.destroyTLS();
              return this.$Prompt
                .modal({
                  title: "提示",
                  showCancel: false,
                  content: "抱歉，直播间异常"
                })
                .then(() => {
                  this.$Navigate.replace("/pages/live/index");
                });
            }
            if (e.payload.data == "end") {
              console.log("主播已下播");
              this.quitGroup().then(() => {
                this.$Navigate.replace({
                  path: "/packages/live/end",
                  query: {
                    anchor_id: this.anchor_id,
                    live_id: this.live_id
                  }
                });
              });
            }
            if (e.payload.data == "leave") {
              const param = decodeUriParams(e.payload.description);
              const is_leaving = parseInt(param.is_leaving);
              console.log(is_leaving ? "主播离开了" : "主播离开后进入直播间");
              this.setPageType({ type: is_leaving ? 2 : 0 });
              this.pushNoticeList({
                type: "system",
                name: is_leaving ? "主播离开了" : "主播进来了"
              });
              this.updateWatchNum();
            }
            if (e.payload.data == "now_online_num") {
              console.log("[观看人数变化]");
            }
            if (e.payload.data == "watch_time") {
              const param = decodeUriParams(e.payload.description);
              console.log(param.uname + "退出群聊触发自定义消息：观看时间");
            }
            if (e.payload.data == "mute") {
              const param = decodeUriParams(e.payload.description);
              const is_muting = parseInt(param.is_muting);
              this.isMute = !!is_muting;
              console.log(this.muteText);
              this.pushMsgList({
                type: "system",
                name: "公告",
                content: this.muteText
              });
            }
            if (e.payload.data == "like") {
              const param = decodeUriParams(e.payload.description);
              const count = parseInt(param.like_count || 0);
              console.log(param.uname + "点赞主播");
              this.likeCount = count;
              // console.log("点赞数", param.like_num);
              // console.log("点赞总数", count);
            }
            if (e.payload.data == "follow") {
              const param = decodeUriParams(e.payload.description);
              console.log(param.uname + "关注主播");
              this.pushNoticeList({
                type: "follow",
                name: e.from
              });
            }
            if (e.payload.data == "share") {
              const param = decodeUriParams(e.payload.description);
              console.log(param.uname + "分享直播间");
              this.pushNoticeList({
                type: "share",
                name: e.from
              });
            }
            if (e.payload.data == "click_goods") {
              const param = decodeUriParams(e.payload.description);
              console.log(param.uname + "点击了商品，正前往购物");
              this.pushNoticeList({
                type: "shopping",
                name: e.from
              });
            }
            if (e.payload.data == "recommendgoods") {
              console.log("主播设置主推商品");
              this.getRecGoodsList();
            }
            if (e.payload.data == "gift") {
              const param = decodeUriParams(e.payload.description);
              console.log(param.uname + "打赏礼物");
              this.pushGiftList({
                ...JSON.parse(e.payload.extension)
              });
            }
            if (e.type === "TIMGroupTipElem") {
              // 消息通知
              console.log(
                "[消息通知]",
                parseGroupTipContent(e.payload).content
              );
              this.pushNoticeList({
                type: parseGroupTipContent(e.payload).type,
                name: parseGroupTipContent(e.payload).name
              });
              this.updateWatchNum();
            }
            if (e.type === "TIMGroupSystemNoticeElem") {
              // 系统消息
              console.log("[系统消息]", parseGroupSystemNotice(e.payload));
              if (e.payload.operationType === 5) {
                console.log("主播，解散群组，已下播");
                this.destroyTLS();
                return this.$Navigate.replace({
                  path: "/packages/live/end",
                  query: {
                    anchor_id: this.anchor_id,
                    live_id: this.live_id
                  }
                });
              }
            }
            if (e.type === "TIMTextElem") {
              // 会话消息
              this.pushMsgList({
                type: "user",
                name: e.from,
                content: e.payload.text
              });
            }
          });
        };

        TLS.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived, this);
      });
    },
    // 销毁
    destroyTLS() {
      if (TLS) {
        this.offListener();
        TLS.logout()
          .then(res => {
            console.log(res);
          })
          .catch(e => {
            console.log(e);
          });
      }
      TLS = null;
      SDKAppID = null;
      userSig = null;
      userID = null;
      groupID = null;
      uid = null;
      roomInfo = {
        room_no: ""
      };
      groupInfo = {
        group_id: "",
        join_time: "",
        quit_time: ""
      };
    },
    // 创建群聊
    createGroup() {
      return new Promise((resolve, reject) => {
        let option = {
          type: TIM.TYPES.GRP_AVCHATROOM,
          name: roomInfo.room_no.toString(),
          memberList: [
            {
              userID: userID
            }
          ] // 如果填写了 memberList，则必须填写 userID
        };
        TLS.createGroup(option)
          .then(({ data }) => {
            // 创建群成功
            console.log("[创建群成功]", data);
            groupID = data.group.groupID;
            // 保存群组id
            this.joinGroup(groupID).then(() => {
              resolve();
            });
            SAVE_LIVEIMGROUPID({
              group_id: groupID,
              anchor_id: this.anchor_id
            })
              .then(res => {
                console.log("[群组id保存成功]", res);
              })
              .catch(() => {});
          })
          .catch(error => {
            console.log(error);
            this.offListener();
            this.$Prompt
              .modal({
                content: error,
                showCancel: false
              })
              .then(() => {
                this.$Navigate.back();
              });
          });
      });
    },
    // 加入群聊
    joinGroup(groupId) {
      return new Promise((resolve, reject) => {
        let option = {
          groupID: groupId,
          type: TIM.TYPES.GRP_AVCHATROOM
        };
        console.log(option);
        TLS.joinGroup(option)
          .then(({ data }) => {
            console.log("[加入群聊成功]", data, data.group.memberNum);
            groupInfo.group_id = data.group.groupID;
            groupInfo.join_time = Math.round(new Date() / 1000);
            groupID = data.group.groupID;
            // 加群成功
            this.updateWatchNum();
            if (TIM.TYPES.JOIN_STATUS_SUCCESS == data.status) {
            }
            if (data.group.selfInfo && data.group.selfInfo.role == "Owner") {
              // 群主加入成功
              this.sendCustomMessage({
                name: "leave",
                query: {
                  is_leaving: 0
                }
              });
              this.isLeaveFlag = false;
            }
            resolve();
          })
          .catch(error => {
            console.log(error);
            this.$Prompt.modal({
              content: JSON.stringify(error),
              showCancel: false
            });
            this.destroyTLS();
          });
      });
    },
    // 退出群聊
    quitGroup() {
      return new Promise((resolve, reject) => {
        let option = groupID;
        if (TLS && roomInfo.live_uid) {
          groupInfo.quit_time = Math.round(new Date() / 1000);
          this.sendCustomMessage({
            name: "watch_time",
            query: {
              group_id: groupInfo.group_id,
              join_time: groupInfo.join_time,
              quit_time: groupInfo.quit_time
            }
          })
            .then(() => {
              TLS.quitGroup(option)
                .then(({ data }) => {
                  console.log("[退出群聊]", data.groupID);
                  this.destroyTLS();
                  resolve();
                })
                .catch(() => {
                  resolve();
                });
            })
            .catch(() => {
              resolve();
            });
        } else {
          resolve();
        }
      });
    },
    // 解散群组
    dismissGroup() {
      return new Promise((resolve, reject) => {
        let option = groupID;
        if (TLS) {
          TLS.dismissGroup(option)
            .then(({ data }) => {
              console.log("[解散群聊]", data.groupID);
              this.destroyTLS();
              resolve();
            })
            .catch(() => {
              resolve();
            });
        } else {
          resolve();
        }
      });
    },
    // 主播离开直播间
    leaveLiveRoom() {
      if (TLS) {
        this.isLeaveFlag = true;
        this.sendCustomMessage({
          name: "leave",
          query: {
            is_leaving: 1
          }
        });
      }
    },
    // 主播离开后再次进入直播间
    leavedEnterLiveRoom() {
      if (TLS && this.isLeaveFlag) {
        this.sendCustomMessage({
          name: "leave",
          query: {
            is_leaving: 0
          }
        });
        this.isLeaveFlag = false;
      }
    },
    // 获取群资料
    getGroupInfoProfile() {
      return new Promise((resolve, reject) => {
        TLS.getGroupProfile({
          groupID: groupID
        })
          .then(({ data }) => {
            resolve(data.group);
          })
          .catch(() => {
            resolve({ memberNum: 0 });
          });
      });
    },
    // 更新群资料
    updateGroupProfile(options = {}) {
      return new Promise((resolve, reject) => {
        TLS.updateGroupProfile({
          groupID: groupID,
          ...options
        })
          .then(({ data }) => {
            console.log("[更新群资料成功]", data.group);
            resolve(data);
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 更新在线观看人数
    updateWatchNum() {
      return new Promise(resolve => {
        if (groupID) {
          this.getGroupInfoProfile().then(({ memberNum }) => {
            console.log("在线人数", memberNum);
            this.memberNum = memberNum;
            this.sendCustomMessage({
              name: "now_online_num",
              query: {
                watch_num: this.memberNum
              }
            })
              .then(() => {
                resolve();
              })
              .catch(() => {
                resolve();
              });
          });
        } else {
          resolve();
        }
      });
    },
    // 取消监听
    offListener() {
      if (TLS) {
        TLS.off(TIM.EVENT.SDK_READY, onSdkReady);
        TLS.off(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
      }
    },
    // 获取消息列表
    getMessageList() {
      return new Promise((resolve, reject) => {
        let option = {
          conversationID: `GROUP${this.groupID}`,
          nextReqMessageID: "",
          count: 15
        };
        this.TLS.getMessageList(option).then(({ data }) => {
          const messageList = data.messageList; // 消息列表。
          const nextReqMessageID = data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
          const isCompleted = data.isCompleted; // 表示是否已经拉完所有消息。
          console.log(data);
          resolve(data);
        });
      });
    },
    // 发送消息
    sendMessage(options = {}) {
      if (!TLS) {
        return;
      }
      return new Promise((resolve, reject) => {
        let create = TLS.createTextMessage({
          to: groupID,
          conversationType: TIM.TYPES.CONV_GROUP,
          payload: {
            ...options
          }
        });
        TLS.sendMessage(create)
          .then(({ data }) => {
            const { message } = data;
            this.pushMsgList({
              type: "user",
              name: message.from,
              content: message.payload.text
            });
            resolve();
          })
          .catch(error => {
            // 发送失败
            console.warn("sendMessage error:", error);
            reject();
          });
      });
    },
    // 发送自定义消息
    sendCustomMessage(options = {}) {
      if (!TLS) {
        return;
      }
      return new Promise((resolve, reject) => {
        let query = {
          uid: uid,
          uname: userID,
          live_id: roomInfo.live_id,
          anchor_id: this.anchor_id,
          ...options.query
        };
        let create = TLS.createCustomMessage({
          to: groupID,
          conversationType: TIM.TYPES.CONV_GROUP,
          payload: {
            data: options.name || "",
            description: encodeUriParams(query),
            extension: options.extension
              ? JSON.stringify({ ...options.extension })
              : ""
          }
        });
        TLS.sendMessage(create)
          .then(({ data }) => {
            console.log("[发送自定义消息]", data.message.payload);
            resolve();
          })
          .catch(error => {
            reject();
          });
      });
    }
  }
};

// 解析系统消息
function parseGroupSystemNotice(payload) {
  const groupName =
    payload.groupProfile.groupName || payload.groupProfile.groupID;
  switch (payload.operationType) {
    case 1:
      return `${payload.operatorID} 申请加入群组：${groupName}`;
    case 2:
      return `成功加入群组：${groupName}`;
    case 3:
      return `申请加入群组：${groupName}被拒绝`;
    case 4:
      return `被管理员${payload.operatorID}踢出群组：${groupName}`;
    case 5:
      return `群：${groupName} 已被${payload.operatorID}解散`;
    case 6:
      return `${payload.operatorID}创建群：${groupName}`;
    case 7:
      return `${payload.operatorID}邀请你加群：${groupName}`;
    case 8:
      return `你退出群组：${groupName}`;
    case 9:
      return `你被${payload.operatorID}设置为群：${groupName}的管理员`;
    case 10:
      return `你被${payload.operatorID}撤销群：${groupName}的管理员身份`;
    case 255:
      return "自定义群系统通知";
  }
}

// 解析群提示消息
function parseGroupTipContent(payload) {
  switch (payload.operationType) {
    case TIM.TYPES.GRP_TIP_MBR_JOIN:
      return {
        type: "join",
        name: payload.userIDList.join(","),
        content: `${payload.userIDList.join(",")}，进入直播间`
      };
    case TIM.TYPES.GRP_TIP_MBR_QUIT:
      return {
        type: "quit",
        name: payload.userIDList.join(","),
        content: `${payload.userIDList.join(",")}，退出直播间`
      };
    case TIM.TYPES.GRP_TIP_MBR_KICKED_OUT:
      return {
        type: "quit",
        name: payload.userIDList.join(","),
        content: `${payload.userIDList.join(",")}，被${
          payload.operatorID
        }踢出直播间`
      };
    case TIM.TYPES.GRP_TIP_MBR_SET_ADMIN:
      return {
        type: "",
        name: payload.userIDList.join(","),
        content: `${payload.userIDList.join(",")}，成为管理员`
      };
    case TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN:
      return {
        type: "",
        name: payload.userIDList.join(","),
        content: `${payload.userIDList.join(",")}，被撤销管理员`
      };
    case 5:
      return {
        type: "",
        name: payload.userIDList.join(","),
        content: `${payload.userIDList.join(",")}，主播已下播`
      };
    default:
      return {
        type: "",
        name: payload.userIDList.join(","),
        content: `[提示消息]`
      };
  }
}
