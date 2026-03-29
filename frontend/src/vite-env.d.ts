/// <reference types="vite/client" />

declare module '*.module.css';
declare module '*.module.scss';
declare module '*.module.sass';

declare interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly [key: string]: string | undefined;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
