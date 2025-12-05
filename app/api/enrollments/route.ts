import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const enrollmentSchema = z.object({
  studentId: z.string(),
  classId: z.string()
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { studentId, classId } = enrollmentSchema.parse(body)

    // Verify the class belongs to the teacher
    const classItem = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: session.user.id
      }
    })

    if (!classItem) {
      return NextResponse.json(
        { error: "Class not found or unauthorized" },
        { status: 404 }
      )
    }

    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId,
          classId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Student is already enrolled in this class" },
        { status: 400 }
      )
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        classId
      },
      include: {
        student: true,
        class: true
      }
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Enrollment creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const classId = searchParams.get("classId")

    let enrollments

    if (classId) {
      // Get enrollments for a specific class
      const classItem = await prisma.class.findFirst({
        where: {
          id: classId,
          teacherId: session.user.id
        }
      })

      if (!classItem) {
        return NextResponse.json(
          { error: "Class not found or unauthorized" },
          { status: 404 }
        )
      }

      enrollments = await prisma.enrollment.findMany({
        where: { classId },
        include: {
          student: true,
          class: true
        },
        orderBy: {
          student: {
            lastName: "asc"
          }
        }
      })
    } else {
      // Get all enrollments for teacher's classes
      enrollments = await prisma.enrollment.findMany({
        where: {
          class: {
            teacherId: session.user.id
          }
        },
        include: {
          student: true,
          class: true
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    }

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error("Enrollments fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
