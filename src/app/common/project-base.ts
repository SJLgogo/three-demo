import { Injectable } from '@angular/core';
import { STColumnBadge } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';

declare var wx: any;

@Injectable()
export class ProjectBase {
  /*********    表格分页配合后台的spring data jpa    *********/
  customRequest: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'pageNo',
      ps: 'pageSize',
    },
  };

  customResponse: any = {
    reName: {
      total: 'data.totalElements',
      list: 'data.content',
    },
  };

  customPage: any = {
    zeroIndexed: true,
    pageSizes: [10, 20, 30, 40, 50],
    front: false,
    showSize: true,
    showQuickJumper: true,
  };

  /*********    表格分页配合后台的spring data jpa    *********/

  /*********    企业微信JS-SDK验证      *********/
  // wxcpConfigInit(httpClient: _HttpClient, authUrl: string, jsApiList: Array<string>): any {
  //   httpClient
  //     .get(environment.SERVER_URL + '/auth/wxcp/signature', {
  //       url: authUrl,
  //     })
  //     .subscribe((res: any) => {
  //       console.log(res);
  //       const response = res.data;
  //       wx.config({
  //         beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
  //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  //         appId: response.appId, // 必填，企业微信的corpID
  //         timestamp: response.timestamp, // 必填，生成签名的时间戳
  //         nonceStr: response.nonceStr, // 必填，生成签名的随机串
  //         signature: response.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
  //         jsApiList: jsApiList, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
  //       });
  //     });
  // }

  /*********    企业微信JS-SDK验证      *********/

  BADGE_GENDER: STColumnBadge = {
    MALE: { text: '男', color: 'success' },
    FEMALE: { text: '女', color: 'error' },
  };

  BADGE_PRINCIPAL: STColumnBadge = {
    true: { text: '是', color: 'success' },
    false: { text: '否', color: 'error' },
  };

  BADGE_ENABLE: STColumnBadge = {
    true: { text: '启用', color: 'success' },
    false: { text: '禁用', color: 'error' },
  };

  BADGE_QUOTATION_STATUS: STColumnBadge = {
    '0': { text: '未审核', color: 'error' },
    '1': { text: '已审核', color: 'success' },
  };

  BADGE_EMPLOYEE_STATUS: STColumnBadge = {
    WAIT_ENTRY_STATUS: { text: '待入职', color: 'success' },
    PROBATION_STATUS: { text: '试用期', color: 'success' },
    OFFICIAL_STATUS: { text: '正式员工', color: 'success' },
    DIMISSION_STATUS: { text: '离职', color: 'success' },
  };

  // 表单分类状态
  BADGE_FOEM_CATEGORY_STATUS: STColumnBadge = {
    '0': { text: '启用', color: 'success' },
    '-1': { text: '禁用', color: 'error' },
  };

  // 表单流程类型
  BADGE_CFORM_TYPE: STColumnBadge = {
    ORDINARY: { text: '普通单', color: 'success' },
    TASK: { text: '任务单', color: 'warning' },
    AUDIT: { text: '审批单', color: 'processing' },
  };
  // 表单流程的流程类型
  BADGE_CFORM_AUDIT_TYPE: STColumnBadge = {
    FREE: { text: '自由流程', color: 'processing' },
    CUSTOM: { text: '自定义流程', color: 'processing' },
  };

  BADGE_CFORM_STATUS: STColumnBadge = {
    DRAFT: { text: '草稿', color: 'warning' },
    PUBLISH: { text: '发布', color: 'processing' },
    DISABLE: { text: '禁用', color: 'error' },
  };

  // gnUid(len, radix) {
  //   var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  //   var uuid = [],
  //     i;
  //   radix = radix || chars.length;
  //   if (len) {
  //     for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  //   } else {
  //     var r;
  //     uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  //     uuid[14] = '4';
  //     for (i = 0; i < 36; i++) {
  //       if (!uuid[i]) {
  //         r = 0 | (Math.random() * 16);
  //         uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
  //       }
  //     }
  //   }
  //   return uuid.join('');
  // }

  /**
   * 判断是否为空
   */
  isEmpty(str): boolean {
    return !str || !str.length;
  }

  /**
   * 转换日期时间
   */
  parseDatetime(dateTime): Date {
    if (!this.isEmpty(dateTime)) {
      dateTime = dateTime.replace(/-/g, '/');
      return new Date(dateTime);
    }
    return null;
  }

  /**
   * 转换时间
   */
  parseTime(time): Date {
    if (!this.isEmpty(time)) {
      time = ('1970-01-01 ' + time).replace(/-/g, '/');
      console.log(time);
      return new Date(time);
    }
    return null;
  }

  /**
   * 在数组的指定位置插入一个元素
   */
  insertObjToArrayAtIndex(array, obj, index) {
    console.log(array);
    console.log(index);
    if (index >= array.length) {
      array[index] = obj;
    } else {
      array.splice(index, 0, obj);
    }
  }
}