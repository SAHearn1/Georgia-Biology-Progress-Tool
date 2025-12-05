import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const studentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  studentId: z.string().min(1),
  grade: z.number().int().min(9).max(12).optional(),
  email: z.string().email().optional().or(z.literal(""))
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

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            class: true
          }
        }
      }
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Student fetch error:", error)
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
    const { firstName, lastName, studentId, grade, email } = studentSchema.parse(body)

    const existingStudent = await prisma.student.findUnique({
      where: { id }
    })

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if studentId is being changed and if it conflicts
    if (studentId !== existingStudent.studentId) {
      const conflictingStudent = await prisma.student.findUnique({
        where: { studentId }
      })

      if (conflictingStudent) {
        return NextResponse.json(
          { error: "Student ID already exists" },
          { status: 400 }
        )
      }
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        firstName,
        lastName,
        studentId,
        grade: grade || null,
        email: email || null
      }
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Student update error:", error)
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

    const existingStudent = await prisma.student.findUnique({
      where: { id }
    })

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    await prisma.student.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Student deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
