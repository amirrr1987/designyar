/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Groq API key — https://console.groq.com/keys (client-visible; demo only) */
  readonly VITE_GROQ_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
