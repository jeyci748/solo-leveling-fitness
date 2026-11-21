// @ts-nocheck
// Cálculos sencillos del cuerpo: peso ideal, IMC (índice de masa corporal) y cintura.
// Colores: verde = bien, amarillo = cuidado, rojo = alto.

export const round1 = (n) => Math.round(n * 10) / 10;

// Rango de peso ideal según la altura (IMC entre 18.5 y 24.9)
export function idealRange(heightCm) {
  const m = (heightCm || 0) / 100;
  return { min: round1(18.5 * m * m), max: round1(24.9 * m * m) };
}

export function bmi(weightKg, heightCm) {
  const m = (heightCm || 0) / 100;
  if (!m || !weightKg) return 0;
  return round1(weightKg / (m * m));
}

// Estado del peso con su color y un mensaje claro
export function weightStatus(weightKg, heightCm) {
  const b = bmi(weightKg, heightCm);
  const r = idealRange(heightCm);
  if (b < 18.5) {
    return { id: 'bajo', label: 'Bajo peso', color: 'yellow', bmi: b, range: r, kg: round1(r.min - weightKg),
      msg: `Te faltan ${round1(r.min - weightKg)} kg para llegar a tu peso ideal.` };
  }
  if (b < 25) {
    return { id: 'ideal', label: 'Peso ideal', color: 'green', bmi: b, range: r, kg: 0,
      msg: 'Estás en tu peso ideal. Mantén tus entrenamientos y tu comida.' };
  }
  const extra = round1(weightKg - r.max);
  if (b < 30) {
    return { id: 'sobrepeso', label: 'Sobrepeso', color: 'yellow', bmi: b, range: r, kg: extra,
      msg: `Te sobran ${extra} kg para llegar a tu peso ideal.` };
  }
  return { id: 'obesidad', label: 'Obesidad', color: 'red', bmi: b, range: r, kg: extra,
    msg: `Te sobran ${extra} kg para llegar a tu peso ideal. Empieza suave y sé constante.` };
}

// Posición (0 a 100) del marcador en la barra de colores (IMC de 15 a 40)
export function bmiMarker(b) {
  return Math.max(0, Math.min(100, ((b - 15) / 25) * 100));
}

// Semanas aproximadas para llegar al peso ideal bajando 0.5 kg por semana
export function weeksToIdeal(kgToLose) {
  if (!kgToLose || kgToLose <= 0) return 0;
  return Math.ceil(kgToLose / 0.5);
}

// Cintura: límites de salud por sexo (en cm)
export const WAIST_LIMITS = { hombre: { ok: 94, high: 102 }, mujer: { ok: 80, high: 88 } };

export function waistStatus(waistCm, sex) {
  const L = WAIST_LIMITS[sex === 'mujer' ? 'mujer' : 'hombre'];
  if (!waistCm) return null;
  if (waistCm < L.ok) return { id: 'sana', label: 'Cintura sana', color: 'green', limit: L.ok, cm: 0,
    msg: `Estás en verde (menos de ${L.ok} cm). ¡Sigue así!` };
  const cm = Math.ceil(waistCm - L.ok + 1);
  if (waistCm < L.high) return { id: 'alerta', label: 'Cintura en alerta', color: 'yellow', limit: L.ok, cm,
    msg: `Baja ${cm} cm para estar en verde (menos de ${L.ok} cm).` };
  return { id: 'alta', label: 'Cintura alta', color: 'red', limit: L.ok, cm,
    msg: `Baja ${cm} cm para estar en verde (menos de ${L.ok} cm). Camina cada día y cuida la comida.` };
}

// Posición del marcador de cintura (rango visible: límite-20 a límite alto+15)
export function waistMarker(waistCm, sex) {
  const L = WAIST_LIMITS[sex === 'mujer' ? 'mujer' : 'hombre'];
  const lo = L.ok - 20, hi = L.high + 15;
  return Math.max(0, Math.min(100, ((waistCm - lo) / (hi - lo)) * 100));
}
