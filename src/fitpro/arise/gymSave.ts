// @ts-nocheck
import { EX, setValue } from './lifts';

// Convierte la sesión activa en historial, XP, racha y récords
export function finishSession(user, ses, best) {
  const items = ses.items.map((it) => ({ ...it, sets: it.sets.filter((s) => s.done) })).filter((it) => it.sets.length);
  if (!items.length) return null;
  const sets = items.reduce((a, it) => a + it.sets.length, 0);
  const vol = Math.round(items.reduce((a, it) => a + it.sets.reduce((b, s) => b + (+s.kg || 0) * (+s.reps || 0), 0), 0));
  const prs = items.filter((it) => best[it.ex] && Math.max(...it.sets.map((s) => setValue(EX[it.ex], s))) > best[it.ex]).length;
  const dur = Math.max(1, Math.round((Date.now() - ses.start) / 60000)); const kcal = dur * 6;
  const xp = sets * 12 + prs * 40 + Math.round(vol / 200);
  const muscles = { ...(user.muscles || {}) }; items.forEach((it) => { muscles[EX[it.ex].m] = Date.now(); });
  const t = new Date().toDateString(), y = new Date(Date.now() - 864e5).toDateString();
  const streak = user.lastDay === t ? user.streak : user.lastDay === y ? (user.streak || 0) + 1 : 1;
  const s = user.stats || {};
  return {
    msg: `[SISTEMA] Mazmorra completada · +${xp} EXP${prs ? ` · ${prs} ${prs === 1 ? 'récord' : 'récords'}` : ''}`,
    patch: { session: null, xp: (user.xp || 0) + xp, muscles, streak, best: Math.max(user.best || 0, streak), lastDay: t,
      lifts: [...(user.lifts || []), { ts: Date.now(), dur, vol, sets, prs, items }].slice(-300),
      stats: { kcal: (s.kcal || 0) + kcal, minutes: (s.minutes || 0) + dur, exercises: (s.exercises || 0) + sets },
      history: [...(user.history || []), { ts: Date.now(), title: 'Gym', kcal }].slice(-200) },
  };
}
