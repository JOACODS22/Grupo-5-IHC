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
// MANEJO DEL FORMULARIO DE REGISTRO
// ==========================================
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const mensaje = document.getElementById('mensajeRegistro');


    // Validar que todos los campos estén llenos
    if (!email || !password || !nombre || !celular) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Validar longitud mínima de la contraseña
    if (password.length < 8) {
        let mensajeInvalida = document.getElementById('mensajeInvalida');
        if (!mensajeInvalida) {
            mensajeInvalida = document.createElement('p');
            mensajeInvalida.id = 'mensajeInvalida';
            mensajeInvalida.style.color = 'red';
            mensajeInvalida.style.marginTop = '10px';
            mensajeInvalida.textContent = 'La contraseña debe tener al menos 8 caracteres.';
            document.querySelector('.form-content').insertBefore(mensajeInvalida, document.getElementById('registerForm').nextSibling);
        } else {
            mensajeInvalida.style.display = 'block';
        }
        return;
    } else {
        let mensajeInvalida = document.getElementById('mensajeInvalida');
        if (mensajeInvalida) {
            mensajeInvalida.style.display = 'none';
        }
    }

    // Obtener todos los usuarios registrados
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar si el correo ya está registrado
    const emailExiste = usuarios.some(user => user.email === email);

    if (emailExiste) {
        alert("Ya existe una cuenta con este correo electrónico. Por favor, inicia sesión o usa otro correo.");
        return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
        email: email,
        password: password,
        nombre: nombre,
        celular: celular
    };

    // Agregar el nuevo usuario al array
    usuarios.push(nuevoUsuario);

    // Guardar el array actualizado en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Mostrar mensaje de éxito
    mensaje.style.display = "block";

    // Redirigir a inicio de sesión
    setTimeout(() => {
        window.location.href = "iniciar_sesion.html";
    }, 1500);
});
