// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { ROUTINES, QUICK_ROUTINES, CATEGORIES, WOMAN_ZONES, FOOD_DB, routineMinutes, todayRoutine, IMG } from './data';
import { Home as IconHome, Apple, User, Camera, Play, Pause, SkipForward, ArrowLeft, Swords, Crown, ScrollText, Flame, Clock, Trophy, Lock, Bell, CalendarPlus } from 'lucide-react';
import './index.css';
import './arise/arise.css';
import './fitpro-extra.css';
import { HunterWatcher, HunterChip, SysWin } from './arise/System';
import Status from './arise/Status';
import Gym from './arise/Gym';
import Symmetry from './arise/Symmetry';
import { Backup } from './arise/Backup';
import { missionRoutine } from './arise/Quest';
import { hu } from './arise/hunter';
import { weightStatus, bmiMarker, waistStatus, waistMarker, weeksToIdeal, WAIST_LIMITS } from './body';
import { COACH, coachOf, applyCoach, pushLine, restLine } from './coach';
import { medalState, nextStreakMedal, TIERS } from './medals';
import { DAYS, defaultReminders, setupNotifications, notify, dueReminders, downloadICS } from './reminders';

const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
function usePersist(key, init) {
  const [v, setV] = useState(() => load(key, init));
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)); }, [key, v]);
  return [v, setV];
}
const today = () => new Date().toDateString();
const vibrate = (p) => navigator.vibrate?.(p);
const speak = (text, settings) => { if (!settings.voice || !window.speechSynthesis) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'es-ES'; u.rate = settings.voiceRate || 1.0; window.speechSynthesis.speak(u); };
const newUser = (name, sex) => ({ name, sex, age: 28, height: sex === 'hombre' ? 175 : 162, weight: sex === 'hombre' ? 78 : 62, waist: 0, goal: 'perder', zones: ['cintura', 'piernas'], weeklyGoal: 4, streak: 0, best: 0, lastDay: null, stats: { kcal: 0, minutes: 0, exercises: 0 }, history: [], weights: [], water: 0, waterDay: today(), muscles: {}, strength: {}, foodLog: [] });
const W = (u, m, w) => (u.sex === 'mujer' ? w : m); // texto para hombre o mujer
const GOALS = { perder: 'Perder grasa', mantener: 'Mantener', ganar: 'Ganar músculo' };

