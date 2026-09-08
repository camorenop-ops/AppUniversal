import { useApp } from "../context/AppContext";
import { Icon } from "../components/Icon";
import { BackHeader, SectionLabel, Chip } from "../components/UI";
import { PROGRAMAS_SALUD, CUESTIONARIO_EVALUACION_PROGRAMA, CITAS_DISPONIBLES } from "../data/data";

export function EvaluacionCuestionarioScreen() {
  const { evaluacionForm, responderEvaluacion, continuarEvaluacionCita } = useApp();
  const prog = PROGRAMAS_SALUD[evaluacionForm.programaKey];
  const respuestas = evaluacionForm.respuestas;
  const completo = CUESTIONARIO_EVALUACION_PROGRAMA.every(([k]) => respuestas[k] === true || respuestas[k] === false);

  return (
    <>
      <BackHeader title={`Evaluación · ${prog.nombre}`} />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
        Responde este cuestionario de salud. Un médico revisará tus respuestas para aprobar tu ingreso al programa.
      </div>
      <SectionLabel>Cuestionario de salud</SectionLabel>
      {CUESTIONARIO_EVALUACION_PROGRAMA.map(([k, pregunta]) => (
        <div key={k} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13.5, marginBottom: 6 }}>{pregunta}</div>
          <span style={{ display: "inline-block", margin: "0 6px 6px 0" }}>
            <Chip label="Sí" on={respuestas[k] === true} onClick={() => responderEvaluacion(k, true)} />
          </span>
          <span style={{ display: "inline-block", margin: "0 6px 6px 0" }}>
            <Chip label="No" on={respuestas[k] === false} onClick={() => responderEvaluacion(k, false)} />
          </span>
        </div>
      ))}
      <button className="solid" onClick={continuarEvaluacionCita} disabled={!completo} style={{ width: "100%", marginTop: 8 }}>Continuar</button>
    </>
  );
}

export function EvaluacionCitaScreen() {
  const { evaluacionForm, seleccionarFechaEvaluacion, seleccionarHoraEvaluacion, confirmarEvaluacion } = useApp();
  const prog = PROGRAMAS_SALUD[evaluacionForm.programaKey];
  const citaSeleccionada = CITAS_DISPONIBLES.find((c) => c.fecha === evaluacionForm.fecha);
  const listo = !!(evaluacionForm.fecha && evaluacionForm.hora);

  return (
    <>
      <BackHeader title="Agendar cita" />
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
        Elige fecha y hora para tu evaluación médica de ingreso a {prog.nombre}.
      </div>
      <SectionLabel>Fecha</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {CITAS_DISPONIBLES.map((c) => (
          <Chip key={c.fecha} label={c.fecha} on={evaluacionForm.fecha === c.fecha} onClick={() => seleccionarFechaEvaluacion(c.fecha)} />
        ))}
      </div>
      {citaSeleccionada && (
        <>
          <SectionLabel>Hora</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
            {citaSeleccionada.horas.map((h) => (
              <Chip key={h} label={h} on={evaluacionForm.hora === h} onClick={() => seleccionarHoraEvaluacion(h)} />
            ))}
          </div>
        </>
      )}
      <button className="solid" onClick={confirmarEvaluacion} disabled={!listo} style={{ width: "100%", marginTop: 14 }}>Confirmar cita</button>
    </>
  );
}

export function EvaluacionConfirmadaScreen() {
  const { evaluacionForm, goTab } = useApp();
  const prog = PROGRAMAS_SALUD[evaluacionForm.programaKey];
  return (
    <div style={{ textAlign: "center", padding: "30px 10px" }}>
      <Icon name="circlecheck" size={40} color="var(--success-text)" />
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 14 }}>Evaluación solicitada</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
        Tu cita para la evaluación de ingreso a {prog.nombre} quedó agendada para el {evaluacionForm.fecha} a las {evaluacionForm.hora}.
        Un médico revisará tus respuestas y confirmará tu aprobación al programa.
      </div>
      <button className="solid" onClick={() => goTab("home")} style={{ width: "100%", marginTop: 24 }}>Ver en Inicio</button>
    </div>
  );
}
