// @ts-nocheck
import { useState } from 'react';
import { symmetry, EXERCISES, RANKS, rankOf, exScore, targetFor, e1rm, unitOf } from './lifts';
import { BodyMap } from './BodyMap';
import { SysWin } from './System';
import { STRENGTH_LABELS } from '../data';

const Split = ({ a, av, b, bv }) => (
  <div><div className="row"><small className="sy-s">{a} {av}</small><small className="sy-s">{bv} {b}</small></div>
    <div className="sy-spbar"><i style={{ width: `${(av / (av + bv || 1)) * 100}%` }} /></div></div>
);

function OneRM() {
  const [kg, setKg] = useState(''); const [r, setR] = useState('');
  const one = kg && r ? Math.round(e1rm(+kg, +r)) : 0;
  return (
    <SysWin title="PESO MÁXIMO ESTIMADO">
      <p className="sys-txt">Pon el peso que levantaste y cuántas veces. Te digo el máximo que podrías levantar 1 sola vez.</p>
      <div className="row gap"><input className="input neu-in" inputMode="decimal" placeholder="Peso kg" value={kg} onChange={(e) => setKg(e.target.value)} />
        <input className="input neu-in" inputMode="numeric" placeholder="Repeticiones" value={r} onChange={(e) => setR(e.target.value)} /></div>
      {one > 0 && <><p className="sys-big">{one} kg</p><div className="sy-pct">{[95, 90, 85, 80, 75, 70].map((p) => <span key={p}><b>{Math.round((one * p) / 100)}</b><small>{p}%</small></span>)}</div></>}
    </SysWin>
  );
}

function StrengthTest({ user, update }) {
  return (
    <SysWin title="PRUEBA DE FUERZA">
      <p className="sys-txt">Haz cada ejercicio una vez, todas las veces que puedas seguidas, y anota el número. Esto revela tu rango.</p>
      {Object.entries(STRENGTH_LABELS).map(([k, l]) => (
        <label key={k} className="field"><span>{l}</span><input className="input neu-in" type="number" inputMode="numeric" value={user.strength?.[k] ?? ''} onChange={(e) => update({ strength: { ...(user.strength || {}), [k]: Number(e.target.value) || 0 } })} /></label>
      ))}
    </SysWin>
  );
}

export default function Symmetry({ user, update, onReport }) {
  const s = symmetry(user); const [sel, setSel] = useState(null); const ov = rankOf(s.overall);
  const weak = [...s.muscles].sort((a, b) => a.score - b.score)[0];
  const tips = [];
  if (!s.trained) tips.push('Registra series en Gym o haz la Prueba de fuerza de abajo para revelar tu mapa.');
  else {
    if (Math.abs(s.upper - s.lower) > 12) tips.push(`Tu tren ${s.upper > s.lower ? 'inferior' : 'superior'} va ${Math.abs(s.upper - s.lower)} puntos por detrás.`);
    if (Math.abs(s.push - s.pull) > 12) tips.push(`Desbalance empuje/tirón: entrena más ${s.push > s.pull ? 'espalda y bíceps' : 'pecho, hombros y tríceps'}.`);
    tips.push(`Punto débil: ${weak.name} (${weak.score} puntos). Dale prioridad esta semana.`);
  }
  return (
    <div className="page">
      <div className="row"><h1 className="title">Rango</h1><button className="btn-ghost neu gold" onClick={onReport}>Registro ›</button></div>
      <SysWin title="EVALUACIÓN DEL CAZADOR">
        <div className="sy-top"><div className={`st-rank r-${ov.id}`}><b>{ov.id}</b><small>FUERZA</small></div>
          <div className="sy-nums"><div><b>{s.overall}</b><small>PUNTOS</small></div><div><b>{s.balance}%</b><small>SIMETRÍA</small></div><div><b>{s.trained}/10</b><small>MÚSCULOS</small></div></div></div>
        <BodyMap muscles={s.muscles} />
        <div className="sy-legend">{RANKS.map((r) => <span key={r.id}><i className={`r-${r.id}`} />{r.id}</span>)}</div>
      </SysWin>
      <SysWin title="ANÁLISIS">
        {tips.map((t) => <p key={t} className="sys-txt">▸ {t}</p>)}
        <div className="sy-split"><Split a="Superior" av={s.upper} b="Inferior" bv={s.lower} /><Split a="Empuje" av={s.push} b="Tirón" bv={s.pull} /></div>
      </SysWin>
      <h2 className="section">Músculos</h2>
      {s.muscles.map((m) => (
        <div key={m.id} className="card neu sy-m" onClick={() => setSel(sel === m.id ? null : m.id)}>
          <div className="row"><b>{m.name}</b><span className={`g-rank ${m.trained ? `r-${m.rank.id}` : ''}`}>{m.trained ? m.rank.id : '–'}</span></div>
          <div className="bar neu-in"><i style={{ width: `${m.score}%` }} /></div>
          {sel === m.id && <div className="sy-det">{EXERCISES.filter((e) => e.m === m.id).map((e) => {
            const b = s.bests[e.id] || 0, nx = RANKS.find((r) => r.min > exScore(user, e, b)), u = unitOf(e);
            return <div key={e.id} className="sy-ex"><span>{e.name}</span><small>{b ? `${Math.round(b)} ${u}` : '—'}{nx ? ` → ${nx.id}: ${targetFor(user, e, nx.min)} ${u}` : ' · MAX'}</small></div>;
          })}</div>}
        </div>
      ))}
      <StrengthTest user={user} update={update} />
      <OneRM />
    </div>
  );
}
