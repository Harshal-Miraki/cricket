import { NextResponse } from "next/server";
import crypto from "crypto";

const PRIVATE_KEY = "private_9Sh67++Y+4CmPF+jkwhY6250lP0=";

export async function GET() {
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes expiry
    const signature = crypto
        .createHmac("sha1", PRIVATE_KEY)
        .update(token + expire)
        .digest("hex");

    return NextResponse.json({
        token,
        expire,
        signature,
    });
}
