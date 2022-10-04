/// <reference types="vite/client" />

// Env
interface ImportMetaEnv {
  VITE_MODE: string;
  VITE_PREFIX_URL: string;
  VITE_SUBFIX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
