// @ts-nocheck
import { levelInfo, hunterRank, hunterTitle, hunterStats, hu, SHADOWS } from './hunter';
import { symmetry } from './lifts';
import { SysWin } from './System';
import { Quest } from './Quest';

function Heatmap({ user }) {
  const cnt = {}; (user.history || []).forEach((x) => { const k = new Date(x.ts).toDateString(); cnt[k] = (cnt[k] || 0) + 1; });
  const s = new Date(); s.setHours(0, 0, 0, 0); s.setDate(s.getDate() - ((s.getDay() + 6) % 7) - 28);
  const now = new Date(), t = now.toDateString();
  const days = Array.from({ length: 35 }, (_, i) => { const d = new Date(s); d.setDate(s.getDate() + i); return d; });
  return (
    <SysWin title="REGISTRO DE ACTIVIDAD">
      <div className="heat">{['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => <small key={d}>{d}</small>)}
        {days.map((d) => { const k = d.toDateString(), c = cnt[k] || 0; return <i key={k} className={`${c > 1 ? 'l2' : c ? 'l1' : ''} ${k === t ? 'now' : ''} ${d > now ? 'fut' : ''}`} />; })}
      </div>
      <p className="sys-txt">{Object.keys(cnt).length} días de actividad registrados</p>
    </SysWin>
  );
}

export default function Status({ user, update, onStreak, settings, onMission }) {
  const L = levelInfo(user.xp), r = hunterRank(L.lv), h = hu(user);
  const st = hunterStats(user, symmetry(user).overall); const g = (k) => st.find((x) => x.k === k).total;
  const todayN = (user.history || []).filter((x) => new Date(x.ts).toDateString() === new Date().toDateString()).length;
  const add = (k) => { if (h.points < 1) return; navigator.vibrate?.(10); update({ hunter: { ...h, points: h.points - 1, stats: { ...h.stats, [k]: (h.stats[k] || 0) + 1 } } }); };
  return (
    <div className="page">
      <div className="row"><h1 className="title">Sistema</h1><button className="btn-ghost neu gold" onClick={onStreak}>🔥 Rachas · {user.streak || 0} días</button></div>
      <SysWin title="ESTADO">
        <div className="st-top">
          <div className={`st-rank r-${r.id}`}><b>{r.id}</b><small>RANGO</small></div>
          <div><p className="st-name">{user.name}</p><p className="st-sub">NIVEL <b>{L.lv}</b></p><p className="st-sub">TÍTULO: <b>{hunterTitle(L.lv, user.sex)}</b></p><p className="st-sub">OFICIO: <b>{user.sex === 'mujer' ? 'Cazadora' : 'Cazador'}</b></p></div>
        </div>
        <div className="st-xp"><div className="row"><small>EXPERIENCIA</small><small>{L.cur} / {L.need}</small></div><div className="sys-bar"><i style={{ width: `${L.pct * 100}%` }} /></div></div>
        <div className="st-vitals"><div><small>VIDA</small><b>{100 + g('vit') * 10}</b></div><div><small>ENERGÍA</small><b>{50 + g('int') * 10}</b></div><div><small>CANSANCIO</small><b>{Math.min(100, todayN * 35)}</b></div></div>
        <div className="st-grid">{st.map((s) => (
          <div key={s.k} className="st-stat"><span>{s.ab}</span><b>{s.total}</b>{s.bonus > 0 && <small>+{s.bonus}</small>}
            {h.points > 0 && <button className="st-plus" onClick={() => add(s.k)}>+</button>}</div>))}
        </div>
        <p className="sys-txt">Puntos disponibles: <b>{h.points}</b></p>
      </SysWin>
      <Quest user={user} update={update} settings={settings} onMission={onMission} />
      <Heatmap user={user} />
      <SysWin title="EJÉRCITO DE SOMBRAS">
        <div className="shadows">{SHADOWS.map((s) => { const ok = h.shadows.includes(s.id); return (
          <div key={s.id} className={`shadow ${ok ? 'on' : ''}`}><span>{ok ? s.icon : '?'}</span><b>{ok ? s.name : '???'}</b><small>{ok ? s.role : s.desc}</small></div>); })}
        </div>
      </SysWin>
    </div>
  );
}