export function nutrition(u) {
  const bmr = 10 * u.weight + 6.25 * u.height - 5 * u.age + (u.sex === 'hombre' ? 5 : -161);
  const tdee = bmr * 1.5;
  const kcal = Math.round(u.goal === 'perder' ? tdee - 450 : u.goal === 'ganar' ? tdee + 300 : tdee);
  const protein = Math.round(u.weight * 1.8);
  const fat = Math.round((kcal * 0.27) / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { kcal, protein, fat, carbs, water: Math.round(u.weight * 35) };
}

function Ring({ value, max, label, sub, color = 'gold' }) {
  const C = 2 * Math.PI * 34, pct = Math.min(1, value / max);
  return (<div className="mini-ring"><div className="mini-ring-svg neu"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" className="ring-bg" strokeWidth="7" /><circle cx="40" cy="40" r="34" fill="none" strokeWidth="7" strokeLinecap="round" className={`ring-fg ${color}`} strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 40 40)" /></svg><b>{value}</b></div><span>{label}</span><small>{sub}</small></div>);
}

// Barra de colores (verde / amarillo / rojo) con marcador
function ColorBar({ segs, marker, labels }) {
  return (
    <div className="cbar-wrap">
      <div className="cbar">{segs.map(([c, w], i) => <i key={i} className={`c-${c}`} style={{ width: `${w}%` }} />)}<b style={{ left: `${marker}%` }} /></div>
      <div className="cbar-lbl">{labels.map((l) => <small key={l}>{l}</small>)}</div>
    </div>
  );
}

function StatusLine({ s }) {
  return (<div className="st-line"><span className={`dotc c-${s.color}`} /><div><p className={`st-lbl t-${s.color}`}>{s.label}</p><p className="sys-txt">{s.msg}</p></div></div>);
}

function RoutineCard({ r, onOpen, settings }) {
  const rr = applyCoach(r, settings);
  return (
    <button className="routine neu" onClick={() => onOpen(r)}>
      <div className="routine-img" style={{ backgroundImage: `url(${r.image})` }}>{r.lvlText ? <span className="lvl">{r.lvlText}</span> : <span className="lvl">{routineMinutes(rr)} min</span>}</div>
      <div className="routine-body"><h3>{r.title}</h3><p>{r.subtitle}</p><div className="meta"><span>⏱ {routineMinutes(rr)} minutos</span><span>🔥 {r.kcal} calorías</span>{r.rounds > 1 && <span>{r.rounds} rondas</span>}</div></div>
    </button>
  );
}

function PlanCard({ user, update, onOpen, onRegistro, settings }) {
  const r = todayRoutine(user); const ws = weightStatus(user.weight, user.height); const woman = user.sex === 'mujer';
  const zones = user.zones || [];
  const toggleZone = (z) => update({ zones: zones.includes(z) ? zones.filter((x) => x !== z) : [...zones, z] });
  return (
    <SysWin title={woman ? 'PLAN DE LA CAZADORA' : 'PLAN DEL CAZADOR'}>
      <p className="sys-txt">Objetivo: <b>{GOALS[user.goal] || 'Perder grasa'}</b>{woman && ' · ¿Qué zonas quieres reducir?'}</p>
      {woman && <div className="chips">{WOMAN_ZONES.map(([id, l]) => <button key={id} className={`chip ${zones.includes(id) ? 'on' : ''}`} onClick={() => toggleZone(id)}>{l}</button>)}</div>}
      <button className="today" onClick={() => onOpen(r)}>
        <img src={r.image} alt="" />
        <div><small>RUTINA DE HOY{woman && r.category ? ` · ${(WOMAN_ZONES.find(([id]) => id === r.category) || [])[1] || ''}` : ''}</small><b>{r.title}</b><small>{r.subtitle} · {routineMinutes(applyCoach(r, settings))} min</small></div>
      </button>
      <button className="today-status" onClick={onRegistro}><span className={`dotc c-${ws.color}`} /><span>Tu peso: <b className={`t-${ws.color}`}>{ws.label}</b></span><span className="go">Ver registro ›</span></button>
      {(ws.id === 'sobrepeso' || ws.id === 'obesidad') && user.goal !== 'perder' && <p className="sys-txt">▸ <b>Tienes {ws.label.toLowerCase()}:</b> te conviene el objetivo Perder grasa (cámbialo en Comida).</p>}
      <p className="sys-txt">▸ {woman || user.goal === 'perder' ? 'Para bajar grasa: entrena 4 o 5 días, camina cada día y come un poco menos de lo que gastas (mira Comida).' : user.goal === 'ganar' ? 'Para ganar músculo: entrena fuerte, duerme 8 horas y come suficiente proteína.' : 'Para mantenerte: entrena 3 o 4 días y come lo que gastas.'}</p>
    </SysWin>
  );
}

function Home({ users, active, setActive, user, update, setSex, showWater, onOpen, onRegistro, settings }) {
  const [cat, setCat] = useState('todo');
  const weekAgo = Date.now() - 7 * 864e5;
  const week = (user.history || []).filter((h) => h.ts > weekAgo);
  const n = nutrition(user); const woman = user.sex === 'mujer';
  const cats = CATEGORIES[user.sex] || CATEGORIES.hombre;
  const catObj = cats.find((c) => c.id === cat) || cats[0];
  const mus = cat === 'cintura' ? 'abdomen' : cat;
  const list = cat === 'todo' ? ROUTINES[user.sex] : [
    ...QUICK_ROUTINES.filter((r) => r.category === cat && (r.sex === 'all' || r.sex === user.sex)),
    ...ROUTINES[user.sex].filter((r) => r.muscles.includes(mus)),
  ];
  useEffect(() => { if (!cats.some((c) => c.id === cat)) setCat('todo'); }, [user.sex]); // eslint-disable-line
  return (
    <div className="page">
      <header className="head"><div><p className="eyebrow">[SISTEMA] {W(user, 'Bienvenido, cazador', 'Bienvenida, cazadora')}</p><h1 className="brand">{user.name}<span>.</span></h1></div><HunterChip user={user} /></header>
      <div className="segmented neu-in">{Object.entries(users).map(([k, u]) => (<button key={k} className={`seg ${active === k ? 'active' : ''}`} onClick={() => { setActive(k); vibrate(10); }}>{u.name}</button>))}</div>
      <div className="card glass rings">
        <Ring value={week.length} max={user.weeklyGoal || 4} label="Semana" sub={`de ${user.weeklyGoal || 4} sesiones`} />
        <Ring value={week.reduce((a, h) => a + h.kcal, 0)} max={2000} label="Calorías" sub="quemadas" color="fire" />
        <Ring value={user.streak || 0} max={30} label="Racha" sub="días seguidos" />
      </div>
      {showWater && (<div className="card neu water"><div><p className="eyebrow">Agua · meta {(n.water / 1000).toFixed(1)} litros</p><h3>{user.water || 0} / 8 vasos</h3></div><div className="water-ctrl"><button className="btn-round neu" onClick={() => update({ water: Math.max(0, (user.water || 0) - 1) })}>−</button><button className="btn-round neu gold" onClick={() => { update({ water: Math.min(12, (user.water || 0) + 1) }); vibrate(15); }}>+</button></div><div className="bar neu-in"><i style={{ width: `${Math.min(100, ((user.water || 0) / 8) * 100)}%` }} /></div></div>)}
      <div className="segmented neu-in small">{['hombre', 'mujer'].map((p) => (<button key={p} className={`seg ${user.sex === p ? 'active' : ''}`} onClick={() => setSex(p)}>{p === 'hombre' ? 'Modo Hombre' : 'Modo Mujer'}</button>))}</div>
      <PlanCard user={user} update={update} onOpen={onOpen} onRegistro={onRegistro} settings={settings} />
      <div className="cat-scroll">
        {cats.map((c) => (
          <button key={c.id} className={`cat-item ${cat === c.id ? 'active' : ''}`} onClick={() => { setCat(c.id); vibrate(5); }}>
            <div className="cat-circle"><img src={IMG(c.img)} alt={c.label} loading="lazy" /></div><span>{c.label}</span>
          </button>
        ))}
      </div>
      <h2 className="section">{cat === 'todo' ? W(user, 'Tus rutinas largas', 'Tus rutinas para perder grasa') : `Rutinas: ${catObj.label}`}</h2>
      {cat !== 'todo' && cat !== 'diaria' && cat !== 'cara' && (woman || cat === 'abdomen' || cat === 'quema') && (
        <p className="note">La grasa se pierde en todo el cuerpo, no solo en una zona. Estas rutinas tonifican la zona: combínalas con <b>Quemar grasa</b> y tu plan de <b>Comida</b>.</p>
      )}
      <div className="routines">{list.map((r) => <RoutineCard key={r.id} r={r} onOpen={onOpen} settings={settings} />)}</div>
    </div>
  );
}

function Detail({ routine, onBack, onStart, settings }) {
  const r = applyCoach(routine, settings); const c = coachOf(settings);
  return (
    <div className="page">
      <div className="hero" style={{ backgroundImage: `url(${routine.image})` }}><button className="btn-round neu back" onClick={onBack}><ArrowLeft size={22} strokeWidth={2.5} /></button><div className="hero-txt"><p className="eyebrow">{routine.lvlText ? `${routine.lvlText} · ` : ''}{routine.muscles.join(' · ')}</p><h1>{routine.title}</h1></div></div>
      <div className="stats3"><div className="card neu"><b>{routineMinutes(r)}</b><small>minutos</small></div><div className="card neu"><b>{routine.kcal}</b><small>calorías</small></div><div className="card neu"><b>{routine.rounds}</b><small>{routine.rounds === 1 ? 'ronda' : 'rondas'}</small></div></div>
      <p className="note">Coach <b>{c.name}</b>: {c.desc} Cámbialo en Mío.</p>
      <h2 className="section">Plan de ejercicios</h2>
      {r.exercises.map((e, i) => (<div key={e.name + i} className="card neu ex"><div className="ex-num neu-in">{i + 1}</div><div className="ex-body"><h3>{e.name}</h3><p className="muted">{e.time} segundos de trabajo · {e.rest} segundos de descanso</p><ol>{e.steps?.map((s) => <li key={s}>{s}</li>)}</ol></div></div>))}
      <FormCheck /><button className="btn-primary" onClick={onStart}>⚔ ENTRAR AL PORTAL ({routineMinutes(r)} MIN)</button>
    </div>
  );
}

function FormCheck() {
  const [stream, setStream] = useState(null); const [rec, setRec] = useState(null); const [url, setUrl] = useState(null); const [err, setErr] = useState(''); const live = useRef(null);
  useEffect(() => { if (live.current && stream) live.current.srcObject = stream; }, [stream]);
  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);
  const open = async () => { try { setErr(''); setUrl(null); setStream(await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })); } catch { setErr('No se pudo abrir la cámara.'); } };
  const start = () => { const chunks = []; const r = new MediaRecorder(stream); r.ondataavailable = (e) => chunks.push(e.data); r.onstop = () => { setUrl(URL.createObjectURL(new Blob(chunks, { type: 'video/webm' }))); stream.getTracks().forEach((t) => t.stop()); setStream(null); }; r.start(); setRec(r); };
  const stop = () => { rec.stop(); setRec(null); };
  return (
    <div className="card neu formcheck">
      <div className="row"><div><p className="eyebrow">Revisa tu técnica</p><h3>Grábate entrenando</h3></div><Camera size={22} strokeWidth={2.5} /></div>
      <p className="muted">Revisa tu postura en cámara lenta.</p>
      {stream && <video ref={live} autoPlay muted playsInline className="video" />}{url && <video src={url} controls playsInline className="video" />}{err && <p className="danger">{err}</p>}
      <div className="row gap">{!stream && <button className="btn-ghost neu" onClick={open}>{url ? 'Grabar otra vez' : 'Abrir cámara'}</button>}{stream && !rec && <button className="btn-ghost neu gold" onClick={start}>● Grabar</button>}{rec && <button className="btn-ghost neu fire" onClick={stop}>■ Detener</button>}{url && <a className="btn-ghost neu" href={url} download="mi-tecnica.webm">Guardar</a>}</div>
    </div>
  );
}

