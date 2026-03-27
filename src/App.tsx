import React from 'react';
import { GameProvider, useGame } from './GameContext';
import { Warning } from './pages/Warning';
import { Prologue } from './pages/Prologue';
import { Desktop } from './pages/Desktop';
import { Ending } from './pages/Ending';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShutdownSequence } from './components/ShutdownSequence';
import { Credits } from './pages/Credits';

function GameRouter() {
  const { currentApp, setCurrentApp } = useGame();

  if (currentApp === 'warning') return <Warning />;
  if (currentApp === 'prologue') return <Prologue />;
  if (currentApp === 'ending') return <Ending />;
  if (currentApp === 'shutdown') {
    return <ShutdownSequence onCreditsRequested={() => setCurrentApp('credits')} />;
  }
  if (currentApp === 'credits') {
    return (
      <Credits
        onBack={() => setCurrentApp('credits')}
        onReplay={() => setCurrentApp('credits')}
      />
    );
  }
  // 对旧版本的 oa / forum / clinic 或未知状态，合并渲染到 Desktop
  return (
    <>
      <Desktop />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <GameRouter />
      </GameProvider>
    </ErrorBoundary>
  );
}
