// Prestadores de salud simulados para la consola de escritorio: una mezcla de
// centros médicos, laboratorios y farmacias reales y ampliamente conocidos en
// República Dominicana, más algunos médicos independientes ficticios para
// completar los tipos de prestador.

export const PRESTADORES_SALUD = [
  { id: "PRE-001", nombre: "Hospital General Plaza de la Salud", tipo: "Centro médico", ciudad: "Santo Domingo", codigo: "RNC-101452871" },
  { id: "PRE-002", nombre: "CEDIMAT", tipo: "Centro médico", ciudad: "Santo Domingo", codigo: "RNC-101889321" },
  { id: "PRE-003", nombre: "Clínica Abreu", tipo: "Centro médico", ciudad: "Santo Domingo", codigo: "RNC-101223456" },
  { id: "PRE-004", nombre: "Hospiten Santo Domingo", tipo: "Centro médico", ciudad: "Santo Domingo", codigo: "RNC-101667890" },
  { id: "PRE-005", nombre: "Hospiten Bávaro", tipo: "Centro médico", ciudad: "Punta Cana", codigo: "RNC-101667891" },
  { id: "PRE-006", nombre: "Centro Médico Herrera", tipo: "Centro médico", ciudad: "Santo Domingo", codigo: "RNC-101778901" },
  { id: "PRE-007", nombre: "Hospital Metropolitano de Santiago (HOMS)", tipo: "Centro médico", ciudad: "Santiago", codigo: "RNC-101334455" },
  { id: "PRE-008", nombre: "Clínica Corominas", tipo: "Centro médico", ciudad: "Santiago", codigo: "RNC-101556677" },
  { id: "PRE-009", nombre: "Clínica Unión Médica del Norte", tipo: "Centro médico", ciudad: "Santiago", codigo: "RNC-101889012" },
  { id: "PRE-010", nombre: "Instituto Nacional del Cáncer Rosa Emilia Sánchez-Tavares (INCART)", tipo: "Centro médico", ciudad: "Santo Domingo", codigo: "RNC-101990123" },
  { id: "PRE-011", nombre: "Laboratorio Clínico Referencia", tipo: "Laboratorio clínico", ciudad: "Santo Domingo", codigo: "RNC-102001234" },
  { id: "PRE-012", nombre: "Laboratorio Amadita", tipo: "Laboratorio clínico", ciudad: "Santo Domingo", codigo: "RNC-102112345" },
  { id: "PRE-013", nombre: "Farmacia Carol", tipo: "Farmacia", ciudad: "Santo Domingo", codigo: "RNC-102223456" },
  { id: "PRE-014", nombre: "Farmacias GBC", tipo: "Farmacia", ciudad: "Santo Domingo", codigo: "RNC-102334567" },
  { id: "PRE-015", nombre: "Centro de Rehabilitación Integral CERI", tipo: "Centro de rehabilitación", ciudad: "Santo Domingo", codigo: "RNC-102445678" },
  { id: "PRE-016", nombre: "Dr. Manuel Antonio Ureña — Cardiólogo", tipo: "Médico independiente", ciudad: "Santo Domingo", codigo: "CMD-45123" },
  { id: "PRE-017", nombre: "Dra. Carmen Julia Peralta — Pediatra", tipo: "Médico independiente", ciudad: "Santiago", codigo: "CMD-45890" },
  { id: "PRE-018", nombre: "Dr. Rafael Ernesto Lantigua — Ortopeda", tipo: "Médico independiente", ciudad: "Santo Domingo", codigo: "CMD-46201" },
];

function normalizar(texto) {
  return (texto || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function buscarPrestadoresSalud(query) {
  const q = normalizar(query).trim();
  if (!q) return PRESTADORES_SALUD;
  return PRESTADORES_SALUD.filter((p) => (
    normalizar(p.nombre).includes(q) ||
    normalizar(p.ciudad).includes(q) ||
    normalizar(p.tipo).includes(q) ||
    normalizar(p.codigo).includes(q)
  ));
}
