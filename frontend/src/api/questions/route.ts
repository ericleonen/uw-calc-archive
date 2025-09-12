import { r2 } from "@/lib/r2";

export const runtime = "nodejs";

let cache: { data: any[]; ts: number } | null = null;
const CACHE_MS = 60_000;

async function loadIndex(): Promise<any[]> {
    if (cache && Date.now() - cache.ts < CACHE_MS) return cache.data;

    const Bucket = process.env.R2_BUCKET_NAME!;
    const Key = "archive/index.json"

    const obj = await r2.send(new GetObjectCommand({ Bucket, Key }))
}