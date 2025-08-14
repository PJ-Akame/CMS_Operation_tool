/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string
  readonly VITE_GITHUB_CLIENT_ID: string
  readonly VITE_GITHUB_CLIENT_SECRET: string
  readonly VITE_TWITTER_API_KEY: string
  readonly VITE_TWITTER_API_SECRET: string
  readonly VITE_TWITTER_BEARER_TOKEN: string
  readonly VITE_YOUTUBE_CLIENT_ID: string
  readonly VITE_YOUTUBE_CLIENT_SECRET: string
  readonly VITE_DISCORD_BOT_TOKEN: string
  readonly VITE_CLAUDE_API_KEY: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOG_LEVEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}