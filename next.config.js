/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output creates a minimal server.js and traces only what's needed.
  // This is the recommended output for Docker because the runner image can stay
  // very small (we only copy .next/standalone, .next/static, and public/).
  output: "standalone",

  // Allow toggling between the live LLM providers (Anthropic, OpenAI) and the
  // built-in deterministic fallback. Server-side only.
  serverRuntimeConfig: {
    llmProvider: process.env.LLM_PROVIDER || "fallback", // "anthropic" | "openai" | "fallback"
  },

  reactStrictMode: true,
};

module.exports = nextConfig;
