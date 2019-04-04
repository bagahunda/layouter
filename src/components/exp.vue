<template>
  <div class="exp container"></div>
</template>

<script>
/* eslint-disable */
import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import Stats from "stats.js";
import glsl from "glslify";

let camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
const renderer = new THREE.WebGLRenderer();
let geometry = new THREE.BoxBufferGeometry(200, 200, 200);
const controls = new OrbitControls(camera);
let material = new THREE.MeshNormalMaterial();
let groupXyOne = new THREE.Group();
let groupXyTwo = new THREE.Group();
let groupXyThree = new THREE.Group();
let groupXyFour = new THREE.Group();
let groupXyFive = new THREE.Group();
let scene = new THREE.Scene();
let cube = [];
let shaders = [];
let uniforms = { time: { value: 0 } };
let vertexShader = "";
let fragmentShader = "";
let time = uniforms.time;
const stats = new Stats();
const startTime = Date.now();

export default {
  camera,
  renderer,
  geometry,
  controls,
  material,
  groupXyOne,
  groupXyTwo,
  groupXyThree,
  groupXyFour,
  groupXyFive,
  scene,
  cube,
  shaders,
  uniforms,
  vertexShader,
  fragmentShader,
  time,
  stats,
  startTime,

  data() {
    return {};
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.$options.camera.position.z = -8;

      this.createThreeThreeThreeBlocksMatrix();

      this.$options.renderer.setPixelRatio(window.devicePixelRatio);
      this.$options.renderer.setSize(window.innerWidth, window.innerHeight);

      document.body.appendChild(stats.dom);
      document.body.appendChild(renderer.domElement);
      document.body.style.cssText = "margin: 0; overflow: hidden";
      window.addEventListener("resize", this.onWindowResize, false);
      this.animate();
    },

    createThreeThreeThreeBlocksMatrix(start) {
      this.$options.vertexShader = glsl(`
        varying vec2 vUv;
        uniform float time;

        // ================================================================================
        // START OF NOISE =================================================================
        // ================================================================================

        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0; }

        float mod289(float x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0; }

        vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
        }

        float permute(float x) {
            return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        float taylorInvSqrt(float r)
        {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec4 grad4(float j, vec4 ip)
          {
          const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
          vec4 p,s;

          p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
          p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
          s = vec4(lessThan(p, vec4(0.0)));
          p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

          return p;
          }

        // (sqrt(5) - 1)/4 = F4, used once below
        #define F4 0.309016994374947451

        float snoise(vec4 v)
          {
          const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                                0.276393202250021,  // 2 * G4
                                0.414589803375032,  // 3 * G4
                              -0.447213595499958); // -1 + 4 * G4

        // First corner
          vec4 i  = floor(v + dot(v, vec4(F4)) );
          vec4 x0 = v -   i + dot(i, C.xxxx);

        // Other corners

        // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
          vec4 i0;
          vec3 isX = step( x0.yzw, x0.xxx );
          vec3 isYZ = step( x0.zww, x0.yyz );
        //  i0.x = dot( isX, vec3( 1.0 ) );
          i0.x = isX.x + isX.y + isX.z;
          i0.yzw = 1.0 - isX;
        //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
          i0.y += isYZ.x + isYZ.y;
          i0.zw += 1.0 - isYZ.xy;
          i0.z += isYZ.z;
          i0.w += 1.0 - isYZ.z;

          // i0 now contains the unique values 0,1,2,3 in each channel
          vec4 i3 = clamp( i0, 0.0, 1.0 );
          vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
          vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

          //  x0 = x0 - 0.0 + 0.0 * C.xxxx
          //  x1 = x0 - i1  + 1.0 * C.xxxx
          //  x2 = x0 - i2  + 2.0 * C.xxxx
          //  x3 = x0 - i3  + 3.0 * C.xxxx
          //  x4 = x0 - 1.0 + 4.0 * C.xxxx
          vec4 x1 = x0 - i1 + C.xxxx;
          vec4 x2 = x0 - i2 + C.yyyy;
          vec4 x3 = x0 - i3 + C.zzzz;
          vec4 x4 = x0 + C.wwww;

        // Permutations
          i = mod289(i);
          float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
          vec4 j1 = permute( permute( permute( permute (
                    i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                  + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                  + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
                  + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

        // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
        // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
          vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

          vec4 p0 = grad4(j0,   ip);
          vec4 p1 = grad4(j1.x, ip);
          vec4 p2 = grad4(j1.y, ip);
          vec4 p3 = grad4(j1.z, ip);
          vec4 p4 = grad4(j1.w, ip);

        // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          p4 *= taylorInvSqrt(dot(p4,p4));

        // Mix contributions from the five corners
          vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
          vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
          m0 = m0 * m0;
          m1 = m1 * m1;
          return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                      + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

          }

          // ================================================================================
          //  MAIN ==========================================================================
          // ================================================================================

          void main () {
            vUv = uv;
            vec3 transformed = position.xyz;
            float offset = 0.0;
            offset += 0.9 * (snoise(vec4(normal.xyz * 1.0, time * 0.5)) * 0.5 + 0.5);
            transformed += normal * offset;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
          }
      `);

      this.$options.fragmentShader = glsl(`
        precision highp float;
        uniform float time;
        uniform float aspect;
        varying vec2 vUv;

          // ================================================================================
          //  HSL2RGB =======================================================================
          // ================================================================================

        float hue2rgb(float f1, float f2, float hue) {
          if (hue < 0.0)
              hue += 1.0;
          else if (hue > 1.0)
              hue -= 1.0;
          float res;
          if ((6.0 * hue) < 1.0)
              res = f1 + (f2 - f1) * 6.0 * hue;
          else if ((2.0 * hue) < 1.0)
              res = f2;
          else if ((3.0 * hue) < 2.0)
              res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
          else
              res = f1;
          return res;
        }

        vec3 hsl2rgb(vec3 hsl) {
          vec3 rgb;

          if (hsl.y == 0.0) {
              rgb = vec3(hsl.z); // Luminance
          } else {
              float f2;

              if (hsl.z < 0.5)
                  f2 = hsl.z * (1.0 + hsl.y);
              else
                  f2 = hsl.z + hsl.y - hsl.y * hsl.z;

              float f1 = 2.0 * hsl.z - f2;

              rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
              rgb.g = hue2rgb(f1, f2, hsl.x);
              rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
          }
          return rgb;
        }

        vec3 hsl2rgb(float h, float s, float l) {
          return hsl2rgb(vec3(h, s, l));
        }

        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v)
          {
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

          // First corner
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;

          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );

          //   x0 = x0 - 0.0 + 0.0 * C.xxx;
          //   x1 = x0 - i1  + 1.0 * C.xxx;
          //   x2 = x0 - i2  + 2.0 * C.xxx;
          //   x3 = x0 - 1.0 + 3.0 * C.xxx;
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
          vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

          // Permutations
          i = mod289(i);
          vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

          // Gradients: 7x7 points over a square, mapped onto an octahedron.
          // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
          float n_ = 0.142857142857; // 1.0/7.0
          vec3  ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );

          //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
          //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);

          //Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                        dot(p2,x2), dot(p3,x3) ) );
        }

        // ================================================================================
        //  MAIN ==========================================================================
        // ================================================================================

        void main () {

          float n = snoise(vec3(vUv.xy * 0.05, time / 2.0));
          vec3 color = hsl2rgb(
            (n * 0.6 + 0.5 ),
            0.5,
            0.5
          );

          gl_FragColor = vec4(color, 1.0);
        }
      `);

      const material = this.shaderCreator();
      let colorA = 0x0f2344;
      let shaders = this.$options.shaders;
      let geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          for (let z = 0; z < 5; z++) {
            if (z === 0) {
              colorA = 0x0f2344;
            } else if (z === 1) {
              colorA = 0x195aa8;
            } else if (z === 2) {
              colorA = 0x21bced;
            } else if (z === 3) {
              colorA = 0x195aa8;
            } else if (z === 4) {
              colorA = 0x0f2344;
            }
            this.$options.cube["cube" + x + y + z] = new THREE.Mesh(
              geometry,
              material
            );

            this.$options.cube["cube" + x + y + z].position.set(
              x / 2 - 1,
              y / 2 - 1,
              z / 2 - 1
            );

            if (z === 0) {
              this.$options.groupXyOne.add(
                this.$options.cube["cube" + x + y + z]
              );
            } else if (z === 1) {
              this.$options.groupXyTwo.add(
                this.$options.cube["cube" + x + y + z]
              );
            } else if (z === 2) {
              this.$options.groupXyThree.add(
                this.$options.cube["cube" + x + y + z]
              );
            } else if (z === 3) {
              this.$options.groupXyFour.add(
                this.$options.cube["cube" + x + y + z]
              );
            } else if (z === 4) {
              this.$options.groupXyFive.add(
                this.$options.cube["cube" + x + y + z]
              );
            }
          }
        }
      }
      this.$options.scene.add(this.$options.groupXyOne);
      this.$options.scene.add(this.$options.groupXyTwo);
      this.$options.scene.add(this.$options.groupXyThree);
      this.$options.scene.add(this.$options.groupXyFour);
      this.$options.scene.add(this.$options.groupXyFive);
    },

    shaderCreator(offset) {
      return new THREE.ShaderMaterial({
        flatShading: true,
        vertexShader: this.$options.vertexShader,
        fragmentShader: this.$options.fragmentShader,
        uniforms: {
          time: this.$options.time,
          aspect: ({ width, height }) => width / height
        }
      });
    },

    mergeRotX(x, offset, angleval) {
      for (let k = 0; k < 5; k++) {
        for (let j = 0; j < 5; j++) {
          let cubeId = String(x) + String(k) + String(j);
          let cubeX = this.$options.cube["cube" + cubeId].position.x;
          let cubeY = this.$options.cube["cube" + cubeId].position.y;
          let angle = (angleval * Math.PI) / 180;
          let newCubeX =
            cubeX * Math.cos(angle) - (cubeY + offset) * Math.sin(angle);
          let newCubeY =
            cubeY * Math.cos(angle) + (cubeX + offset) * Math.sin(angle);
          this.$options.cube["cube" + cubeId].position.x = newCubeX;
          this.$options.cube["cube" + cubeId].position.y = newCubeY;
        }
      }
    },

    mergeRotY(y, offset, angleval) {
      for (let k = 0; k < 5; k++) {
        for (let j = 0; j < 5; j++) {
          let cubeId = String(k) + String(y) + String(j);
          let cubeX = this.$options.cube["cube" + cubeId].position.x;
          let cubeY = this.$options.cube["cube" + cubeId].position.y;
          let angle = (angleval * Math.PI) / 180;
          let newCubeX =
            cubeX * Math.cos(angle) - (cubeY + offset) * Math.sin(angle);
          let newCubeY =
            cubeY * Math.cos(angle) + (cubeX + offset) * Math.sin(angle);
          this.$options.cube["cube" + cubeId].position.x = newCubeX;
          this.$options.cube["cube" + cubeId].position.y = newCubeY;
        }
      }
    },

    animate() {
      this.$options.stats.begin();

      let elapsedMilliseconds = Date.now() - this.$options.startTime;
      let time = elapsedMilliseconds / 1000;

      this.$options.uniforms.time.value = time + 1.1;
      this.$options.uniforms.time.value = time + 1.2;
      this.$options.uniforms.time.value = time + 1.1;
      this.$options.uniforms.time.value = time + 1.0;

      this.$options.groupXyOne.rotation.x += 0.02;
      this.$options.groupXyOne.rotation.y += 0.02;
      this.$options.groupXyOne.rotation.z += 0.02;

      this.$options.groupXyTwo.rotation.x += 0.02;
      this.$options.groupXyTwo.rotation.y += 0.02;

      this.$options.groupXyThree.rotation.x += 0.02;
      this.$options.groupXyThree.rotation.y += 0.02;
      this.$options.groupXyThree.rotation.z -= 0.02;

      this.$options.groupXyFour.rotation.x += 0.02;
      this.$options.groupXyFour.rotation.y += 0.02;

      this.$options.groupXyFive.rotation.x += 0.02;
      this.$options.groupXyFive.rotation.y += 0.02;
      this.$options.groupXyFive.rotation.z += 0.02;

      this.mergeRotY(0, 0, -1);
      this.mergeRotY(1, 0, 0.5);
      this.mergeRotY(2, 0, -1);
      this.mergeRotY(3, 0, 0.5);
      this.mergeRotY(4, 0, -1);

      this.mergeRotX(2, 0, 2);

      this.$options.controls.update();
      this.$options.renderer.render(this.$options.scene, this.$options.camera);

      this.$options.stats.end();

      requestAnimationFrame(this.animate);
    },

    onWindowResize() {
      this.$options.camera.aspect = window.innerWidth / window.innerHeight;
      this.$options.camera.updateProjectionMatrix();
      this.$options.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>