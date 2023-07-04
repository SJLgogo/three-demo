import { Component, Input, OnInit } from '@angular/core';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { resolve } from 'dns';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { Common } from '../../common/common.class';
import { UserModel } from '../../common/user.class';


@Component({
  selector: 'app-basic-move',
  templateUrl: './basic-move.component.html',
  styleUrls: ['./basic-move.component.less']
})
export class BasicMoveComponent extends Common implements OnInit {

  constructor() {
    super()
  }

  @Input()
  scene: any;
  @Input()
  camera: any;
  @Input()
  renderer: any;
  @Input()
  currentControls: any;

  user = new UserModel()
  pointerLockControls: any;

  async ngOnInit(): Promise<void> {
    this.user.userModel = await new OBJLoader().loadAsync('assets/svg/person.obj');
    const gltfObj = await this.loadModel('assets/svg/moveGltf/scene.gltf')
    this.user.walkingModel = await gltfObj.modal
    this.user.walkingGltf = await gltfObj.gltf
    this.user.setCurrentGroup(this.user.userModel)
    this.setInitPosition()
    this.addModelToScenen()
  }

  /** 设置初始位置 */
  setInitPosition(): void {
    this.user.currentGroup.position.set(100, 0, 0)
  }

  /** 模型加入场景 */
  addModelToScenen(): void {
    this.scene.add(this.user.currentGroup)
    this.render()
  }


  /** 两点移动 */
  twoPointMovement(): void {
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    this.user.currentGroup.remove(this.user.userModel)
    this.user.currentGroup.add(this.user.walkingModel)
    this.gltfAnimation(this.scene, this.renderer, this.camera, this.user.walkingGltf)
    var end = new THREE.Vector3(105, 20, 30); // 结束点坐标
    new TWEEN.Tween(this.user.currentGroup.position)
      .to(end, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => this.render())  // 在Tween动画的每一帧中被调用
      .onComplete(() => {
        this.user.currentGroup.remove(this.user.walkingModel)
        this.user.currentGroup.add(this.user.userModel)
      })          // 动画结束后执行
      .start();
    animate()
  }

  /** 根据曲线路径移动 */
  curveMovement(): void {
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(100, 0, 0),
      new THREE.Vector3(-2, 3, 0),
      new THREE.Vector3(2, -3, 0),
      new THREE.Vector3(5, 0, 0)
    ]);
    const curvePath = new THREE.CurvePath();
    curvePath.add(curve);
    new TWEEN.Tween({ t: 0 })
      .to({ t: 1 }, 10000)
      .onUpdate((e: any) => {
        this.changeUserPosition(curvePath, e, this.user.currentGroup)
        this.changeUserLookPoint(curvePath, e, this.user.currentGroup)
        this.render()
      })
      .onComplete(() => {
      })          // 动画结束后执行
      .start();
    animate()
  }

  /** 改变曲线动画中每一帧的位置 */
  changeUserPosition(curvePath: any, e: any, model: any): void {
    const position = curvePath.getPointAt(e.t);
    model.position.copy(position);
  }

  /** 改变曲线动画中模型的朝向 */
  changeUserLookPoint(curvePath: any, e: any, model: any): void {
    let direction = new THREE.Vector3() // 方向
    const position = curvePath.getPointAt(e.t);
    const tangent = curvePath.getTangentAt(e.t).normalize(); // 根据参数化值获取曲线上的点和切线
    direction.copy(tangent);
    model.lookAt(position.clone().add(direction));  // 更新人物的朝向
  }

  /** 渲染 */
  render(): void {
    this.renderer.render(this.scene, this.camera);//执行渲染操作
  }


  /** gltf自身动画 */
  gltfAnimation(scene: any, renderer: any, camera: any, gltf: any): void {
    const mixer = new THREE.AnimationMixer(scene);
    const clock = new THREE.Clock();
    // 获取动画剪辑
    const animationClip = gltf.animations[0];
    // 创建动画动作
    const action = mixer.clipAction(animationClip);

    // 开始播放动画
    action.play();

    const animate = () => {
      requestAnimationFrame(animate);
      const deltaTime = clock.getDelta();
      mixer.update(deltaTime);
      renderer.render(scene, camera);
    }
    animate();
  }







}
