import adAuto from "../assets/ad-auto.jpg";
import adSalud from "../assets/ad-salud.jpg";

export const INITIAL_DEPENDIENTES = [
  "Amy Carolina Pereyra García",
  "Gabriel Eduardo Moreno Pereyra",
  "Isabel Sofia Moreno Pereyra",
];

export function initialProducts() {
  return [
    {
      key: "salud", label: "Salud", plan: "Plan Alpha", sub: `Plan Alpha, ${INITIAL_DEPENDIENTES.length} dependientes`, icon: "stethoscope",
      renovacion: "15/11/2026", primaActual: 42000, primaRenovacion: 46500, montoPendiente: 3500,
    },
    {
      key: "auto", label: "Auto", sub: "Full, Toyota Prado 2024", icon: "car", plan: "Full",
      vehiculos: [{ marca: "Toyota", modelo: "Prado", anio: "2024", placa: "A123456", color: "Gris" }],
      renovacion: "20/10/2026", primaActual: 38500, primaRenovacion: 41200, montoPendiente: 3208,
    },
    {
      key: "vida", label: "Vida Universal", sub: "5 millones asegurados", icon: "heart", plan: "Vida Universal", extra: "Monto asegurado: 5,000,000 pesos",
      renovacion: "20/01/2027", primaActual: 12800, primaRenovacion: 13400, montoPendiente: 1067,
    },
    {
      key: "hogar", label: "GarantiCasa", sub: "Multiriesgo, Santo Domingo", icon: "home", plan: "GarantiCasa Multiriesgo", extra: "Apartamento de 120 m², Santo Domingo",
      renovacion: "10/03/2027", primaActual: 18200, primaRenovacion: 19700, montoPendiente: 1517,
    },
    {
      key: "garantivilla", label: "GarantiVilla", sub: "Villa, Punta Cana", icon: "building", plan: "GarantiVilla", extra: "Villa vacacional, Punta Cana, La Altagracia",
      renovacion: "05/06/2027", primaActual: 26400, primaRenovacion: 28900, montoPendiente: 2200,
    },
    { key: "viaje", label: "Seguro de Viaje", sub: "No contratado", icon: "send", noContratado: true },
  ];
}

export const RENOVACION_BENEFICIOS = {
  salud: ["Telemedicina ampliada a especialistas", "Copago reducido en laboratorios", "Cobertura de vacunas ampliada"],
  auto: ["Grúa ilimitada en toda la isla", "Retoque Express incluido sin costo", "Nuevo taller preferido en Santiago"],
  vida: ["Muerte accidental ampliada a 250% del monto asegurado", "Cobertura de enfermedades graves ampliada"],
  hogar: ["Equipos electrónicos ampliados hasta RD$700,000", "Renta educativa incluida sin costo adicional"],
  garantivilla: ["Gold Assist ampliado a emergencias 24/7", "Cobertura de paneles solares incluida"],
};

export const BANCOS_RD = [
  "Banreservas", "Banco Popular Dominicano", "BHD León", "Scotiabank",
  "Banco Santa Cruz", "Banco Caribe", "Banco Promerica", "Banco Vimenca",
];

export const TIPOS_RECLAMO_AUTO = [
  ["tool", "asistencia", "Asistencia vehicular"],
  ["car", "choque", "Choque"],
  ["shield", "robo", "Robo"],
  ["alerttriangle", "terceros", "Daño a terceros"],
];

export const REQUISITOS_RECLAMO_HOGAR = [
  "Formulario de reclamación firmado",
  "Fotos del daño",
  "Presupuesto o factura de reparación",
  "Copia de cédula del asegurado",
  "Denuncia policial (si aplica)",
];

export function initialAsistenciaProducts() {
  return [
    { key: "goldassist", label: "Gold Assist", sub: "Activo", icon: "shield" },
    { key: "asistenciahogar", label: "Asistencia Hogar", sub: "No contratado", icon: "home", noContratado: true },
  ];
}

