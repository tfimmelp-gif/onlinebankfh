type StoredObject = { body: ReadableStream; httpMetadata?: { contentType?: string } };
type PutOptions = { httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string> };
type ObjectStorage = {
  put(key: string, value: ArrayBuffer | ReadableStream, options?: PutOptions): Promise<unknown>;
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
};

let storagePromise: Promise<ObjectStorage> | null = null;

function usesS3() { return Boolean(process.env.OBJECT_STORAGE_ENDPOINT); }

async function cloudflareStorage() {
  const moduleName = "cloudflare:workers";
  const runtime = await import(/* @vite-ignore */ moduleName) as { env?: { FILES?: ObjectStorage } };
  if (!runtime.env?.FILES) throw new Error("PRIVATE_FILE_STORAGE_UNAVAILABLE");
  return runtime.env.FILES;
}

async function s3Storage(): Promise<ObjectStorage> {
  const moduleName = "@aws-sdk/client-s3";
  const aws = await import(/* @vite-ignore */ moduleName) as typeof import("@aws-sdk/client-s3");
  const bucket = process.env.OBJECT_STORAGE_BUCKET ?? "northstar-private";
  const client = new aws.S3Client({
    endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
    region: process.env.OBJECT_STORAGE_REGION ?? "us-east-1",
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY ?? "",
      secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY ?? "",
    },
  });
  return {
    async put(key, value, options) {
      if (value instanceof ReadableStream) throw new Error("STREAMING_UPLOAD_NOT_SUPPORTED");
      await client.send(new aws.PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: new Uint8Array(value),
        ContentType: options?.httpMetadata?.contentType,
        Metadata: options?.customMetadata,
      }));
    },
    async get(key) {
      try {
        const response = await client.send(new aws.GetObjectCommand({ Bucket: bucket, Key: key }));
        if (!response.Body) return null;
        const body = response.Body.transformToWebStream();
        return { body, httpMetadata: { contentType: response.ContentType } };
      } catch (error) {
        const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
        if (status === 404) return null;
        throw error;
      }
    },
    async delete(key) { await client.send(new aws.DeleteObjectCommand({ Bucket: bucket, Key: key })); },
  };
}

export async function objectStorage() {
  storagePromise ??= (usesS3() ? s3Storage() : cloudflareStorage()).catch((error) => {
    storagePromise = null;
    throw error;
  });
  return storagePromise;
}

export async function objectStorageHealthcheck() {
  if (!usesS3()) {
    await cloudflareStorage();
    return true;
  }
  const moduleName = "@aws-sdk/client-s3";
  const aws = await import(/* @vite-ignore */ moduleName) as typeof import("@aws-sdk/client-s3");
  const client = new aws.S3Client({
    endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
    region: process.env.OBJECT_STORAGE_REGION ?? "us-east-1",
    forcePathStyle: true,
    credentials: { accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY ?? "", secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY ?? "" },
  });
  await client.send(new aws.HeadBucketCommand({ Bucket: process.env.OBJECT_STORAGE_BUCKET ?? "northstar-private" }));
  return true;
}
