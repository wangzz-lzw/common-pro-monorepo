// * 请求响应参数(不包含data)
export interface Result {
  code: number;
  msg: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = object> extends Result {
  data: T;
  records?: T[];
}

// * 分页响应参数
export interface ResPage<T> {
  records: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// * 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// * 登录
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    token: string;
  }
  export interface ResAuthButtons {
    [propName: string]: any;
  }
}

export namespace User {
  export interface Userinfo {
    username: string;
    avatar?: string;
    nickname?: string;
  }
  export interface ReqSearchForm {
    username?: string;
  }
  export interface ResSearchUser {
    id: number;
    username: string;
    admin: string;
    nickname: string;
    address: string;
    phone: number;
    email: string;
  }
  export interface ReqAddForm {
    username: string;
    nickname: string;
    address: string;
    phone: number;
    email: string;
    id?: number;
  }

  export interface FindPage {
    pageNum: number;
    pageSize: number;
  }
}
