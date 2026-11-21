// @ts-nocheck
// Rutinas, categorías con imágenes anime y comida.
export const IMG = (n) => `/anime/${n}.jpg`;

export const FOOD_DB = {
  'papa': { kcal: 77, carbs: 17, protein: 2, fat: 0.1 }, 'pollo': { kcal: 165, carbs: 0, protein: 31, fat: 3.6 },
  'arroz': { kcal: 130, carbs: 28, protein: 2.7, fat: 0.3 }, 'huevo': { kcal: 155, carbs: 1.1, protein: 13, fat: 11 },
  'avena': { kcal: 389, carbs: 66, protein: 16.9, fat: 6.9 }, 'banana': { kcal: 89, carbs: 22.8, protein: 1.1, fat: 0.3 },
  'atun': { kcal: 132, carbs: 0, protein: 28, fat: 1 }, 'pan': { kcal: 265, carbs: 49, protein: 9, fat: 3.2 },
  'carne': { kcal: 250, carbs: 0, protein: 26, fat: 15 }, 'pescado': { kcal: 206, carbs: 0, protein: 22, fat: 12 },
  'manzana': { kcal: 52, carbs: 14, protein: 0.3, fat: 0.2 }, 'yogur': { kcal: 59, carbs: 3.6, protein: 10, fat: 0.4 },
  'lentejas': { kcal: 116, carbs: 20, protein: 9, fat: 0.4 }, 'aguacate': { kcal: 160, carbs: 9, protein: 2, fat: 15 },
};

// Ejercicio: nombre, pasos, segundos de trabajo y descanso
const E = (name, steps, time = 40, rest = 20) => ({ name, time, rest, steps });

// ---------- Categorías (círculos con imagen) ----------
export const CATEGORIES = {
  hombre: [
    { id: 'todo', label: 'Todo', img: 'todo' },
    { id: 'pecho', label: 'Pecho y hombro', img: 'h-empuje' },
    { id: 'espalda', label: 'Espalda', img: 'h-espalda' },
    { id: 'brazos', label: 'Brazos', img: 'h-brazos' },
    { id: 'abdomen', label: 'Abdomen', img: 'h-cintura' },
    { id: 'piernas', label: 'Piernas', img: 'h-pierna' },
    { id: 'gluteos', label: 'Glúteos', img: 'h-gluteos' },
    { id: 'quema', label: 'Quemar grasa', img: 'h-quema' },
    { id: 'cara', label: 'Rostro', img: 'h-cara' },
    { id: 'diaria', label: 'Diaria', img: 'diaria' },
  ],
  mujer: [
    { id: 'todo', label: 'Todo', img: 'm-quema' },
    { id: 'cintura', label: 'Cintura', img: 'm-cintura' },
    { id: 'piernas', label: 'Piernas', img: 'm-piernas' },
    { id: 'gluteos', label: 'Glúteos', img: 'm-gluteos' },
    { id: 'brazos', label: 'Brazos', img: 'm-brazos' },
    { id: 'espalda', label: 'Espalda', img: 'm-espalda' },
    { id: 'cara', label: 'Rostro', img: 'm-cara' },
    { id: 'quema', label: 'Quemar grasa', img: 'm-quema' },
    { id: 'diaria', label: 'Diaria', img: 'diaria' },
  ],
};

// Zonas que una mujer puede elegir para reducir (Plan de la Cazadora)
export const WOMAN_ZONES = [
  ['cintura', 'Cintura'], ['piernas', 'Piernas'], ['brazos', 'Brazos'],
  ['espalda', 'Espalda'], ['cara', 'Rostro'], ['quema', 'Todo el cuerpo'],
];

