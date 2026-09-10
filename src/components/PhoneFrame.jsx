import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon, LogoLockup } from "./Icon";
import { Router } from "../Router";
import { ANUNCIOS, TITULAR_NOMBRE } from "../data/data";

const TABS = [
  { key: "home", icon: "home", label: "Inicio" },
  { key: "notif", icon: "bell", label: "Alertas" },
  { key: "cuenta", icon: "user", label: "Cuenta" },
];

function ScreenContainer() {
  const { current } = useApp();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [current]);

  return (
    <div id="screen" style={{ opacity: visible ? 1 : 0 }}>
      <Router />
    </div>
  );
}

function Splash({ onDismiss }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  function handleScroll(e) {
    const w = e.currentTarget.clientWidth || 1;
    setIdx(Math.round(e.currentTarget.scrollLeft / w));
  }

  return (
    <div className="splash" onClick={onDismiss}>
      <div className="splash-track" onScroll={handleScroll}>
        {ANUNCIOS.map((a, i) => (
          <div key={i} className="splash-slide">
            {a.img && a.fit === "contain" ? (
              <>
                <div className="splash-slide-bg" style={{ backgroundImage: `url(${a.img})` }} />
                <div className="splash-slide-fg" style={{ backgroundImage: `url(${a.img})` }} />
              </>
            ) : (
              <div
                className="splash-slide-cover"
                style={a.img ? { backgroundImage: `url(${a.img})` } : { background: "linear-gradient(135deg,var(--navy),var(--accent))" }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="splash-scrim-top" />
      <div className="splash-scrim-bottom" />
      <div className="splash-top">
        <LogoLockup size={26} className="home-logo" />
        <div className="splash-greeting">{TITULAR_NOMBRE}</div>
      </div>
      <div className="splash-bottom">
        <div className="splash-dots">
          {ANUNCIOS.map((_, i) => <span key={i} className={"dot" + (i === idx ? " on" : "")} />)}
        </div>
        <div className="splash-hint">Toca la pantalla para continuar</div>
      </div>
    </div>
  );
}

export function PhoneFrame() {
  const { current, activeTab, goTab, openChat } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="phone">
      <div className="notch" />
      <div className="screen-body">
        <ScreenContainer />
        {current.view !== "chat" && (
          <div id="fab" onClick={openChat}>
            <Icon name="messagecircle" size={22} />
          </div>
        )}
        <div id="navbar">
          {TABS.map((t) => (
            <div key={t.key} onClick={() => goTab(t.key)} style={{ color: activeTab === t.key ? "var(--accent)" : "var(--text-muted)" }}>
              <Icon name={t.icon} size={18} />
              <div>{t.label}</div>
            </div>
          ))}
        </div>
        {showSplash && <Splash onDismiss={() => setShowSplash(false)} />}
      </div>
    </div>
  );
}
