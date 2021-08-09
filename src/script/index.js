"use strict";
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Reflector } from "three/examples/jsm/objects/Reflector";

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
    this.setFog();
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
      45,
      window.innerWidth / window.innerHeight,
      1,
      20000
    );

    this.camera.position.x = 0;
    this.camera.position.y = 500;
    this.camera.position.z = 1000;
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
    this.renderer.setPixelRatio(window.devicePixelRatio * 1);
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
    // 环境光
    // let light = new THREE.AmbientLight("#ffffff");
    // this.scene.add(light);

    // 环境光
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.position.set(0, 200, 0);
    this.scene.add(hemiLight);
    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    this.scene.add(hemiLightHelper);

    const addDirectionLight = (x, y, z, color) => {
      let directionalLight = new THREE.DirectionalLight(color, 1);
      directionalLight.position.x = x;
      directionalLight.position.y = y;
      directionalLight.position.z = z;
      this.scene.add(directionalLight);
      let helper1 = new THREE.DirectionalLightHelper(directionalLight, 50);
      this.scene.add(helper1);
    };
    addDirectionLight(-200, 100, 200, 0x0000ff); // 左边

    // const pointLight = new THREE.PointLight(0xffffff, 1, 5000);
    // pointLight.position.set(-500, 1000, -500);
    // this.scene.add(pointLight);

    // const sphereSize = 10;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // this.scene.add(pointLightHelper);
  }
  /**
   * @desc 添加场景雾
   * */

  setFog() {
    this.scene.fog = new THREE.Fog("#000000", 0, 5000);
  }
  /**
   * @desc 动画
   * */
  animation(time) {
    if (this.wayAnimation) this.wayAnimation();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  /**
   * @desc 创建控制器
   * */
  setControl() {
    this.controls = new MapControls(this.camera, this.renderer.domElement);
  }

  /**
   * @desc 创建地面函数
   * */
  makeGround() {
    const geometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);

    const texture = new THREE.TextureLoader().load("/images/floor.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    const material = new THREE.MeshStandardMaterial({
      bumpMap: texture,
      flatShading: true,
      color: 0x000000,
      roughness: 0.5,
      metalness: 0,
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.position.x = 0;
    ground.position.y = 0;
    ground.position.z = 5;
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);
  }
  /**
   * @desc 加载环境模型
   * */
  loadEvnModel() {
    this.objGroup = new THREE.Group(); // 组
    this.scene.add(this.objGroup);
    let loader = new GLTFLoader();
    loader.load("/model/gx.glb", (glb) => {
      let object = glb.scene;
      object.scale.set(1, 1, 1);

      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          if (child.name === "Areas") {
            let tubeMaterial = new THREE.MeshPhongMaterial({
              transparent: true,
              opacity: 1,
              color: "#280a52", // 1A5FEA
              wireframe: false,
              shininess: 75,
              // emissive: "#280a52",
            });
            child.material = tubeMaterial;
          }
          if (child.name === "Router") {
            let textureLoader = new THREE.TextureLoader();
            let texture = textureLoader.load("/images/t2.jpg");
            // 设置阵列模式为 RepeatWrapping
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
            // 等价texture.repeat= new THREE.Vector2(20,1)
            texture.repeat.x = 1;
            texture.repeat.y = 1;
            let tubeMaterial = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              side: THREE.DoubleSide,
              color: "#C7A6D1",
              // emissive: 10,
              // shininess: 50,
              // ambient: 0xffffff,
            });
            child.material = tubeMaterial;
            this.wayAnimation = () => {
              texture.offset.x -= 0.02;
            };
          }
        }
      });
      this.objGroup.add(object);
      this.objGroup.position.x = 0;
      this.objGroup.position.y = 0;
    });
  }
}
