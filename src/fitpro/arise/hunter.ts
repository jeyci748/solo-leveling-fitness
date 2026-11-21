// @ts-nocheck
// ARISE · Sistema del Cazador (niveles, rangos, misiones, sombras)
export const today = () => new Date().toDateString();
export const xpNeed = (lv) => 100 + (lv - 1) * 40;
export function levelInfo(xp = 0) {
  let lv = 1, rest = Math.max(0, Math.floor(xp || 0));
  while (rest >= xpNeed(lv) && lv < 300) { rest -= xpNeed(lv); lv++; }
  return { lv, cur: rest, need: xpNeed(lv), pct: rest / xpNeed(lv) };
}
const HR = [['E', 1], ['D', 10], ['C', 20], ['B', 35], ['A', 50], ['S', 70]];
export const hunterRank = (lv) => ({ id: [...HR].reverse().find(([, m]) => lv >= m)[0] });
const TITLES = [[1, 'Cazador Novato', 'Cazadora Novata'], [5, 'El que Despertó', 'La que Despertó'], [10, 'Cazador de Lobos', 'Cazadora de Lobos'], [20, 'Asesino de Caballeros', 'Asesina de Caballeros'], [35, 'Conquistador de Mazmorras', 'Conquistadora de Mazmorras'], [50, 'Señor de la Guerra', 'Señora de la Guerra'], [70, 'Cazador Nacional', 'Cazadora Nacional'], [100, 'Monarca de las Sombras', 'Monarca de las Sombras']];
export const hunterTitle = (lv, sex) => { const t = [...TITLES].reverse().find(([m]) => lv >= m); return sex === 'mujer' ? t[2] : t[1]; };
export const STAT_KEYS = [['fue', 'Fuerza'], ['agi', 'Agilidad'], ['vit', 'Vitalidad'], ['per', 'Percepción'], ['int', 'Inteligencia']];
export const hu = (u) => ({ lvSeen: 1, points: 0, shadows: [], questsDone: 0, penalty: false, ...(u.hunter || {}),
  stats: { fue: 0, agi: 0, vit: 0, per: 0, int: 0, ...(u.hunter?.stats || {}) }, quest: { day: null, counts: {}, claimed: false, ...(u.hunter?.quest || {}) } });

export function hunterStats(u, overall = 0) {
  const h = hu(u), s = u.stats || {};
  const bonus = { fue: Math.round(overall / 5), agi: Math.floor((s.minutes || 0) / 30), vit: Math.floor((u.best || 0) / 2), per: h.questsDone, int: Math.floor((u.foodLog || []).length / 3) };
  return STAT_KEYS.map(([k, ab]) => ({ k, ab, bonus: bonus[k], total: 10 + (h.stats[k] || 0) + bonus[k] }));
}

export const QUEST_XP = 150;
// Misión diaria: cambia según sexo y dureza del coach. steps = cómo hacerlo.
export function questItems(lv, sex = 'hombre', mult = 1) {
  const n = Math.round(Math.min(100, 10 + lv * 3) * mult / 5) * 5;
  const km = Math.min(10, 1 + Math.floor(lv / 8)) * (mult > 1.3 ? 2 : 1);
  if (sex === 'mujer') return [
    { id: 'squat', name: 'Sentadillas', goal: n, unit: '', steps: ['Pies al ancho de hombros.', 'Baja como si te sentaras, espalda recta.', 'Sube empujando con los talones.'] },
    { id: 'bridge', name: 'Puente de glúteo', goal: n, unit: '', steps: ['Boca arriba, rodillas dobladas.', 'Sube la cadera y aprieta el glúteo 1 segundo.', 'Baja sin tocar el suelo.'] },
    { id: 'plank', name: 'Plancha', goal: Math.round(Math.min(180, 30 + lv * 5) * mult / 5) * 5, unit: ' seg', step: 15, timed: true, steps: ['Apoya antebrazos y puntas de los pies.', 'Cuerpo recto, ombligo hacia dentro.', 'No subas ni hundas la cadera.'] },
    { id: 'walk', name: 'Caminar rápido', goal: km, unit: ' km', step: 1, distance: true, steps: ['Camina a paso rápido, que te cueste hablar un poco.', 'Brazos activos, espalda recta.'] },
  ];
  return [
    { id: 'push', name: 'Flexiones', goal: n, unit: '', steps: ['Manos al ancho de hombros.', 'Cuerpo recto como una tabla.', 'Baja el pecho casi al suelo y empuja.'] },
    { id: 'abs', name: 'Abdominales', goal: n, unit: '', steps: ['Boca arriba, rodillas dobladas.', 'Sube el pecho hacia las rodillas sin jalar el cuello.', 'Baja lento.'] },
    { id: 'squat', name: 'Sentadillas', goal: n, unit: '', steps: ['Pies al ancho de hombros.', 'Baja como si te sentaras, espalda recta.', 'Sube empujando con los talones.'] },
    { id: 'run', name: 'Correr', goal: km, unit: ' km', step: 1, distance: true, steps: ['Trota a ritmo cómodo.', 'Respira por la nariz y suelta los hombros.'] },
  ];
}

export const SHADOWS = [
  { id: 'igris', icon: '⚔️', name: 'Igris', role: 'Caballero Sangriento', desc: '10 entrenamientos', test: (u) => (u.history || []).length >= 10 },
  { id: 'iron', icon: '🛡️', name: 'Iron', role: 'Tanque Acorazado', desc: '5 sesiones de gym', test: (u) => (u.lifts || []).length >= 5 },
  { id: 'tank', icon: '🐻', name: 'Tank', role: 'Oso Guardián', desc: 'Racha de 7 días', test: (u) => (u.best || 0) >= 7 },
  { id: 'tusk', icon: '🔥', name: 'Tusk', role: 'Chamán Orco', desc: '7 misiones diarias', test: (u) => hu(u).questsDone >= 7 },
  { id: 'beru', icon: '🐜', name: 'Beru', role: 'Rey Hormiga', desc: 'Llega a nivel 25', test: (u) => levelInfo(u.xp).lv >= 25 },
  { id: 'kaisel', icon: '🐉', name: 'Kaisel', role: 'Dragón Alado', desc: '1000 min entrenados', test: (u) => (u.stats?.minutes || 0) >= 1000 },
  { id: 'greed', icon: '🗡️', name: 'Greed', role: 'Caballero Élite', desc: 'Simetría 80% (6 músculos)', test: (u, s) => s.trained >= 6 && s.balance >= 80 },
  { id: 'bellion', icon: '👑', name: 'Bellion', role: 'Gran Mariscal', desc: 'Un músculo rango S', test: (u, s) => s.muscles.some((m) => m.rank.id === 'S') },
];
