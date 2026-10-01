import { useState } from 'react';
import { PublicNavbar } from './components/layout/PublicNavbar';
import { LandingHero } from './components/landing/LandingHero';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { AboutFeaturesSection } from './components/landing/AboutFeaturesSection';
import { BlueprintSection } from './components/blueprints/BlueprintSection';
import { MissionCreationSection } from './components/mission/MissionCreationSection';
import { CommandCenter } from './components/command-center/CommandCenter';
import { MissionCompleteView } from './components/replay/MissionCompleteView';
import { Footer } from './components/layout/Footer';

// New Flow Views
import { MissionInputView } from './components/flow/MissionInputView';
import { PlanGenerationView } from './components/flow/PlanGenerationView';
import { MissionPlanView } from './components/flow/MissionPlanView';
import { MissionRecoveryView } from './components/flow/MissionRecoveryView';
import { MissionResultsView } from './components/flow/MissionResultsView';
import { DEMO_AGENTS } from './components/flow/MissionInputView';
import type { AgentId, FlowStep, MissionConfig, CompletedMissionTelemetry } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<FlowStep>('landing');
  const [completedMissionData, setCompletedMissionData] = useState<CompletedMissionTelemetry | null>(null);
  const [missionObjective, setMissionObjective] = useState<string>(
    'Search the earthquake zone and rescue survivors.'
  );
  const [selectedAgents, setSelectedAgents] = useState<AgentId[]>(['D1', 'D2', 'D3', 'G1']);
  const [missionConfig, setMissionConfig] = useState<MissionConfig>({
    objective: 'Search the earthquake zone and rescue survivors.',
    selectedAgentIds: ['D1', 'D2', 'D3', 'G1'],
    agents: DEMO_AGENTS,
  });

  const handleStartMissionFromSection = (objective: string) => {
    setMissionObjective(objective);
    setMissionConfig({
      objective,
      selectedAgentIds: selectedAgents,
      agents: DEMO_AGENTS.filter((a) => selectedAgents.includes(a.id)),
    });
    setCurrentView('mission_plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGeneratePlan = (config: MissionConfig) => {
    setMissionConfig(config);
    setMissionObjective(config.objective);
    setSelectedAgents(config.selectedAgentIds);
    // Show short planning transition sequence
    setCurrentView('plan_generation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050607', color: '#F2F4F2' }}>
      {/* 1. LANDING */}
      {currentView === 'landing' && (
        <>
          <PublicNavbar
            onEnterMissionControl={() => {
              setCurrentView('mission_input');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={handleNavigateSection}
          />
          <main>
            <div id="home">
              <LandingHero
                onEnterMissionControl={() => {
                  setCurrentView('mission_input');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExplorePlan={() => handleNavigateSection('how-it-works')}
              />
            </div>
            <div id="how-it-works">
              <HowItWorksSection
                onTryMission={() => {
                  setCurrentView('mission_input');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
            <div id="about">
              <AboutFeaturesSection />
            </div>
            <div id="blueprints">
              <BlueprintSection />
            </div>
            <div id="mission-creation">
              <MissionCreationSection onStartMission={handleStartMissionFromSection} />
            </div>
          </main>
          <Footer />
        </>
      )}

      {/* 2. MISSION INPUT */}
      {currentView === 'mission_input' && (
        <MissionInputView
          initialObjective={missionObjective}
          initialSelectedAgentIds={selectedAgents}
          onNavigate={(step) => {
            setCurrentView(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGeneratePlan={handleGeneratePlan}
        />
      )}

      {/* 3. PLAN GENERATION */}
      {currentView === 'plan_generation' && (
        <PlanGenerationView
          objective={missionObjective}
          onNavigate={(step) => {
            setCurrentView(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGenerationComplete={() => {
            setCurrentView('mission_plan');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 4. MISSION PLAN */}
      {currentView === 'mission_plan' && (
        <MissionPlanView
          objective={missionObjective}
          selectedAgents={selectedAgents}
          missionConfig={missionConfig}
          onNavigate={(step) => {
            setCurrentView(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onContinueToCommandCenter={() => {
            setCurrentView('command_center');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 5. COMMAND CENTER */}
      {currentView === 'command_center' && (
        <CommandCenter
          onCompleteMission={(telemetry) => {
            if (telemetry) {
              setCompletedMissionData(telemetry);
            }
            setCurrentView('mission_complete');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onProceedToRecovery={() => {
            setCurrentView('mission_recovery');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExitToLanding={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 6. MISSION RECOVERY */}
      {currentView === 'mission_recovery' && (
        <MissionRecoveryView
          onNavigate={(step) => {
            setCurrentView(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onProceedToComplete={() => {
            setCurrentView('mission_complete');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 7. MISSION COMPLETE */}
      {currentView === 'mission_complete' && (
        <MissionCompleteView
          missionData={completedMissionData}
          onRestartMission={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onReturnToCommandCenter={() => {
            setCurrentView('command_center');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onProceedToResults={() => {
            setCurrentView('results');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* 8. RESULTS */}
      {currentView === 'results' && (
        <MissionResultsView
          onNavigate={(step) => {
            setCurrentView(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRestart={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}

export default App;
