<template>
  <h3 id="title">知识图谱智能推荐</h3>
  <div id="canvas" ></div>
  <img id="img" src="/bord.png" alt="">
</template>
<script  >
import neo4j from "neo4j-driver";
import * as THREE from 'three';
import threeScene from "./threeClass"

export default {
  name: "recommend",
  data() {
    return {
      nodeNum: 0,
      linkNum: 0,
      startNode: "",
      layoutType: "",
      current: null,
      endNode: "",
      close: false,
      close1: false,
      close2: false,
      nodeName: "",
      pageNum: 100,
      driver: null,
      myGraph: null, // 3D-graph对象
      graphData: null, // 3D-graph加载的图数据
      result: {},
      scene:null,
      camera:null,
      renderer:null,
    };
  },
  mounted() {
    // this.driver = neo4j.driver(
    //   this.db.uri,
    //   neo4j.auth.basic(this.db.user, this.db.password)
    // );

    let threeS = new threeScene()

    setTimeout(()=>{
      threeS.mount()
    },200)
  },
  methods: {
    async init() {
      // const scene = new THREE.Scene();
      // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
      // const renderer = new THREE.WebGLRenderer();
      // renderer.setSize(window.innerWidth, window.innerHeight);
      // const $dom = document.getElementById('canvas');
      // $dom.appendChild(renderer.domElement);

      // camera.position.z =5;

      // const geometry = new THREE.SphereGeometry(15, 32, 16);
      // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      // const sphere = new THREE.Mesh(geometry,material);
      // this.scene.add(sphere);

      // const geometry = new THREE.SphereGeometry(15, 32, 16);
      // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      // const sphere = new THREE.Mesh(geometry, material); 
      // scene.add(sphere);

      // const loader = new THREE.TextureLoader();
      // const bgTexture = loader.load('/earth.jpg');
      // bgTexture.colorSpace = THREE.SRGBColorSpace;
      // this.scene.background = bgTexture;
      
      // this.animate()

      // this.skyBox()
    },
    skyBox(){
      // const loader = new THREE.TextureLoader();
      // const bgTexture = loader.load('/earth.jpg');
      // bgTexture.colorSpace = THREE.SRGBColorSpace;
      
      // let backgroundBall = new THREE.Mesh(
      //   new THREE.SphereGeometry(800, 128, 128),
      //   new THREE.MeshBasicMaterial({
      //     map: bgTexture,
      //   })
      // );
      // backgroundBall.geometry.scale(-1, 1, 1);


      // const geometry = new THREE.SphereGeometry(15, 32, 16);
      // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      // const sphere = new THREE.Mesh(geometry, material); 
      // this.scene.add(sphere);


      // this.scene.add(backgroundBall);
    },
    getTexture(picName) {
      texture = new Three.TextureLoader().load(
        require(`${picName}`)
      );
      return texture;
    },
    animate(renderer,) {
      requestAnimationFrame(this.animate);
      renderer.render(scene, camera);
    },
    async getCyperResult(limit_items) {
      const session = this.driver.session();
      const result = await session.run(
        "MATCH (n)-[r]-(m) RETURN * " + "LIMIT $limit_items ",
        { limit_items: neo4j.int(limit_items) }
      );

      const node_info = {};
      const rel_info = {};
      result.records.map((k) => {
        node_info[k.get("n")["properties"]["uid"]] = {
          labels: k.get("n")["labels"].toString(),
          attrs: k.get("n")["properties"],
        };
        node_info[k.get("m")["properties"]["uid"]] = {
          labels: k.get("m")["labels"].toString(),
          attrs: k.get("m")["properties"],
        };
        rel_info[k.get("r").toString()] = {
          source: k.get("n")["properties"]["uid"],
          target: k.get("m")["properties"]["uid"],
        };
      });

      return {
        node_info,
        rel_info,
      };
    },
    
  },
};
</script>


<style lang="less" scoped>
h6 {
  color: #fff;
}

.ml-2 {
  cursor: pointer;
}

#title {
  position: absolute;
  top:-10px;
  z-index: 3;
  left: 50%;
  transform: translateX(-50%);
  /* color: #00a287; */
  backdrop-filter: blur(6px);
  font-size: 30px;
  color: #fff;
  width: 600px;
  /* height: 60px; */
  /* background-color: transparent; */
  /* background: linear-gradient(to bottom, white 0%, #f49602 100%); */
  background-image: url("../assets/title-bg.png");
  background-size: 100% 100%;
}
#canvas {
  width: 100%;
  height:100vh;
}

.box-card {
  position: absolute;
  z-index: 10;
  left: 50px;
  top: 60px;
  width: 320px;
  height: 200px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.2);
  border-color: #07d6ff;
  backdrop-filter: blur(6px);
  opacity: 1;
  padding: 5px;
  transition: all 1.0s;
}

.closeCard {
  left: -400px;
  opacity: 0;
  transition: all 1.0s;
}

// .box-card::before, .box-card::after {
//     content: "";
//     position: absolute;
//     top: -2px;
//     left: -2px;
//     right: -2px;
//     bottom: -2px;
//     border: 1px dashed #07d6ff;
//     transition: all 1.2s;
//     border-radius: 5px;
//     animation: clippath 10s infinite linear;
// }
// .box-card::after {
//     animation: clippath 10s infinite -3.5s linear;
// }
// @keyframes clippath {
//     0%, 100% { clip-path: inset(0 0 98% 0); }
//     25% { clip-path: inset(0 98% 0 0); }
//     50% { clip-path: inset(98% 0 0 0); }
//     75% { clip-path: inset(0 0 0 98%); }
// }
.box-card1 {
  top: 280px;
}

.box-card2 {
  top: 500px;
  height: 200px;
}

.read-the-docs {
  color: #888;
}

#graph {
  background-color: black;
  background-image: url("/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.search {
  position: absolute;
  bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
}

.node-input {
  margin-top: 5px;
}

.test-ul {
  font-size: 10px;
  color: #fff;
}

.retract-btn {
  position: fixed;
  display: inline-block;
  top: 150px;
  left: 30px;
  transform: rotate(180deg);
  background-color: transparent;
  background-image: url(/src/assets/retract.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  inset-inline-end: 24px;
  inset-block-end: 48px;
  z-index: 12;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.retract-btn1 {
  .retract-btn;
  top: 370px;
}

.retract-btn2 {
  .retract-btn;
  top: 580px;
}

.retractReverse {
  transform: rotate(0deg);
  transition: all 0.3s ease-in-out;
}
</style>
