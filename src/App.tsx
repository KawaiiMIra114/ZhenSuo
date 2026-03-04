import React from 'react';
import { GameProvider, useGame } from './GameContext';
import { Warning } from './pages/Warning';
import { Prologue } from './pages/Prologue';
import { Desktop } from './pages/Desktop';
import { Clinic } from './pages/Clinic';
import { Forum } from './pages/Forum';
import { OA } from './pages/OA';
import { Terminal } from './pages/Terminal';
import { Ending } from './pages/Ending';
import { Notebook } from './components/Notebook';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Browser } from './components/Browser';
import { ShutdownSequence } from './components/ShutdownSequence';

function GameRouter() {
  const { currentApp } = useGame();

  if (currentApp === 'warning') return <Warning />;
  if (currentApp === 'prologue') return <Prologue />;
  if (currentApp === 'terminal') return <Terminal />;
  if (currentApp === 'ending') return <Ending />;
  if (currentApp === 'shutdown') return <ShutdownSequence />;
  // 对旧版本的 oa / forum / clinic 或未知状态，合并渲染到 Desktop
  return (
    <>
      <Desktop />
      <Notebook />
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
