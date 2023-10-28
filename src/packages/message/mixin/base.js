import { mapGetters, mapState } from "vuex";
import emoji from "../lib/emoji";
import { platform } from "@/common/utils";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      static: "static"
    }),
    ...mapState({
      qlkefuIO: ({ config }) => config.qlkefu_domain_port
    }),
    qlDomain() {
      const arr = this.qlkefuIO.split(":");
      const domain = arr.splice(0, arr.length - 1).join(":");
      return domain;
    },
    // 客服请求基础路径
    qlApiBaseUrl() {
      return platform("H5") ? "/qlapi" : this.qlDomain;
    },
    emojiPath() {
      return this.static.baseImgPath + "emoji/";
    }
  },
  methods: {
    // 添加客服图片域名
    addImgSrcKfDomain(src) {
      const domain = this.qlDomain;
      let newSrc = "";
      if (typeof src != "string") return "";
      if (src.indexOf("http://") == 0 || src.indexOf("https://") == 0)
        return src;
      src.substr(0, 1) !== "/"
        ? (newSrc = domain + "/" + src)
        : (newSrc = domain + src);
      return newSrc;
    },
    // 转义内容
    escapeContent(content = "") {
      let obj = {};
      obj.type = "text";
      var html = end => {
        return new RegExp(
          "\\n*\\[" +
            (end || "") +
            "(pre|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*",
          "g"
        );
      };
      obj.text = content
        .replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#39;") // XSS
        .replace(/"/g, "&quot;")
        .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') // 转义@
        .replace(/face\[([^\s\[\]]+?)\]/g, face => {
          // 转义表情
          var alt = face.replace(/^face/g, "");
          var index = emoji.indexOf(alt);
          var src = index != -1 ? this.emojiPath + index + ".gif" : "";
          return '<img style="vertical-align: middle;" src="' + src + '">';
        })
        .replace(/img\[([^\s]+?)\]/g, img => {
          // 转义图片
          var imgsrc = img.replace(/(^img\[)|(\]$)/g, "");
          obj.type = "img";
          obj.imgsrc = this.addImgSrcKfDomain(imgsrc);
          return imgsrc;
        })
        .replace(/file\([\s\S]+?\)\[[\s\S]*?\]/g, str => {
          // 转义文件
          var href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1];
          var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
          if (!href) return str;
          console.log("文件类型");
          obj.type = "file";
          obj.filelink = href;
          return text;
        })
        .replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, str => {
          // 转义链接
          var href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
          var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
          if (!href) return str;
          obj.type = "link";
          obj.linkhref = href;
          return text;
        })
        .replace(/goodsid\[([^\s]+?)\]/g, str => {
          //转义商品id
          var id = str.replace(/(^goodsid\[)|(\]$)/g, "");
          obj.type = "goods";
          if (!obj.goods) {
            obj.goods = {};
          }
          obj.goods.id = id;
          return str;
        })
        .replace(/goodspic\[([^\s]+?)\]/g, str => {
          //转义商品图片
          var img = str.replace(/(^goodspic\[)|(\]$)/g, "");
          obj.type = "goods";
          if (!obj.goods) {
            obj.goods = {};
          }
          obj.goods.img = img;
          return str;
        })
        .replace(/goodsname\[([^\s]+?)\]/g, str => {
          //转义商品名称
          var name = str.replace(/(^goodsname\[)|(\]$)/g, "");
          obj.type = "goods";
          if (!obj.goods) {
            obj.goods = {};
          }
          obj.goods.name = name;
          return str;
        })
        .replace(/goodsprice\[([^\s]+?)\]/g, str => {
          //转义商品价格
          var price = str.replace(/(^goodsprice\[)|(\]$)/g, "");
          obj.type = "goods";
          if (!obj.goods) {
            obj.goods = {};
          }
          obj.goods.price = price;
          return str;
        })
        .replace(html(), "<$1 $2>")
        .replace(html("/"), "</$1>") // 转移HTML代码
        .replace(/\n/g, "<br>"); // 转义换行

      return obj;
    }
  }
};
