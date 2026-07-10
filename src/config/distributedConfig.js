// =========================
// CONFIGURACIÓN DE SEDES
// =========================
export const SEDES = {
    C01: 'Salud Integral Norte',
    C02: 'Salud Integral Centro'
};

export const CLINICAS = ['C01', 'C02'];

// =========================
// LINKED SERVER (Nodo C02)
// =========================
export const LINKED_SERVER =
    `[${process.env.LINKED_SERVER}].SaludIntegralCentro.dbo.`;

// =========================
// VALIDACIONES
// =========================
export const isSedeValid = (sede) => {
    return sede === 'C01' || sede === 'C02';
};

export const normalizeSede = (sede) => {
    if (!sede || !isSedeValid(sede)) {
        return 'C01';
    }
    return sede;
};

// =========================
// REGLAS DE NEGOCIO
// =========================
export const canWriteClinica = (sede) => {
    return sede === 'C01';
};

// =========================
// TABLAS REPLICADAS
// =========================
export const getPacienteTable = (sede) => {
    return sede === 'C02'
        ? `${LINKED_SERVER}Paciente`
        : 'Paciente';
};

export const getClinicaTable = (sede) => {
    return sede === 'C02'
        ? `${LINKED_SERVER}Clinica`
        : 'Clinica';
};

// =========================
// FRAGMENTACIÓN VERTICAL
// =========================
export const getMedicoAdministrativoTable = () => {
    return 'MEDICO_ADMINISTRATIVO';
};

// =========================
// FRAGMENTACIÓN HORIZONTAL PRIMARIA
// =========================
export const getMedicoTable = (sede) => {
    return sede === 'C02'
        ? `${LINKED_SERVER}MEDICO_C02`
        : 'MEDICO_C01';
};

export const getConsultorioTable = (sede) => {
    return sede === 'C02'
        ? `${LINKED_SERVER}CONSULTORIO_C02`
        : 'CONSULTORIO_C01';
};

export const getCitaTable = (sede) => {
    return sede === 'C02'
        ? `${LINKED_SERVER}CITA_MEDICA_C02`
        : 'CITA_MEDICA_C01';
};

// =========================
// FRAGMENTACIÓN DERIVADA
// =========================
export const getTelefonoMedicoTable = (sede) => {
    return sede === 'C02'
        ? `${LINKED_SERVER}TELEFONO_MEDICO_C02`
        : 'TELEFONO_MEDICO_C01';
};