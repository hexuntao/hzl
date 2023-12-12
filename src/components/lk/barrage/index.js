import Vue from "vue";
import barrage from "./barrage.vue";

const constructor = Vue.extend(barrage);

const instance = new constructor({
  el: document.createElement("div")
});

constructor.prototype.create = function() {
  document.body.appendChild(instance.$el);
};

export default {
  create: instance.create,
  push: instance.push
};
