import { useState } from "react";
import { Icon } from "../components/Icon";
import { SectionLabel } from "../components/UI";
import { buscarClientes, polizasActivas } from "../data/clientes";
import { buscarIntermediarios } from "../data/intermediarios";

const COPY = {
  cliente: {
    titulo: "Buscar cliente",
    descripcion: "Busca por nombre, cédula, número de contrato, teléfono o póliza para ver toda la información y accesos del cliente.",
    placeholder: "Nombre, cédula, contrato o póliza…",
  },
  intermediario: {
    titulo: "Buscar intermediario",
    descripcion: "Busca por nombre o código de corredor/agente para ver su cartera completa de clientes.",
    placeholder: "Nombre o código…",
  },
  prestador: {
    titulo: "Consulta de prestador de salud",
    descripcion: "Busca al cliente por nombre, cédula o contrato para validar su cobertura de Salud o registrar una solicitud de autorización.",
    placeholder: "Nombre, cédula o contrato del cliente…",
  },
};

export function SearchScreen({ modo, setModo, query, setQuery, onAbrirCliente, onAbrirIntermediario }) {
  const [tocado, setTocado] = useState(false);
  const clientes = (modo === "cliente" || modo === "prestador") ? buscarClientes(query) : [];
  const intermediarios = modo === "intermediario" ? buscarIntermediarios(query) : [];
  const copy = COPY[modo];

  return (
    <div>
      <SectionLabel>Consulta interna</SectionLabel>
      <h1 style={{ fontSize: 20, color: "var(--navy)", margin: "2px 0 4px" }}>{copy.titulo}</h1>
      <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px" }}>{copy.descripcion}</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div className={"agent-tab" + (modo === "cliente" ? " on" : "")} onClick={() => setModo("cliente")}>Cliente</div>
        <div className={"agent-tab" + (modo === "intermediario" ? " on" : "")} onClick={() => setModo("intermediario")}>Intermediario</div>
        <div className={"agent-tab" + (modo === "prestador" ? " on" : "")} onClick={() => setModo("prestador")}>Prestador de salud</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border-strong)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, background: "var(--surface)" }}>
        <Icon name="search" size={16} color="var(--text-muted)" />
        <input
          autoFocus
          value={query}
          onChange={(e) => { setQuery(e.target.value); setTocado(true); }}
          placeholder={copy.placeholder}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14 }}
        />
      </div>

      {(modo === "cliente" || modo === "prestador") && query.trim() && (
        clientes.length === 0 ? (
          <div className="agent-empty">No se encontraron clientes para "{query}".</div>
        ) : (
          <table className="agent-table">
            <thead>
              <tr><th>Cliente</th><th>Cédula</th><th>Contrato</th><th>Pólizas activas</th></tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} onClick={() => onAbrirCliente(c.id)}>
                  <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="user" size={15} color="var(--accent)" />{c.nombre}
                  </td>
                  <td>{c.cedula}</td>
                  <td>{c.contrato}</td>
                  <td>{polizasActivas(c)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {modo === "intermediario" && query.trim() && (
        intermediarios.length === 0 ? (
          <div className="agent-empty">No se encontraron intermediarios para "{query}".</div>
        ) : (
          <table className="agent-table">
            <thead>
              <tr><th>Intermediario</th><th>Código</th><th>Tipo</th></tr>
            </thead>
            <tbody>
              {intermediarios.map((i) => (
                <tr key={i.id} onClick={() => onAbrirIntermediario(i.id)}>
                  <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="userplus" size={15} color="var(--accent)" />{i.nombre}
                  </td>
                  <td>{i.codigo}</td>
                  <td>{i.tipo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {!query.trim() && !tocado && (
        <div className="agent-empty">Escribe para comenzar la búsqueda.</div>
      )}
    </div>
  );
}
