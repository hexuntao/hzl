let modules = {};
const files = require.context(".", false, /\.js$/);
files.keys().forEach(key => {
  if (key === "./index.js") return;
  const item = files(key).default;
  const name = key.replace(/(.*\/)*([^.]+).*/gi, "$2");
  modules[name] = item;
});

export const basic = modules["basic"];
export const reform = modules["reform"];
export const navigate = modules["navigate"];
