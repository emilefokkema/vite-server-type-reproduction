import { fileURLToPath } from "url";
import { InlineConfig } from "vite";

export default function (): InlineConfig {
    const root = fileURLToPath(new URL('.', import.meta.url))
    return { root }
  }
  