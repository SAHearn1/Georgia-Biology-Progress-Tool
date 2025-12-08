import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // 1. Security Check
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, accessCode, description } = body;

    if (!name || !accessCode) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 2. Check for Duplicate Code
    const codeExists = await db.class.findUnique({
      where: { accessCode: accessCode.toUpperCase() }
    });

    if (codeExists) {
      return new NextResponse("Access Code already taken. Please try another.", { status: 409 });
    }

    // 3. Create Class
    const newClass = await db.class.create({
      data: {
        name,
        accessCode: accessCode.toUpperCase(),
        description,
        teacherId: session.user.id,
      },
    });

    return NextResponse.json(newClass);

  } catch (error) {
    console.error("[CLASS_CREATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
