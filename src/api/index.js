let modules = {};
const files = require.context(".", false, /\.js$/);
files.keys().forEach(key => {
  if (key === "./index.js") return;
  const item = files(key).default;
  const name = key.replace(/(.*\/)*([^.]+).*/gi, "$2");
  modules[name] = item;
});

export default modules;
