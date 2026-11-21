// @ts-nocheck
import { useEffect, useState } from 'react';
import { levelInfo, hunterRank, hu, today, SHADOWS } from './hunter';
import { symmetry } from './lifts';

export function SysWin({ title = 'NOTIFICACIÓN', tone = '', className = '', children }) {
  return (
    <div className={`sys ${tone} ${className}`}>
      <i className="sys-c tl" /><i className="sys-c tr" /><i className="sys-c bl" /><i className="sys-c br" />
      <div className="sys-head"><span className="sys-ico">!</span><b>{title}</b></div>
      <div className="sys-body">{children}</div>
    </div>
  );
}

export function HunterChip({ user }) {
  const { lv } = levelInfo(user.xp); const r = hunterRank(lv);
  return <div className={`hchip r-${r.id}`}><b>{r.id}</b><span>NIVEL {lv}</span></div>;
}

// Vigila nivel, sombras y misión diaria. Muestra "Subiste de nivel" y "ARISE".
export function HunterWatcher({ user, update }) {
  const [queue, setQueue] = useState([]);
  const h = hu(user); const { lv } = levelInfo(user.xp);
  const sym = symmetry(user);
  const unlocked = SHADOWS.filter((s) => s.test(user, sym)).map((s) => s.id);
  const fresh = unlocked.find((id) => !h.shadows.includes(id));
  const push = (item) => { navigator.vibrate?.([80, 40, 160]); setQueue((q) => (q.some((x) => x.key === item.key) ? q : [...q, item])); };

  useEffect(() => {
    if (user.xp === undefined) {
      const xp = (user.stats?.minutes || 0) * 10 + (user.history || []).length * 50;
      update({ xp, hunter: { ...h, lvSeen: levelInfo(xp).lv, shadows: unlocked, quest: { day: today(), counts: {}, claimed: false } } });
      return;
    }
    const patch = {};
    if (h.quest.day !== today()) {
      const y = new Date(Date.now() - 864e5).toDateString();
      patch.quest = { day: today(), counts: {}, claimed: false };
      if (h.quest.day === y && !h.quest.claimed) patch.penalty = true;
    }
    if (lv > h.lvSeen) {
      patch.lvSeen = lv; patch.points = h.points + (lv - h.lvSeen) * 3;
      push({ key: `lv${lv}`, type: 'lv', from: h.lvSeen, to: lv });
    } else if (fresh) {
      patch.shadows = [...h.shadows, fresh];
      push({ key: fresh, type: 'arise', s: SHADOWS.find((s) => s.id === fresh) });
    }
    if (Object.keys(patch).length) update({ hunter: { ...h, ...patch } });
  }, [user.xp, lv, h.lvSeen, fresh, h.quest.day]); // eslint-disable-line

  const cur = queue[0]; const close = () => setQueue((q) => q.slice(1));
  if (!cur) return null;
  if (cur.type === 'lv') return (
    <div className="sys-overlay" onClick={close}>
      <SysWin className="pop">
        <p className="sys-big">¡HAS SUBIDO DE NIVEL!</p>
        <p className="sys-lv"><span>{cur.from}</span> → <b>{cur.to}</b></p>
        <p className="sys-txt center">Recompensa: +{(cur.to - cur.from) * 3} puntos de estadística</p>
        <button className="sys-btn">ACEPTAR</button>
      </SysWin>
    </div>
  );
  return (
    <div className="arise-overlay" onClick={close}>
      <div className="arise-smoke" />
      <p className="arise-word">ARISE</p>
      <div className="arise-icon">{cur.s.icon}</div>
      <h2>{cur.s.name}</h2>
      <p className="sys-txt">{cur.s.role} se ha unido a tu ejército de sombras.</p>
      <button className="sys-btn">LEVÁNTATE</button>
    </div>
  );
}