export const PRODUCT_TITLES = {
  salud: "Salud", auto: "Auto", vida: "Vida Universal", hogar: "GarantiCasa",
  garantivilla: "GarantiVilla", viaje: "Seguro de Viaje", asistenciahogar: "Asistencia Hogar",
};

export const CATEGORIA = {
  salud: "persona", vida: "persona", viaje: "persona",
  auto: "vehiculo", hogar: "propiedad", garantivilla: "propiedad",
  asistenciahogar: "asistenciaHogar",
};

export const CARNET_BIEN = {
  vida: { plan: "Vida Universal", label: "Asegurado", bien: "Carlos Andrés Moreno Prieto — monto asegurado 5,000,000 pesos" },
  hogar: { plan: "GarantiCasa Multiriesgo", label: "Bien asegurado", bien: "Apartamento de 120 m², Santo Domingo" },
  garantivilla: { plan: "GarantiVilla", label: "Bien asegurado", bien: "Villa vacacional, Punta Cana, La Altagracia" },
};

export const COBERTURAS_DISPONIBLES_SALUD = [
  ["Cobertura dental", 1200],
  ["Cobertura óptica", 900],
  ["Cobertura internacional", 3500],
  ["Segunda opinión médica", 750],
];
export const COBERTURAS_VIDA = [
  ["Muerte natural", "100% del monto asegurado"],
  ["Muerte accidental", "200% del monto asegurado"],
  ["Invalidez total y permanente", "100% del monto asegurado"],
  ["Enfermedades graves", "50% del monto asegurado"],
];
export const COBERTURAS_HOGAR = [
  ["Incendio", "100%"],
  ["Robo", "100%"],
  ["Daños por agua", "100%"],
  ["Terremoto", "Hasta límite de póliza"],
  ["Responsabilidad civil", "Incluida"],
];
export const COBERTURAS_GARANTIVILLA = [
  ["Incendio", "100%"],
  ["Robo", "100%"],
  ["Daños por huracán o tormenta", "100%"],
  ["Responsabilidad civil", "Incluida"],
];
export const COBERTURAS_LABEL = { vida: "Causales cubiertas", hogar: "Eventos cubiertos", garantivilla: "Eventos cubiertos" };
export const COBERTURAS_DATA = { vida: COBERTURAS_VIDA, hogar: COBERTURAS_HOGAR, garantivilla: COBERTURAS_GARANTIVILLA };

const CAT_OPCIONALES_AUTO = "car|Coberturas opcionales";
const FILAS_OPCIONALES_AUTO = [
  ["Alquiler de vehículos", "5 categorías, 10 a 30 días"],
  ["Casa del Conductor", "Personal para actas policiales"],
  ["Aeroambulancia", "Para el asegurado y 5 pasajeros"],
  ["LoJack", "Según marca y modelo"],
  ["Responsabilidad civil en exceso", "Sumas aseguradas adicionales"],
];

