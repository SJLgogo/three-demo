import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Common {
    constructor() {

    }

    async loadModel(url: string): Promise<any> {
        const gLTFLoader = new GLTFLoader();
        const gltf = await gLTFLoader.loadAsync(url);
        const modal = this.operateGltfModel(gltf)
        return { modal: modal, gltf: gltf }
    }


    /** 处理gltf模型 */
    operateGltfModel(gltf: any): any {
        const model = gltf.scene;
        model.scale.multiplyScalar(5);
        const group = new THREE.Group();
        group.add(model);
        model.traverse((node: any) => {
            if (node.isMesh) {
                const mesh = node as THREE.Mesh;
                const materials = mesh.material;

                if (Array.isArray(materials)) {
                    // 处理多个材质
                    for (let i = 0; i < materials.length; i++) {
                        const material = materials[i] as THREE.MeshStandardMaterial;
                        const texture = gltf.parser.json.textures[i]; // 获取对应索引的texture

                        if (texture) {
                            const textureIndex = texture.index; // 获取texture的索引
                            const textureObj = gltf.parser.json.images[textureIndex]; // 获取对应索引的图片对象

                            if (textureObj) {
                                const texturePath = textureObj.uri; // 获取图片路径

                                // 创建纹理对象并设置到材质中
                                const textureLoader = new THREE.TextureLoader();
                                const textureMap = textureLoader.load(texturePath);
                                material.map = textureMap;
                                material.needsUpdate = true;
                            }
                        }
                    }
                } else if (materials instanceof THREE.MeshStandardMaterial) {
                    // 处理单个材质
                    const material = materials;
                    const texture = gltf.parser.json.textures[0]; // 获取第一个texture

                    if (texture) {
                        const textureIndex = texture.index; // 获取texture的索引
                        const textureObj = gltf.parser.json.images[textureIndex]; // 获取对应索引的图片对象

                        if (textureObj) {
                            const texturePath = textureObj.uri; // 获取图片路径

                            // 创建纹理对象并设置到材质中
                            const textureLoader = new THREE.TextureLoader();
                            const textureMap = textureLoader.load(texturePath);
                            material.map = textureMap;
                            material.needsUpdate = true;
                        }
                    }
                }
            }
        });
        return group
    }

    getCameraDirection(camera: any): void {
        const direction = new THREE.Vector3(); // 创建一个向量来保存相机的朝向数据
        camera.getWorldDirection(direction); // 将相机的朝向数据存储在 direction 向量中
        console.log('Camera Direction:', direction.x, direction.y, direction.z);    // 输出相机朝向的 x、y、z 分量
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