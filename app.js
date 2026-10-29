// ==========================================
// FUNDACIÓN MANOS UNIDAS - CARRERA SOLIDARIA
// ==========================================

// FECHA DEL EVENTO: 20 de diciembre de 2026, 7:00 a. m.
// Cambia estos valores cuando tengas la fecha oficial.
const fechaCarrera = new Date(2026, 11, 20, 7, 0, 0);

const dosDigitos = numero => String(numero).padStart(2, "0");

function actualizarCuentaRegresiva() {
    const diferencia = fechaCarrera.getTime() - Date.now();

    if (diferencia <= 0) {
        document.getElementById("dias").textContent = "00";
        document.getElementById("horas").textContent = "00";
        document.getElementById("minutos").textContent = "00";
        document.getElementById("segundos").textContent = "00";

        document.getElementById("estado-cuenta").textContent =
            "¡Llegó el día de nuestra carrera solidaria!";

        return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    document.getElementById("dias").textContent = dosDigitos(dias);
    document.getElementById("horas").textContent = dosDigitos(horas);
    document.getElementById("minutos").textContent = dosDigitos(minutos);
    document.getElementById("segundos").textContent = dosDigitos(segundos);

    document.getElementById("estado-cuenta").textContent = "";
}

actualizarCuentaRegresiva();
setInterval(actualizarCuentaRegresiva, 1000);


// ==========================================
// VALIDACIÓN DEL FORMULARIO
// ==========================================

const formulario = document.getElementById("formulario-inscripcion");

const campos = [
    "nombre",
    "documento",
    "correo",
    "telefono",
    "nacimiento",
    "categoria",
    "camiseta",
    "acepto"
];

const mensajeExito = document.getElementById("mensaje-exito");

function mostrarError(campo, mensaje) {
    const entrada = document.getElementById(campo);
    const error = document.getElementById(`error-${campo}`);

    error.textContent = mensaje;
    entrada.setAttribute("aria-invalid", mensaje ? "true" : "false");

    if (mensaje) {
        entrada.setAttribute("aria-describedby", `error-${campo}`);
    } else {
        entrada.removeAttribute("aria-describedby");
    }
}

function limpiarErrores() {
    campos.forEach(campo => mostrarError(campo, ""));
    mensajeExito.hidden = true;
    mensajeExito.textContent = "";
}

function calcularEdad(fechaNacimiento) {
    const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const aunNoCumple =
        hoy.getMonth() < nacimiento.getMonth() ||
        (
            hoy.getMonth() === nacimiento.getMonth() &&
            hoy.getDate() < nacimiento.getDate()
        );

    if (aunNoCumple) {
        edad--;
    }

    return edad;
}

function validarCampo(campo) {
    const entrada = document.getElementById(campo);
    const valor = entrada.value.trim();
    let error = "";

    switch (campo) {
        case "nombre":
            if (!valor) {
                error = "Escribe tu nombre completo.";
            } else if (valor.length < 5 || !valor.includes(" ")) {
                error = "Escribe tu nombre y al menos un apellido.";
            } else if (/\d/.test(valor)) {
                error = "El nombre no debe contener números.";
            }
            break;

        case "documento":
            if (!valor) {
                error = "Escribe tu documento de identidad.";
            } else if (!/^\d{5,15}$/.test(valor)) {
                error = "Usa solo números, entre 5 y 15 dígitos.";
            }
            break;

        case "correo":
            if (!valor) {
                error = "Escribe tu correo electrónico.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
                error = "Ingresa un correo válido, por ejemplo nombre@correo.com.";
            }
            break;

        case "telefono":
            if (!valor) {
                error = "Escribe tu número de teléfono.";
            } else if (!/^\d{7,15}$/.test(valor)) {
                error = "Usa solo números, entre 7 y 15 dígitos.";
            }
            break;

        case "nacimiento":
            if (!valor) {
                error = "Selecciona tu fecha de nacimiento.";
            } else {
                const fecha = new Date(`${valor}T00:00:00`);
                const hoy = new Date();
                hoy.setHours(23, 59, 59, 999);

                if (Number.isNaN(fecha.getTime()) || fecha > hoy) {
                    error = "La fecha de nacimiento no puede ser futura.";
                } else {
                    const edad = calcularEdad(valor);
                    const categoria = document.getElementById("categoria").value;

                    if (categoria === "5K" && edad < 12) {
                        error = "Para la categoría 5K debes tener al menos 12 años.";
                    } else if (categoria === "10K" && edad < 16) {
                        error = "Para la categoría 10K debes tener al menos 16 años.";
                    } else if (categoria === "Familiar" && edad < 5) {
                        error = "La categoría familiar tiene una edad mínima de 5 años.";
                    }
                }
            }
            break;

        case "categoria":
            if (!valor) {
                error = "Selecciona una categoría.";
            } else {
                const nacimiento = document.getElementById("nacimiento").value;

                if (nacimiento) {
                    const fecha = new Date(`${nacimiento}T00:00:00`);
                    const hoy = new Date();
                    hoy.setHours(23, 59, 59, 999);

                    if (fecha <= hoy) {
                        const edad = calcularEdad(nacimiento);

                        if (valor === "5K" && edad < 12) {
                            error = "Para la categoría 5K debes tener al menos 12 años.";
                        } else if (valor === "10K" && edad < 16) {
                            error = "Para la categoría 10K debes tener al menos 16 años.";
                        } else if (valor === "Familiar" && edad < 5) {
                            error = "La categoría familiar tiene una edad mínima de 5 años.";
                        }
                    }
                }
            }
            break;

        case "camiseta":
            if (!valor) {
                error = "Selecciona tu talla de camiseta.";
            }
            break;

        case "acepto":
            if (!entrada.checked) {
                error = "Debes aceptar el uso de datos para gestionar la inscripción.";
            }
            break;
    }

    mostrarError(campo, error);
    return error === "";
}


// Validar al salir de cada campo y al cambiar sus valores.
campos.forEach(campo => {
    const entrada = document.getElementById(campo);

    entrada.addEventListener("blur", () => validarCampo(campo));

    entrada.addEventListener("input", () => {
        validarCampo(campo);

        // La edad depende de la fecha de nacimiento y de la categoría.
        if (campo === "nacimiento" || campo === "categoria") {
            validarCampo("nacimiento");
            validarCampo("categoria");
        }
    });

    entrada.addEventListener("change", () => {
        validarCampo(campo);

        if (campo === "nacimiento" || campo === "categoria") {
            validarCampo("nacimiento");
            validarCampo("categoria");
        }
    });
});
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores();

    let formularioValido = true;
    let primerCampoInvalido = null;

    campos.forEach(campo => {
        const valido = validarCampo(campo);

        if (!valido) {
            formularioValido = false;

            if (!primerCampoInvalido) {
                primerCampoInvalido = document.getElementById(campo);
            }
        }
    });

    if (!formularioValido) {
        primerCampoInvalido.focus();
        return;
    }

    // Número de WhatsApp de Colombia
    const numeroWhatsApp = "573104428485";

    // Obtener los datos del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const documento = document.getElementById("documento").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const nacimiento = document.getElementById("nacimiento").value;
    const categoria = document.getElementById("categoria").value;
    const camiseta = document.getElementById("camiseta").value;

    // Crear el mensaje de inscripción
    const mensaje =
        "¡Hola! Quiero inscribirme en la Carrera Solidaria Manos Unidas.\n\n" +
        "Nombre completo: " + nombre + "\n" +
        "Documento: " + documento + "\n" +
        "Correo: " + correo + "\n" +
        "Teléfono: " + telefono + "\n" +
        "Fecha de nacimiento: " + nacimiento + "\n" +
        "Categoría: " + categoria + "\n" +
        "Talla de camiseta: " + camiseta + "\n\n" +
        "Confirmo que deseo solicitar mi inscripción.";

    // Abrir WhatsApp con el mensaje preparado
    const enlaceWhatsApp =
        "https://wa.me/" + numeroWhatsApp +
        "?text=" + encodeURIComponent(mensaje);

    window.open(enlaceWhatsApp, "_blank");

    mensajeExito.textContent =
        "Tus datos fueron validados. WhatsApp se ha abierto con tu mensaje. " +
        "Recuerda enviarlo para completar la solicitud de inscripción.";

    mensajeExito.hidden = false;
});