// ---------- Rutinas largas ----------
export const ROUTINES = {
  hombre: [
    { id: 'h_empuje', muscles: ['pecho', 'hombros', 'brazos'], title: 'Empuje: Pecho y Hombro', subtitle: 'Fuerza de tren superior · 3 rondas', lvlText: 'Lunes y Jueves', rounds: 3, image: IMG('h-empuje'), kcal: 450,
      exercises: [
        E('Círculos de brazos', ['De pie, brazos extendidos a los lados.', 'Círculos grandes hacia adelante y luego hacia atrás.'], 40, 15),
        E('Flexiones clásicas', ['Manos un poco más abiertas que los hombros.', 'Cuerpo recto como una tabla.', 'Baja el pecho casi al suelo y empuja.'], 50, 20),
        E('Flexiones declinadas', ['Pies sobre una silla o sofá.', 'Baja controlando el pecho.'], 50, 20),
        E('Flexiones diamante', ['Manos juntas formando un diamante.', 'Codos pegados al cuerpo.'], 50, 20),
        E('Flexiones en V (hombro)', ['Desde plancha, sube la cadera formando una V invertida.', 'Baja la cabeza entre las manos y empuja.'], 50, 20),
        E('Fondos en silla', ['Manos en el borde de una silla, espalda pegada.', 'Baja doblando los codos hacia atrás y sube.'], 50, 20),
      ] },
    { id: 'h_tiron', muscles: ['espalda', 'brazos'], title: 'Tirón: Espalda y Bíceps', subtitle: 'Espalda ancha · 3 rondas', lvlText: 'Martes y Viernes', rounds: 3, image: IMG('h-espalda'), kcal: 400,
      exercises: [
        E('Dominadas o remo en mesa', ['Cuélgate de una barra (o túmbate bajo una mesa firme).', 'Tira del pecho hacia la barra juntando escápulas.'], 45, 25),
        E('Superman', ['Boca abajo, brazos al frente.', 'Levanta brazos y piernas a la vez, aguanta 2 segundos.'], 45, 20),
        E('Remo con mochila', ['Mochila con libros en una mano, torso inclinado.', 'Lleva el codo hacia atrás pegado al cuerpo.'], 50, 20),
        E('Curl con mochila', ['De pie, mochila colgando de las manos.', 'Sube doblando los codos sin balancearte.'], 45, 20),
        E('Ángeles en el suelo', ['Boca abajo, brazos en W.', 'Estira los brazos arriba sin tocar el suelo y vuelve.'], 40, 20),
      ] },
    { id: 'h_pierna', muscles: ['piernas', 'gluteos'], title: 'Pierna: Fuerza', subtitle: 'Piernas fuertes · 3 rondas', lvlText: 'Miércoles y Sábado', rounds: 3, image: IMG('h-pierna'), kcal: 500,
      exercises: [
        E('Sentadillas libres', ['Pies al ancho de hombros.', 'Baja como si te sentaras, espalda recta.'], 50, 20),
        E('Sentadilla búlgara (izquierda)', ['Pie derecho atrás sobre una silla.', 'Baja la rodilla trasera hacia el suelo.'], 45, 15),
        E('Sentadilla búlgara (derecha)', ['Pie izquierdo atrás sobre una silla.', 'Empuja con el talón delantero.'], 45, 15),
        E('Zancadas alternas', ['Paso largo al frente.', 'Ambas rodillas a 90 grados, alterna.'], 50, 20),
        E('Puente de glúteo a una pierna', ['Boca arriba, una pierna estirada al aire.', 'Sube la cadera apretando el glúteo.'], 45, 20),
        E('Sentadilla en pared', ['Espalda pegada a la pared.', 'Muslos paralelos al suelo, aguanta.'], 50, 20),
      ] },
    { id: 'h_quema', muscles: ['abdomen', 'piernas'], title: 'Quema de Grasa: Portal Rojo', subtitle: 'Cardio intenso · 4 rondas', lvlText: 'Domingo', rounds: 4, image: IMG('h-quema'), kcal: 420,
      exercises: [
        E('Burpees', ['Baja, pies atrás a plancha.', 'Vuelve y salta con brazos arriba.'], 40, 20),
        E('Escaladores', ['En plancha, lleva rodillas al pecho rápido.'], 40, 20),
        E('Saltos de tijera', ['Abre y cierra piernas y brazos saltando.'], 40, 20),
        E('Sentadilla con salto', ['Baja a sentadilla y salta explosivo.'], 40, 20),
      ] },
  ],
  mujer: [
    { id: 'm_quema', muscles: ['abdomen', 'piernas', 'gluteos'], title: 'Quema Total: Perder Grasa', subtitle: 'Cardio que quema en todo el cuerpo · 4 rondas', lvlText: 'Lunes, Miércoles y Viernes', rounds: 4, image: IMG('m-quema'), kcal: 350,
      exercises: [
        E('Saltos de tijera', ['Abre y cierra piernas y brazos saltando suave.'], 40, 20),
        E('Sentadilla con brazos arriba', ['Baja a sentadilla, al subir estira los brazos.'], 40, 20),
        E('Escaladores', ['En plancha, rodillas al pecho alternando.'], 40, 20),
        E('Rodillas arriba', ['Corre en el sitio subiendo rodillas a la cadera.'], 40, 20),
        E('Plancha con toques de hombro', ['En plancha alta, toca cada hombro sin mover la cadera.'], 40, 20),
      ] },
    { id: 'm_gluteo_d1', muscles: ['gluteos', 'piernas'], title: 'Glúteos y Piernas: Fuerza', subtitle: 'Tonifica glúteos y muslos · 3 rondas', lvlText: 'Martes', rounds: 3, image: IMG('m-gluteos'), kcal: 300,
      exercises: [
        E('Hip thrust en sofá', ['Espalda alta en el borde del sofá.', 'Sube la cadera en línea recta y aprieta el glúteo.'], 50, 20),
        E('Peso muerto a una pierna', ['Inclina el torso mientras la pierna libre va atrás.', 'Espalda recta, sube apretando el glúteo.'], 45, 20),
        E('Puente rana', ['Plantas de los pies juntas, rodillas abiertas.', 'Sube la cadera apretando fuerte.'], 45, 20),
        E('Abducción acostada', ['De lado, cuerpo recto.', 'Sube la pierna de arriba lento y baja.'], 45, 20),
      ] },
    { id: 'm_piernas', muscles: ['piernas', 'gluteos'], title: 'Piernas Finas: Quema y Tono', subtitle: 'Reduce grasa de piernas · 3 rondas', lvlText: 'Jueves', rounds: 3, image: IMG('m-piernas'), kcal: 320,
      exercises: [
        E('Zancadas atrás', ['Paso largo hacia atrás.', 'Rodilla trasera casi al suelo, peso adelante.'], 45, 20),
        E('Sentadilla sumo', ['Piernas abiertas, puntas afuera.', 'Baja recta y sube con los talones.'], 45, 20),
        E('Subidas al escalón', ['Pie completo en un escalón firme.', 'Sube empujando con el talón.'], 45, 20),
        E('Patada lateral de pie', ['Apoyada en una pared.', 'Sube la pierna al lado sin inclinarte.'], 40, 20),
      ] },
    { id: 'm_cintura_brazos', muscles: ['abdomen', 'brazos', 'espalda'], title: 'Cintura, Brazos y Espalda', subtitle: 'Parte de arriba firme · 3 rondas', lvlText: 'Sábado', rounds: 3, image: IMG('m-cintura'), kcal: 260,
      exercises: [
        E('Plancha lateral (izquierda)', ['Sobre el antebrazo, cadera arriba.', 'Cuerpo en línea recta.'], 30, 15),
        E('Plancha lateral (derecha)', ['Cambia de lado, cadera arriba.'], 30, 15),
        E('Giros rusos', ['Sentada, pies elevados.', 'Gira el torso tocando el suelo a cada lado.'], 40, 20),
        E('Fondos en silla', ['Manos en la silla, codos hacia atrás.'], 40, 20),
        E('Remo con botellas', ['Torso inclinado, botellas de agua en las manos.', 'Lleva los codos atrás juntando la espalda.'], 40, 20),
      ] },
  ],
};

