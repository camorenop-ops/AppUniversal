import { Icon } from "./Icon";
import { useApp } from "../context/AppContext";

export function Row({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="row">
      <span style={{ color: "var(--muted)" }}><Icon name={icon} size={17} /></span>
      <span className="label">{label}</span>
      <span style={{ color: "var(--text-muted)" }}><Icon name="chevronright" size={15} /></span>
    </div>
  );
}

export function AddRow({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="add-row">
      <span style={{ color: "var(--accent)" }}><Icon name={icon} size={15} /></span>
      <span className="label">{label}</span>
    </div>
  );
}

export function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>;
}

export function BackHeader({ title }) {
  const { goBack } = useApp();
  return (
    <div className="back-header">
      <span onClick={goBack}><Icon name="arrowleft" size={18} /></span>
      <span>{title}</span>
    </div>
  );
}

export function Pill({ label, on, onClick }) {
  return <span onClick={onClick} className={"pill" + (on ? " on" : "")}>{label}</span>;
}

export function FilialTab({ icon, label, on, onClick }) {
  return (
    <div onClick={onClick} className={"filial-tab" + (on ? " on" : "")}>
      <Icon name={icon} size={22} />
      <span>{label}</span>
    </div>
  );
}

export function Chip({ label, on, onClick }) {
  return <span onClick={onClick} className={"chip" + (on ? " on" : "")}>{label}</span>;
}

export function Card({ children, style }) {
  return <div className="card" style={style}>{children}</div>;
}

export function InfoCard({ icon, name, rows }) {
  return (
    <div className="card">
      <Icon name={icon} size={22} color="var(--accent)" />
      <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>{name}</div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>
          <span>{r[0]}</span>
          <span style={{ color: "#1a1f2b", fontWeight: 600 }}>{r[1]}</span>
        </div>
      ))}
    </div>
  );
}

export function CoverageLine({ item }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
      <span>{item[0]}</span>
      <span style={{ fontWeight: 600, color: "var(--accent)" }}>{item[1]}</span>
    </div>
  );
}

export function MapMock({ pins }) {
  return (
    <div className="map-mock">
      {pins.map((p, i) => (
        <div key={i} className="map-pin" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <Icon name="mappin" size={p.primary ? 26 : 20} color={p.primary ? "var(--accent)" : "var(--danger)"} />
          <div className="tag">{p.label}</div>
        </div>
      ))}
    </div>
  );
}

export function MapPicker({ pin, onPick }) {
  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onPick({ x, y });
  }
  return (
    <div className="map-mock" onClick={handleClick} style={{ cursor: "crosshair" }}>
      {pin && (
        <div className="map-pin" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
          <Icon name="mappin" size={26} color="var(--accent)" />
          <div className="tag">{pin.label || "Ubicación seleccionada"}</div>
        </div>
      )}
    </div>
  );
}

