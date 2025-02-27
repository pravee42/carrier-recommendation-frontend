// /app/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '../lib/progressStore';
import QuestLayout from '../components/QuestLayout';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const currentQuest = useProgressStore(state => state.currentQuest);
  const resetProgress = useProgressStore(state => state.resetProgress);
  const isAllQuestsCompleted = useProgressStore(state => state.isAllQuestsCompleted);
  
  // Auto-redirect to the current quest if already started
  useEffect(() => {
    if (isAllQuestsCompleted()) {
      router.push('/congratulations');
    } else if (currentQuest > 1) {
      router.push(`/quest/${currentQuest}`);
    }
  }, [currentQuest, router, isAllQuestsCompleted]);

  return (
    <QuestLayout>
      <div className="home-container">
        <div className="magical-title">
          <h1>🏆 Code Quest - Round 1 of Gryffindor</h1>
          <div className="magic-sparkle"></div>
        </div>
        
        <p className="intro-text">
          Welcome, brave coder, to the mystical realm of brain. 
          Your journey will take you through five magical challenges, each testing 
          your knowledge of the ancient coding arts.
        </p>

        <div className="start-container">
          <Link href="/quest/1" className="start-button">
            Begin Your Quest
          </Link>
          
          {currentQuest > 1 && (
            <button 
              onClick={resetProgress} 
              className="reset-button"
            >
              Reset Journey
            </button>
          )}
        </div>
      </div>
    </QuestLayout>
  );
}