// ---------- Rutinas cortas por zona ----------
const Q = (id, category, sex, title, subtitle, img, kcal, exercises) => ({ id, category, sex, title, subtitle, image: IMG(img), kcal, rounds: 1, lvlText: '', muscles: [category], exercises });
export const QUICK_ROUTINES = [
  // Mujer
  Q('qm_cintura', 'cintura', 'mujer', 'Cintura de Avispa', 'Reduce la cintura', 'm-cintura', 60, [
    E('Abdominal bicicleta', ['Boca arriba, lleva el codo a la rodilla contraria.', 'Alterna lento y controlado.'], 45, 15),
    E('Giros rusos', ['Sentada, torso inclinado atrás.', 'Gira tocando el suelo a cada lado.'], 45, 15),
    E('Plancha lateral', ['Sobre el antebrazo, cadera arriba.'], 30, 15),
    E('Vacío abdominal', ['De pie, saca todo el aire.', 'Mete el ombligo hacia dentro 10 segundos.'], 40, 15),
    E('Escaladores lentos', ['En plancha, rodilla al codo del mismo lado.'], 40, 15)]),
  Q('qm_piernas', 'piernas', 'mujer', 'Piernas Finas', 'Quema grasa de piernas', 'm-piernas', 70, [
    E('Sentadillas', ['Baja como si te sentaras, espalda recta.'], 45, 15),
    E('Zancadas alternas', ['Paso largo al frente, alterna.'], 45, 15),
    E('Patada lateral', ['De pie, sube la pierna al lado.'], 40, 15),
    E('Saltos suaves en el sitio', ['Salta ligero sobre las puntas.'], 40, 15)]),
  Q('qm_gluteos', 'gluteos', 'mujer', 'Glúteo Express', 'Levanta y tonifica', 'm-gluteos', 55, [
    E('Puente de glúteo', ['Boca arriba, sube la cadera y aprieta.'], 45, 15),
    E('Patada de burro', ['En cuadrupedia, sube la pierna doblada al techo.'], 45, 15),
    E('Sentadilla sumo', ['Pies abiertos, baja recta.'], 45, 15)]),
  Q('qm_brazos', 'brazos', 'mujer', 'Brazos Firmes', 'Adiós a la flacidez', 'm-brazos', 45, [
    E('Fondos en silla', ['Codos hacia atrás, baja y sube.'], 40, 15),
    E('Flexiones con rodillas', ['Rodillas en el suelo, baja el pecho.'], 40, 15),
    E('Extensión de tríceps con botella', ['Botella detrás de la cabeza con las dos manos.', 'Estira los brazos arriba.'], 40, 15),
    E('Círculos de brazos', ['Brazos en cruz, círculos pequeños sin bajar.'], 40, 15)]),
  Q('qm_espalda', 'espalda', 'mujer', 'Espalda sin Rollitos', 'Reduce la grasa de la espalda', 'm-espalda', 50, [
    E('Superman', ['Boca abajo, sube brazos y piernas 2 segundos.'], 40, 15),
    E('Remo con botellas', ['Torso inclinado, codos hacia atrás.'], 40, 15),
    E('Ángeles en el suelo', ['Boca abajo, brazos de W a arriba.'], 40, 15),
    E('Plancha con toques de hombro', ['En plancha, toca cada hombro.'], 40, 15)]),
  Q('qm_cara', 'cara', 'mujer', 'Yoga Facial', 'Afina rostro y papada', 'm-cara', 15, [
    E('Masaje de pómulos', ['Con los dedos, presiona los pómulos hacia arriba.'], 45, 10),
    E('Ejercicio contra papada', ['Mira al techo y presiona la lengua contra el paladar.'], 45, 10),
    E('Beso al techo', ['Mira arriba y estira los labios como un beso.'], 40, 10),
    E('Estiramiento de cuello', ['Inclina la cabeza a cada lado suave.'], 40, 10)]),
  Q('qm_quema', 'quema', 'mujer', 'Quema Rápida', 'Grasa de todo el cuerpo', 'm-quema', 90, [
    E('Saltos de tijera', ['Abre y cierra piernas y brazos.'], 40, 15),
    E('Rodillas arriba', ['Corre en el sitio subiendo rodillas.'], 40, 15),
    E('Sentadilla con salto suave', ['Baja y salta ligero.'], 40, 15),
    E('Escaladores', ['En plancha, rodillas al pecho rápido.'], 40, 15)]),
  // Hombre
  Q('qh_pecho', 'pecho', 'hombre', 'Pecho de Acero', 'Pecho y hombros', 'h-empuje', 60, [
    E('Flexiones', ['Cuerpo recto, pecho casi al suelo.'], 45, 15),
    E('Flexiones abiertas', ['Manos muy abiertas.'], 40, 15),
    E('Flexiones en V', ['Cadera arriba, cabeza entre las manos.'], 40, 15)]),
  Q('qh_espalda', 'espalda', 'hombre', 'Espalda de Sombra', 'Espalda ancha', 'h-espalda', 55, [
    E('Dominadas o remo en mesa', ['Tira del pecho hacia la barra.'], 40, 20),
    E('Superman', ['Sube brazos y piernas 2 segundos.'], 40, 15),
    E('Remo con mochila', ['Codo atrás pegado al cuerpo.'], 40, 15)]),
  Q('qh_brazos', 'brazos', 'hombre', 'Brazos de Hierro', 'Bíceps y tríceps', 'h-brazos', 55, [
    E('Flexiones diamante', ['Manos juntas, codos pegados.'], 45, 15),
    E('Fondos en silla', ['Baja hasta 90 grados.'], 45, 15),
    E('Curl con mochila', ['Sube sin balancearte.'], 45, 15)]),
  Q('qh_abdomen', 'abdomen', 'hombre', 'Abdomen de Acero', 'Abdominales y oblicuos', 'h-cintura', 50, [
    E('Plancha', ['Cuerpo recto, abdomen apretado.'], 60, 15),
    E('Escaladores', ['Rodillas al pecho rápido.'], 45, 15),
    E('Abdominal en V', ['Toca los pies con las manos.'], 45, 15)]),
  Q('qh_piernas', 'piernas', 'hombre', 'Piernas de Cazador', 'Fuerza y resistencia', 'h-pierna', 70, [
    E('Sentadillas', ['Espalda recta, baja profundo.'], 45, 15),
    E('Zancadas', ['Paso largo, rodilla casi al suelo.'], 45, 15),
    E('Sentadilla en pared', ['Muslos paralelos, aguanta.'], 45, 15)]),
  Q('qh_gluteos', 'gluteos', 'hombre', 'Fuerza de Glúteo', 'Potencia de cadera', 'h-gluteos', 60, [
    E('Puente a una pierna', ['Una pierna arriba, sube la cadera.'], 45, 15),
    E('Sentadilla búlgara', ['Pie trasero en silla.'], 45, 15),
    E('Zancadas profundas', ['Paso largo, rodilla al suelo.'], 45, 15)]),
  Q('qh_quema', 'quema', 'hombre', 'Portal Rojo Express', 'Quema grasa rápido', 'h-quema', 100, [
    E('Burpees', ['Plancha, vuelve y salta.'], 40, 15),
    E('Escaladores', ['Rodillas al pecho.'], 40, 15),
    E('Sentadilla con salto', ['Baja y salta explosivo.'], 40, 15)]),
  Q('qh_cara', 'cara', 'hombre', 'Mandíbula Marcada', 'Reduce hinchazón de la cara', 'h-cara', 15, [
    E('Masaje mandibular', ['De la barbilla hacia las orejas.'], 45, 10),
    E('Mentón adentro', ['Mete la barbilla hacia atrás 5 segundos.'], 45, 10),
    E('Estiramiento de cuello', ['Inclina la cabeza suave a cada lado.'], 45, 10)]),
  // Para los dos
  Q('q_diaria', 'diaria', 'all', 'Activación Diaria', 'Despierta el cuerpo cada mañana', 'diaria', 25, [
    E('Gato-camello', ['En cuadrupedia.', 'Arquea y redondea la espalda.'], 40, 10),
    E('Rotación de cadera', ['De pie, círculos grandes con la pelvis.'], 40, 10),
    E('Estiramiento de brazos arriba', ['Entrelaza las manos y estira al techo.'], 40, 10),
    E('Sentadillas suaves', ['10 sentadillas lentas.'], 40, 10)]),
];

