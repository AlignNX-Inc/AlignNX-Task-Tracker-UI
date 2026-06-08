export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
  creationDate: string;
  completionDate: string;
  parent: Goal;
}

export interface Goal {
  id: string;
  title: string;
  tasks: Task[];
  expanded: boolean;
}

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface UserMeta {
  id: string,
  username: string,
  password_hash: string,
  name: string,
  role: string,
}

export interface  UserAuth {
  name: string,
  role: string,
  message: string,
  error: string
}