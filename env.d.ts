/**
 * Augment the global CloudflareEnv interface used by @cloudflare/next-on-pages.
 * This tells getRequestContext().env about our actual Cloudflare bindings.
 */
interface CloudflareEnv {
  DB: D1Database;
  BUCKET: R2Bucket;
  VECTOR_INDEX: VectorizeIndex;
  AI: Ai;
}
