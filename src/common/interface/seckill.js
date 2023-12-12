import $Request from "@/api/requset";

// 秒杀商品列表标签
export function GET_SECKILLTAG(data = {}, config = {}) {
  return $Request({
    url: "/addons/seckill/seckill/getAllSecTime",
    data,
    noLogin: true,
    ...config
  });
}

// 秒杀商品列表
export function GET_SECKILLLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/seckill/seckill/getSeckillGoodsList",
    data,
    noLogin: true,
    ...config
  });
}

// 首页装修模板
export function GET_CUSTOMSECKILL(data = {}, config = {}) {
  return $Request({
    url: "/addons/seckill/seckill/getIndexSeckillList",
    data,
    noLogin: true,
    ...config
  });
}
