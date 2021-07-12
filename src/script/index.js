"use strict";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class ThreeCity {
  constructor() {
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.controls = null;
  }
  init() {
    // 加载基础对象
    this.createScene(true);
    this.createCamera(true);
    this.createRenderer();
    this.setControl();
    // 加载内容
    this.makeGround();
  }
  /**
   * @desc 创建相机
   * */
  createCamera(addHelper = false) {
    this.camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 100;
    this.camera.lookAt(0, 0, 0);
    if (addHelper) {
      const helper = new THREE.CameraHelper(this.camera);
      this.scene.add(helper);
    }
  }
  /**
   * @desc 创建场景
   * */
  createScene(addHelper = false) {
    this.scene = new THREE.Scene();
    if (addHelper) {
      const axes = new THREE.AxesHelper(1);
      this.scene.add(axes);
    }
  }
  /**
   * @desc 创建Renderer
   * */
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.animation.bind(this));
    document.body.appendChild(this.renderer.domElement);

    function onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize.bind(this), false);
  }
  /**
   * @desc 动画
   * */
  animation(time) {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  /**
   * @desc 创建控制器
   * */
  setControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  /**
   * @desc 创建地面函数
   * */
  makeGround() {
    const maps = new THREE.TextureLoader().load("/images/bgf.png");
    maps.wrapS = maps.wrapT = THREE.RepeatWrapping;
    maps.repeat.set(50, 50); // 纹理 y,x方向重铺
    maps.needsUpdate = false; // 纹理更新
    let material = new THREE.MeshBasicMaterial({
      map: maps,
      opacity: 1,
      transparent: true,
      color: "#6f1fff",
    });
    const geometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    let ground = new THREE.Mesh(geometry, material);
    ground.position.x = 0;
    ground.position.y = 0;
    ground.position.z = -1;
    this.scene.add(ground);
    ground.receiveShadow = true;
  }
}
