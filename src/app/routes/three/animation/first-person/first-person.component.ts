import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Common } from '../../common/common.class';
import { UserModel } from '../../common/user.class';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { MeshLambertMaterial, PointLight, SpotLight } from 'three';

@Component({
  selector: 'app-first-person',
  templateUrl: './first-person.component.html',
  styleUrls: ['./first-person.component.less']
})
export class FirstPersonComponent extends Common implements OnInit, AfterViewInit {

  constructor() {
    super()
  }

  ngAfterViewInit(): void {
  }

  @Input()
  scene: any;
  @Input()
  camera: any;
  @Input()
  renderer: any;
  @Input()
  currentControls: any;
  @Output()
  changeController = new EventEmitter();

  user = new UserModel()
  sceneView: any;

  /** 全屏点击事件 */
  windowClick = (e: any) => {
    e.preventDefault();
    //通过鼠标位置计算归一化设备坐标
    const sceneRect = document.body.getBoundingClientRect();
    const sceneWidth = sceneRect.width;
    const sceneHeight = sceneRect.height;
    const mouse = new THREE.Vector2();
    mouse.x = ((e.clientX - sceneRect.left) / sceneWidth) * 2 - 1;
    mouse.y = -((e.clientY - sceneRect.top) / sceneHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects: any = raycaster.intersectObjects(this.scene.children, true); // 计算射线和场景中的对象相交情况
    let clickedObject;

    // 如果有物体相交，则触发点击事件
    if (intersects.length > 0) {
      clickedObject = intersects[0].object;
      const position = intersects[0].point
      this.twoPointMovement(position)
    }


  }

  async ngOnInit(): Promise<void> {
    this.renderer.shadowMap.enabled = true  // 开启阴影渲染
    this.setLight()
    this.editBackground()
    this.user.userModel = await new OBJLoader().loadAsync('assets/svg/person.obj');
    this.user.userModel.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const gltfObj = await this.loadModel('assets/svg/moveGltf/scene.gltf')
    this.user.walkingModel = await gltfObj.modal
    this.user.walkingModel.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    this.user.walkingGltf = await gltfObj.gltf
    this.user.setCurrentGroup(this.user.userModel)
    this.addGrid()
    this.addModelToScenen()
    this.addThreeClick()

    this.render()
  }

  /** 创建光源 */
  setLight(): void {
    let spotLight = new PointLight(0xFFFFFF)
    spotLight.castShadow = true    // 开启阴影
    spotLight.position.set(-40, 50, 30)

    this.scene.add(spotLight) // 将聚光灯添加到场景中
  }

  /** 模型加入场景 */
  addModelToScenen(): void {
    this.scene.add(this.user.currentGroup)
    this.changeController.emit()
  }

  /** 增加网格 */
  addGrid(): void {
    // 创建透明的可点击物体
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    let planeMaterial = new MeshLambertMaterial() // 开启阴影
    const clickablePlane = new THREE.Mesh(planeGeometry, planeMaterial);
    // 设置可点击物体的位置和旋转，与网格平面保持一致
    clickablePlane.position.set(0, 0, 0);
    clickablePlane.rotation.x = -Math.PI / 2;
    clickablePlane.receiveShadow = true // 开启阴影
    this.scene.add(clickablePlane);


    const gridHelper = new THREE.GridHelper(2000, 100, 0x000000, 0x000000);
    this.scene.add(gridHelper);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /** 修改场景背景 */
  editBackground(): void {
    const loader = new RGBELoader();
    loader.loadAsync('assets/hdr/1.hdr').then((texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      //将加载的材质texture设置给背景和环境
      this.scene.background = texture;
      this.scene.environment = texture;
      this.render()
    })
  }

  /** 增加点击事件 */
  addThreeClick(): void {
    // document.addEventListener('click', this.windowClick)
  }


  /** 两点移动 */
  twoPointMovement(end: any): void {
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    this.user.currentGroup.remove(this.user.userModel)
    this.user.currentGroup.add(this.user.walkingModel)
    this.gltfAnimation(this.scene, this.renderer, this.camera, this.user.walkingGltf)
    const start = this.user.currentGroup.position.clone(); // 起始位置
    const distance = start.distanceTo(end); // 计算两点之间的距离
    const speed = 0.1; // 根据需求设置移动速度

    const duration = distance / speed; // 计算动画持续时间
    this.user.currentGroup.lookAt(end);
    new TWEEN.Tween(this.user.currentGroup.position)
      .to(end, duration)
      .easing(TWEEN.Easing.Linear.None) // 使用线性缓动函数
      .onUpdate(() => {
      })
      .onComplete(() => {
        this.user.currentGroup.remove(this.user.walkingModel);
        this.user.currentGroup.add(this.user.userModel);
      }) // 动画结束后执行
      .start();

    animate();
  }


  sceneClear(): void {
    this.scene.remove(this.user.userModel)
    this.render()
  }


}