export const COBERTURAS_DETALLE = {
  "Plan Esencial": {
    "shieldplus|Límites del plan": [["Límite por caso", "RD$600,000"], ["Cobertura catastrófica", "RD$600,000"]],
    "stethoscope|Ambulatorias": [["Consulta ambulatoria", "Copago aplica"], ["Emergencias ambulatorias", "60%"], ["Laboratorios", "60%"], ["Rayos X", "60%"], ["Estudios especiales", "60%"], ["Vacunas en centros afiliados", "No incluido"]],
    "buildinghospital|Hospitalización": [["Habitación privada", "70%"], ["Cuidados intensivos", "70%"], ["Servicios especiales de hospital", "70%"], ["Medicamentos durante internamiento", "70%"], ["Honorarios médicos", "70%"]],
    "babycarriage|Maternidad": [["Parto normal / Cesárea", "100% hasta RD$100,000"], ["Beneficio de neonato", "No incluido"], ["Complicaciones del recibimiento", "100% bajo el límite de la madre"], ["Screening neonatal", "No incluido"]],
    "cash|Reembolso": [["Consultas fuera de la red", "Hasta RD$1,200"], ["Habitación privada", "Hasta RD$2,000"], ["Gastos fuera de la red", "60% según THM"]],
    "listcheck|Incluidas": [["Telemedicina", "24/7 con IDA Healthcare"], ["Chequeo preventivo", "No incluido"], ["Detección cáncer oral", "No incluido"], ["Últimos Gastos Plus", "RD$75,000"], ["Seguro de vida", "RD$150,000"], ["Gold Assist", "No incluido"]],
  },
  "Plan Alpha": {
    "shieldplus|Límites del plan": [["Límite por caso", "RD$1,200,000"], ["Cobertura catastrófica", "RD$1,200,000"]],
    "stethoscope|Ambulatorias": [["Consulta ambulatoria", "Copago aplica"], ["Emergencias ambulatorias", "80%"], ["Laboratorios", "80%"], ["Rayos X", "80%"], ["Estudios especiales", "80%"], ["Vacunas en centros afiliados", "Según esquema"]],
    "buildinghospital|Hospitalización": [["Habitación privada", "90%"], ["Cuidados intensivos", "90%"], ["Servicios especiales de hospital", "90%"], ["Medicamentos durante internamiento", "90%"], ["Honorarios médicos", "90%"]],
    "babycarriage|Maternidad": [["Parto normal / Cesárea", "100% hasta RD$200,000"], ["Beneficio de neonato", "Desde la gestación"], ["Complicaciones del recibimiento", "100% bajo el límite de la madre"], ["Screening neonatal", "Incluido"]],
    "cash|Reembolso": [["Consultas fuera de la red", "Hasta RD$2,500"], ["Habitación privada", "Hasta RD$3,500"], ["Gastos fuera de la red", "80% según THM"]],
    "listcheck|Incluidas": [["Telemedicina", "24/7 con IDA Healthcare"], ["Chequeo preventivo", "40+ años"], ["Detección cáncer oral", "Exclusiva Alpha"], ["Últimos Gastos Plus", "RD$150,000"], ["Seguro de vida", "RD$300,000"], ["Gold Assist", "Hogar y emergencias"]],
  },
  "Plan Exclusivo": {
    "shieldplus|Límites del plan": [["Límite por caso", "RD$2,500,000"], ["Cobertura catastrófica", "RD$2,500,000"]],
    "stethoscope|Ambulatorias": [["Consulta ambulatoria", "Ilimitadas sujeto a copago"], ["Emergencias ambulatorias", "100%"], ["Laboratorios", "100%"], ["Rayos X", "100%"], ["Estudios especiales", "100%"], ["Vacunas en centros afiliados", "100% según esquema"]],
    "buildinghospital|Hospitalización": [["Habitación privada", "100%"], ["Cuidados intensivos", "100%"], ["Servicios especiales de hospital", "100%"], ["Medicamentos durante internamiento", "100%"], ["Honorarios médicos", "100%"]],
    "babycarriage|Maternidad": [["Parto normal / Cesárea", "100% hasta RD$400,000"], ["Beneficio de neonato", "Desde la gestación"], ["Complicaciones del recibimiento", "100% bajo el límite de la madre"], ["Screening neonatal", "Incluido"]],
    "cash|Reembolso": [["Consultas fuera de la red", "Hasta RD$5,000"], ["Habitación privada", "Hasta RD$7,000"], ["Gastos fuera de la red", "90% según THM"]],
    "listcheck|Incluidas": [["Movilidad Universal", "Transporte especializado"], ["Telemedicina", "24/7 con IDA Healthcare"], ["Chequeo preventivo", "40+ años"], ["Últimos Gastos Plus", "RD$200,000"], ["Seguro de vida", "RD$500,000"], ["Gold Assist", "Hogar y emergencias"], ["Asistencia en viajes", "Incluida"]],
  },
  "Básico": {
    "shield|Cobertura de ley": [["Daños a terceros", "Según ley"], ["Responsabilidad civil", "Hasta límite legal"]],
    "tool|Asistencia vehicular": [["Remolque por grúa", "No incluido"], ["Cambio de neumáticos", "No incluido"], ["Envío de combustible", "No incluido"], ["Cerrajería", "No incluido"]],
    "building|Talleres y reparaciones": [["Talleres preferidos", "No incluido"], ["Reparación de cristales", "No incluido"], ["Retoque Express", "No incluido"]],
    "alerttriangle|Asistencia en accidentes": [["Soporte al abrir el reclamo", "No incluido"], ["Asesoría legal", "No incluido"], ["Reporte Casa del Conductor", "No incluido"]],
    "home|Gold Assist (hogar)": [["Emergencias del hogar", "No incluido"], ["Coordinación de servicios", "No incluido"]],
  },
  "Pérdida Total": {
    "shield|Cobertura principal": [["Pérdida total por robo", "100% del valor asegurado"], ["Pérdida total por daños irreparables", "100% del valor asegurado"]],
    "tool|Asistencia vehicular": [["Remolque por grúa", "100%"], ["Cambio de neumáticos", "Incluido"], ["Envío de combustible", "Incluido"], ["Cerrajería", "Incluido"]],
    "building|Talleres y reparaciones": [["Talleres preferidos", "Incluido"], ["Reparación de cristales", "No incluido"], ["Retoque Express", "No incluido"]],
    "alerttriangle|Asistencia en accidentes": [["Soporte al abrir el reclamo", "Incluido"], ["Asesoría legal", "Incluido"], ["Reporte Casa del Conductor", "Incluido"]],
    "home|Gold Assist (hogar)": [["Emergencias del hogar", "100% mano de obra"], ["Coordinación de servicios", "Incluido"], ["Servicios especiales", "RD$500 copago"]],
  },
  "Full": {
    "shield|Cobertura principal": [["Colisión, vuelco e incendio", "Incluida"], ["Responsabilidad civil", "Incluida"], ["Robo", "Incluido"]],
    "tool|Asistencia vehicular": [["Remolque por grúa", "100%"], ["Cambio de neumáticos", "Incluido"], ["Envío de combustible", "Incluido"], ["Cerrajería", "Incluido"]],
    "building|Talleres y reparaciones": [["Talleres preferidos", "Incluido"], ["Reparación de cristales", "Gratis"], ["Retoque Express", "No incluido"]],
    "alerttriangle|Asistencia en accidentes": [["Soporte al abrir el reclamo", "Incluido"], ["Asesoría legal", "Incluido"], ["Reporte Casa del Conductor", "Incluido"]],
    "home|Gold Assist (hogar)": [["Emergencias del hogar", "100% mano de obra"], ["Coordinación de servicios", "Incluido"], ["Servicios especiales", "RD$500 copago"]],
  },
  "Súper Full": {
    "shield|Cobertura principal": [["Colisión, vuelco e incendio", "Amplia, cero deducible disponible"], ["Responsabilidad civil", "Incluida"], ["Robo", "Incluido"], ["Daños a propiedad ajena", "Incluidos"]],
    "tool|Asistencia vehicular": [["Remolque por grúa", "100%"], ["Cambio de neumáticos", "Incluido"], ["Envío de combustible", "Incluido"], ["Cerrajería", "Incluido"]],
    "building|Talleres y reparaciones": [["Talleres preferidos", "Incluido"], ["Reparación de cristales", "Gratis"], ["Retoque Express", "Gratis"]],
    "alerttriangle|Asistencia en accidentes": [["Soporte al abrir el reclamo", "Incluido"], ["Asesoría legal", "Incluido"], ["Reporte Casa del Conductor", "Incluido"]],
    "home|Gold Assist (hogar)": [["Emergencias del hogar", "100% mano de obra"], ["Coordinación de servicios", "Incluido"], ["Servicios especiales", "RD$500 copago"]],
  },
};
["Básico", "Pérdida Total", "Full", "Súper Full"].forEach((planKey) => {
  COBERTURAS_DETALLE[planKey][CAT_OPCIONALES_AUTO] = FILAS_OPCIONALES_AUTO;
});

