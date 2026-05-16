export type Stack = 'backend' | 'frontend';

export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type BePkg =
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain'
  | 'handler' | 'repository' | 'route' | 'service';

export type FePkg = 'api' | 'component' | 'hook' | 'page' | 'state' | 'style';

export type SharedPkg = 'auth' | 'config' | 'middleware' | 'utils';

export type Pkg = BePkg | FePkg | SharedPkg;

export interface LogReq {
  stack: Stack;
  level: Level;
  package: Pkg;
  message: string;
}

export interface LogRes {
  logID: string;
  message: string;
}

export interface AuthReq {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export interface AuthRes {
  token_type: string;
  access_token: string;
  expires_in: number;
}

export interface TokenCache {
  tok: string;
  expAt: number;
}
