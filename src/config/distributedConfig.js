//=============================
// CONFIGURACIÓN DE SEDES
//=============================

export const SEDES = {
    C01: "Salud Integral Norte",
    C02: "Salud Integral Centro"
};

export const CLINICAS = ["C01","C02"];

//=============================
// VALIDACIONES
//=============================

export const isSedeValid = (sede) =>
    sede === "C01" || sede === "C02";

export const normalizeSede = (sede) =>
    isSedeValid(sede) ? sede : "C01";

//=============================
// REGLAS DE NEGOCIO
//=============================

export const canWriteClinica = (sede) =>
    sede === "C01";