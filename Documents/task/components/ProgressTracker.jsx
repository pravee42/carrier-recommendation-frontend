import { useProgressStore } from '@/lib/progressStore';
import Link from 'next/link';

export default function ProgressTracker() {
  const completedQuests = useProgressStore(state => state.completedQuests);
  const isQuestUnlocked = useProgressStore(state => state.isQuestUnlocked);
  
  return (
    <div className="progress-tracker">
      <h3>Your Quest Progress</h3>
      <div className="quest-bubbles">
        {[1, 2, 3, 4, 5].map(questId => {
          const isCompleted = completedQuests.includes(questId);
          const unlocked = isQuestUnlocked(questId);
          
          return (
            <Link 
              href={unlocked ? `/quest/${questId}` : '#'} 
              key={questId}
              className={`quest-bubble ${isCompleted ? 'completed' : ''} ${unlocked ? 'unlocked' : 'locked'}`}
            >
              {isCompleted ? '✓' : questId}
              {!unlocked && <span className="lock-icon">🔒</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}