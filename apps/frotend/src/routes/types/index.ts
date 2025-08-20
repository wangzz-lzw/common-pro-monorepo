export interface MetaProps {
  keepAlive?: boolean;
  requireAuth?: boolean;
  title: string;
  key?: string;
  icon?: React.ReactNode;
  isMenu?: boolean;
}

export interface RouteObject {
  caseSensitive?: boolean;
  children?: RouteObject[];
  element?: React.ReactNode;
  index?: false | undefined;
  path: string;
  meta?: MetaProps;
  isLink?: string;
}
export interface RouteOption {
  title?: string;
  path: string;
  meta: MetaProps;
  children?: RouteOption[];
}
