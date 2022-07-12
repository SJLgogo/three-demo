class DepartmentInterface {

}


interface childNode{
  title: string;
  key: string;
  isLeaf: boolean;
  corpId: string;
  icon: string;
  category:string;
  expanded?: boolean;
}

interface TreeNode extends childNode{
  children: childNode[]
}

type variable<T> = T | undefined | null;

type fn = () => void


export {
  DepartmentInterface,
  TreeNode,
  fn,
  variable,
  childNode
}
