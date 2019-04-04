<template>
  <div class="container"></div>
</template>

<script>
import Stats from "stats.js";
import WebGLView from "./WebGL/WebGLView";
let webgl = "";
let handlerAnimate = "";
const stats = new Stats();
export default {
  webgl,
  handlerAnimate,
  stats,

  mounted() {
    this.init();
  },

  methods: {
    init() {
      document.body.appendChild(stats.dom);
      this.initWebGL();
      this.addListeners();
      this.animate();
      this.resize();
    },

    initWebGL() {
      console.log("init WebGL");

      this.$options.webgl = new WebGLView(this);
      document
        .querySelector(".container")
        .appendChild(this.$options.webgl.renderer.domElement);
    },

    addListeners() {
      this.$options.handlerAnimate = this.animate.bind(this);

      window.addEventListener("resize", this.resize.bind(this));

      // const el = this.$options.webgl.renderer.domElement;
      // el.addEventListener("click", this.click.bind(this));
    },

    animate() {
      this.$options.stats.begin();
      this.update();
      this.draw();
      this.$options.stats.end();
      requestAnimationFrame(this.$options.handlerAnimate);
    },

    update() {
      if (this.$options.webgl) this.$options.webgl.update();
    },

    draw() {
      if (this.$options.webgl) this.$options.webgl.draw();
    },

    resize() {
      if (this.$options.webgl) this.$options.webgl.resize();
    },

    click() {
      this.$options.webgl.goto(0);
    }
  }
};
</script>

<style scoped>
</style>