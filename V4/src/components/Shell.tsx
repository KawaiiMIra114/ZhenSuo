import { Link, useLocation } from 'react-router-dom';
import { useGameState } from '../game/state';
import { playRouteTick, startLowHum, stopLowHum } from '../game/sfx';
import { useEffect, useMemo, useRef } from 'react';
import { SignalEffects } from './SignalEffects';
import { CanonPanel } from './CanonPanel';

export function Shell({ children }: { children: React.ReactNode }) {
  const { state, reset, increaseSignal } = useGameState();
  const location = useLocation();
  const progressSnapshot = useMemo(
    () =>
      `${state.discoveredFacts.size}:${state.collectedRunes.size}:${state.readNodes.size}:${state.oaLoggedIn}:${state.adminUnlocked}`,
    [state]
  );
  const lastProgressRef = useRef<number>(Date.now());
  const snapshotRef = useRef<string>(progressSnapshot);

  useEffect(() => {
    playRouteTick();
  }, [location.pathname]);

  useEffect(() => {
    const shouldHum =
      location.pathname.startsWith('/forum/admin') ||
      location.pathname.startsWith('/forum/shadow') ||
      location.pathname.startsWith('/oa/b2report');
    if (shouldHum) {
      startLowHum();
      return () => stopLowHum();
    }
    stopLowHum();
    return undefined;
  }, [location.pathname]);

  useEffect(() => {
    if (snapshotRef.current !== progressSnapshot) {
      snapshotRef.current = progressSnapshot;
      lastProgressRef.current = Date.now();
    }
  }, [progressSnapshot]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const idleMs = Date.now() - lastProgressRef.current;
      if (location.pathname.startsWith('/clinic') && idleMs > 10 * 60 * 1000) {
        increaseSignal();
        lastProgressRef.current = Date.now();
      }
      if (location.pathname.startsWith('/forum') && idleMs > 8 * 60 * 1000) {
        increaseSignal();
        lastProgressRef.current = Date.now();
      }
    }, 15000);
    return () => window.clearInterval(id);
  }, [increaseSignal, location.pathname]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">安宁深眠诊所：拘魂网</div>
        <div className="status-row">
          <span>碎片 {state.collectedRunes.size}/7</span>
          <span>信号强度 {state.linXiaoSignalStrength}</span>
          <span>层级 {state.forumAccess}</span>
          <button
            className="reset-btn"
            onClick={() => {
              reset();
            }}
          >
            重新开始
          </button>
        </div>
      </header>

      <nav className="global-nav">
        <Link to="/">桌面</Link>
        <Link to="/clinic">官网</Link>
        <Link to="/forum">论坛</Link>
        <Link to="/oa">OA</Link>
        <Link to="/world">外部层</Link>
        <Link to="/ending">终局</Link>
        <Link to="/canon/gdd">GDD原文</Link>
        <Link to="/canon/world">世界观原文</Link>
        <span className="path">{location.pathname}</span>
      </nav>

      <main className="main-container">
        <div key={location.pathname} className="route-stage">
          {children}
        </div>
        <CanonPanel />
      </main>
      <SignalEffects />
    </div>
  );
}
