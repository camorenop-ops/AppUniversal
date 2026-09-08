import { CLIENTES } from "./clientes";

// Intermediarios (corredores/agentes) simulados y su cartera de clientes.

export const INTERMEDIARIOS = [
  {
    id: "INT-01",
    nombre: "Rafael Antonio Bidó",
    codigo: "COR-1042",
    tipo: "Corredor",
    telefono: "809-555-2001",
    correo: "rbido@corredoresuniversal.com",
  },
  {
    id: "INT-02",
    nombre: "Yolanda Beatriz Guzmán",
    codigo: "AGT-2087",
    tipo: "Agente exclusivo",
    telefono: "809-555-2087",
    correo: "yguzman@universal.com.do",
  },
  {
    id: "INT-03",
    nombre: "Estudio Corporativo Peña & Asociados",
    codigo: "COR-3311",
    tipo: "Corredor",
    telefono: "809-555-3311",
    correo: "contacto@penaasociados.com.do",
  },
];

function normalizar(texto) {
  return (texto || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getIntermediarioPorId(id) {
  return INTERMEDIARIOS.find((i) => i.id === id) || null;
}

export function clientesDeIntermediario(id) {
  return CLIENTES.filter((c) => c.intermediarioId === id);
}

export function buscarIntermediarios(query) {
  const q = normalizar(query).trim();
  if (!q) return [];
  return INTERMEDIARIOS.filter((i) => (
    normalizar(i.nombre).includes(q) || normalizar(i.codigo).includes(q) || normalizar(i.tipo).includes(q)
  ));
}
