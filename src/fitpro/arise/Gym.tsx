// @ts-nocheck
import { useEffect, useState } from 'react';
import { EXERCISES, EX, MUSCLE_GROUPS, bests } from './lifts';
import { SysWin } from './System';
import { ExCard, RestTimer, beep } from './GymParts';
import { finishSession } from './gymSave';

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function Gym({ user, update, toast }) {
  const ses = user.session; const lifts = user.lifts || [];
  const [rest, setRest] = useState(0); const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (rest && now >= rest) { setRest(0); navigator.vibrate?.([200, 100, 200]); beep(); } }, [now, rest]);
  const best = bests(user);
  const save = (items) => update({ session: { ...ses, items } });
  const start = (items = []) => update({ session: { start: Date.now(), items } });
  const addEx = (id) => id && save([...ses.items, { ex: id, sets: [{ kg: '', reps: '', done: false }] }]);
  const repeat = () => { const l = lifts.at(-1); if (l) start(l.items.map((it) => ({ ex: it.ex, sets: it.sets.map((s) => ({ kg: s.kg, reps: s.reps, done: false })) }))); };

  const finish = () => {
    const r = finishSession(user, ses, best);
    if (!r) { if (confirm('No hay series completadas. ¿Descartar la sesión?')) update({ session: null }); return; }
    update(r.patch); toast?.(r.msg);
  };

  if (!ses) return (
    <div className="page">
      <h1 className="title">Gym</h1>
      <SysWin title="PORTAL DETECTADO">
        <p className="sys-txt">Registra peso, series y repeticiones. Cada récord sube el rango de tus músculos.</p>
        <button className="sys-btn" onClick={() => start()}>⚔ ENTRAR A LA MAZMORRA</button>
        {lifts.length > 0 && <button className="sys-btn ghost" onClick={repeat}>↻ REPETIR ÚLTIMA SESIÓN</button>}
      </SysWin>
      <h2 className="section">Historial</h2>
      {lifts.length === 0 && <p className="muted">Aún no hay sesiones registradas.</p>}
      {[...lifts].reverse().slice(0, 15).map((s) => (
        <div key={s.ts} className="card neu g-hist">
          <div className="row"><b>{new Date(s.ts).toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })}</b><span className="pill">{s.dur} min</span></div>
          <p className="muted">{s.items.map((it) => EX[it.ex]?.name).join(' · ')}</p>
          <div className="meta"><span>{s.sets} series</span><span>{s.vol} kg levantados</span>{s.prs > 0 && <span>🏆 {s.prs} {s.prs === 1 ? 'récord' : 'récords'}</span>}</div>
        </div>
      ))}
    </div>
  );

  const left = Math.max(0, Math.round((rest - now) / 1000));
  return (
    <div className="page">
      <div className="row">
        <div><p className="eyebrow">Mazmorra activa</p><h1 className="title">{fmt(Math.floor((now - ses.start) / 1000))}</h1></div>
        <button className="btn-ghost neu fire" onClick={() => confirm('¿Abandonar la sesión?') && update({ session: null })}>Salir</button>
      </div>
      {ses.items.map((it, i) => (
        <ExCard key={i} it={it} user={user} best={best[it.ex] || 0}
          onChange={(n) => save(ses.items.map((x, j) => (j === i ? n : x)))}
          onRemove={() => save(ses.items.filter((_, j) => j !== i))}
          onDone={(pr) => { setRest(Date.now() + 90000); if (pr) toast?.('🏆 ¡Nuevo récord personal!'); }} />
      ))}
      <div className="card neu"><p className="eyebrow">Añadir ejercicio</p>
        <select className="input neu-in g-sel" value="" onChange={(e) => addEx(e.target.value)}>
          <option value="">+ Elegir ejercicio…</option>
          {MUSCLE_GROUPS.map(([m, n]) => <optgroup key={m} label={n}>{EXERCISES.filter((e) => e.m === m).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</optgroup>)}
        </select>
      </div>
      <button className="btn-primary" onClick={finish}>COMPLETAR MAZMORRA</button>
      {left > 0 && <RestTimer left={left} onAdd={(d) => setRest((r) => r + d * 1000)} onSkip={() => setRest(0)} />}
    </div>
  );
}
