import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "./Icon";
import { Router } from "../Router";

const TABS = [
  { key: "home", icon: "home", label: "Inicio" },
  { key: "tramites", icon: "list", label: "Trámites" },
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

export function PhoneFrame() {
  const { current, activeTab, goTab, openChat } = useApp();

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
      </div>
    </div>
  );
}
