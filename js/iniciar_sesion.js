// ==========================================
// MIGRACIÓN DE DATOS ANTIGUOS
// Convertir sistema antiguo (un solo usuario) al nuevo (múltiples usuarios)
// ==========================================
(function migrateOldData() {
    const usuarioAntiguo = localStorage.getItem("usuario");
    const usuariosNuevos = localStorage.getItem("usuarios");

    // Si existe un usuario en el sistema antiguo y no hay usuarios en el nuevo sistema
    if (usuarioAntiguo && !usuariosNuevos) {
        try {
            const user = JSON.parse(usuarioAntiguo);
            // Migrar al nuevo sistema
            localStorage.setItem("usuarios", JSON.stringify([user]));
            console.log("Migración completada: usuario antiguo transferido al nuevo sistema");
        } catch (e) {
            console.error("Error al migrar datos:", e);
        }
    }
})();

// ==========================================
// MANEJO DEL FORMULARIO DE INICIO DE SESIÓN
// ==========================================
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const emailIngresado = document.getElementById('email').value.trim();
    const passwordIngresado = document.getElementById('password').value.trim();
    const mensajeError = document.getElementById("mensajeError");

    // Validar que los campos no estén vacíos
    if (!emailIngresado || !passwordIngresado) {
        mensajeError.textContent = "Por favor, completa todos los campos.";
        mensajeError.style.display = "block";
        return;
    }

    // Obtener todos los usuarios registrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar si hay usuarios registrados
    if (usuarios.length === 0) {
        mensajeError.textContent = "No existe una cuenta registrada. Por favor, regístrate primero.";
        mensajeError.style.display = "block";
        return;
    }

    // Buscar el usuario con el correo ingresado
    const usuarioEncontrado = usuarios.find(user => user.email === emailIngresado);

    // Verificar si el usuario existe
    if (!usuarioEncontrado) {
        mensajeError.textContent = "No existe una cuenta con este correo electrónico.";
        mensajeError.style.display = "block";
        return;
    }

    // Verificar si la contraseña es correcta
    if (usuarioEncontrado.password === passwordIngresado) {
        mensajeError.style.display = "none";

        // Iniciar sesión
        localStorage.setItem("sesionActiva", "true");
        localStorage.setItem("usuarioActivo", usuarioEncontrado.email);

        // Redirigir al inicio
        window.location.href = "../index.html";
    } else {
        mensajeError.textContent = "Contraseña incorrecta.";
        mensajeError.style.display = "block";
    }
});
