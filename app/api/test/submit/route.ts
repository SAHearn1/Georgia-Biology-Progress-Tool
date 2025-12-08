import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateTheta, calculateInformation } from "@/lib/psychometrics";

// Configuration constants
const MAX_ITEMS_PER_SESSION = 10; // Maximum number of items in a single assessment session

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

    // 7. CAT LOGIC: Select Next Item using Maximum Fisher Information
    // Find an item we haven't answered yet with the highest information value
    const answeredItemIds = await db.response.findMany({
      where: { sessionId },
      select: { itemId: true }
    });
    const excludeIds = answeredItemIds.map(r => r.itemId);

    // Fetch all candidate items (not yet answered)
    const candidateItems = await db.item.findMany({
      where: {
        id: { notIn: excludeIds }
      }
    });

    if (candidateItems.length === 0) {
      // No more items available - complete the test
      await db.assessmentSession.update({
        where: { id: sessionId },
        data: { status: "COMPLETED", endTime: new Date() }
      });
      return NextResponse.json({ completed: true });
    }

    // Calculate Fisher Information for each candidate and select the one with maximum information
    let nextItem = candidateItems[0];
    let maxInfo = calculateInformation(
      newTheta,
      candidateItems[0].difficulty_b,
      candidateItems[0].discrimination_a,
      candidateItems[0].guessing_c
    );

    for (let i = 1; i < candidateItems.length; i++) {
      const info = calculateInformation(
        newTheta,
        candidateItems[i].difficulty_b,
        candidateItems[i].discrimination_a,
        candidateItems[i].guessing_c
      );

      if (info > maxInfo) {
        maxInfo = info;
        nextItem = candidateItems[i];
      }
    }

    // 8. Check for Test Completion (max items reached)
    if (excludeIds.length >= MAX_ITEMS_PER_SESSION) {
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
