import * as THREE from "three";
import InteractiveControls from "../InteractiveControls";
import Particles from "../particles/particles";

/* eslint-disable */
export default class WebGLView {
  constructor(app) {
    this.app = app;

    this.samples = ["sample-03.png"];

    this.initThree();
    this.initParticles();
    this.initControls();

    // const rnd = ~~(Math.random() * this.samples.length);
    // this.goto(rnd);
    this.particles.init(this.samples[0]);
  }

  initThree() {
    console.log("init three");

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.z = 300;

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // clock
    this.clock = new THREE.Clock(true);
  }

  initControls() {
    this.interactive = new InteractiveControls(
      this.camera,
      this.renderer.domElement
    );
  }

  initParticles() {
    console.log("init particles");

    this.particles = new Particles(this);
    this.scene.add(this.particles.container);
  }

  update() {
    const delta = this.clock.getDelta();

    if (this.particles) this.particles.update(delta);
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  // goto(index) {
  //   this.particles.init(this.samples[index]);
  // }

  // next() {
  //   if (this.currSample < this.samples.length - 1)
  //     this.goto(this.currSample + 1);
  //   else this.goto(0);
  // }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------

  resize() {
    if (!this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.fovHeight =
      2 *
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) *
      this.camera.position.z;

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.interactive) this.interactive.resize();
    if (this.particles) this.particles.resize();
  }
}
