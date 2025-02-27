// /app/api/quests/[id]/route.js
import { NextResponse } from 'next/server';
import { quests } from '../../../../lib/questData';

export async function GET(request, { params }) {
    console.log("Received request for quest ID:", params?.id);
  const id = parseInt(params?.id);
  
  const quest = quests.find(q => q.id === id);
  
  if (!quest) {
    return NextResponse.json(
      { error: "Quest not found in the ancient scrolls" },
      { status: 404 }
    );
  }
  
  // Remove the correctAnswer from the response
  const { correctAnswer, explanation, ...safeQuest } = quest;
  
  return NextResponse.json(safeQuest);
}

export async function POST(request, { params }) {
  const id = parseInt(params?.id);
  const { answer } = await request.json();
  
  const quest = quests.find(q => q.id === id);
  
  if (!quest) {
    return NextResponse.json(
      { error: "Quest not found in the ancient scrolls" },
      { status: 404 }
    );
  }
  
  // For more forgiving validation, we can do case-insensitive comparison
  // and trim whitespace from both sides
  const isCorrect = answer.trim().toLowerCase() === quest.correctAnswer.toLowerCase();
  
  return NextResponse.json({
    isCorrect,
    explanation: isCorrect ? quest.explanation : "The spell failed. Try a different approach."
  });
}