// @ts-nocheck
// Medallas y trofeos del apartado Rachas.
import { hu, levelInfo } from './arise/hunter';

const f = (u, m, w) => (u.sex === 'mujer' ? w : m);
export const TIERS = {
  bronce: { name: 'Bronce', color: '#d08a52' },
  plata: { name: 'Plata', color: '#c9d1dc' },
  oro: { name: 'Oro', color: '#f5cf6b' },
  diamante: { name: 'Diamante', color: '#7fe3f2' },
  monarca: { name: 'Monarca', color: '#ff7a45' },
};

// icon: nombre de icono (flame, swords, scroll, clock, dumbbell, trophy, crown)
export const MEDAL_GROUPS = [
  { id: 'racha', title: 'RACHAS', icon: 'flame', unit: 'días', value: (u) => Math.max(u.best || 0, u.streak || 0), items: [
    { id: 'r3', name: () => 'Chispa', goal: 3, tier: 'bronce' },
    { id: 'r7', name: () => 'Semana de Fuego', goal: 7, tier: 'plata' },
    { id: 'r14', name: () => 'Llama Constante', goal: 14, tier: 'oro' },
    { id: 'r30', name: () => 'Mes Indomable', goal: 30, tier: 'oro' },
    { id: 'r60', name: () => 'Voluntad de Acero', goal: 60, tier: 'diamante' },
    { id: 'r100', name: () => 'Fuego Eterno', goal: 100, tier: 'monarca' },
  ] },
  { id: 'train', title: 'ENTRENAMIENTOS', icon: 'swords', unit: '', value: (u) => (u.history || []).length, items: [
    { id: 't1', name: () => 'Primer Portal', goal: 1, tier: 'bronce' },
    { id: 't10', name: (u) => f(u, 'Cazador Activo', 'Cazadora Activa'), goal: 10, tier: 'plata' },
    { id: 't25', name: () => 'Rompe Mazmorras', goal: 25, tier: 'oro' },
    { id: 't50', name: (u) => f(u, 'Veterano', 'Veterana'), goal: 50, tier: 'oro' },
    { id: 't100', name: () => 'Leyenda del Gremio', goal: 100, tier: 'diamante' },
    { id: 't250', name: (u) => f(u, 'Imparable', 'Imparable'), goal: 250, tier: 'monarca' },
  ] },
  { id: 'quest', title: 'MISIONES DIARIAS', icon: 'scroll', unit: '', value: (u) => hu(u).questsDone, items: [
    { id: 'q1', name: (u) => f(u, 'Recluta', 'Recluta'), goal: 1, tier: 'bronce' },
    { id: 'q7', name: (u) => f(u, 'Disciplinado', 'Disciplinada'), goal: 7, tier: 'plata' },
    { id: 'q30', name: () => 'Sin Penalización', goal: 30, tier: 'oro' },
    { id: 'q100', name: () => 'Voluntad del Sistema', goal: 100, tier: 'monarca' },
  ] },
  { id: 'time', title: 'TIEMPO ENTRENADO', icon: 'clock', unit: 'min', value: (u) => u.stats?.minutes || 0, items: [
    { id: 'm60', name: () => 'Primera Hora', goal: 60, tier: 'bronce' },
    { id: 'm300', name: () => '5 Horas de Sudor', goal: 300, tier: 'plata' },
    { id: 'm1000', name: () => 'Mil Minutos', goal: 1000, tier: 'oro' },
    { id: 'm3000', name: () => 'Maestría', goal: 3000, tier: 'diamante' },
  ] },
  { id: 'trophy', title: 'TROFEOS', icon: 'trophy', unit: '', trophy: true, items: [
    { id: 'lv10', name: () => 'Rango D: Nivel 10', goal: 10, tier: 'plata', value: (u) => levelInfo(u.xp).lv },
    { id: 'lv25', name: () => 'Rango C: Nivel 25', goal: 25, tier: 'oro', value: (u) => levelInfo(u.xp).lv },
    { id: 'lv50', name: () => 'Rango A: Nivel 50', goal: 50, tier: 'monarca', value: (u) => levelInfo(u.xp).lv },
    { id: 'gym10', name: () => '10 Mazmorras de Gym', goal: 10, tier: 'oro', value: (u) => (u.lifts || []).length },
    { id: 'pr1', name: () => 'Primer Récord', goal: 1, tier: 'plata', value: (u) => (u.lifts || []).reduce((a, s) => a + (s.prs || 0), 0) },
    { id: 'kcal', name: () => '10.000 Calorías', goal: 10000, tier: 'diamante', value: (u) => u.stats?.kcal || 0 },
  ] },
];

export function medalState(u) {
  return MEDAL_GROUPS.map((g) => {
    const items = g.items.map((m) => {
      const v = (m.value || g.value)(u);
      return { ...m, name: m.name(u), value: Math.min(v, m.goal), done: v >= m.goal, pct: Math.min(1, v / m.goal) };
    });
    return { ...g, items, earned: items.filter((m) => m.done).length };
  });
}

// Próxima medalla de racha
export function nextStreakMedal(u) {
  const g = medalState(u)[0];
  return g.items.find((m) => !m.done) || null;
}
