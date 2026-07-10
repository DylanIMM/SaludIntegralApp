// ======================================
// INDEX.JS
// Sistema Salud Integral
// ======================================

const STORAGE_KEY = "SALUD_INTEGRAL_CURRENT_SEDE";

document.addEventListener("DOMContentLoaded", () => {

    const selectSede = document.getElementById("sede");
    const btnIngresar = document.getElementById("btn-ingresar");

    // Restaurar última sede utilizada
    const sedeGuardada = localStorage.getItem(STORAGE_KEY);

    if (sedeGuardada && selectSede) {
        selectSede.value = sedeGuardada;
    }

    if (!btnIngresar) return;

    btnIngresar.addEventListener("click", ingresar);

});

//======================================

function ingresar() {

    const selectSede = document.getElementById("sede");

    if (!selectSede) {
        alert("No se encontró el selector de sede.");
        return;
    }

    const sede = selectSede.value;

    if (!sede) {
        alert("Seleccione una sede.");
        return;
    }

    localStorage.setItem(STORAGE_KEY, sede);

    window.location.href = "dashboard.html";

}