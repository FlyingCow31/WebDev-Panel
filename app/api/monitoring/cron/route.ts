import { AdminCheck } from "@/app/lib/auth/auth"
import { checkSites } from "@/app/lib/monitoring"
import { timingSafeEqual } from "node:crypto"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300

function isCron(request: NextRequest) {
     const secret = process.env.CRON_SECRET
     const header = request.headers.get("authorization")
     if (!secret || !header) return false

     const expected = Buffer.from(`Bearer ${secret}`)
     const received = Buffer.from(header)
     return expected.length === received.length && timingSafeEqual(expected, received)
}

export async function GET(request: NextRequest) {
     if (!isCron(request) && !AdminCheck(request)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 })
     }

     const results = await checkSites({ staleOnly: true })
     revalidateTag("sites", { expire: 0 })

     return NextResponse.json({ success: true, checked: results.length, failed: results.filter((r) => !r?.ok).length })
}
