// @ts-nocheck
// Mapa corporal frontal y posterior coloreado por rango (estilo Symmetry)
const D = {
  delt: 'M74 58C62 58 54 66 52 80c0 8 2 14 4 18 6-8 14-16 24-24 2-8 0-14-6-16z',
  pec: 'M98 62L80 64c-8 6-14 16-14 28 6 10 20 14 32 10z',
  arm: 'M54 100c-6 10-8 24-6 36 6 2 12-2 14-10 2-10 0-20-4-26z',
  fore: 'M48 140c-6 14-8 30-6 44 4 2 8 0 10-4 4-14 8-28 8-40z',
  obl: 'M70 104c4 16 6 36 12 66l2-60z',
  absLow: 'M86 162h12v22c-6 0-12-6-12-12z',
  quad: 'M98 186c-10-2-20 4-24 18-4 22-2 46 4 64 6 4 14 2 18-4 4-24 4-54 2-78z',
  shin: 'M78 286c-4 14-4 32 0 50 4 4 10 4 12 0 4-18 4-36 2-50z',
  trap: 'M100 52l-16 4c-6 2-8 6-4 10 8 4 16 8 20 14z',
  lat: 'M98 82c-8-6-16-10-20-6-8 14-8 34 0 54 8 6 16 8 20 10z',
  glute: 'M98 168c-12-2-22 4-24 18 0 14 10 22 24 20z',
  ham: 'M98 210c-10 0-20 4-22 16-2 18 2 34 8 44 6 2 12-2 14-8z',
  calf: 'M78 284c-6 12-6 28 0 42 6 4 12 2 14-6 2-14 0-28-4-36z',
};
const Base = () => (<><ellipse cx="100" cy="28" rx="17" ry="21" className="bm-base" /><path d="M92 46h16v12H92z" className="bm-base" /></>);
const Side = ({ children }) => (<><g>{children}</g><g transform="matrix(-1 0 0 1 200 0)">{children}</g></>);

export function BodyMap({ muscles }) {
  const c = Object.fromEntries(muscles.map((m) => [m.id, m.trained ? `bm r-${m.rank.id}` : 'bm off']));
  const n = 'bm-base';
  return (
    <div className="bodymap">
      <figure><svg viewBox="0 0 200 360"><Base /><Side>
        <path d={D.delt} className={c.hombros} /><path d={D.pec} className={c.pecho} /><path d={D.arm} className={c.biceps} />
        <path d={D.fore} className={n} /><ellipse cx="44" cy="194" rx="6" ry="9" className={n} />
        <rect x="86" y="108" width="12" height="15" rx="4" className={c.abdomen} /><rect x="86" y="126" width="12" height="15" rx="4" className={c.abdomen} />
        <rect x="86" y="144" width="12" height="15" rx="4" className={c.abdomen} /><path d={D.absLow} className={c.abdomen} /><path d={D.obl} className={c.abdomen} />
        <path d={D.quad} className={c.cuadriceps} /><ellipse cx="86" cy="278" rx="9" ry="6" className={n} />
        <path d={D.shin} className={c.gemelos} /><ellipse cx="86" cy="348" rx="9" ry="5" className={n} />
      </Side></svg><figcaption>FRONTAL</figcaption></figure>
      <figure><svg viewBox="0 0 200 360"><Base /><Side>
        <path d={D.trap} className={c.espalda} /><path d={D.delt} className={c.hombros} /><path d={D.lat} className={c.espalda} />
        <rect x="88" y="142" width="10" height="24" rx="4" className={c.espalda} /><path d={D.arm} className={c.triceps} />
        <path d={D.fore} className={n} /><ellipse cx="44" cy="194" rx="6" ry="9" className={n} />
        <path d={D.glute} className={c.gluteos} /><path d={D.ham} className={c.isquios} />
        <path d={D.calf} className={c.gemelos} /><ellipse cx="86" cy="348" rx="9" ry="5" className={n} />
      </Side></svg><figcaption>POSTERIOR</figcaption></figure>
    </div>
  );
}
