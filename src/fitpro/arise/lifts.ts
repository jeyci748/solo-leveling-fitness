// @ts-nocheck
// ARISE · Motor de fuerza estilo Symmetry
import { EXERCISES } from './exercises';
export { EXERCISES };
export const MUSCLE_GROUPS = [['pecho','Pecho'],['espalda','Espalda'],['hombros','Hombros'],['biceps','Bíceps'],['triceps','Tríceps'],['abdomen','Abdomen'],['cuadriceps','Cuádriceps'],['isquios','Femorales'],['gluteos','Glúteos'],['gemelos','Gemelos']];
export const MUSCLE_NAME = Object.fromEntries(MUSCLE_GROUPS);
export const UPPER = ['pecho','espalda','hombros','biceps','triceps'];
export const LOWER = ['cuadriceps','isquios','gluteos','gemelos'];
export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
export const RANKS = [{ id: 'E', min: 0 }, { id: 'D', min: 20 }, { id: 'C', min: 40 }, { id: 'B', min: 60 }, { id: 'A', min: 75 }, { id: 'S', min: 90 }];
export const rankOf = (sc) => [...RANKS].reverse().find((r) => sc >= r.min);
export const e1rm = (kg, reps) => (reps <= 1 ? kg : kg * (1 + reps / 30));
export const unitOf = (ex) => (ex.t === 'w' ? 'kg' : ex.t === 'time' ? 's' : 'reps');
export const setValue = (ex, s) => (ex.t === 'w' ? e1rm(+s.kg || 0, +s.reps || 0) : +s.reps || 0);
const sexF = (u, ex) => (u.sex !== 'mujer' ? 1 : LOWER.includes(ex.m) ? (ex.t === 'w' ? 0.75 : 0.85) : ex.t === 'w' ? 0.6 : 0.65);
const target = (u, ex) => (ex.t === 'w' ? (u.weight || 70) * ex.std : ex.std) * sexF(u, ex);
export const exScore = (u, ex, v) => Math.min(100, Math.round(((v || 0) / target(u, ex)) * 100));
export const targetFor = (u, ex, sc) => Math.ceil((target(u, ex) * sc) / 100);

export function bests(u) {
  const b = {}; const put = (id, v) => { if (v > (b[id] || 0)) b[id] = v; };
  (u.lifts || []).forEach((s) => s.items.forEach((it) => { const ex = EX[it.ex]; if (ex) it.sets.forEach((st) => st.done && put(it.ex, setValue(ex, st))); }));
  const st = u.strength || {};
  if (st.empuje) put('flexiones', st.empuje); if (st.tiron) put('remo_inv', st.tiron);
  if (st.pierna) put('sent_libre', st.pierna); if (st.core) put('plancha', st.core);
  return b;
}

export function symmetry(u) {
  const b = bests(u), sc = {};
  Object.entries(b).forEach(([id, v]) => {
    const ex = EX[id]; if (!ex) return; const s = exScore(u, ex, v);
    if (s > (sc[ex.m] || 0)) sc[ex.m] = s;
    ex.sec.forEach((m) => { const s2 = Math.round(s * 0.6); if (s2 > (sc[m] || 0)) sc[m] = s2; });
  });
  const muscles = MUSCLE_GROUPS.map(([id, name]) => ({ id, name, score: sc[id] || 0, trained: (sc[id] || 0) > 0, rank: rankOf(sc[id] || 0) }));
  const all = muscles.map((m) => m.score), n = all.length;
  const mean = all.reduce((a, v) => a + v, 0) / n;
  const mad = all.reduce((a, v) => a + Math.abs(v - mean), 0) / n;
  const trained = muscles.filter((m) => m.trained).length;
  const avg = (ids) => Math.round(ids.reduce((a, id) => a + (sc[id] || 0), 0) / ids.length);
  return { muscles, bests: b, trained, overall: Math.round(mean), balance: trained ? Math.max(0, Math.round(100 - mad * 2)) : 0,
    upper: avg(UPPER), lower: avg(LOWER), push: avg(['pecho', 'hombros', 'triceps']), pull: avg(['espalda', 'biceps']) };
}