export const MUSCLES = ['hombros', 'pecho', 'brazos', 'abdomen', 'espalda', 'gluteos', 'piernas'];
export const STRENGTH_STD = { hombre: { empuje: 40, tiron: 25, pierna: 50, core: 120 }, mujer: { empuje: 20, tiron: 15, pierna: 40, core: 90 } };
export const STRENGTH_LABELS = { empuje: 'Flexiones seguidas', tiron: 'Remos seguidos', pierna: 'Sentadillas seguidas', core: 'Plancha (segundos)' };

export const routineMinutes = (r) => { const roundTime = r.exercises.reduce((a, e) => a + e.time + e.rest, 0); return Math.max(1, Math.round((roundTime * (r.rounds || 1)) / 60)); };

// Rutina de hoy según el sexo y las zonas elegidas
export function todayRoutine(user) {
  const day = new Date().getDay();
  if (user.sex === 'mujer') {
    const zones = (user.zones && user.zones.length) ? user.zones : ['quema'];
    const z = zones[day % zones.length];
    return QUICK_ROUTINES.find((r) => r.sex === 'mujer' && r.category === z) || ROUTINES.mujer[0];
  }
  const plan = { 1: 'h_empuje', 2: 'h_tiron', 3: 'h_pierna', 4: 'h_empuje', 5: 'h_tiron', 6: 'h_pierna', 0: 'h_quema' };
  return ROUTINES.hombre.find((r) => r.id === plan[day]) || ROUTINES.hombre[0];
}