COBERTURAS_DETALLE["Básica"] = {
  "alerttriangle|Coberturas principales": [
    ["Incendio y/o rayo", "Incluido"],
    ["Explosión", "Incluido"],
    ["Ciclón, huracán, tornado y manga de viento", "Incluido"],
    ["Remoción de escombros", "Incluido"],
    ["Colapso y/o daño a la estructura", "Incluido"],
    ["Daños por humo", "Incluido"],
    ["Granizo", "Incluido"],
  ],
  "shield|Coberturas adicionales": [
    ["Daños por agua de lluvia (ciclón)", "No incluido"],
    ["Inundación y/o ras de mar", "No incluido"],
    ["Daños por agua accidental", "No incluido"],
    ["Terremoto y/o temblor de tierra", "No incluido"],
    ["Robo con escalamiento y/o violencia", "No incluido"],
    ["Daños por naves aéreas y vehículos", "No incluido"],
    ["Motín, huelga y daños maliciosos", "No incluido"],
  ],
  "listcheck|Beneficios incluidos": [
    ["Responsabilidad civil", "No incluido"],
    ["Inhabitabilidad del hogar", "No incluido"],
    ["Pérdida de renta", "No incluido"],
    ["Equipos electrónicos", "No incluido"],
    ["Recuperación de documentos", "No incluido"],
    ["Gold Assist", "No incluido"],
    ["Últimos Gastos Plus", "No incluido"],
  ],
};
COBERTURAS_DETALLE["Amplia"] = {
  "alerttriangle|Coberturas principales": COBERTURAS_DETALLE["Básica"]["alerttriangle|Coberturas principales"],
  "shield|Coberturas adicionales": [
    ["Daños por agua de lluvia (ciclón)", "Incluido"],
    ["Inundación y/o ras de mar", "Incluido"],
    ["Daños por agua accidental", "Incluido"],
    ["Terremoto y/o temblor de tierra", "Incluido"],
    ["Robo con escalamiento y/o violencia", "Incluido"],
    ["Daños por naves aéreas y vehículos", "Incluido"],
    ["Motín, huelga y daños maliciosos", "Incluido"],
  ],
  "listcheck|Beneficios incluidos": [
    ["Responsabilidad civil", "Incluido"],
    ["Inhabitabilidad del hogar", "Hasta RD$150,000 por reembolso"],
    ["Pérdida de renta", "Hasta RD$100,000"],
    ["Equipos electrónicos", "10% del valor de tus muebles, hasta RD$500,000"],
    ["Recuperación de documentos", "Hasta RD$50,000 por reembolso"],
    ["Gold Assist", "Asistencia de emergencia para el hogar"],
    ["Últimos Gastos Plus", "Servicio de asistencia funeral y exequial"],
  ],
  "plus|Coberturas opcionales": [
    ["Paneles solares", "Disponible por cuota adicional"],
    ["Rotura de cristales", "Disponible por cuota adicional"],
    ["Avería de maquinaria", "Disponible por cuota adicional"],
    ["Renta educativa", "Disponible por cuota adicional"],
    ["Gastos médicos por accidente (empleados domésticos)", "Hasta RD$50,000 por reembolso"],
  ],
};

