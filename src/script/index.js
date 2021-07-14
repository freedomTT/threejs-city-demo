"use strict";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
    this.setLight();
    // 加载内容
    this.makeGround();
    this.loadEvnModel();
  }
  /**
   * @desc 创建相机
   * */
  createCamera(addHelper = false) {
    this.camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      1,
      2000
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
    // this.renderer.setPixelRatio(window.devicePixelRatio * 1);
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
   * @desc 添加基础灯光
   * */

  setLight() {
    let light = new THREE.AmbientLight("#8b8b8b");
    this.scene.add(light);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.x = 10;
    directionalLight.position.y = 10;
    directionalLight.position.z = 10;
    this.scene.add(directionalLight);
    let helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    this.scene.add(helper);
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
  /**
   * @desc 加载环境模型
   * */
  loadEvnModel() {
    this.objGroup = new THREE.Group(); // 组
    this.scene.add(this.objGroup);
    let loader = new FBXLoader();
    const color = new THREE.Color("#616161");
    loader.load("/model/cd.fbx", (object) => {
      object.rotation.x = Math.PI / 2;
      object.scale.set(0.0001, 0.0001, 0.0001);
      object.traverse(function (child) {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = 0.5;
          child.material.color = color;
          child.castShadow = true;
        }
      });
      this.objGroup.add(object);

      this.objGroup.position.x = 0;
      this.objGroup.position.y = 0; 
    });
  }
}
