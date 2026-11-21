// @ts-nocheck
// Dureza del coach: cambia descansos, tiempo de trabajo, misiones y frases.
export const COACH = {
  normal: { id: 'normal', name: 'Normal', rest: 1, work: 1, quest: 1, penalty: 30,
    desc: 'Descansos completos y voz tranquila.' },
  duro: { id: 'duro', name: 'Duro', rest: 0.7, work: 1.1, quest: 1.25, penalty: 60,
    desc: '30% menos descanso, 10% más trabajo y coach exigente.' },
  monarca: { id: 'monarca', name: 'Monarca', rest: 0.5, work: 1.2, quest: 1.5, penalty: 100,
    desc: 'La mitad de descanso, 20% más trabajo. Sin piedad.' },
};
export const coachOf = (settings) => COACH[settings?.coach] || COACH.duro;

// Aplica la dureza a una rutina (no modifica la original)
export function applyCoach(routine, settings) {
  const c = coachOf(settings);
  return { ...routine, exercises: routine.exercises.map((e) => ({ ...e,
    time: Math.round(e.time * c.work), rest: Math.max(5, Math.round(e.rest * c.rest)) })) };
}

const PUSH = {
  normal: ['Bien hecho, sigue así.', 'Buen ritmo.', 'Respira y continúa.'],
  duro: ['¡Sin excusas! ¡Sigue!', '¡No te detengas ahora!', '¡Más fuerte! ¡Tú puedes más!', '¡El dolor es temporal, la fuerza se queda!'],
  monarca: ['¡Los débiles se rinden aquí! ¡Tú no!', '¡Levántate! ¡El Sistema te observa!', '¡Ni un segundo de descanso mental!', '¡Si paras, empiezas de cero!'],
};
const REST = {
  normal: (n) => `Descansa. Siguiente: ${n}.`,
  duro: (n) => `Descanso corto. No te enfríes. Viene ${n}.`,
  monarca: (n) => `Respira rápido. ${n} te espera. Prepárate.`,
};
export const pushLine = (settings, i = 0) => { const l = PUSH[coachOf(settings).id]; return l[i % l.length]; };
export const restLine = (settings, next) => REST[coachOf(settings).id](next);
