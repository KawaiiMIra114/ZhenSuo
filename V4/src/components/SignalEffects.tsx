import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGameState } from '../game/state';
import { playGlitchPing } from '../game/sfx';

export function SignalEffects() {
  const { state } = useGameState();
  const location = useLocation();
  const level = state.linXiaoSignalStrength;
  const [flash, setFlash] = useState(false);
  const [cover, setCover] = useState(false);

  useEffect(() => {
    document.body.dataset.signalLevel = String(level);
  }, [level]);

  useEffect(() => {
    if (level < 3) return;
    const id = window.setInterval(
      () => {
        setFlash(true);
        window.setTimeout(() => setFlash(false), 110);
      },
      Math.max(2500, 9000 - level * 700)
    );
    return () => window.clearInterval(id);
  }, [level]);

  useEffect(() => {
    if (level < 6) return;
    setCover(true);
    if (level >= 6) playGlitchPing();
    const t = window.setTimeout(() => setCover(false), 400);
    return () => window.clearTimeout(t);
  }, [location.pathname, level]);

  const ghostText = useMemo(() => {
    if (level >= 7 && location.pathname.startsWith('/ending')) {
      return '我知道你在找我';
    }
    if (level >= 5) return '我还在';
    if (level >= 4) return '救';
    return '';
  }, [level, location.pathname]);

  return (
    <>
      {flash && <div className="signal-flash" aria-hidden="true" />}
      {cover && <div className="signal-cover">救我</div>}
      {ghostText && <div className="signal-ghost">{ghostText}</div>}
    </>
  );
}
