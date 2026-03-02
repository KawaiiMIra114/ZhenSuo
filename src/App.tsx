import React from 'react';
import { GameProvider, useGame } from './GameContext';
import { Warning } from './pages/Warning';
import { Desktop } from './pages/Desktop';
import { Clinic } from './pages/Clinic';
import { Forum } from './pages/Forum';
import { OA } from './pages/OA';
import { Terminal } from './pages/Terminal';
import { Ending } from './pages/Ending';
import { Notebook } from './components/Notebook';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Browser } from './components/Browser';

function GameRouter() {
  const { currentApp } = useGame();

  if (currentApp === 'warning') return <Warning />;
  if (currentApp === 'terminal') return <Terminal />;
  if (currentApp === 'ending') return <Ending />;
  if (currentApp === 'desktop') return <><Desktop /><Notebook /></>;

  // Browser Apps
  let url = 'https://www.tranquil-sleep.com';
  let title = '安宁深眠诊所';
  let content = <Clinic />;

  if (currentApp === 'forum') {
    url = 'https://bbs.tranquil-sleep.com';
    title = '安宁社区 - 病友交流论坛';
    content = <Forum />;
  } else if (currentApp === 'oa') {
    url = 'https://oa.tranquil-sleep.com/login';
    title = 'TRANQUIL SLEEP CLINIC - INTRANET';
    content = <OA />;
  }

  return (
    <>
      <Browser title={title} defaultUrl={url}>
        {content}
      </Browser>
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
