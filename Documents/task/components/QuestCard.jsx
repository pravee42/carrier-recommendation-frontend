// /components/QuestCard.jsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/lib/progressStore';

export default function QuestCard({ quest }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const completeQuest = useProgressStore(state => state.completeQuest);
  const isAllQuestsCompleted = useProgressStore(state => state.isAllQuestsCompleted);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answer.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/quests/${quest.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: answer.trim() }),
      });
      
      const data = await response.json();
      
      setIsCorrect(data.isCorrect);
      setFeedback(data.explanation);
      
      if (data.isCorrect) {
        completeQuest(quest.id);
        
        // Delay to show feedback before redirecting
        setTimeout(() => {
          if (quest.id === 5) {
            router.push('/congratulations');
          } else {
            router.push(`/quest/${quest.id + 1}`);
          }
        }, 2000);
      }
    } catch (error) {
      setFeedback('A magical disruption occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quest-card">
      <div className="quest-header">
        <h2>{quest.title}</h2>
        <div className="quest-description">{quest.description}</div>
      </div>

      <div className="quest-question">
        <pre><code>{quest.question}</code></pre>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="answer-container">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer..."
            disabled={isCorrect}
            className="answer-input"
            autoComplete="off"
          />
        </div>

        {feedback && (
          <div className={`feedback ${isCorrect ? 'success' : 'error'}`}>
            {feedback}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!answer.trim() || isSubmitting || isCorrect}
          className="magic-button"
        >
          {isSubmitting ? 'Casting Spell...' : 'Cast Your Spell'}
        </button>
      </form>
    </div>
  );
}