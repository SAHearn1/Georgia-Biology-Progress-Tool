import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateTheta } from "@/lib/psychometrics";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, itemId, selectedAnswer, timeSpent } = body;

    // 1. Fetch Session details
    const session = await db.assessmentSession.findUnique({
      where: { id: sessionId },
      include: { student: true }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Handle initial request (first question)
    if (itemId === 'initial' || !itemId) {
      // Find the first item for this session
      const firstItem = await db.item.findFirst({
        take: 1
      });

      if (!firstItem) {
        return NextResponse.json({ error: "No items available" }, { status: 404 });
      }

      return NextResponse.json({
        nextItem: {
          id: firstItem.id,
          content: firstItem.content,
          options: firstItem.options,
          standard: firstItem.standard
        }
      });
    }

    // 2. Fetch Item details
    const item = await db.item.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 3. Grade the Response
    // (In production, ensure correctAnswer is stored securely or hashed)
    const isCorrect = item.correctAnswer === selectedAnswer;

    // 4. Calculate New Ability (Theta)
    const oldTheta = session.currentTheta;
    const newTheta = updateTheta(
      oldTheta,
      item.difficulty_b,
      item.discrimination_a,
      isCorrect
    );

    // 5. Save Response to DB
    await db.response.create({
      data: {
        sessionId,
        itemId,
        selectedAnswer,
        isCorrect,
        timeSpent
      }
    });

    // 6. Update Session with new Theta
    await db.assessmentSession.update({
      where: { id: sessionId },
      data: { currentTheta: newTheta }
    });
    
    // Also update the student cache for the Teacher Dashboard
    await db.student.update({
      where: { id: session.studentId },
      data: { lastMastery: newTheta }
    });

    // 7. CAT LOGIC: Select Next Item
    // Find an item we haven't answered yet, closest to newTheta
    const answeredItemIds = await db.response.findMany({
      where: { sessionId },
      select: { itemId: true }
    });
    const excludeIds = answeredItemIds.map(r => r.itemId);

    // Simple CAT selection: Find first item not taken. 
    // (Enhancement: Sort by ABS(difficulty - newTheta) for true adaptive)
    const nextItem = await db.item.findFirst({
      where: {
        id: { notIn: excludeIds }
      },
      // In a real app with Prisma, you'd fetch candidates and sort in JS
      // because pure SQL ABS() sorting is tricky in basic Prisma.
      take: 1 
    });

    // 8. Check for Test Completion
    if (!nextItem || excludeIds.length >= 10) { // Limit to 10 items for MVP
      await db.assessmentSession.update({
        where: { id: sessionId },
        data: { status: "COMPLETED", endTime: new Date() }
      });
      return NextResponse.json({ completed: true });
    }

    // 9. Return Next Item (Hide correct answer!)
    return NextResponse.json({
      nextItem: {
        id: nextItem.id,
        content: nextItem.content,
        options: nextItem.options, // Should be stored as JSON
        standard: nextItem.standard
      }
    });

  } catch (error) {
    console.error("[SUBMIT_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
