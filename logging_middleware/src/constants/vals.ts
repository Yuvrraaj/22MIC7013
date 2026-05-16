export const STACKS = ['backend', 'frontend'] as const;

export const LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;

export const BE_PKGS = [
  'cache', 'controller', 'cron_job', 'db', 'domain',
  'handler', 'repository', 'route', 'service'
] as const;

export const FE_PKGS = [
  'api', 'component', 'hook', 'page', 'state', 'style'
] as const;

export const SHARED_PKGS = ['auth', 'config', 'middleware', 'utils'] as const;

export const ALL_PKGS = [...BE_PKGS, ...FE_PKGS, ...SHARED_PKGS] as const;

export const BE_ALLOWED = [...BE_PKGS, ...SHARED_PKGS] as const;
export const FE_ALLOWED = [...FE_PKGS, ...SHARED_PKGS] as const;
