import $Request from "@/api/requset";

// 获取任务中心信息
export function GET_TASKCENTRE(data = {}, config = {}) {
  return $Request({
    url: "/addons/taskcenter/taskcenter/getTaskList",
    data,
    ...config
  });
}

// 领取任务
export function RECEIVE_TASK(data = {}, config = {}) {
  return $Request({
    url: "/addons/taskcenter/taskcenter/getMyTask",
    data,
    ...config
  });
}

// 我的任务
export function GET_TASKLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/taskcenter/taskcenter/getMyTaskList",
    data,
    ...config
  });
}

// 任务详情
export function GET_TASKDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/taskcenter/taskcenter/getTaskDetail",
    data,
    ...config
  });
}
