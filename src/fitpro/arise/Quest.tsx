// @ts-nocheck
import { useState } from 'react';
import { hu, levelInfo, questItems, QUEST_XP } from './hunter';
import { SysWin } from './System';
import { coachOf } from '../coach';

export function Quest({ user, update, settings, onMission }) {
  const h = hu(user); const { lv } = levelInfo(user.xp); const coach = coachOf(settings);
  const items = questItems(lv, user.sex, coach.quest); const c = h.quest.counts || {};
  const [info, setInfo] = useState(null);
  const done = items.every((i) => (c[i.id] || 0) >= i.goal);
  const set = (id, v) => { navigator.vibrate?.(8); update({ hunter: { ...h, quest: { ...h.quest, counts: { ...c, [id]: Math.max(0, v) } } } }); };
  const claim = () => update({ xp: (user.xp || 0) + QUEST_XP, hunter: { ...h, questsDone: h.questsDone + 1, penalty: false, quest: { ...h.quest, claimed: true } } });
  const w = user.sex === 'mujer';
  return (
    <>
      {h.penalty && (
        <SysWin title="MISIÓN DE PENALIZACIÓN" tone="danger">
          <p className="sys-txt center">No completaste la misión diaria de ayer.</p>
          <p className="sys-big sm">Sobrevive: {coach.penalty} {w ? 'saltos de tijera' : 'burpees'}</p>
          <button className="sys-btn" onClick={() => update({ hunter: { ...h, penalty: false } })}>HE SOBREVIVIDO</button>
        </SysWin>
      )}
      <SysWin title="MISIÓN DIARIA">
        <p className="sys-q">{w ? 'Preparación para volverse más fuerte y ligera' : 'Preparación para volverse fuerte'}</p>
        <p className="sys-txt center">Coach: <b>{coach.name}</b>{coach.quest > 1 ? ` · metas +${Math.round((coach.quest - 1) * 100)}%` : ''}</p>
        {items.map((i) => {
          const v = c[i.id] || 0, st = i.step || 10;
          return (
            <div key={i.id}>
              <div className={`q-row ${v >= i.goal ? 'ok' : ''}`}>
                <button className="q-name" onClick={() => setInfo(info === i.id ? null : i.id)}>{i.name} <i className="q-i">?</i></button>
                <b>[{Math.min(v, i.goal)}/{i.goal}{i.unit}]</b>
                <div className="q-btns"><button onClick={() => set(i.id, v - st)}>−</button><button onClick={() => set(i.id, v + st)}>+{st}</button></div>
              </div>
              {info === i.id && <ol className="q-steps">{i.steps.map((s) => <li key={s}>{s}</li>)}</ol>}
            </div>
          );
        })}
        <p className="sys-txt">Toca el nombre de un ejercicio para ver cómo se hace.</p>
        {!h.quest.claimed && <button className="sys-btn ghost" onClick={() => onMission?.(items)}>⚔ HACER LA MISIÓN GUIADA (CON COACH)</button>}
        <p className="sys-warn">⚠ ADVERTENCIA: no completar la misión diaria traerá una penalización.</p>
        {h.quest.claimed
          ? <p className="sys-done">✔ MISIÓN COMPLETADA · +{QUEST_XP} EXPERIENCIA</p>
          : <button className="sys-btn" disabled={!done} onClick={claim}>{done ? `RECLAMAR (+${QUEST_XP} EXPERIENCIA)` : 'EN PROGRESO…'}</button>}
      </SysWin>
    </>
  );
}

// Convierte la misión en una rutina guiada de 4 series por ejercicio
export function missionRoutine(items, user) {
  const ex = [];
  items.filter((i) => !i.distance).forEach((i) => {
    const per = Math.ceil(i.goal / 4);
    for (let s = 1; s <= 4; s++) {
      ex.push({ name: `${i.name} · Serie ${s} (${per}${i.timed ? ' seg' : ''})`, time: i.timed ? per : Math.max(30, per * 2), rest: 30, steps: i.steps, missionId: i.id, add: per });
    }
  });
  return { id: 'mision', mission: true, title: 'Misión Diaria Guiada', subtitle: 'Sigue al coach serie por serie', lvlText: 'Misión', rounds: 1, image: '/anime/todo.jpg', kcal: 120, muscles: ['pecho', 'abdomen', 'piernas'], exercises: ex };
}
