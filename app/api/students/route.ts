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

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName, studentId, grade, email } = studentSchema.parse(body)

    // Check if student ID already exists
    const existingStudent = await prisma.student.findUnique({
      where: { studentId }
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: "Student ID already exists" },
        { status: 400 }
      )
    }

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        studentId,
        grade: grade || null,
        email: email || null
      }
    })

    return NextResponse.json(newStudent, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Student creation error:", error)
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

    const students = await prisma.student.findMany({
      orderBy: { lastName: "asc" },
      include: {
        _count: {
          select: { enrollments: true }
        }
      }
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error("Students fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
