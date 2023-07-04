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
  t = 0;
  sceneView: any;
  loopTime = 10 * 1000; // loopTime: 循环一圈的时间


  async ngOnInit(): Promise<void> {
    this.sceneView = await new FBXLoader().loadAsync('assets/svg/5.fbx');
    this.user.setCurrentGroup(this.user.userModel)
    this.addModelToScenen()
    this.render()
  }

  /** 模型加入场景 */
  addModelToScenen(): void {
    this.scene.add(this.user.currentGroup)
    this.scene.add(this.sceneView)
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
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
        if (e.t > 0.04) {
          var pos = curve.getPointAt(e.t - 0.04);
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


}
