import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     const site_id = Number((await params).id)
     if (!Number.isInteger(site_id) || site_id <= 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

     const deleted = await sql`DELETE FROM site WHERE site_id = ${site_id} RETURNING site_id`
     if (deleted.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })

     revalidateTag("sites", { expire: 0 })
     return NextResponse.json({ success: true })
}
