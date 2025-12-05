import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const classSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  period: z.string().optional()
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, period } = classSchema.parse(body)

    const newClass = await prisma.class.create({
      data: {
        name,
        description: description || null,
        period: period || null,
        teacherId: session.user.id
      }
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Class creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const classes = await prisma.class.findMany({
      where: { teacherId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { enrollments: true }
        }
      }
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error("Classes fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
