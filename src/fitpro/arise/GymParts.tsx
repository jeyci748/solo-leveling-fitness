// @ts-nocheck
import { EX, MUSCLE_NAME, setValue, exScore, rankOf, unitOf } from './lifts';

export function ExCard({ it, user, best, onChange, onRemove, onDone }) {
  const ex = EX[it.ex]; const w = ex.t === 'w';
  const setS = (i, p) => onChange({ ...it, sets: it.sets.map((s, j) => (j === i ? { ...s, ...p } : s)) });
  const add = () => { const l = it.sets.at(-1) || {}; onChange({ ...it, sets: [...it.sets, { kg: l.kg || '', reps: l.reps || '', done: false }] }); };
  const top = Math.max(best, 0, ...it.sets.filter((s) => s.done).map((s) => setValue(ex, s)));
  const r = rankOf(exScore(user, ex, top));
  return (
    <div className={`card neu g-ex ${w ? '' : 'bw'}`}>
      <div className="row">
        <div><h3>{ex.name}</h3><p className="muted">{MUSCLE_NAME[ex.m]} · {best ? `Récord ${Math.round(best)} ${unitOf(ex)}${w ? ' (máximo estimado)' : ''}` : 'Sin récord'}</p></div>
        <div className="row" style={{ gap: 6 }}><span className={`g-rank ${top ? `r-${r.id}` : ''}`}>{top ? r.id : '–'}</span><button className="g-x" onClick={onRemove}>×</button></div>
      </div>
      <div className="g-head"><span>SERIE</span>{w && <span>KG</span>}<span>{ex.t === 'time' ? 'SEGUNDOS' : 'VECES'}</span><span>✓</span></div>
      {it.sets.map((s, i) => (
        <div key={i} className={`g-set ${s.done ? 'done' : ''}`}>
          <span className="g-n">{i + 1}</span>
          {w && <input className="input neu-in" inputMode="decimal" placeholder="0" value={s.kg} onChange={(e) => setS(i, { kg: e.target.value })} />}
          <input className="input neu-in" inputMode="numeric" placeholder="0" value={s.reps} onChange={(e) => setS(i, { reps: e.target.value })} />
          <button className={`g-chk ${s.done ? 'on' : ''}`} onClick={() => { const d = !s.done; setS(i, { done: d }); if (d) onDone(best > 0 && setValue(ex, s) > best); }}>✓</button>
        </div>
      ))}
      <button className="btn-ghost neu" onClick={add}>+ Serie</button>
    </div>
  );
}

export function RestTimer({ left, onAdd, onSkip }) {
  return (
    <div className="g-rest"><span>DESCANSO</span><b>{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</b>
      <button onClick={() => onAdd(-15)}>−15</button><button onClick={() => onAdd(15)}>+15</button><button onClick={onSkip}>Saltar</button></div>
  );
}

export const beep = () => {
  try { const a = new (window.AudioContext || window.webkitAudioContext)(); const o = a.createOscillator(), g = a.createGain();
    o.connect(g); g.connect(a.destination); o.frequency.value = 880; g.gain.value = 0.15; o.start(); o.stop(a.currentTime + 0.35); } catch { /* sin audio */ }
};
