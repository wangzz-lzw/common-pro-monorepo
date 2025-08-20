import request from "../index";

export const postAgent = <T>(data) => {
  return request.post<T>("/api/agent", data);
};
