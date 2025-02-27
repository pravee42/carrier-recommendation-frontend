import ProgressTracker from './ProgressTracker';
import MagicalEffects from './MagicalEffects';

export default function QuestLayout({ children }) {
  return (
    <div className="quest-layout">
      <MagicalEffects />
      <div className="quest-container">
        <ProgressTracker />
        <div className="quest-content">
          {children}
        </div>
      </div>
    </div>
  );
}