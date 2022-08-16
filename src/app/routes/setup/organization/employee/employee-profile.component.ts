// import { Component, Input, OnInit } from '@angular/core';
// import { _HttpClient, ModalHelper } from '@delon/theme';
// import { Base } from '../../../../common/base';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { NzMessageService } from 'ng-zorro-antd/message';
// import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
// import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
//
// @Component({
//   selector: 'app-system-contact-employee-profile',
//   templateUrl: './employee-profile.component.html',
//   styleUrls: ['./employee-profile.component.less'],
// })
// export class SystemContactEmployeeProfileComponent extends Base implements OnInit {
//   employee: any = {};
//   employeeAvatar = '';
//   employeeOrgInfo = '';
//   employeePostInfo = '';
//   employeeJobInfo = '';
//
//   active = 1;
//   profileForm: FormGroup;
//
//   constructor(
//     fb: FormBuilder,
//     public msgSrv: NzMessageService,
//     public http: _HttpClient,
//     private activeRoute: ActivatedRoute,
//     private modal: ModalHelper,
//     private nzContextMenuService: NzContextMenuService,
//     private modalSrv: NzModalService,
//     private router: Router,
//   ) {
//     super();
//     this.profileForm = fb.group({
//       name: [null, Validators.compose([Validators.required])],
//       email: '',
//       code: '',
//       remark: [null, Validators.maxLength(160)],
//       telephone: '',
//       mobilePhone: '',
//       employeeEnum: '',
//       entryDate: '',
//       birthday: '',
//       address: '',
//       gender: '',
//     });
//   }
//
//   ngOnInit(): void {
//     this.activeRoute.queryParams.subscribe((params) => {
//       this.loadEmployee(params.employeeId);
//     });
//   }
//
//   //-----------------用户信息
//   loadEmployee(employeeId): void {
//     this.http.get(`/service/contact/admin/employee/profile/` + employeeId).subscribe((res) => {
//       if (res.success) {
//         this.employee = res.data;
//         this.employeeAvatar = this.employee.wxAvatar;
//
//         let orgNameArray = [];
//         this.employee.orgInfoList.forEach(function (value, index, array) {
//           orgNameArray.push(value.path);
//         });
//         this.employeeOrgInfo = orgNameArray.join(',');
//
//         let postNameArray = [];
//         this.employee.postInfoList.forEach(function (value, index, array) {
//           postNameArray.push(value.name);
//         });
//         this.employeePostInfo = postNameArray.join(',');
//
//         let jobNameArray = [];
//         this.employee.jobInfoList.forEach(function (value, index, array) {
//           jobNameArray.push(value.name);
//         });
//         this.employeeJobInfo = jobNameArray.join(',');
//
//         this.profileForm.patchValue({
//           code: this.employee.code,
//           name: this.employee.name,
//           email: this.employee.email,
//           gender: this.employee.genderEnum,
//           employeeEnum: this.employee.employeeEnum,
//           mobilePhone: this.employee.mobilePhone,
//           telephone: this.employee.telephone,
//           address: this.employee.address,
//           entryDate: this.employee.entryDate,
//           birthday: this.employee.birthday,
//           remark: this.employee.remark,
//         });
//
//         this.loadRoleList();
//         this.loadAppList();
//         this.loadPostInfo();
//       }
//     });
//   }
//
//   updateEmployeeProfile(event, employeeValue) {
//     employeeValue.id = this.employee.id;
//     console.log(this.profileForm.getRawValue());
//     this.http.post(`/service/contact/admin/employee/profile/update/personal-info`, employeeValue).subscribe((res) => {
//       if (res.success) {
//         this.msgSrv.success(res.msg);
//         this.loadRoleAppPermission();
//       }
//     });
//   }
//
//   changeRolePermission(permission: any): void {}
//   //-----------------用户信息
//
//   //-----------------岗位职务信息
//   postList = [];
//   jobList = [];
//   loadPostInfo() {
//     this.http.get(`/service/contact/admin/employee/position/` + this.employee.id).subscribe((res) => {
//       if (res.success) {
//         this.postList = res.data.post;
//         this.jobList = res.data.job;
//       }
//     });
//   }
//
//   addPost() {
//     let selectedUser = [];
//     let mode = ['post'];
//     this.modal.createStatic(SetupContactSelectComponent, { selectedItems: selectedUser, mode: mode }).subscribe((res) => {
//       let postIds = [];
//       res.selectedItems.forEach(function (value, index, array) {
//         switch (value.category) {
//           case 'post':
//             postIds.push(value.id);
//             break;
//         }
//       });
//
//       let params = {
//         employeeId: this.employee.id,
//         postIds: postIds.join(','),
//       };
//       this.http.post(`/service/contact/admin/employee/assign/post`, params).subscribe((res) => {
//         if (res.success) {
//           this.loadPostInfo();
//           this.msgSrv.success('保存成功');
//         }
//       });
//     });
//   }
//
//   setPrincipalPost(post, isPrincipal) {
//     let params = {
//       employeeId: this.employee.id,
//       relationId: post.relationId,
//       principal: isPrincipal,
//     };
//     this.http.post(`/service/contact/admin/employee/post/principal`, params).subscribe((res) => {
//       if (res.success) {
//         this.loadPostInfo();
//         this.msgSrv.success('保存成功');
//       }
//     });
//   }
//
//   removePost(post) {
//     this.confirmModal = this.modalSrv.confirm({
//       nzTitle: '删除确认?',
//       nzContent: '是否要移除 [' + post.postName + '] ?',
//       nzOnOk: () => {
//         let params = {
//           employeeId: this.employee.id,
//           relationId: post.relationId,
//         };
//         this.http.post(`/service/contact/admin/employee/unAssign/post`, params).subscribe((res) => {
//           if (res.success) {
//             this.loadPostInfo();
//             this.msgSrv.success(res.msg);
//           }
//         });
//       },
//     });
//   }
//
//   addJob() {
//     let selectedUser = [];
//     let mode = ['job'];
//     this.modal.createStatic(SetupContactSelectComponent, { selectedItems: selectedUser, mode: mode }).subscribe((res) => {
//       let postIds = [];
//       res.selectedItems.forEach(function (value, index, array) {
//         switch (value.category) {
//           case 'job':
//             postIds.push(value.id);
//             break;
//         }
//       });
//
//       let params = {
//         employeeId: this.employee.id,
//         jobIds: postIds.join(','),
//       };
//       this.http.post(`/service/contact/admin/employee/assign/job`, params).subscribe((res) => {
//         if (res.success) {
//           this.loadPostInfo();
//           this.msgSrv.success('保存成功');
//         }
//       });
//     });
//   }
//
//   setPrincipalJob(job, isPrincipal) {
//     let params = {
//       employeeId: this.employee.id,
//       relationId: job.relationId,
//       principal: isPrincipal,
//     };
//     this.http.post(`/service/contact/admin/employee/job/principal`, params).subscribe((res) => {
//       if (res.success) {
//         this.loadPostInfo();
//         this.msgSrv.success('保存成功');
//       }
//     });
//   }
//
//   removeJob(job) {
//     this.confirmModal = this.modalSrv.confirm({
//       nzTitle: '删除确认?',
//       nzContent: '是否要移除 [' + job.jobName + '] ?',
//       nzOnOk: () => {
//         let params = {
//           employeeId: this.employee.id,
//           relationId: job.relationId,
//         };
//         this.http.post(`/service/contact/admin/employee/unAssign/job`, params).subscribe((res) => {
//           if (res.success) {
//             this.loadPostInfo();
//             this.msgSrv.success(res.msg);
//           }
//         });
//       },
//     });
//   }
//
//   //-----------------岗位职务信息
//
//   //-----------------角色权限
//   //-----------------角色列表
//   confirmModal: NzModalRef;
//   roleList = [];
//   selectedRole = { id: null };
//   loadRoleList() {
//     this.http.get(`/service/contact/admin/role/list/employee/` + this.employee.id).subscribe((res) => {
//       if (res.success) {
//         this.roleList = res.data;
//       }
//     });
//   }
//   activeRole(role) {
//     this.selectedRole = role;
//     if (this.selectedApp != null) {
//       this.loadRoleAppPermission();
//     }
//   }
//   //-----------------角色列表
//
//   //应用列表
//   selectedApp: any = null;
//   appList = [];
//   loadAppList() {
//     this.selectedApp = {};
//     this.http.get(`/service/contact/admin/application/list`).subscribe((res) => {
//       if (res.success) {
//         this.appList = res.data;
//       }
//     });
//   }
//   optAppPermission(app) {
//     this.selectedApp = app;
//     this.roleAppPermissions = [];
//     this.loadRoleAppPermission();
//   }
//
//   //权限操作
//   roleAppPermissions = [];
//   loadRoleAppPermission(): void {
//     let params = {
//       roleId: this.selectedRole.id,
//       applicationId: this.selectedApp.id,
//     };
//     this.http.post(`/service/contact/admin/role/permission/list/all`, params).subscribe((res) => {
//       if (res.success) {
//         this.roleAppPermissions = res.data;
//       }
//     });
//   }
//
//   //-----------------角色权限
// }
