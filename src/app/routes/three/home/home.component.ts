import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Common } from '../common/common.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent extends Common implements OnInit {

  constructor() {
    super()
  }


  idx: number = 1

  scene: any;  // 三维场景
  camera: any;  // 相机
  renderer: any; // webGl渲染器
  orbitControls: any;
  currentControls: any;

  ngOnInit(): void {
    this.baseThree()
  }

  baseThree(): void {
    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer();
    this.setLight()
    this.AxesHelper()
    this.setCamera()
    this.controllSceen()
    this.render()
  }


  // 设置环境光
  setLight(): void {
    const point = new THREE.PointLight(0x999999);  // 创建一个光源对象，参数定义光照强度
    point.position.set(200, 1000, 1000); //点光源位置
    this.scene.add(point); //点光源添加到场景中
    const ambient = new THREE.AmbientLight(0x444444); //环境光
    this.scene.add(ambient);
  }


  // 增加原点坐标
  AxesHelper(): void {
    const axesHelper = new THREE.AxesHelper(200);
    this.scene.add(axesHelper);
  }


  // 设置相机 
  setCamera(): void {
    const [width, height] = [window.innerWidth, window.innerHeight]; //3d场景宽高
    const k = width / height; //窗口宽高比
    const s = 500; //三维场景显示范围控制系数，系数越大，显示的范围越大
    // this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);  //创建相机对象
    // this.camera.position.set(0, 100, 600); //设置相机位置
    // this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)

    this.camera = this.returnPerspective()
    this.camera.position.set(0, 100, 600); //设置相机位置
    this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)

    this.renderer.setSize(width, height); //设置渲染区域尺寸
    this.renderer.setClearColor(0xFFFFFF, 1); //设置背景颜色
    document.body.appendChild(this.renderer.domElement); // body元素中插入canvas对象
  }


  returnPerspective(): any {
    const fov = 45; // 视场角度
    const aspect = window.innerWidth / window.innerHeight; // 纵横比
    const near = 0.1; // 近剪切面
    const far = 10000; // 远剪切面
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // 透视相机
    return camera
  }

  /** 控制视图移动拖拽  */
  controllSceen(): void {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);//创建控件对象
    this.orbitControls.enableRotate = true; //启用旋转
    this.orbitControls.enablePan = true; //启用平移
    this.orbitControls.enableZoom = true;//启用缩放

    // 添加以下几行代码
    this.orbitControls.update(); // 更新控件
    this.orbitControls.addEventListener('change', () => this.render());//监听鼠标、键盘事件
    this.currentControls = this.orbitControls
  }

  idxChange(idx: number): void {
    this.idx = idx
  }


  render(): void {
    this.renderer.render(this.scene, this.camera);//执行渲染操作
    requestAnimationFrame(() => this.render);//请求再次执行渲染函数render
  }

}
