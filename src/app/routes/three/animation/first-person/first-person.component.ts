import { Component, OnInit, Input } from '@angular/core';
import { Common } from '../../common/common.class';
import { UserModel } from '../../common/user.class';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { HDRCubeTextureLoader } from "three/examples/jsm/loaders/HDRCubeTextureLoader";

@Component({
  selector: 'app-first-person',
  templateUrl: './first-person.component.html',
  styleUrls: ['./first-person.component.less']
})
export class FirstPersonComponent extends Common implements OnInit {

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
    this.user.userModel = await new OBJLoader().loadAsync('assets/svg/person.obj');
    this.addModelToScenen()
    this.render()
  }

  /** 模型加入场景 */
  addModelToScenen(): void {
    this.scene.add(this.sceneView)
    this.scene.add(this.user.userModel)
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  editBackground(): void {
    const loader = new HDRCubeTextureLoader();
    loader.setPath('assets/hdr'); // 设置 HDR 图像所在的文件夹路径

    const hdrCubeMap = loader.load([
      '1.hdr', '1.hdr', // 正 x、负 x 方向
      '1.hdr', '1.hdr', // 正 y、负 y 方向
      '1.hdr', '1.hdr'  // 正 z、负 z 方向
    ], () => {

    });
    // hdrCubeMap.encoding = THREE.RGBEEncoding; // 设置 HDR 编码
    this.scene.background = hdrCubeMap;
  }


}
