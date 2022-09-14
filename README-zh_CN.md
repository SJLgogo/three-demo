<p align="center">
  <a href="https://ng-alain.com">
    <img width="100" src="https://ng-alain.com/assets/img/logo-color.svg">
  </a>
</p>

<h1 align="center">汇辙科技web端基础框架</h1>


[English](README.md) | 简体中文

## 快速入门

- 网页登录url为动态访问连接、例如：http://localhost:4200/passport/login?appId=1547139498926796801

## 基础功能点

+ minio分布式存储功能组织使用方法
+ 
+ 1.环境变量配置
export const environment = {
  production: false,
  useHash: false,
  api: {
    baseUrl: './api/',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh',
    version: 'dev',
    RESOURCE_APP_NAME:'shaoxing2-resource-document-management',
  },
  modules: [DelonMockModule.forRoot({ data: MOCKDATA })]
} as Environment;

+ 2.html
<div class="upload">
  <nz-upload
    nzType="drag"
    [nzMultiple]="false"
    [nzAccept]="
      'application/pdf,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    "
    [(nzFileList)]="fileList"
    [nzBeforeUpload]="beforeUpload"
    [nzRemove]="fileRemove"
  >
    <div class="add-img">
      <img src="assets/img/add.png" />
    </div>
    <p class="ant-upload-text">将文件拖到此处，或点击上传</p>
  </nz-upload>
</div>

+ 3.ts代码
handleUpload() {
  const formData = new FormData();
  this.fileList.forEach((file: any) => {
    formData.append('file', file);
  });
  this.uploading = true;
  const appName = `${environment.api['RESOURCE_APP_NAME']}`;
  formData.append('appName', appName);
  this.http.post(`/service/platform-resource/resources/wxcp/uploadObject`, formData).subscribe((res) => {
    if (res.success) {
      //->>>>>>>>>>>>业务代码

      const objectName = res.data.objectName;//应用只存上传返回的这个objectName
      console.log(objectName);
      const url = this.presignedGetObjectUrl(objectName);//通过objectName来获取访问链接
      this.emergencyPlanFileDTO.url = url;
    }
  });
}

//获取临时访问链接
presignedGetObjectUrl(objectName: String) {
  const postData = {
    objectName: objectName,//上传获取的文件名称
    appName: `${environment.api['RESOURCE_APP_NAME']}`,//每个应用应该配置一个应用名
    expires: 120000//临时链接生效时长，不少于120秒，这里是120000毫秒
  };
  this.http.post(`/service/platform-resource/resources/wxcp/presignedGetObjectUrl`, postData).subscribe((res) => {
    if (res.success) {
      console.log(res);
      return res.data;
    } else {
      return null;
    }
  });
}


## 特性

+ 基于 `ng-zorro-antd`
+ 响应式
+ 国际化
+ 基建类库 [@delon](https://github.com/ng-alain/delon)（包括：业务组件、ACL访问控制、缓存、授权、动态表单等）
+ 延迟加载及良好的启用画面
+ 良好的UI路由设计
+ 定制主题
+ Less预编译
+ RTL
+ 良好的目录组织结构
+ 简单升级
+ 支持Docker部署

## Architecture

![Architecture](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/architecture.png)

> [delon](https://github.com/ng-alain/delon) 是基于 Ant Design 设计理念的企业级中后台前端业务型组件库。

## 应用截图

![desktop](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/desktop.png)
![ipad](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/ipad.png)
![iphone](https://raw.githubusercontent.com/ng-alain/delon/master/_screenshot/iphone.png)


