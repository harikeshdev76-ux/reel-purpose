import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Cloudflare R2 is S3-compatible. The client constructs without network calls,
// so an empty endpoint/credentials won't throw on import — only on send().
export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
  // AWS SDK v3 adds CRC32 integrity checksums by default, which Cloudflare R2
  // rejects with SignatureDoesNotMatch. Only send checksums when required.
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

/** Upload a file buffer to R2 and return its public URL. */
export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    }),
  );
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
