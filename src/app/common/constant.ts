import { STColumnTag } from '@delon/abc/st';

/**
 *  系统常量
 */
export class Constant {
  public static disableOrEnable = [
    { label: '启用', value: true },
    { label: '禁用', value: false }
  ];
  public static trueOrFalse = [
    { label: '是', value: true },
    { label: '否', value: false }
  ];

  public static morningOrAfternoon = [
    { label: '上午', value: 'am' },
    { label: '下午', value: 'pm' }
  ];

  public static valueTrueOrFalse = [
    { label: '是', value: '1' },
    { label: '否', value: '0' }
  ];

  public static valueDisableOrEnable = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
  ];

  public static valueDisableOrEnableTag: STColumnTag = {
    1: { text: '启用', color: 'green' },
    0: { text: '禁用', color: 'red' }
  };

  public static successOrFailureTag: STColumnTag = {
    1: { text: '失败', color: 'red' },
    0: { text: '成功', color: 'green' }
  };
}
