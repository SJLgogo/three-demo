import { Component, OnInit, Input } from '@angular/core';
import { Common } from '../../common/common.class';
import { UserModel } from '../../common/user.class';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.less']
})
export class PersonViewComponent extends Common implements OnInit {

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
  sceneView: any;



  async ngOnInit(): Promise<void> {
    this.sceneView = await new FBXLoader().loadAsync('assets/svg/5.fbx');
    this.addModelToScenen()
    this.render()
  }

  /** 模型加入场景 */
  addModelToScenen(): void {
    this.scene.add(this.sceneView)
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  cameraViewAnimate(): void {
    const cameraAnimate = () => {
      requestAnimationFrame(cameraAnimate);
      TWEEN.update();
    }
    const position = this.camera.position

    const startCameraPosition = new THREE.Vector3(position.x, position.y, position.z); // 设置起始相机位置
    const targetCameraPosition = new THREE.Vector3(200, -60, 0); // 设置目标相机位置
    new TWEEN.Tween(startCameraPosition)
      .to(targetCameraPosition, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {     // 在Tween动画更新时，更新相机位置
        this.camera.position.copy(startCameraPosition);
        this.camera.lookAt(0, -60, 0);
        this.render()
      })
      .onComplete(() => {
        this.currentControls.target.set(0, -60, 0); // 改变目标点
        this.currentControls.update();
      })
      .start();
    cameraAnimate()
  }

  viewMove(): void {
    const curve = this.getViewCureve();
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    new TWEEN.Tween({ t: 0 })
      .to({ t: 1 }, 30000)
      .onUpdate((e: any) => {
        const position = curve.getPointAt(e.t);
        if (e.t > 0.03) {
          var pos = curve.getPointAt(e.t - 0.03);
          this.camera.position.copy(pos);
          this.camera.lookAt(position);
        }
        this.render()
      })
      .onComplete(() => {
        console.log(this.camera.position);

      })          // 动画结束后执行
      .start();
    animate()
  }

  getViewCureve(): any {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(400, -60, 0),
      new THREE.Vector3(300, -50, 0),
      new THREE.Vector3(200, -60, 0),
      new THREE.Vector3(-200, -60, 0)
    ]);
    return curve
  }

  getCameraLookAt(): void {
    const target = new THREE.Vector3();
    this.camera.getWorldDirection(target);
    const lookAtData = this.camera.position.clone().add(target);
    console.log('LookAt Point:', lookAtData.x, lookAtData.y, lookAtData.z);
  }




}
