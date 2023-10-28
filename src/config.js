const utils = require('./common/utils');
const manifest = require('./manifest.json');
/**
 * 其他配置需前往manifest.json 配置文件修改
 *
 * 开发h5时解决跨域需前往manifest.json 配置文件修改 h5->devServer ，填写相关请求域名
 *
 * 开发微信小程序需前往manifest.json 配置文件修改 mp-weixin->appid  (开发其他平台小程序也一样需要修改appid)
 *
 * name       ==>    应用名称(一般不修改，用于项目标识用，存储的key值会以name值为其中一个字符)
 * version    ==>    版本号
 * domain     ==>    域名(h5端自动获取访问域名，开发环境需要填写域名)
 * subDomain  ==>    子域名、二级域名，独立域名(小程序用到)(h5端自动获取访问域名)
 * websiteid  ==>    商户id(小程序用到)
 * static     ==>    资源路径 (存放图片资源，字体icon等)
 * base_api   ==>    请求域名(域名拼接/wapapi) 一般不修改
 * auth_key   ==>    请求接口授权码 由后台提供
 */

/**
 * 版本定义（顺序指向）：
 * 1，主版本号，特指发生重大变革
 * 2，次要版本，发生功能变更（如增加应用等）
 * 3，修复版本，完善和修复
 */

// 生产环境配置
const production = {
  NAME: 'shopvslai',
  VERSION: manifest.versionName,
  DOMAIN: 'https://hzldm.sandyp.cn', //https://lht.dgszwin.com
  SUBDOMAIN: 'https://hzldm.sandyp.cn',
  WEBSITE_ID: 1,
  STATIC: '/public/app',
  BASE_API: 'wapapi',
  AUTH_KEY: 'P6l0Gx9p7Qsijklz',
};

// 开发环境配置
const development = {};

console.info('version', production.VERSION);

export default {
  production,
  development: utils.merge(production, development),
};
