import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // 1. Create a Test Teacher (Linked to your email if needed, or generic)
    // NOTE: once you log in with Google, your user row is created automatically. 
    // This seed focuses on the CONTENT (Questions).

    // 2. Clear existing items to avoid duplicates (Optional, be careful in production!)
    // await db.item.deleteMany({}); 

    // 3. Seed Biology Items (GSE Aligned)
    const biologyItems = [
      // SB1.a - Cell Structure
      {
        standard: 'SB1.a',
        content: 'Which organelle is primarily responsible for the synthesis of proteins in the cell?',
        options: JSON.stringify(['Golgi Apparatus', 'Mitochondria', 'Ribosome', 'Smooth ER']),
        correctAnswer: 'Ribosome',
        difficulty_b: -1.5, // Easy
        discrimination_a: 1.2,
        guessing_c: 0.25
      },
      {
        standard: 'SB1.a',
        content: 'Which structure is found in plant cells but NOT in animal cells?',
        options: JSON.stringify(['Ribosome', 'Cell Wall', 'Mitochondria', 'Cell Membrane']),
        correctAnswer: 'Cell Wall',
        difficulty_b: -0.8, 
        discrimination_a: 1.5,
        guessing_c: 0.2
      },
      // SB1.b - Enzymes
      {
        standard: 'SB1.b',
        content: 'Enzymes act as biological catalysts by lowering the activation energy. Which factor most directly affects an enzyme function?',
        options: JSON.stringify(['Container size', 'pH and temperature', 'Amount of product', 'ATP availability']),
        correctAnswer: 'pH and temperature',
        difficulty_b: 0.5, // Medium
        discrimination_a: 1.8,
        guessing_c: 0.25
      },
      // SB2.a - DNA
      {
        standard: 'SB2.a',
        content: 'During replication, which enzyme is responsible for \"unzipping\" the double helix?',
        options: JSON.stringify(['DNA Polymerase', 'Helicase', 'Ligase', 'Primase']),
        correctAnswer: 'Helicase',
        difficulty_b: 1.2, // Hard
        discrimination_a: 2.0, 
        guessing_c: 0.2
      },
      {
        standard: 'SB2.b',
        content: 'Which mutation would likely have the most significant effect on the resulting protein?',
        options: JSON.stringify(['Silent mutation', 'Frameshift mutation', 'Point mutation at end', 'Intron mutation']),
        correctAnswer: 'Frameshift mutation',
        difficulty_b: 1.8, // Very Hard
        discrimination_a: 1.6,
        guessing_c: 0.25
      }
    ];

    let count = 0;
    for (const item of biologyItems) {
      // Check if exists before adding
      const exists = await db.item.findFirst({ where: { content: item.content }});
      if (!exists) {
        await db.item.create({ data: item });
        count++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Database seeded successfully. Added ${count} new items.` 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
