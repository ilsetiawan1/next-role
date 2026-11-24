import { S3Client } from "@aws-sdk/client-s3";
import { getServerEnv } from "./env";

let cachedR2Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (cachedR2Client) return cachedR2Client;
  const env = getServerEnv();
  cachedR2Client = new S3Client({
    region: "auto",
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
  return cachedR2Client;
}

export function getR2BucketName(): string {
  return getServerEnv().R2_BUCKET_NAME;
}
