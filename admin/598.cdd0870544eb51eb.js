"use strict";(self.webpackChunkng_alain=self.webpackChunkng_alain||[]).push([[598],{1598:(V,z,s)=>{s.r(z),s.d(z,{DictModule:()=>q});var F=s(4909),k=s(4400),y=s(4521),t=s(5e3),C=s(9808),l=s(9727),g=s(5617),v=s(7957),J=s(9590),h=s(3186),p=s(6042),d=s(2643),u=s(2683);function P(n,a){1&n&&t._UZ(0,"nz-spin",4)}function L(n,a){if(1&n){const e=t.EpF();t.TgZ(0,"sf",5,6)(2,"div",7)(3,"button",8),t.NdJ("click",function(){return t.CHM(e),t.oxw().location.back()}),t._uU(4,"\u8fd4\u56de"),t.qZA(),t.TgZ(5,"button",9),t.NdJ("click",function(){t.CHM(e);const o=t.MAs(1);return t.oxw().save(o.value)}),t._uU(6,"\u4fdd\u5b58 "),t.qZA()()()}if(2&n){const e=t.MAs(1),i=t.oxw();t.Q6J("schema",i.schema)("ui",i.ui)("formData",i.i),t.xp6(3),t.Q6J("nzLoading",i.http.loading),t.xp6(2),t.Q6J("disabled",!e.valid)("nzLoading",i.http.loading)}}let m=(()=>{class n{constructor(e,i,o,r,c){this.route=e,this.location=i,this.msgSrv=o,this.http=r,this.modal=c,this.id=this.route.snapshot.params.id,this.schema={type:"object",properties:{id:{type:"string",title:"\u7f16\u53f7"},label:{type:"string"},value:{type:"string"},dictSort:{type:"integer"},status:{type:"integer",title:"\u72b6\u6001"}}},this.ui={"*":{spanLabelFixed:100,grid:{span:24}}}}ngOnInit(){this.id>0&&this.http.get(`/dict-data/${this.record.id}`).subscribe(e=>this.i=e)}save(e){this.http.post(`/dict-data/${this.record.id}`,e).subscribe(i=>{this.msgSrv.success("\u4fdd\u5b58\u6210\u529f"),this.modal.close(!0)})}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(y.gz),t.Y36(C.Ye),t.Y36(l.dD),t.Y36(g.lP),t.Y36(v.Lf))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-dict-type-swagger-edit"]],decls:5,vars:2,consts:[[1,"modal-header"],[1,"modal-title"],["class","modal-spin",4,"ngIf"],["mode","edit","button","none",3,"schema","ui","formData",4,"ngIf"],[1,"modal-spin"],["mode","edit","button","none",3,"schema","ui","formData"],["sf",""],[1,"modal-footer"],["nz-button","","type","button",3,"nzLoading","click"],["nz-button","","type","submit","nzType","primary",3,"disabled","nzLoading","click"]],template:function(e,i){1&e&&(t.TgZ(0,"div",0)(1,"div",1),t._uU(2,"\u6dfb\u52a0/\u7f16\u8f91\u5e94\u7528\u4fe1\u606f"),t.qZA()(),t.YNc(3,P,1,0,"nz-spin",2),t.YNc(4,L,7,6,"sf",3)),2&e&&(t.xp6(3),t.Q6J("ngIf",!i.i),t.xp6(1),t.Q6J("ngIf",i.i))},directives:[C.O5,J.W,h.kJ,p.ix,d.dQ,u.w],encapsulation:2}),n})();var D=s(7946),x=s(7484),O=s(1894),S=s(5017),_=s(7664);const Q=["st"];function E(n,a){if(1&n){const e=t.EpF();t.TgZ(0,"button",8),t.NdJ("click",function(){return t.CHM(e),t.oxw().add()}),t._uU(1,"\u6dfb\u52a0\u5b57\u5178\u7c7b\u578b"),t.qZA()}}let M=(()=>{class n{constructor(e,i,o){this.http=e,this.msg=i,this.modal=o,this.url="/service/dictionary/dict-type-data/page-all",this.searchSchema={properties:{no:{type:"string",title:"\u7f16\u53f7"}}},this.columns=[{title:"\u7f16\u53f7",index:"id"},{title:"systemDictType",index:"systemDictType"},{title:"label",index:"label"},{title:"value",index:"value"},{title:"dictSort",index:"dictSort",type:"number"},{title:"\u72b6\u6001",index:"status",type:"number"}]}refresh(){this.st.reload()}add(){this.modal.createStatic(m,{i:{id:""}},{size:600}).subscribe(()=>this.st.reload())}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(g.lP),t.Y36(l.dD),t.Y36(g.Te))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-dict-type-swagger-list"]],viewQuery:function(e,i){if(1&e&&t.Gf(Q,5),2&e){let o;t.iGM(o=t.CRH())&&(i.st=o.first)}},decls:11,vars:4,consts:[[3,"action"],["phActionTpl",""],[1,"justify-content-between"],["mode","search",3,"schema","formSubmit","formReset"],["nz-button","","nzShape","circle","nzType","primary",3,"click"],["nz-icon","","nzType","reload"],[3,"data","columns"],["st",""],["nz-button","","nzType","primary",3,"click"]],template:function(e,i){if(1&e){const o=t.EpF();t.TgZ(0,"page-header",0),t.YNc(1,E,2,0,"ng-template",null,1,t.W1O),t.qZA(),t.TgZ(3,"nz-card")(4,"nz-row",2)(5,"sf",3),t.NdJ("formSubmit",function(c){return t.CHM(o),t.MAs(10).reset(c)})("formReset",function(c){return t.CHM(o),t.MAs(10).reset(c)}),t.qZA(),t.TgZ(6,"div")(7,"button",4),t.NdJ("click",function(){return i.refresh()}),t._UZ(8,"i",5),t.qZA()()(),t._UZ(9,"st",6,7),t.qZA()}if(2&e){const o=t.MAs(2);t.Q6J("action",o),t.xp6(5),t.Q6J("schema",i.searchSchema),t.xp6(4),t.Q6J("data",i.url)("columns",i.columns)}},directives:[D.q,p.ix,d.dQ,u.w,x.bd,O.SK,h.kJ,S.Ls,_.A5],encapsulation:2}),n})();const U=[{label:"\u4f01\u4e1a\u5fae\u4fe1",value:"wxCp"},{label:"\u9489\u9489",value:"ding"},{label:"\u4e91\u4e4b\u5bb6",value:"yzj"},{label:"\u5176\u4ed6",value:"other"}],H=[{label:"app\u8bbf\u95ee",value:"app"},{label:"web\u7aef\u8bbf\u95ee",value:"web"},{label:"\u901a\u8baf\u5f55",value:"contact"}];var I=s(4004),b=s(2527);const Y=["sf"];let A=(()=>{class n{constructor(e,i,o){this.modal=e,this.msgSrv=i,this.organizationService=o,this.i={},this.schema={properties:{name:{type:"string",title:"\u5e94\u7528\u540d\u79f0",maxLength:100,ui:{placeHolder:"\u8bf7\u8f93\u5165"}},companyId:{type:"string",title:"\u63a5\u5165\u516c\u53f8",maxLength:100,ui:{placeHolder:"\u8bf7\u8f93\u5165",widget:"select",asyncData:()=>this.organizationService.allPro().pipe((0,I.U)(r=>r.data.map(f=>({label:f.name,value:f.id}))))}},agentId:{type:"string",title:"\u4e09\u65b9\u5e94\u7528Id",maxLength:100,ui:{placeholder:"\u8bf7\u8f93\u5165"}},url:{type:"string",title:"\u8bbf\u95ee\u8def\u5f84",maxLength:100,ui:{placeHolder:"\u8bf7\u8f93\u5165"}},category:{type:"string",title:"\u5e94\u7528\u7c7b\u578b",enum:H,ui:{placeHolder:"\u8bf7\u9009\u62e9",widget:"select",width:150}},secret:{type:"string",title:"\u4f01\u4e1a\u5fae\u4fe1\u901a\u8baf\u5f55",maxLength:100,ui:{visibleIf:{category:["contact"]},placeHolder:"\u8bf7\u8f93\u5165"}},messageToken:{type:"string",title:"\u4f01\u4e1a\u5fae\u4fe1token",maxLength:100,ui:{visibleIf:{category:["contact"]},placeHolder:"\u8bf7\u8f93\u5165"}},messageEncodingAesKey:{type:"string",title:"\u4f01\u4e1a\u5fae\u4fe1Key",maxLength:100,ui:{visibleIf:{category:["contact"]},placeHolder:"\u8bf7\u8f93\u5165"}}},required:["name","companyId","url","category","secret","messageToken","messageEncodingAesKey"]},this.ui={"*":{spanLabelFixed:150,grid:{span:12}},$description:{widget:"textarea",grid:{span:24},autosize:{minRows:4,maxRows:6}}}}ngOnInit(){console.log(this.i)}save(e){this.saveOperation(e)}close(){this.modal.destroy()}saveOperation(e){var i;(null===(i=this.i)||void 0===i?void 0:i.id)?(e.id=this.i.id,this.fn("editApp",e)):this.fn("saveApp",e)}fn(e,i){this.organizationService[e](i).subscribe(o=>{this.httpAfterOperation(o.success,o.message)})}httpAfterOperation(e,i){e?this.msgSrv.success(i):this.msgSrv.error(i),e&&this.modal.close(!0)}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(v.Lf),t.Y36(l.dD),t.Y36(b.M))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-app-add"]],viewQuery:function(e,i){if(1&e&&t.Gf(Y,5),2&e){let o;t.iGM(o=t.CRH())&&(i.sf=o.first)}},decls:10,vars:4,consts:[[1,"modal-header"],[1,"modal-title"],["mode","edit","button","none",3,"schema","ui","formData"],["sf",""],[1,"modal-footer"],["nz-button","","type","button",3,"click"],["nz-button","","type","submit","nzType","primary",3,"disabled","click"]],template:function(e,i){if(1&e){const o=t.EpF();t.TgZ(0,"div",0)(1,"div",1),t._uU(2,"\u6dfb\u52a0/\u7f16\u8f91\u5e94\u7528"),t.qZA()(),t.TgZ(3,"sf",2,3)(5,"div",4)(6,"button",5),t.NdJ("click",function(){return i.close()}),t._uU(7,"\u5173\u95ed"),t.qZA(),t.TgZ(8,"button",6),t.NdJ("click",function(){t.CHM(o);const c=t.MAs(4);return i.save(c.value)}),t._uU(9,"\u4fdd\u5b58 "),t.qZA()()()}if(2&e){const o=t.MAs(4);t.xp6(3),t.Q6J("schema",i.schema)("ui",i.ui)("formData",i.i),t.xp6(5),t.Q6J("disabled",!o.valid)}},directives:[h.kJ,p.ix,d.dQ,u.w],styles:[""]}),n})();const R=["sf"];let T=(()=>{class n{constructor(e,i,o){this.modal=e,this.msgSrv=i,this.organizationService=o,this.i={},this.schema={properties:{name:{type:"string",title:"\u9879\u76ee\u540d\u79f0",maxLength:100,ui:{placeholder:"\u8bf7\u8f93\u5165"}},corpId:{type:"string",title:"\u4e09\u65b9\u516c\u53f8Id",maxLength:100,ui:{placeholder:"\u8bf7\u8f93\u5165"}},category:{type:"string",enum:U,title:"\u5e94\u7528",ui:{placeholder:"\u8bf7\u9009\u62e9",widget:"select"}},automaticUpdate:{type:"boolean",title:"\u81ea\u52a8\u66f4\u65b0\u901a\u8baf\u5f55"},synchronisedTime:{type:"number",minimum:0,title:"\u540c\u6b65\u65f6\u95f4",ui:{visibleIf:{automaticUpdate:[!0]}}}},required:["name","corpId","agentId","category","automaticUpdate","synchronisedTime"]},this.ui={"*":{spanLabelFixed:150,grid:{span:12}}}}ngOnInit(){}save(e){this.saveOperation(e)}close(){this.modal.destroy()}saveOperation(e){var i;(null===(i=this.i)||void 0===i?void 0:i.id)?(e.id=this.i.id,this.fn("editPro",e)):this.fn("savePro",e)}fn(e,i){this.organizationService[e](i).subscribe(o=>{this.httpAfterOperation(o.success,o.message)})}httpAfterOperation(e,i){e?this.msgSrv.success(i):this.msgSrv.error(i),e&&this.modal.close(!0)}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(v.Lf),t.Y36(l.dD),t.Y36(b.M))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-pro-add"]],viewQuery:function(e,i){if(1&e&&t.Gf(R,5),2&e){let o;t.iGM(o=t.CRH())&&(i.sf=o.first)}},decls:10,vars:4,consts:[[1,"modal-header"],[1,"modal-title"],["mode","edit","button","none",3,"schema","ui","formData"],["sf",""],[1,"modal-footer"],["nz-button","","type","button",3,"click"],["nz-button","","type","submit","nzType","primary",3,"disabled","click"]],template:function(e,i){if(1&e){const o=t.EpF();t.TgZ(0,"div",0)(1,"div",1),t._uU(2,"\u6dfb\u52a0/\u7f16\u8f91\u516c\u53f8"),t.qZA()(),t.TgZ(3,"sf",2,3)(5,"div",4)(6,"button",5),t.NdJ("click",function(){return i.close()}),t._uU(7,"\u5173\u95ed"),t.qZA(),t.TgZ(8,"button",6),t.NdJ("click",function(){t.CHM(o);const c=t.MAs(4);return i.save(c.value)}),t._uU(9,"\u4fdd\u5b58"),t.qZA()()()}if(2&e){const o=t.MAs(4);t.xp6(3),t.Q6J("schema",i.schema)("ui",i.ui)("formData",i.i),t.xp6(5),t.Q6J("disabled",!o.valid)}},directives:[h.kJ,p.ix,d.dQ,u.w],styles:[""]}),n})();var Z=s(404);const N=["stPro"],B=["stApp"],G=["cpTrigger"];function j(n,a){}function K(n,a){if(1&n){const e=t.EpF();t.TgZ(0,"label",10),t.NdJ("click",function(){const r=t.CHM(e).$implicit;return t.oxw().cpClickTrigger(r.url+"?appId="+r.id)}),t._UZ(1,"i",11),t._uU(2),t.qZA()}if(2&n){const e=a.$implicit;t.s9C("title",e.url+"?appId="+e.id),t.xp6(2),t.hij(" ",e.url+"?appId="+e.id," ")}}const X=[{path:"data",component:M},{path:"swagger-edit",component:m},{path:"organization-management",component:(()=>{class n{constructor(e,i,o){this.modal=e,this.organizationService=i,this.msgSrv=o,this.urlPro="/base/api/agent/company/page-all",this.urlApp="/base/api/agent/app/page-all",this.columnsPro=[{title:"\u540d\u79f0",index:"name"},{title:"\u516c\u53f8Id",index:"corpId"},{title:"\u5e94\u7528",index:"category",type:"enum",enum:{wxCp:"\u4f01\u4e1a\u5fae\u4fe1",ding:"\u9489\u9489",yzj:"\u4e91\u4e4b\u5bb6",other:"\u5176\u4ed6"}},{title:"\u901a\u8baf\u5f55\u81ea\u52a8\u540c\u6b65",index:"automaticUpdate",type:"yn"},{title:"\u64cd\u4f5c",buttons:[{text:"\u7f16\u8f91",click:r=>this.editPro(r)},{text:"\u5220\u9664",icon:"delete",type:"del",pop:{title:"\u786e\u8ba4\u5220\u9664\u8be5\u8ba1\u5212?",okType:"danger",icon:"star"},click:r=>{this.deleteProHttp(r.id)}},{text:"\u5e94\u7528\u5217\u8868"},{text:"\u7ba1\u7406\u5458\u8d26\u53f7"}]}],this.columnsApp=[{title:"\u5e94\u7528\u540d\u79f0",index:"name"},{title:"\u516c\u53f8",index:"companyId"},{title:"\u8bbf\u95ee\u5730\u5740",index:"url",render:"renderAppAuthUrl"},{title:"\u5e94\u7528\u7c7b\u578b",index:"category",type:"enum",enum:{app:"app\u8bbf\u95ee",web:"web\u7aef\u8bbf\u95ee",contact:"\u901a\u8baf\u5f55"}},{title:"\u4f01\u4e1a\u5fae\u4fe1\u901a\u8baf\u5f55secret",index:"secret"},{title:"\u901a\u8baf\u5f55token",index:"messageToken"},{title:"\u901a\u8baf\u5f55Key",index:"messageEncodingAesKey"},{title:"\u64cd\u4f5c",buttons:[{text:"\u7f16\u8f91",click:r=>this.editApp(r)},{text:"\u5220\u9664",icon:"delete",type:"del",pop:{title:"\u786e\u8ba4\u5220\u9664\u8be5\u8ba1\u5212?",okType:"danger",icon:"star"},click:r=>{this.deleteAppHttp(r.id)}}]}]}ngOnInit(){new ClipboardJS(".cp-trigger",{text:i=>this.cpData})}addApp(){this.modal.createStatic(A).subscribe(e=>{this.tableRefresh("stApp")})}addPro(){this.modal.createStatic(T).subscribe(e=>{this.tableRefresh("stPro")})}tableRefresh(e){this[e].reload()}choosePerson(){}deleteProHttp(e){this.organizationService.deletePro(e).subscribe(i=>{this.httpAfterOperation(i.success,i.message),this.refresh()})}deleteAppHttp(e){this.organizationService.deleteApp(e).subscribe(i=>{this.httpAfterOperation(i.success,i.message),this.refresh()})}editPro(e){this.modal.createStatic(T,{i:e}).subscribe(i=>{this.tableRefresh("stPro")})}editApp(e){this.modal.createStatic(A,{i:e}).subscribe(i=>{this.tableRefresh("stApp")})}httpAfterOperation(e,i){e?this.msgSrv.success(i):this.msgSrv.error(i)}refresh(){this.tableRefresh("stPro"),this.tableRefresh("stApp")}cpClickTrigger(e){this.cpData=e,this.cpTrigger.nativeElement.click()}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(g.Te),t.Y36(b.M),t.Y36(l.dD))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-organization-management"]],viewQuery:function(e,i){if(1&e&&(t.Gf(N,5),t.Gf(B,5),t.Gf(G,5)),2&e){let o;t.iGM(o=t.CRH())&&(i.stPro=o.first),t.iGM(o=t.CRH())&&(i.stApp=o.first),t.iGM(o=t.CRH())&&(i.cpTrigger=o.first)}},decls:20,vars:5,consts:[[3,"action"],["phActionTpl",""],["nz-button","","nzType","primary",3,"click"],[3,"data","columns"],["stPro",""],["stApp",""],["st-row","renderAppAuthUrl"],[3,"click"],[1,"cp-trigger"],["cpTrigger",""],["nz-tooltip","","nzTooltipPlacement","topLeft","nzTooltipTrigger","click","nzTooltipTitle","\u5df2\u590d\u5236\u5230\u7c98\u8d34\u677f",1,"app-auth-url",3,"title","click"],["nz-icon","","nzType","copy","nzTheme","outline"]],template:function(e,i){if(1&e&&(t.TgZ(0,"page-header",0),t.YNc(1,j,0,0,"ng-template",null,1,t.W1O),t.qZA(),t.TgZ(3,"nz-card")(4,"div")(5,"button",2),t.NdJ("click",function(){return i.addPro()}),t._uU(6,"\u6dfb\u52a0\u516c\u53f8"),t.qZA()(),t._UZ(7,"st",3,4),t.qZA(),t.TgZ(9,"nz-card")(10,"div")(11,"button",2),t.NdJ("click",function(){return i.addApp()}),t._uU(12,"\u6dfb\u52a0\u5e94\u7528"),t.qZA()(),t.TgZ(13,"st",3,5),t.YNc(15,K,3,2,"ng-template",6),t.qZA()(),t.TgZ(16,"button",7),t.NdJ("click",function(){return i.choosePerson()}),t._uU(17,"\u9009\u4eba"),t.qZA(),t._UZ(18,"div",8,9)),2&e){const o=t.MAs(2);t.Q6J("action",o),t.xp6(7),t.Q6J("data",i.urlPro)("columns",i.columnsPro),t.xp6(6),t.Q6J("data",i.urlApp)("columns",i.columnsApp)}},directives:[D.q,x.bd,p.ix,d.dQ,u.w,_.A5,_.wZ,Z.SY,S.Ls],styles:[".app-auth-url[_ngcontent-%COMP%]{color:#1890ff}"]}),n})()},{path:"swagger-edit",component:m},{path:"swagger-edit",component:m}];let $=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[y.Bz.forChild(X)],y.Bz]}),n})();var W=s(2382);let q=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[k.m8,$,F.H,Z.cg,W.u5]]}),n})()}}]);