export function AdsStrip({ ads, onSelect }) {
  return (
    <div className="ads-strip">
      {ads.map((a, i) => {
        const style = a.img
          ? { backgroundImage: `url(${a.img})` }
          : { background: "linear-gradient(135deg,var(--navy),var(--accent))" };
        return (
          <div key={i} className="ad-card" style={style} onClick={() => onSelect(a.t)}>
            <div className="overlay">
              <div className="tag">{a.tag}</div>
              <div className="t">{a.t}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Tile({ product, onClick, onCotizar }) {
  const off = product.noContratado;
  return (
    <div onClick={onClick} className={"tile" + (off ? " off" : "")}>
      <Icon name={product.icon} size={20} color={off ? "var(--text-muted)" : "var(--accent)"} />
      <div className="l">{product.label}</div>
      <div className="s">{product.sub}</div>
      {onCotizar && (
        <div
          onClick={(e) => { e.stopPropagation(); onCotizar(product.key); }}
          className="cotizar-row"
        >
          <Icon name="plus" size={12} color="var(--accent)" />
          <span>Cotizar</span>
        </div>
      )}
    </div>
  );
}

export function QuickAction({ icon, label, onClick }) {
  return (
    <div onClick={onClick} className="qa-item">
      <div className="qa-icon"><Icon name={icon} size={19} color="var(--accent)" /></div>
      <div className="qa-label">{label}</div>
    </div>
  );
}

export function QuickActionsRow({ items }) {
  return (
    <div className="qa-row">
      {items.map((it, i) => <QuickAction key={i} icon={it[0]} label={it[1]} onClick={it[2]} />)}
    </div>
  );
}

export function CaptureCard({ label, captured, onClick }) {
  return (
    <div onClick={onClick} className="capture-card">
      <Icon name={captured ? "circlecheck" : "camera"} size={24} color={captured ? "var(--success-text)" : "var(--accent)"} />
      <div style={{ fontSize: 12.5, marginTop: 6, color: captured ? "var(--success-text)" : "var(--accent)", fontWeight: 600 }}>
        {captured ? `${label} cargada` : label}
      </div>
    </div>
  );
}

export function Progress({ pasoActual }) {
  return (
    <div className="progress">
      {[1, 2, 3, 4].map((n) => <div key={n} className={n <= pasoActual ? "on" : ""} />)}
    </div>
  );
}

export function MetodoPagoRow({ icon, label, on, onClick }) {
  return (
    <div
      onClick={onClick}
      className="row"
      style={{ background: on ? "var(--ice)" : "transparent", borderRadius: 10, border: `1px solid ${on ? "var(--accent)" : "transparent"}`, padding: "9px 8px" }}
    >
      <span style={{ color: on ? "var(--accent)" : "var(--muted)" }}><Icon name={icon} size={17} /></span>
      <span className="label" style={{ color: on ? "var(--accent)" : "#1a1f2b", fontWeight: on ? 600 : 400 }}>{label}</span>
      {on && <Icon name="circlecheck" size={16} color="var(--accent)" />}
    </div>
  );
}

export function StepNav({ onBack, onForward, forwardLabel, disabled }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      <button onClick={onBack} style={{ flex: 1 }}>Atrás</button>
      <button className="solid" onClick={onForward} disabled={disabled} style={{ flex: 2 }}>{forwardLabel}</button>
    </div>
  );
}

const ESTADO_COLORS = {
  "Aprobado": ["var(--success-bg)", "var(--success-text)"],
  "Aprobada": ["var(--success-bg)", "var(--success-text)"],
  "En revisión": ["#EEF1F6", "var(--muted)"],
  "Rechazado": ["rgba(140,47,29,0.12)", "var(--danger)"],
  "Rechazada": ["rgba(140,47,29,0.12)", "var(--danger)"],
};

export function EstadoBadge({ estado }) {
  const c = ESTADO_COLORS[estado] || ["#EEF1F6", "var(--muted)"];
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, background: c[0], color: c[1], whiteSpace: "nowrap" }}>
      {estado}
    </span>
  );
}

function checkVal(v) {
  if (v === "Sí") return <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700 }}>✓</span>;
  if (v === "No") return <span style={{ color: "var(--text-muted)", fontSize: 13 }}>–</span>;
  return <span style={{ fontSize: 9.5 }}>{v}</span>;
}

export function TablaComparativa({ filas, columnas, calcularPrecio, plan, onSeleccionar }) {
  return (
    <>
      <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
        <div style={{ width: 66, flexShrink: 0 }} />
        <div style={{ display: "flex", flex: 1, gap: 3 }}>
          {columnas.map((c) => {
            const on = plan === c;
            const precio = calcularPrecio(c);
            return (
              <div
                key={c}
                onClick={() => onSeleccionar(c, precio)}
                style={{ flex: 1, textAlign: "center", padding: "8px 2px", borderRadius: 8, cursor: "pointer", background: on ? "var(--ice)" : "#fff", border: `1px solid ${on ? "var(--accent)" : "var(--border)"}` }}
              >
                <div style={{ fontSize: 9, fontWeight: 600, color: on ? "var(--accent)" : "#1a1f2b" }}>{c}</div>
                <div style={{ fontSize: 8.5, color: on ? "var(--accent)" : "var(--muted)", marginTop: 2 }}>RD$ {precio.toLocaleString("es-DO")}</div>
              </div>
            );
          })}
        </div>
      </div>
      {filas.map((f, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 3, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 66, fontSize: 9.5, color: "var(--muted)", flexShrink: 0 }}>{f.label}</div>
          <div style={{ display: "flex", flex: 1, gap: 3 }}>
            {f.valores.map((v, j) => <div key={j} style={{ flex: 1, textAlign: "center" }}>{checkVal(v)}</div>)}
          </div>
        </div>
      ))}
    </>
  );
}
