// /app/congratulations/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '../../lib/progressStore';
import QuestLayout from '../../components/QuestLayout';
import Link from 'next/link';

export default function CongratulationsPage() {
  const router = useRouter();
  const isAllQuestsCompleted = useProgressStore(state => state.isAllQuestsCompleted);
  
  useEffect(() => {
    if (!isAllQuestsCompleted()) {
      router.push('/');
    }
  }, [isAllQuestsCompleted, router]);
  
  if (!isAllQuestsCompleted()) {
    return null; 
  }
  
  return (
    <QuestLayout>
      <div className="congratulations-container">
        <h1 className="magical-title">Congratulations!</h1>
        
        <div className="magic-celebration">
          <div className="magic-stars"></div>
          <div className="magic-burst"></div>
        </div>
        
        <p className="congratulations-text">
          You have successfully completed all five enchanted quests! 
        </p>
        
        <div className="action-buttons">
          <button 
            onClick={() => window.location.href=`https://www.hackerrank.com/contests/gryffindor-aiml/challenges`} 
            className="magic-button"
          >
            Begin a New Journey
          </button>
          
          <Link href="/" className="home-button">
            Return to Main Hall
          </Link>
        </div>
      </div>
    </QuestLayout>
  );
}