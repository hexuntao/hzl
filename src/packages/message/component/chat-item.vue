<template>
  <view class="chat-item" :class="info.type">
    <block v-if="info.type == 'system'">
      <text class="system">{{ info.content }}</text>
    </block>
    <block v-else-if="info.type == 'goods'">
      <view class="goods-card" v-if="info.goods">
        <lk-goods-card
          cell-padding
          :image="info.goods.img"
          :title="info.goods.name"
          :price="info.goods.price"
        >
          <lk-button
            slot="num"
            theme
            round
            size="mini"
            :color="theme.gradient"
            @click="sendGoods"
          >
            发给商家
          </lk-button>
        </lk-goods-card>
      </view>
    </block>
    <block v-else-if="info.type == 'mine'">
      <view class="content">
        <view class="read" :class="info.read_status == 1 ? 'ed' : 'no'">
          {{ info.read_status == 1 ? "已读" : "未读" }}
        </view>
        <view class="bubble" :class="content.type">
          <rich-text
            class="text"
            :nodes="content.text"
            v-if="content.type == 'text'"
          ></rich-text>
          <view class="picture" v-if="content.type == 'img'">
            <image
              class="picture-img"
              mode="widthFix"
              :src="content.imgsrc"
              @click="previewImage(content.imgsrc)"
            />
          </view>
          <view
            class="goods"
            v-if="content.type == 'goods'"
            @click="toGoodsDetail"
          >
            <view class="image-box">
              <image class="goods-img" :src="content.goods.img" />
            </view>
            <view class="goods-name">
              <view class="text">{{ content.goods.name }}</view>
            </view>
            <view class="goods-price first-letter">
              <text>¥{{ content.goods.price }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="info">
        <image class="avatar" mode="aspectFill" :src="user_avatar" />
      </view>
    </block>
    <block v-else-if="info.type == 'user'">
      <view class="info">
        <image class="avatar" mode="aspectFill" :src="info.from_avatar" />
      </view>
      <view class="content">
        <view class="name">
          <text class="text">{{ info.from_name }}</text>
        </view>
        <view class="bubble">
          <rich-text
            class="text"
            :nodes="content.text"
            v-if="content.type == 'text'"
          ></rich-text>
          <view class="picture" v-if="content.type == 'img'">
            <image
              class="picture-img"
              mode="widthFix"
              :src="content.imgsrc"
              @click="previewImage(content.imgsrc)"
            />
          </view>
        </view>
        <view
          class="read"
          v-if="info.read_status != 1"
          :class="info.read_status == 1 ? 'ed' : 'no'"
        >
          {{ info.read_status == 1 ? "已读" : "未读" }}
        </view>
      </view>
    </block>
    <block v-else-if="info.type == 'robot'">
      <view class="info">
        <image class="avatar" mode="aspectFill" :src="info.from_avatar" />
      </view>
      <view class="content">
        <view class="name">
          <text class="text">{{ info.from_name }}</text>
        </view>
        <view class="bubble">
          <rich-text
            class="text"
            :nodes="content.text"
            v-if="content.type == 'text'"
          ></rich-text>
          <view class="picture" v-if="content.type == 'img'">
            <image
              class="picture-img"
              mode="widthFix"
              :src="content.imgsrc"
              @click="previewImage(content.imgsrc)"
            />
          </view>
          <view
            class="question"
            v-if="info.question_list && info.question_list.length"
          >
            <view
              class="question-item"
              v-for="(q, q_i) in info.question_list"
              :key="q_i"
              @click="sendQuestion(q)"
            >
              {{ q.question }}
            </view>
          </view>
        </view>
        <view
          class="read"
          v-if="info.read_status != 1"
          :class="info.read_status == 1 ? 'ed' : 'no'"
        >
          {{ info.read_status == 1 ? "已读" : "未读" }}
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import baseMixin from "../mixin/base";
import { mapState } from "vuex";
export default {
  props: {
    info: Object
  },
  mixins: [baseMixin],
  computed: {
    ...mapState({
      user_avatar: ({ member }) => member.info.member_img
    }),
    content() {
      return this.escapeContent(this.info.content);
    }
  },
  methods: {
    toGoodsDetail() {
      this.$Navigate.push(
        "/packages/goods/detail?goods_id=" + this.content.goods.id
      );
    },
    previewImage(image) {
      if (image) {
        uni.previewImage({
          urls: [image]
        });
      }
    },
    sendQuestion(item) {
      this.$emit("send-question", item);
    },
    sendGoods() {
      const { id, price, img, name } = this.info.goods;
      let content = `goodsid[${id}]goodspic[${img}] goodsname[${name.replace(
        /\s+/g,
        ""
      )}] goodsprice[${price}]`;
      this.$emit("send-goods", content);
    }
  }
};
</script>

<style lang="scss" scoped>
image {
  will-change: transform;
}

.chat-item {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20rpx;
  margin: 40rpx 0;
  .read {
    display: flex;
    align-items: flex-end;
    font-size: $font-size-xs;
    color: $text-light;
    padding: 0 10rpx;
  }
  .read.no {
    color: $orange;
  }
  .system {
    background: rgba(0, 0, 0, 0.15);
    color: $text-gray;
    font-size: $font-size-sm;
    text-align: center;
    border-radius: 8rpx;
    padding: 0 40rpx;
    line-height: 1.6;
  }
  .goods-card {
    width: 100%;
    flex: 1;
  }
  .content {
    width: 100%;
    display: flex;
    min-height: 80rpx;
    padding: 0 30rpx;
    flex: 1.8;
    overflow: hidden;
    .bubble {
      max-width: 80%;
      min-width: 10%;
      min-height: 80rpx;
      line-height: 1.2;
      border-radius: 10rpx;
      padding: 15rpx 20rpx;
      display: flex;
      align-items: center;
      font-size: $font-size;
      word-break: break-word;
      background: #ffffff;
      position: relative;
      &::before,
      &::after {
        position: absolute;
        width: 0;
        height: 0;
        top: 16rpx;
      }
    }
    .goods {
      width: 100%;
      .image-box {
        height: 0;
        width: 100%;
        padding: 50% 0;
        overflow: hidden;
        background: $image-background;
        position: relative;
      }
      .goods-img {
        display: flex;
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .goods-name {
        margin: 10rpx 0;
        max-width: 100%;
        min-width: 600rpx;
        min-height: 32rpx;
        max-height: 64rpx;
        .text {
          width: 416rpx;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
      .goods-price {
        font-size: $font-size-sm;
        color: $red;
      }
    }
    .picture {
      width: auto;
      height: auto;
      max-width: 100%;
      .picture-img {
        max-width: 100%;
        display: block;
        overflow: hidden;
      }
    }
  }
  .info {
    flex: 0.2;
    .avatar {
      width: 80rpx;
      height: 80rpx;
      display: block;
      border-radius: 8rpx;
      background: #fff;
    }
  }
}

.chat-item.mine {
  .content {
    justify-content: flex-end;
    .bubble {
      background: $blue;
      color: #ffffff;
      &::after {
        content: "";
        right: -10rpx;
        border-top: 10rpx solid transparent;
        border-bottom: 10rpx solid transparent;
        border-left: 10rpx solid $blue;
      }
    }
  }
}

.chat-item.user,
.chat-item.robot {
  .content {
    flex-direction: column;
    flex-flow: wrap;
    .name {
      width: 100%;
      display: flex;
      margin-bottom: 10rpx;
      line-height: 1;
      flex-direction: column;
      .text {
        font-size: $font-size-sm;
        color: $text-light;
        max-width: 50%;
      }
    }
    .bubble {
      background: #ffffff;
      color: $text-color;
      &::before {
        content: "";
        left: -10rpx;
        border-top: 10rpx solid transparent;
        border-bottom: 10rpx solid transparent;
        border-right: 10rpx solid #ffffff;
      }
    }
  }
}
.chat-item.robot {
  .bubble {
    flex-direction: column;
    justify-content: center;
    .text {
      display: block;
    }
    .question {
      margin-top: 20rpx;
      line-height: 40rpx;
      color: $blue;
      width: 100%;
    }
  }
}
.chat-item {
  .content {
    .bubble.text {
    }
    .bubble.img {
      background-color: #ffffff;
      &::after {
        border-left: 10rpx solid #ffffff;
      }
    }
    .bubble.goods {
      background-color: #ffffff;
      color: $text-color;
      &::after {
        border-left: 10rpx solid #ffffff;
      }
    }
  }
}
</style>