function Player({ routine: base, settings, onExit, onFinish }) {
  const routine = applyCoach(base, settings); const c = coachOf(settings);
  const [idx, setIdx] = useState(0); const [round, setRound] = useState(1); const [resting, setResting] = useState(false);
  const [left, setLeft] = useState(routine.exercises[0].time); const [running, setRunning] = useState(false);
  const [preparing, setPreparing] = useState(true); const [reps, setReps] = useState(0);
  const ex = routine.exercises[idx]; const total = resting ? ex.rest : ex.time;

  useEffect(() => { if (running && !preparing) speak(resting ? restLine(settings, ex.name) : `¡Empieza! ${ex.name}.`, settings); }, [round, idx, resting, preparing]); // eslint-disable-line
  useEffect(() => { setReps(0); }, [idx, round]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      vibrate([120, 60, 120]);
      if (!resting && ex.rest > 0 && !(idx + 1 >= routine.exercises.length && round >= routine.rounds)) { setResting(true); setLeft(ex.rest); return; }
      if (idx + 1 >= routine.exercises.length) {
        if (round < routine.rounds) { setRound(round + 1); setIdx(0); setResting(false); setLeft(routine.exercises[0].time); speak(`¡Ronda ${round} completada! Ronda ${round + 1}.`, settings); return; }
        setRunning(false); speak(c.id === 'normal' ? '¡Entrenamiento completado! Excelente trabajo.' : '¡Mazmorra superada! El Sistema reconoce tu esfuerzo.', settings); onFinish(); return;
      }
      const nx = routine.exercises[idx + 1]; setIdx(idx + 1); setResting(false); setLeft(nx.time); return;
    }
    const t = setTimeout(() => {
      const el = total - left + 1;
      if (!resting) {
        const half = Math.floor(total / 2);
        if (el % 3 === 0) setReps((r) => r + 1);
        if (c.id !== 'normal' && (el === half || (c.id === 'monarca' && el === Math.floor(total * 0.8)))) speak(pushLine(settings, idx + round + el), settings);
        else if (left === 4) speak('Tres, dos, uno', settings);
        else if (el % 3 === 0) speak(`${Math.floor(el / 3)}`, settings);
      }
      setLeft((s) => s - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [running, left, resting, idx, round]); // eslint-disable-line

  const pct = Math.max(0, left / total); const C = 2 * Math.PI * 90;
  if (preparing) {
    return (
      <div className="page">
        <header className="head"><button className="btn-round neu" onClick={onExit}><ArrowLeft size={22} strokeWidth={2.5} /></button><p className="eyebrow">Cómo se hace</p><span className="pill">Coach {c.name}</span></header>
        <h1 className="player-title" style={{ marginTop: '20px', fontSize: '30px' }}>{ex.name}</h1>
        <div className="card glass" style={{ padding: '24px', marginTop: '10px' }}>
          <p className="eyebrow" style={{ marginBottom: '15px' }}>Sigue estos pasos:</p>
          <ol style={{ fontSize: '16px', lineHeight: 1.8, paddingLeft: '20px' }}>{ex.steps?.map((s, i) => (<li key={i} style={{ marginBottom: '10px', color: 'var(--text)' }}>{s}</li>))}</ol>
        </div>
        <p className="note">{c.desc}</p>
        <button className="btn-primary" style={{ marginTop: '10px', padding: '20px' }} onClick={() => { setPreparing(false); setRunning(true); vibrate(50); }}>¡LISTO, EMPEZAR!</button>
      </div>
    );
  }
  return (
    <div className="page player">
      <header className="head"><button className="btn-round neu" onClick={() => { window.speechSynthesis?.cancel(); onExit(); }}><ArrowLeft size={22} strokeWidth={2.5} /></button><p className="eyebrow">Ronda {round} de {routine.rounds}</p><span className="pill">{settings.voice ? '🔊' : '🔇'} Coach {c.name}</span></header>
      <h1 className="player-title" style={{ fontSize: '24px', textAlign: 'center', marginTop: '10px' }}>{resting ? 'Descanso' : ex.name}</h1>
      {resting && routine.exercises[idx + 1] && <p className="muted center">Siguiente: {routine.exercises[idx + 1].name}</p>}
      <div className="ring neu" style={{ marginTop: '20px' }}>
        <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" className="ring-bg" strokeWidth="10" /><circle cx="100" cy="100" r="90" className={`ring-fg ${resting ? 'fire' : 'gold'}`} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 100 100)" style={{ transition: 'stroke-dashoffset 1s linear' }} /></svg>
        <div className="ring-num" style={{ fontSize: '50px' }}>{Math.max(0, left)}<small>segundos</small></div>
      </div>
      {!resting && (<div style={{ textAlign: 'center', margin: '15px 0' }}><p className="eyebrow">Repeticiones estimadas</p><h2 style={{ fontSize: '32px', color: 'var(--accent)', fontWeight: 900 }}>{reps}</h2></div>)}
      {!resting && <div className="card glass" style={{ padding: '15px' }}><ol>{ex.steps?.map((s) => <li key={s}>{s}</li>)}</ol></div>}
      <div className="controls" style={{ marginTop: '20px' }}>
        <button className="btn-round big neu gold" onClick={() => setRunning(!running)}>{running ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}</button>
        <button className="btn-round big neu" onClick={() => setLeft(0)}><SkipForward size={26} fill="currentColor" /></button>
      </div>
    </div>
  );
}

const MEDAL_ICON = { flame: Flame, swords: Swords, scroll: ScrollText, clock: Clock, trophy: Trophy };

function Streak({ user, onStart }) {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const done = new Set((user.history || []).filter((h) => h.ts > Date.now() - 7 * 864e5).map((h) => (new Date(h.ts).getDay() + 6) % 7));
  const groups = medalState(user); const next = nextStreakMedal(user);
  const total = groups.reduce((a, g) => a + g.items.length, 0), earned = groups.reduce((a, g) => a + g.earned, 0);
  return (
    <div className="page">
      <h1 className="title">Rachas</h1>
      <SysWin title="RACHA ACTUAL">
        <div className="streak-top">
          <div className="flame-wrap neu"><svg viewBox="0 0 64 64" className="flame"><defs><linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="var(--fire)" /><stop offset="1" stopColor="var(--gold-1)" /></linearGradient></defs><path fill="url(#fl)" d="M32 4s16 14 16 32a16 16 0 0 1-32 0c0-8 5-12 5-12s1 7 6 7c0-12 5-27 5-27z" /></svg></div>
          <div><p className="streak-num">{user.streak || 0}</p><p className="streak-lbl">{user.streak === 1 ? 'día seguido' : 'días seguidos'} · récord {user.best || 0}</p></div>
        </div>
        <div className="week">{days.map((d, i) => <div key={d} className={`day ${done.has(i) ? 'done neu-in' : 'neu'}`}>{d}</div>)}</div>
        {next && <div className="next-m"><div className="row"><small>Próxima medalla: <b>{next.name}</b></small><small>{next.value}/{next.goal} días</small></div><div className="sys-bar"><i style={{ width: `${next.pct * 100}%` }} /></div></div>}
        <p className="sys-txt center">Medallas y trofeos: <b>{earned}/{total}</b></p>
      </SysWin>
      <button className="btn-primary" onClick={onStart}>EMPEZAR ENTRENAMIENTO</button>
      {groups.map((g) => { const GI = MEDAL_ICON[g.icon] || Trophy; return (
        <section key={g.id} className="md-group">
          <div className="md-head"><GI size={16} /><b>{g.title}</b><span>{g.earned}/{g.items.length}</span></div>
          <div className="md-grid">{g.items.map((m) => (
            <div key={m.id} className={`md-card ${m.done ? 'on' : ''} ${g.trophy ? 'trophy' : ''}`} style={{ '--tc': TIERS[m.tier].color }}>
              <div className="md-badge">{m.done ? <GI size={22} /> : <Lock size={16} />}</div>
              <b>{m.name}</b>
              {m.done ? <small className="md-tier">{TIERS[m.tier].name}</small> : <><small>{m.value}/{m.goal}{g.unit ? ` ${g.unit}` : ''}</small><div className="md-bar"><i style={{ width: `${m.pct * 100}%` }} /></div></>}
            </div>))}
          </div>
        </section>); })}
    </div>
  );
}

function Registro({ user, update }) {
  const [kg, setKg] = useState('');
  const w = (user.weights && user.weights.length) ? user.weights.map((x) => x.kg) : [user.weight];
  const CW = 320, H = 140, min = Math.min(...w) - 1, max = Math.max(...w) + 1;
  const pts = w.map((v, i) => [w.length === 1 ? CW / 2 : (i / (w.length - 1)) * CW, H - ((v - min) / (max - min)) * H]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const diff = +(w.at(-1) - w[0]).toFixed(1);
  const addWeight = () => { const v = parseFloat(kg); if (!v || v < 25 || v > 300) return; update({ weights: [...(user.weights || []), { d: today(), kg: v }].slice(-30), weight: v }); setKg(''); };
  const ws = weightStatus(user.weight, user.height); const waist = waistStatus(user.waist, user.sex);
  const L = WAIST_LIMITS[user.sex === 'mujer' ? 'mujer' : 'hombre']; const n = nutrition(user); const weeks = ws.kg > 0 && ws.id !== 'bajo' ? weeksToIdeal(ws.kg) : 0;
  const span = (L.high + 15) - (L.ok - 20);
  return (
    <div className="page">
      <h1 className="title">Registro</h1>
      <SysWin title={W(user, 'ESTADO DEL CAZADOR', 'ESTADO DE LA CAZADORA')}>
        <StatusLine s={ws} />
        <ColorBar segs={[['yellow', 14], ['green', 26], ['yellow', 20], ['red', 40]]} marker={bmiMarker(ws.bmi)} labels={['Bajo', 'Ideal', 'Sobrepeso', 'Obesidad']} />
        <div className="trio"><div><b>{user.weight} kg</b><small>Tu peso</small></div><div><b>{ws.range.min}–{ws.range.max}</b><small>Peso ideal (kg)</small></div><div><b>{ws.bmi}</b><small>Índice de masa</small></div></div>
        <p className="sys-txt">Calculado con tu altura de <b>{user.height} cm</b>. Cámbiala en Mío si no es correcta.</p>
        {weeks > 0 && <p className="sys-txt">▸ Bajando medio kilo por semana llegas a tu peso ideal en unas <b>{weeks} semanas</b>.</p>}
        <div className="sep" />
        <label className="field"><span>Mi cintura (cm, a la altura del ombligo)</span><input className="input neu-in" type="number" inputMode="decimal" placeholder="Ej: 90" value={user.waist || ''} onChange={(e) => update({ waist: Number(e.target.value) || 0 })} /></label>
        {waist ? (<><StatusLine s={{ ...waist, label: `${waist.label} · ${user.waist} cm` }} />
          <ColorBar segs={[['green', (20 / span) * 100], ['yellow', ((L.high - L.ok) / span) * 100], ['red', (15 / span) * 100]]} marker={waistMarker(user.waist, user.sex)} labels={['Sana', 'Alerta', 'Alta']} /></>)
          : <p className="sys-txt">▸ Anota tu cintura para ver si está en verde (menos de {L.ok} cm).</p>}
      </SysWin>
      <SysWin title="LO BÁSICO DE HOY">
        <div className="trio"><div><b>{(n.water / 1000).toFixed(1)} L</b><small>Agua al día</small></div><div><b>{n.kcal}</b><small>Calorías para {GOALS[user.goal]?.toLowerCase()}</small></div><div><b>{n.protein} g</b><small>Proteína al día</small></div></div>
        <p className="sys-txt">▸ Duerme 7 a 8 horas. Camina al menos 7.000 pasos. Pésate siempre en ayunas.</p>
      </SysWin>
      <SysWin title="REGISTRO DE PESO">
        <div className="row"><b className="kg-now">{w.at(-1)} kg</b><span className="pill">{diff === 0 ? 'Sin cambios' : diff < 0 ? `Bajaste ${Math.abs(diff)} kg` : `Subiste ${diff} kg`}</span></div>
        <svg viewBox={`0 0 ${CW} ${H + 10}`} className="chart"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--gold-1)" stopOpacity=".55" /><stop offset="1" stopColor="var(--gold-1)" stopOpacity="0" /></linearGradient><linearGradient id="stroke" x1="0" x2="1"><stop offset="0" stopColor="var(--gold-2)" /><stop offset="1" stopColor="var(--gold-1)" /></linearGradient></defs>{w.length > 1 && <path d={`${line} L${CW},${H} L0,${H} Z`} fill="url(#area)" />}<path d={line} fill="none" stroke="url(#stroke)" strokeWidth="3.5" strokeLinecap="round" />{pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4" className="dot" />)}</svg>
        <div className="row gap"><input className="input neu-in" type="number" inputMode="decimal" placeholder="Peso de hoy (kg)" value={kg} onChange={(e) => setKg(e.target.value)} /><button className="btn-ghost neu gold" onClick={addWeight}>Añadir</button></div>
      </SysWin>
      <div className="stats3"><div className="card neu"><b>{user.stats?.kcal || 0}</b><small>Calorías quemadas</small></div><div className="card neu"><b>{user.stats?.minutes || 0}</b><small>Minutos</small></div><div className="card neu"><b>{user.stats?.exercises || 0}</b><small>Ejercicios</small></div></div>
    </div>
  );
}

function Nutrition({ user, update }) {
  const n = nutrition(user);
  const [foodName, setFoodName] = useState(''); const [grams, setGrams] = useState('100');
  const macro = [['Proteína', n.protein, 4, 'gold'], ['Carbohidratos', n.carbs, 4, 'fire'], ['Grasas', n.fat, 9, 'silver']];
  const totalConsumed = (user.foodLog || []).reduce((acc, f) => acc + f.kcal, 0); const remaining = n.kcal - totalConsumed;
  const addFood = () => {
    const key = foodName.toLowerCase().trim(); const food = FOOD_DB[key];
    if (!food) return alert(`Alimento no encontrado. Prueba: ${Object.keys(FOOD_DB).join(', ')}.`);
    const m = parseFloat(grams) / 100;
    const log = { id: Date.now(), name: key, grams: parseFloat(grams), kcal: Math.round(food.kcal * m), carbs: Math.round(food.carbs * m), protein: Math.round(food.protein * m), fat: Math.round(food.fat * m) };
    update({ foodLog: [...(user.foodLog || []), log] }); setFoodName('');
  };
  return (
    <div className="page">
      <h1 className="title">Comida</h1>
      <div className="segmented neu-in small">{Object.entries(GOALS).map(([k, l]) => (<button key={k} className={`seg ${user.goal === k ? 'active' : ''}`} onClick={() => update({ goal: k })}>{l}</button>))}</div>
      {user.sex === 'mujer' && user.goal !== 'perder' && <p className="note">Tu plan de mujer está pensado para <b>perder grasa</b>. Elige "Perder grasa" para que las calorías te ayuden.</p>}
      <div className="card glass center"><p className="eyebrow">Calorías de hoy para {user.name}</p><h1 className="kcal" style={{ color: remaining < 0 ? 'var(--fire)' : 'var(--gold-1)' }}>{remaining} <small>te quedan</small></h1><p className="muted">Meta: {n.kcal} · Comido: {totalConsumed}</p><div className="bar neu-in" style={{ marginTop: '10px' }}><i style={{ width: `${Math.min(100, (totalConsumed / n.kcal) * 100)}%`, background: remaining < 0 ? 'var(--fire)' : 'var(--gold-1)' }} /></div></div>
      <div className="card neu"><p className="eyebrow">Añadir comida</p><div className="row gap"><input className="input neu-in" placeholder="Ej: pollo, arroz…" value={foodName} onChange={(e) => setFoodName(e.target.value)} /><input className="input neu-in" style={{ maxWidth: '90px' }} type="number" value={grams} onChange={(e) => setGrams(e.target.value)} /><button className="btn-ghost neu gold" onClick={addFood}>+</button></div><p className="muted" style={{ marginTop: 6 }}>Escribe el alimento y los gramos.</p>
        <div className="food-list">{(user.foodLog || []).length === 0 && <p className="muted center">No has comido nada aún hoy.</p>}{(user.foodLog || []).map((f) => (<div key={f.id} className="food-item"><div><b>{f.name}</b> <small>({f.grams} gramos)</small></div><div className="muted" style={{ fontSize: '11px' }}>Carbohidratos {f.carbs} g · Proteína {f.protein} g · Grasa {f.fat} g</div><b className="accent">{f.kcal} calorías</b></div>))}</div>
        <button className="btn-ghost neu danger" style={{ width: '100%', marginTop: 12 }} onClick={() => update({ foodLog: [] })}>Borrar registro de hoy</button></div>
      {macro.map(([l, g, k, c]) => (<div key={l} className="card neu macro"><div className="row"><b>{l}</b><span className="accent">{g} gramos</span></div><div className="bar neu-in"><i className={c} style={{ width: `${Math.round(((g * k) / n.kcal) * 100)}%` }} /></div><small className="muted">{Math.round(((g * k) / n.kcal) * 100)}% de las calorías</small></div>))}
    </div>
  );
}

function Reminders({ user, settings, setSettings, toast }) {
  const rem = { ...defaultReminders(), ...(settings.rem || {}) };
  const set = (p) => setSettings({ ...settings, rem: { ...rem, ...p } });
  const [perm, setPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'no');
  const ask = async () => { const p = await setupNotifications(); setPerm(p); return p; };
  const woman = user.sex === 'mujer';
  return (
    <div className="card neu rem">
      <div className="row"><span className="rem-t"><Bell size={18} /> Recordatorios de entrenamiento</span><Toggle on={rem.on} onChange={async (v) => { if (v) await ask(); set({ on: v }); }} /></div>
      <p className="muted">Días para entrenar:</p>
      <div className="chips">{DAYS.map(([l, n]) => <button key={l} className={`chip day-chip ${rem.days.includes(n) ? 'on' : ''}`} onClick={() => set({ days: rem.days.includes(n) ? rem.days.filter((d) => d !== n) : [...rem.days, n] })}>{l}</button>)}</div>
      <label className="field"><span>Hora del entrenamiento</span><input className="input neu-in" type="time" value={rem.time} onChange={(e) => set({ time: e.target.value })} /></label>
      <div className="row" style={{ marginTop: 10 }}><span>Avisarme si falta la misión diaria</span><Toggle on={rem.questOn} onChange={async (v) => { if (v) await ask(); set({ questOn: v }); }} /></div>
      {rem.questOn && <label className="field"><span>Hora del aviso de misión</span><input className="input neu-in" type="time" value={rem.questTime} onChange={(e) => set({ questTime: e.target.value })} /></label>}
      <div className="row gap">
        <button className="btn-ghost neu gold" onClick={() => { downloadICS(rem, user.name, woman); toast('Abre el archivo descargado para guardarlo en tu calendario'); }}><CalendarPlus size={14} /> Añadir a mi calendario</button>
        <button className="btn-ghost neu" onClick={async () => { const p = perm === 'granted' ? 'granted' : await ask(); if (p === 'granted') notify('[SISTEMA] Prueba de aviso', `Así te avisaré, ${woman ? 'cazadora' : 'cazador'}.`); else toast('Debes permitir las notificaciones en tu navegador'); }}>Probar aviso</button>
      </div>
      <p className="muted rem-n">{perm === 'denied' ? '⚠ Las notificaciones están bloqueadas. Actívalas en los ajustes del navegador.' : perm === 'no' ? '⚠ Este navegador no permite notificaciones. Usa "Añadir a mi calendario".' : 'Los avisos del teléfono llegan con la app abierta o en segundo plano. Para que te avise aunque la cierres, toca "Añadir a mi calendario": tu calendario sonará a la hora elegida.'}</p>
    </div>
  );
}

function Mine({ user, update, setSex, settings, setSettings, onReset, toast }) {
  const set = (k) => (v) => setSettings({ ...settings, [k]: v });
  const num = (k) => ({ type: 'number', value: user[k], onChange: (e) => update({ [k]: Number(e.target.value) || 0 }) });
  const c = coachOf(settings);
  return (
    <div className="page">
      <h1 className="title">Mío</h1>
      <div className="card neu profile"><div className="avatar neu-in">{(user.name || 'U').slice(0, 2).toUpperCase()}</div><input className="input neu-in grow" value={user.name} onChange={(e) => update({ name: e.target.value.slice(0, 16) || ' ' })} /></div>
      <div className="card neu grid3">
        <label className="field"><span>Edad</span><input className="input neu-in" {...num('age')} /></label>
        <label className="field"><span>Altura (cm)</span><input className="input neu-in" {...num('height')} /></label>
        <label className="field"><span>Peso (kg)</span><input className="input neu-in" {...num('weight')} /></label>
      </div>
      <div className="card neu setting col">
        <span>Sexo (adapta rutinas, misiones y metas)</span>
        <div className="segmented neu-in small full">{['hombre', 'mujer'].map((p) => <button key={p} className={`seg ${user.sex === p ? 'active' : ''}`} onClick={() => setSex(p)}>{p === 'hombre' ? 'Hombre' : 'Mujer'}</button>)}</div>
        <span style={{ marginTop: 6 }}>Dureza del coach</span>
        <div className="chips">{Object.values(COACH).map((k) => <button key={k.id} className={`chip ${c.id === k.id ? 'on' : ''}`} onClick={() => setSettings({ ...settings, coach: k.id })}>{k.name}</button>)}</div>
        <p className="muted">{c.desc}</p>
      </div>
      <div className="card neu setting col">
        <span>Meta semanal (días a entrenar)</span>
        <input className="input neu-in" type="number" min="1" max="7" value={user.weeklyGoal || 4} onChange={(e) => update({ weeklyGoal: Number(e.target.value) })} />
      </div>
      <Reminders user={user} settings={settings} setSettings={setSettings} toast={toast} />
      <div className="card neu setting col">
        <div className="row" style={{ width: '100%' }}><span>Voz del coach</span><Toggle on={settings.voice} onChange={set('voice')} /></div>
        <div style={{ width: '100%', marginTop: '10px' }}>
          <p className="eyebrow">Velocidad de la voz: {settings.voiceRate?.toFixed(1) || '1.0'}x</p>
          <input type="range" min="0.5" max="1.5" step="0.1" value={settings.voiceRate || 1.0} onChange={(e) => setSettings({ ...settings, voiceRate: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--gold-1)' }} />
        </div>
      </div>
      <div className="card neu setting"><span>Modo oscuro</span><Toggle on={settings.dark} onChange={set('dark')} /></div>
      <div className="card neu setting"><span>Seguimiento de agua</span><Toggle on={settings.showWater} onChange={set('showWater')} /></div>
      <Backup />
      <button className="card neu setting danger" onClick={() => confirm(`¿Reiniciar el progreso de ${user.name}?`) && onReset()}><span>Reiniciar progreso</span><span>›</span></button>
    </div>
  );
}
function Toggle({ on, onChange }) { return <button className={`toggle neu-in ${on ? 'on' : ''}`} onClick={() => onChange(!on)}><i /></button>; }

function Toast({ message }) { if (!message) return null; return (<div className="sys-toast"><b>!</b>{message}</div>); }

export default function App() {
  const [tab, setTab] = useState('home');
  const [users, setUsers] = usePersist('fp.users', { yo: newUser('Yo', 'hombre'), pareja: newUser('Pareja', 'mujer') });
  const [active, setActive] = usePersist('fp.active', 'yo');
  const [settings, setSettings] = usePersist('fp.settings', { dark: true, showWater: true, voice: true, voiceRate: 1.0, coach: 'duro', rem: defaultReminders() });
  const [fired, setFired] = usePersist('fp.fired', {});
  const [routine, setRoutine] = useState(null); const [playing, setPlaying] = useState(false); const [toast, setToast] = useState('');

  const user = { ...newUser('Yo', 'hombre'), ...(users[active] || {}) };
  const update = (patch) => setUsers((all) => ({ ...all, [active]: { ...newUser('Yo', 'hombre'), ...(all[active] || {}), ...patch } }));
  const setSex = (sex) => { update({ sex, goal: sex === 'mujer' ? 'perder' : user.goal, zones: user.zones?.length ? user.zones : ['cintura', 'piernas'] }); vibrate(10); };

  useEffect(() => { document.documentElement.dataset.theme = settings.dark ? 'dark' : 'light'; }, [settings.dark]);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  // Recordatorios: revisa cada 30 segundos
  const questPending = !hu(user).quest.claimed;
  useEffect(() => {
    const rem = { ...defaultReminders(), ...(settings.rem || {}) };
    if (!rem.on && !rem.questOn) return;
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') setupNotifications();
    const tick = () => {
      const due = dueReminders(rem, new Date(), fired, questPending);
      if (!due.length) return;
      const woman = user.sex === 'mujer';
      due.forEach((k) => k === 'train'
        ? notify('[SISTEMA] Hora de entrenar', `${user.name}, el portal está abierto. ¡Entra ahora, ${woman ? 'cazadora' : 'cazador'}!`)
        : notify('[SISTEMA] Misión diaria pendiente', 'Complétala antes de medianoche o recibirás una penalización.'));
      const d = today(); setFired((f) => ({ ...f, ...Object.fromEntries(due.map((k) => [k, d])) }));
    };
    tick(); const t = setInterval(tick, 30000); return () => clearInterval(t);
  }, [settings.rem, fired, questPending, user.name, user.sex]); // eslint-disable-line

  const finish = () => {
    const t = today(), y = new Date(Date.now() - 864e5).toDateString();
    const streak = user.lastDay === t ? user.streak : user.lastDay === y ? user.streak + 1 : 1;
    const muscles = { ...(user.muscles || {}) }; routine.muscles.forEach((m) => { muscles[m] = Date.now(); });
    const r = applyCoach(routine, settings); const mins = routineMinutes(r); const gained = mins * 10 + 50;
    const patch = { xp: (user.xp || 0) + gained, streak, best: Math.max(user.best || 0, streak), lastDay: t, muscles, stats: { kcal: (user.stats?.kcal || 0) + routine.kcal, minutes: (user.stats?.minutes || 0) + mins, exercises: (user.stats?.exercises || 0) + (routine.exercises.length * routine.rounds) }, history: [...(user.history || []), { ts: Date.now(), title: routine.title, kcal: routine.kcal }].slice(-200) };
    if (routine.mission) {
      const h = hu(user); const counts = { ...(h.quest.counts || {}) };
      routine.exercises.forEach((e) => { counts[e.missionId] = (counts[e.missionId] || 0) + e.add; });
      patch.hunter = { ...h, quest: { ...h.quest, counts } };
    }
    update(patch);
    setPlaying(false); setRoutine(null); setTab('system'); showToast(`[SISTEMA] Mazmorra superada · +${gained} EXPERIENCIA`);
  };
  const reset = () => { update({ ...newUser(user.name, user.sex) }); showToast('Progreso reiniciado'); };

  let view;
  if (routine && playing) view = <Player routine={routine} settings={settings} onExit={() => setPlaying(false)} onFinish={finish} />;
  else if (routine) view = <Detail routine={routine} settings={settings} onBack={() => setRoutine(null)} onStart={() => setPlaying(true)} />;
  else if (tab === 'streak') view = <Streak user={user} onStart={() => setRoutine(todayRoutine(user))} />;
  else if (tab === 'system') view = <Status user={user} update={update} settings={settings} onStreak={() => setTab('streak')} onMission={(items) => setRoutine(missionRoutine(items, user))} />;
  else if (tab === 'gym') view = <Gym user={user} update={update} toast={showToast} />;
  else if (tab === 'rank') view = <Symmetry user={user} update={update} onReport={() => setTab('report')} />;
  else if (tab === 'report') view = <Registro user={user} update={update} />;
  else if (tab === 'food') view = <Nutrition user={user} update={update} />;
  else if (tab === 'mine') view = <Mine user={user} update={update} setSex={setSex} settings={settings} setSettings={setSettings} onReset={reset} toast={showToast} />;
  else view = <Home users={users} active={active} setActive={setActive} user={user} update={update} setSex={setSex} showWater={settings.showWater} onOpen={setRoutine} onRegistro={() => setTab('report')} settings={settings} />;

  const tabs = [['home', 'Inicio', IconHome], ['system', 'Sistema', ScrollText], ['gym', 'Gym', Swords], ['rank', 'Rango', Crown], ['food', 'Comida', Apple], ['mine', 'Mío', User]];
  return (
    <div className="app">
      <Toast message={toast} />
      <HunterWatcher user={user} update={update} />
      <main className="scroll">{view}</main>
      {!playing && (<nav className="tabbar glass">{tabs.map(([id, label, IconComponent]) => (<button key={id} className={`tab ${(tab === id || (id === 'rank' && tab === 'report') || (id === 'system' && tab === 'streak')) && !routine ? 'active' : ''}`} onClick={() => { setRoutine(null); setTab(id); vibrate(8); }}><IconComponent size={22} strokeWidth={2.5} /><span>{label}</span></button>))}</nav>)}
    </div>
  );
}
