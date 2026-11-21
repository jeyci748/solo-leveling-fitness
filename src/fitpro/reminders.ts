// @ts-nocheck
// Recordatorios de entrenamiento y misión diaria.
// 1) Notificaciones del teléfono mientras la app está abierta o en segundo plano.
// 2) Archivo de calendario (.ics) con alarmas: avisa aunque la app esté cerrada.

export const DAYS = [['L', 1, 'MO'], ['M', 2, 'TU'], ['X', 3, 'WE'], ['J', 4, 'TH'], ['V', 5, 'FR'], ['S', 6, 'SA'], ['D', 0, 'SU']];
export const defaultReminders = () => ({ on: false, days: [1, 3, 5], time: '07:00', questOn: true, questTime: '20:00' });

let reg = null;
export async function setupNotifications() {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'no';
  try { if ('serviceWorker' in navigator && !reg) reg = await navigator.serviceWorker.register('/sw.js'); } catch { reg = null; }
  if (Notification.permission === 'default') { try { return await Notification.requestPermission(); } catch { return 'denied'; } }
  return Notification.permission;
}

export async function notify(title, body) {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return false;
  const opts = { body, icon: '/anime/todo.jpg', badge: '/anime/todo.jpg', vibrate: [200, 100, 200], tag: title };
  try {
    const r = reg || (await navigator.serviceWorker?.getRegistration());
    if (r) { await r.showNotification(title, opts); return true; }
  } catch { /* uso la notificación simple */ }
  try { new Notification(title, opts); return true; } catch { return false; }
}

const hhmm = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

// Revisa cada minuto si toca avisar. fired guarda lo ya avisado hoy.
export function dueReminders(rem, now, fired, questPending) {
  const out = []; const day = now.toDateString(); const t = hhmm(now);
  if (rem.on && rem.days.includes(now.getDay()) && t >= rem.time && fired.train !== day) out.push('train');
  if (rem.questOn && questPending && t >= rem.questTime && fired.quest !== day) out.push('quest');
  return out;
}

// Crea un archivo .ics con eventos semanales y alarma
export function buildICS(rem, name, isWoman) {
  const pad = (n) => String(n).padStart(2, '0');
  const start = new Date(); const stamp = `${start.getUTCFullYear()}${pad(start.getUTCMonth() + 1)}${pad(start.getUTCDate())}T${pad(start.getUTCHours())}${pad(start.getUTCMinutes())}00Z`;
  const date = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}`;
  const ev = (uid, time, title, desc, byday, mins) => {
    const [h, m] = time.split(':'); const end = new Date(0, 0, 0, +h, +m + mins);
    return ['BEGIN:VEVENT', `UID:${uid}-${date}@fitpro-arise`, `DTSTAMP:${stamp}`, `DTSTART:${date}T${pad(+h)}${pad(+m)}00`, `DTEND:${date}T${pad(end.getHours())}${pad(end.getMinutes())}00`,
      `RRULE:FREQ=WEEKLY;BYDAY=${byday}`, `SUMMARY:${title}`, `DESCRIPTION:${desc}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${title}`, 'TRIGGER:-PT0M', 'END:VALARM',
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${title} en 10 minutos`, 'TRIGGER:-PT10M', 'END:VALARM', 'END:VEVENT'].join('\r\n');
  };
  const events = [];
  const who = isWoman ? 'cazadora' : 'cazador';
  if (rem.on && rem.days.length) {
    const by = DAYS.filter(([, n]) => rem.days.includes(n)).map(([, , c]) => c).join(',');
    events.push(ev('train', rem.time, '[SISTEMA] Entrenamiento de hoy', `${name}, el portal está abierto. Entra a FitPro y entrena, ${who}.`, by, 45));
  }
  if (rem.questOn) events.push(ev('quest', rem.questTime, '[SISTEMA] Misión diaria', `Completa tu misión diaria o recibirás una penalización, ${who}.`, 'MO,TU,WE,TH,FR,SA,SU', 15));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FitPro ARISE//ES', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR'].join('\r\n');
}

export function downloadICS(rem, name, isWoman) {
  const blob = new Blob([buildICS(rem, name, isWoman)], { type: 'text/calendar' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'fitpro-recordatorios.ics'; a.click();
}
