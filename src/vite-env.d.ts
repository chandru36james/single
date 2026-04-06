/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_WEB3FORMS_ACCESS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
