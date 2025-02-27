import { create } from 'zustand';
  import { persist } from 'zustand/middleware';
  
  export const useProgressStore = create(
    persist(
      (set, get) => ({
        completedQuests: [],
        currentQuest: 1,
        
        completeQuest: (questId) => {
          const { completedQuests, currentQuest } = get();
          
          if (!completedQuests.includes(questId)) {
            set({
              completedQuests: [...completedQuests, questId],
              currentQuest: Math.max(currentQuest, questId + 1)
            });
          }
        },
        
        resetProgress: () => {
          set({
            completedQuests: [],
            currentQuest: 1
          });
        },
        
        isQuestUnlocked: (questId) => {
          const { completedQuests, currentQuest } = get();
          return questId <= currentQuest;
        },
        
        isQuestCompleted: (questId) => {
          return get().completedQuests.includes(questId);
        },
        
        isAllQuestsCompleted: () => {
          return get().completedQuests.length === 5;
        }
      }),
      {
        name: 'code-quest-progress'
      }
    )
  );