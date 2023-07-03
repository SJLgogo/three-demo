import { Group } from "three";

export class UserModel {
    constructor() {

    }

    // 人物模型
    userModel: any;

    // 行走动画模型
    walkingModel: any;
    walkingGltf: any

    // 当前模型
    currentGroup: any = new Group();


    setCurrentGroup(modal: any): void {
        this.currentGroup.add(modal)
    }


}