export const PRESTADORES = [
  { nombre: "Dra. Carmen Reyes", especialidad: "Cardiología", telefono: "809-555-0142", direccion: "Av. Abraham Lincoln 504, Santo Domingo" },
  { nombre: "Dr. Luis Fernández", especialidad: "Cardiología", telefono: "809-555-0198", direccion: "Torre Médica Naco, piso 3" },
  { nombre: "Dra. Ana Martínez", especialidad: "Pediatría", telefono: "809-555-0221", direccion: "Av. Winston Churchill 1120" },
  { nombre: "Dr. Pedro Gómez", especialidad: "Ginecología", telefono: "809-555-0345", direccion: "Plaza Salud, suite 4" },
  { nombre: "Dra. Rosa Jiménez", especialidad: "Dermatología", telefono: "809-555-0456", direccion: "Centro Médico UCE, consultorio 12" },
  { nombre: "Dr. Miguel Ortiz", especialidad: "Medicina General", telefono: "809-555-0567", direccion: "Clínica Abreu, piso 2" },
];

export const FONDOS = [
  { name: "Fondo Renta Fija Universal", rows: [["Saldo actual", "850,000 pesos"], ["Rendimiento anual", "6.2%"], ["Fecha de inicio", "03/2023"]] },
  { name: "Fondo Balanceado Universal", rows: [["Saldo actual", "420,000 pesos"], ["Rendimiento anual", "8.1%"], ["Fecha de inicio", "11/2024"]] },
];
export const PROYECTOS = [
  { name: "Torre Grid 7, apto 502", rows: [["Estado", "En construcción"], ["Entrega estimada", "2026"], ["Contrato", "FID-2024-0512"]] },
];
export const ESTADO_CUENTA = {
  proyecto: "Torre Grid 7, apto 502",
  saldoPendiente: "2,200,000 pesos",
  pagos: [["15/01/2025", "Inicial", "500,000 pesos"], ["15/04/2025", "Cuota 1", "150,000 pesos"], ["15/07/2025", "Cuota 2", "150,000 pesos"]],
};
export const ASISTENCIA_INFO = {
  goldassist: [["Estado", "Activo"], ["Cobertura", "Vial, hogar y viajes"], ["Vigencia", "01/2026 a 12/2026"]],
  asistenciahogar: [["Estado", "Activo"], ["Cobertura", "Plomería, electricidad, cerrajería"]],
};
export const FILIALES = ["Seguros", "AFI", "Fiduciaria", "ARS", "Asistencia"];
export const MUEBLES_HOGAR = [
  "Sala (mueble, TV, decoración)",
  "Comedor",
  "Habitación principal",
  "Habitaciones secundarias",
  "Cocina y electrodomésticos",
  "Nevera",
  "Lavadora y secadora",
  "Aire acondicionado",
  "Equipos electrónicos (computadoras, consolas)",
  "Ropa y efectos personales",
];
export const UBICACIONES_MUESTRA = [
  "Piantini, Santo Domingo",
  "Bella Vista, Santo Domingo",
  "Naco, Santo Domingo",
  "Los Prados, Santiago",
  "Punta Cana, La Altagracia",
  "Bávaro, La Altagracia",
];
export const ANUNCIOS = [
  { tag: "SEGUROS UNIVERSAL · AUTO", t: "Retoque Express gratis con tu Súper Full", img: adAuto },
  { tag: "SEGUROS UNIVERSAL · SALUD", t: "Plan Exclusivo: cobertura desde la gestación", img: adSalud },
  { tag: "GRUPO UNIVERSAL", t: "60 años protegiendo lo que más quieres", img: null },
];
export const CENTROS = [
  { x: 50, y: 62, label: "Tú", primary: true },
  { x: 28, y: 28, label: "Clínica Abreu" },
  { x: 70, y: 32, label: "Centro Médico UCE" },
  { x: 55, y: 15, label: "Hospital General" },
];
export const ESPECIALIDADES = ["Cardiología", "Pediatría", "Ginecología", "Dermatología", "Medicina General"];
export const SINTOMAS = [
  ["Dolor de pecho", "Cardiología"],
  ["Fiebre en niños", "Pediatría"],
  ["Dolor de cabeza persistente", "Neurología"],
  ["Erupciones en la piel", "Dermatología"],
];

