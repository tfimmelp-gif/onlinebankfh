declare module "cloudflare:workers" {
  type D1Result<T> = { results: T[] };
  type D1PreparedStatement = {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T>(): Promise<T | null>;
    all<T>(): Promise<D1Result<T>>;
  };
  type D1Database = {
    prepare(query: string): D1PreparedStatement;
    batch(statements: D1PreparedStatement[]): Promise<unknown[]>;
  };
  type R2ObjectBody = { body: ReadableStream; httpMetadata?: { contentType?: string } };
  type R2Bucket = {
    put(key: string, value: ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string }; customMetadata?: Record<string,string> }): Promise<unknown>;
    get(key: string): Promise<R2ObjectBody | null>;
    delete(key: string): Promise<void>;
  };
  export const env: { DB?: D1Database; FILES?: R2Bucket };
}
