import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, accessCode } = body;

    // 1. Validate Input
    if (!fullName || !accessCode) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 2. Find the Class
    const targetClass = await db.class.findUnique({
      where: { accessCode: accessCode.trim() }
    });

    if (!targetClass) {
      return NextResponse.json({ error: "Invalid Access Code" }, { status: 404 });
    }

    // 3. Find or Create the Student
    // In a real anonymous system, we might create a new entry every time,
    // or try to match based on name within that specific class.
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    }
    
    const splitName = trimmedName.split(" ");
    const firstName = splitName[0];
    const lastName = splitName.slice(1).join(" ") || "";

    const student = await db.student.create({
      data: {
        firstName,
        lastName,
        name: trimmedName,
        classId: targetClass.id,
        riskLevel: "LOW", // Default start
        lastMastery: 0.0  // Start at average ability
      }
    });

    // 4. Create a New Assessment Session
    const session = await db.assessmentSession.create({
      data: {
        studentId: student.id,
        startTime: new Date(),
        status: "IN_PROGRESS",
        currentTheta: 0.0
      }
    });

    // 5. Return the Session ID (The frontend will redirect to /test/[sessionId])
    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error("[STUDENT_JOIN_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