export const MEMBERS = ["Carlos A.", "Amy C.", "Gabriel E.", "Isabel S."];

export function initialReembolsos() {
  return [
    { fecha: "15/08/2026", concepto: "Consulta especialista", monto: "2,500 pesos", estado: "Aprobado" },
    { fecha: "02/08/2026", concepto: "Medicamentos", monto: "1,200 pesos", estado: "En revisión" },
    { fecha: "20/07/2026", concepto: "Laboratorio", monto: "850 pesos", estado: "Rechazado" },
  ];
}
export function initialAutorizaciones() {
  return [
    { fecha: "10/08/2026", concepto: "Resonancia magnética", estado: "Aprobada" },
    { fecha: "28/07/2026", concepto: "Fisioterapia (10 sesiones)", estado: "En revisión" },
  ];
}

export const BASE_PERSONA = {
  salud: { "Plan Esencial": 9000, "Plan Alpha": 15000, "Plan Exclusivo": 28000 },
  vida: { "Básico": 6000, "Premium": 14500 },
  viaje: { "Nacional": 1800, "Internacional": 4200 },
};
export function edadFactor(edad) {
  const e = Number(edad) || 0;
  return 1 + Math.max(0, e - 25) * 0.012 + Math.max(0, e - 60) * 0.02;
}
export const CUESTIONARIO_SALUD_VIDA = [
  ["fuma", "¿Fumas o has fumado en el último año?"],
  ["cronica", "¿Padeces alguna enfermedad crónica (diabetes, hipertensión, cardiopatía)?"],
  ["hospitalizado", "¿Has sido hospitalizado(a) en los últimos 5 años?"],
  ["deporteRiesgo", "¿Practicas deportes o actividades de alto riesgo?"],
  ["antecedentes", "¿Tienes antecedentes familiares de enfermedades graves?"],
];
export function saludFactorVida(respuestas) {
  const positivas = Object.values(respuestas || {}).filter((v) => v === true).length;
  return 1 + positivas * 0.08;
}
export const AUTO_FACTOR = { "Básico": 0.012, "Pérdida Total": 0.025, "Full": 0.045, "Súper Full": 0.065 };
export const PROPIEDAD_FACTOR = { "Básica": 0.0018, "Amplia": 0.0035 };
export const ASISTENCIA_HOGAR_PRECIOS = { "Básica": 450, "Premium": 950 };

