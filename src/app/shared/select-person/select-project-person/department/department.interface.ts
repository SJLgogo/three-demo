class DepartmentClass {}

interface childNode {
  title: string;
  key: string;
  isLeaf: boolean;
  corpId: string;
  icon: string;
  category: string;
  expanded?: boolean;
}

interface TreeNode extends childNode {
  children: childNode[];
}

interface Person extends CommonSelect {
  corpId: string;
  departmentId: string;
  departmentName: string;
  avatar:string;
  jobNumber:string;
  mobilePhone:string;
  orgs?:Common[];
}

interface Common{
  label:string;
  value:string;
}


interface Organization extends CommonSelect {
  selected?: boolean;
}

type Department = Partial<Person>;

interface CommonSelect {
  category: string;
  id: string;
  name: string;
  companyId: string;
  companyName: string;
}

type selected = Person | Organization | Department;
type variable<T> = T | undefined | null;
type fn = voidFn;
type voidFn = () => void;
type promiseFn<T = void> = (str: string) => Promise<T>;

export { DepartmentClass, TreeNode, fn, variable, childNode, Person, Organization, selected , Common};
