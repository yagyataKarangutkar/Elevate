import { useState } from 'react';
import { PublicNavbar } from './components/layout/PublicNavbar';
import { LandingHero } from './components/landing/LandingHero';
import { AboutFeaturesSection } from './components/landing/AboutFeaturesSection';
import { BlueprintSection } from './components/blueprints/BlueprintSection';
import { MissionCreationSection } from './components/mission/MissionCreationSection';
import { CommandCenter } from './components/command-center/CommandCenter';
import { MissionCompleteView } from './components/replay/MissionCompleteView';
import { Footer } from './components/layout/Footer';

export function App() {
  const [currentView, setCurrentView] = useState<'public' | 'command_center' | 'mission_complete'>('public');

  const handleStartMission = (_objective: string) => {
    setCurrentView('command_center');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050607', color: '#F2F4F2' }}>
      {currentView === 'public' && (
        <>
          <PublicNavbar
            onEnterMissionControl={() => setCurrentView('command_center')}
            onNavigate={handleNavigateSection}
          />
          <main>
            <div id="home">
              <LandingHero
                onEnterMissionControl={() => setCurrentView('command_center')}
                onExplorePlan={() => handleNavigateSection('mission-creation')}
              />
            </div>
            <div id="about">
              <AboutFeaturesSection />
            </div>
            <div id="blueprints">
              <BlueprintSection />
            </div>
            <div id="mission-creation">
              <MissionCreationSection onStartMission={handleStartMission} />
            </div>
          </main>
          <Footer />
        </>
      )}

      {currentView === 'command_center' && (
        <CommandCenter
          onCompleteMission={() => setCurrentView('mission_complete')}
          onExitToLanding={() => setCurrentView('public')}
        />
      )}

      {currentView === 'mission_complete' && (
        <MissionCompleteView
          onRestartMission={() => setCurrentView('public')}
          onReturnToCommandCenter={() => setCurrentView('command_center')}
        />
      )}
    </div>
  );
}

export default App;