export const COMPARATIVO_FILAS = {
  salud: [
    { label: "Seguro de vida incluido", valores: ["RD$150,000", "RD$300,000", "RD$500,000"] },
    { label: "Detección cáncer oral", valores: ["No", "Sí", "No"] },
    { label: "Chequeo preventivo 40+", valores: ["No", "Sí", "Sí"] },
    { label: "Telemedicina 24/7", valores: ["Sí", "Sí", "Sí"] },
    { label: "Salones VIP aeropuerto", valores: ["No", "No", "Sí"] },
  ],
  vida: [
    { label: "Muerte natural", valores: ["100%", "100%"] },
    { label: "Muerte accidental", valores: ["150%", "200%"] },
    { label: "Invalidez total", valores: ["No", "Sí"] },
    { label: "Enfermedades graves", valores: ["No", "50%"] },
  ],
  viaje: [
    { label: "Cobertura médica", valores: ["US$10,000", "US$50,000"] },
    { label: "Cancelación de viaje", valores: ["No", "Sí"] },
    { label: "Equipaje perdido", valores: ["Básico", "Ampliado"] },
    { label: "Asistencia 24/7", valores: ["Sí", "Sí"] },
  ],
  auto: [
    { label: "Responsabilidad civil", valores: ["Sí", "Sí", "Sí", "Sí"] },
    { label: "Colisión propia", valores: ["No", "No", "Sí", "Sí"] },
    { label: "Pérdida total por robo", valores: ["No", "Sí", "Sí", "Sí"] },
    { label: "Cristales gratis", valores: ["No", "No", "Sí", "Sí"] },
    { label: "Retoque Express", valores: ["No", "No", "No", "Sí"] },
  ],
  hogar: [
    { label: "Incendio, rayo y explosión", valores: ["Sí", "Sí"] },
    { label: "Ciclón, huracán y granizo", valores: ["Sí", "Sí"] },
    { label: "Terremoto y/o temblor", valores: ["No", "Sí"] },
    { label: "Robo con escalamiento", valores: ["No", "Sí"] },
    { label: "Daños por agua e inundación", valores: ["No", "Sí"] },
    { label: "Responsabilidad civil", valores: ["No", "Sí"] },
    { label: "Equipos electrónicos", valores: ["No", "Sí"] },
    { label: "Gold Assist", valores: ["No", "Sí"] },
  ],
  garantivilla: [
    { label: "Incendio, rayo y explosión", valores: ["Sí", "Sí"] },
    { label: "Ciclón, huracán y granizo", valores: ["Sí", "Sí"] },
    { label: "Terremoto y/o temblor", valores: ["No", "Sí"] },
    { label: "Robo con escalamiento", valores: ["No", "Sí"] },
    { label: "Daños por agua e inundación", valores: ["No", "Sí"] },
    { label: "Responsabilidad civil", valores: ["No", "Sí"] },
    { label: "Equipos electrónicos", valores: ["No", "Sí"] },
    { label: "Gold Assist", valores: ["No", "Sí"] },
  ],
  asistenciahogar: [
    { label: "Plomería de emergencia", valores: ["Sí", "Sí"] },
    { label: "Electricidad", valores: ["No", "Sí"] },
    { label: "Cerrajería", valores: ["Sí", "Sí"] },
    { label: "Fumigación anual", valores: ["No", "Sí"] },
  ],
};

