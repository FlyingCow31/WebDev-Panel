import { AdminCheck } from "@/app/lib/auth/auth"
import { sql } from "@/app/lib/db"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {
     if (!AdminCheck(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

     let body: unknown
     try {
          body = await request.json()
     } catch {
          return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
     }

     if (
          typeof body !== "object" ||
          body === null ||
          !("data" in body) ||
          typeof body.data !== "object" ||
          body.data === null ||
          !("proj_id" in body.data)
     ) {
          return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
     }

     const proj_id = body.data.proj_id
     if (typeof proj_id !== "number" || !Number.isSafeInteger(proj_id) || proj_id <= 0) {
          return NextResponse.json({ error: "Invalid project id" }, { status: 400 })
     }

     const result = await sql`
          UPDATE projet
          SET proj_done_at = NULL
          WHERE proj_id = ${proj_id} AND proj_done_at IS NOT NULL
          RETURNING proj_id
     `

     if (result.length === 0) {
          return NextResponse.json({ error: "Finished project not found" }, { status: 404 })
     }

     revalidateTag("projets", { expire: 0 })
     revalidateTag(`project-n${proj_id}`, { expire: 0 })
     return NextResponse.json({ success: true })
}
