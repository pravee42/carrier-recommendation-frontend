"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QuestCard from '../../../components/QuestCard';
import QuestLayout from '../../../components/QuestLayout';
import { useProgressStore } from '../../../lib/progressStore';

export default function QuestPage() {
    const params = useParams()
    const questId = params?.id ? parseInt(params.id) : null;
  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const isQuestUnlocked = useProgressStore(state => state.isQuestUnlocked);
  
  useEffect(() => {
    // Prevent access to locked quests
    if (!isQuestUnlocked(questId)) {
      router.push('/quest/1');
      return;
    }
    
    async function fetchQuest() {
      try {
        const response = await fetch(`/api/quests/${questId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch quest');
        }
        
        const data = await response.json();
        setQuest(data);
      } catch (err) {
        setError('A magical disruption occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuest();
  }, [questId, router, isQuestUnlocked]);
  
  if (!isQuestUnlocked(questId)) {
    return null; // Will redirect in useEffect
  }
  
  if (loading) {
    return (
      <QuestLayout>
        <div className="loading-container">
          <div className="magic-loader"></div>
          <p>Conjuring quest...</p>
        </div>
      </QuestLayout>
    );
  }
  
  if (error) {
    return (
      <QuestLayout>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => router.refresh()} className="magic-button">
            Try Again
          </button>
        </div>
      </QuestLayout>
    );
  }
  
  return (
    <QuestLayout>
      {quest && <QuestCard quest={quest} />}
    </QuestLayout>
  );
}