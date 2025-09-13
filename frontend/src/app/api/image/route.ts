import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const Key = url.searchParams.get("key") || "";

    if (!Key) {
        return NextResponse.json(
            { error: "Use ?key= to specify the image" }, 
            { status: 400 }
        );
    }

    try {
        const obj = await r2.send(new GetObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key
        }));
        const body = (obj.Body as any).transformToWebStream?.() ?? (obj.Body as any);

        return new NextResponse(body, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, max-age=60, s-maxage=600",
            }
        });
    } catch (e: any) {
        const code = e?.$metadata?.httpStatusCode ?? 500;
        return NextResponse.json({ error: "NotFoundOrError", message: e?.message }, { status: code });
    }
}