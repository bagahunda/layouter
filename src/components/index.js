import Vue from "vue";
import Layouter from "./Layouter";

const Components = {
  Layouter
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components;
