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
    this.user.userModel = await new OBJLoader().loadAsync('assets/svg/person.obj');
    this.user.setCurrentGroup(this.user.userModel)
    this.setInitPosition()
    this.addModelToScenen()
    this.render()
  }


  /** 设置初始位置 */
  setInitPosition(): void {
    this.user.currentGroup.position.set(0, -60, 0)
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
    var points = curve.getPoints(100);
    var geometry = new THREE.BufferGeometry();
    var positions: any = [];
    points.forEach((point) => positions.push(point.x, point.y, point.z));
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    var material = new THREE.LineBasicMaterial({
      color: "#4488ff"
    });
    var line = new THREE.Line(geometry, material);
    // this.scene.add(line);
    return curve
  }


  changeLookAt(t: any, curve: any): void {
    // 当前点在线条上的位置
    const position = curve.getPointAt(t);
    if (t > 0.03) {
      var pos = curve.getPointAt(t - 0.03);
      this.camera.position.copy(pos);
      this.camera.lookAt(position);
    }
  }


  renderScene(curve: any): void {
    // 使用requestAnimationFrame函数进行渲染
    requestAnimationFrame(() => this.renderScene(curve));
    this.render()

    if (curve) {
      let time = Date.now();
      let t = (time % this.loopTime) / this.loopTime; // 计算当前时间进度百分比
      setTimeout(() => {
        this.changeLookAt(t, curve);
      }, 2000)
    }
  }

}
