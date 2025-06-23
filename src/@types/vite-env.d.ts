/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    STANDALONE_MODE?: string;
    PLANNER_API_BASE_URL?: string;
    MIGRATION_PLANNER_UI_VERSION?: string;
  }
}