export const TITULAR_NOMBRE = "Carlos Andrés Moreno Prieto";

export const LIMITE_POR_CASO_PLAN = { "Plan Esencial": 600000, "Plan Alpha": 1200000, "Plan Exclusivo": 2500000 };
export const COBERTURA_MEDICAMENTOS_PLAN = { "Plan Esencial": 30000, "Plan Alpha": 60000, "Plan Exclusivo": 120000 };

export const PLAN_BASICO_SALUD = {
  nombre: "Plan Básico de Salud (PBS)",
  limitePorCaso: 470000,
  coberturaMedicamentos: 25000,
};

export const AFILIADOS_SALUD_INFO = {
  [TITULAR_NOMBRE]: { parentesco: "Titular", limiteUsado: 185000, medicamentosUsado: 18500 },
  "Amy Carolina Pereyra García": {
    parentesco: "Cónyuge",
    limiteUsado: 42000,
    medicamentosUsado: 9800,
    autorizaciones: [
      { fecha: "02/06/2026", concepto: "Ecografía abdominal", estado: "Aprobada" },
    ],
    reembolsos: [
      { fecha: "20/07/2026", concepto: "Laboratorio", monto: "850 pesos", estado: "Rechazado" },
      { fecha: "02/08/2026", concepto: "Medicamentos", monto: "1,200 pesos", estado: "En revisión" },
    ],
  },
  "Gabriel Eduardo Moreno Pereyra": {
    parentesco: "Hijo",
    limiteUsado: 15000,
    medicamentosUsado: 3200,
    autorizaciones: [],
    reembolsos: [
      { fecha: "05/05/2026", concepto: "Consulta pediatría", monto: "1,800 pesos", estado: "Aprobado" },
    ],
  },
  "Isabel Sofia Moreno Pereyra": {
    parentesco: "Hija",
    limiteUsado: 8000,
    medicamentosUsado: 1500,
    autorizaciones: [],
    reembolsos: [],
  },
};
