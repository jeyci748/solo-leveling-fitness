// @ts-nocheck
// Copia de seguridad: exporta / importa todos tus datos
export function Backup() {
  const exp = () => {
    const data = {}; Object.keys(localStorage).filter((k) => k.startsWith('fp.')).forEach((k) => { data[k] = localStorage.getItem(k); });
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
    a.download = `fitpro-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  };
  const imp = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    f.text().then((t) => { try { Object.entries(JSON.parse(t)).forEach(([k, v]) => k.startsWith('fp.') && localStorage.setItem(k, v)); location.reload(); } catch { alert('Archivo no válido'); } });
  };
  return (
    <div className="card neu"><p className="eyebrow">Copia de seguridad</p>
      <div className="row gap"><button className="btn-ghost neu gold" onClick={exp}>Exportar datos</button>
        <label className="btn-ghost neu">Importar<input type="file" accept="application/json" hidden onChange={imp} /></label></div></div>
  );
}
