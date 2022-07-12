class DepartmentInterface {

}


interface TreeNode {
  title: string;
  key: string;
  isLeaf: boolean;
  corpId: string;
  icon: string;
  expanded: boolean;
  children: TreeNode[]
}

type fn = () => void


export {
  DepartmentInterface,
  TreeNode,
  fn
}
