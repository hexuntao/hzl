export const defaultGoodsData = {
  goods_id: 0,
  goods_image: "",
  goods_name: "",
  goods_type: 1,
  max_buy: 0,
  max_market_price: "0",
  max_price: "0",
  min_buy: 0,
  min_market_price: "0",
  min_price: "0",
  state: null,
  sku: {
    list: [
      {
        attr_value_items: "",
        group_limit_buy: "",
        group_price: "",
        id: 0,
        market_price: "0",
        min_buy: 0,
        price: "0",
        s: [],
        sku_name: "",
        stock_num: 0
      }
    ],
    tree: [
      {
        k: "",
        k_id: 0,
        v: [
          {
            id: 0,
            name: ""
          }
        ],
        k_s: ""
      }
    ]
  },
  is_allow_buy: true,
  is_allow_browse: true,
  member_is_label: 2
};

export const defaultSkuInfo = {
  tree: [],
  list: [],
  price: 0,
  stock_num: 0
};

export const defaultActiveInfo = {
  id: 0,
  title: "",
  picture: "",
  goodsType: "",
  promoteType: "normal",
  selectedNum: 1,
  selectedSkuComb: null,
  isSpec: false,
  stock: 0,
  maxBuy: 0,
  goodsPrice: 0,
  marketPrice: 0,
  goodsState: 1,
  goodsStateText: ""
};
