import { useRoutes } from "react-router-dom";
import React from "react";
import { RouteObject } from "./types";
import lazyLoad from "./utils/lazyLoad";
import LayoutPage from "../layout";
export const routerArray: RouteObject[] = [
  {
    path: "/",
    element: <LayoutPage />,
    meta: {
      title: "首页",
      isMenu: false,
    },
  },
  {
    path: "/login",
    element: lazyLoad(React.lazy(() => import("../pages/login/index"))),
    meta: {
      title: "登录",
      isMenu: false,
    },
  },
];
const Router = () => {
  return useRoutes(routerArray);
};
export default Router;
