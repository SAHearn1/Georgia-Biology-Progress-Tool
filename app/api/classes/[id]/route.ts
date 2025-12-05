import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const classSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  period: z.string().optional()
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const classItem = await prisma.class.findFirst({
      where: {
        id,
        teacherId: session.user.id
      },
      include: {
        enrollments: {
          include: {
            student: true
          }
        }
      }
    })

    if (!classItem) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    return NextResponse.json(classItem)
  } catch (error) {
    console.error("Class fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, period } = classSchema.parse(body)

    const existingClass = await prisma.class.findFirst({
      where: {
        id,
        teacherId: session.user.id
      }
    })

    if (!existingClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        description: description || null,
        period: period || null
      }
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Class update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingClass = await prisma.class.findFirst({
      where: {
        id,
        teacherId: session.user.id
      }
    })

    if (!existingClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    await prisma.class.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Class deleted successfully" })
  } catch (error) {
    console.error("Class deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
