document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const emailIngresado = document.getElementById('email').value.trim();
    const passwordIngresado = document.getElementById('password').value.trim();
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

    const mensajeError = document.getElementById("mensajeError");
    if (!usuarioGuardado) {
        mensajeError.textContent = "No existe una cuenta registrada.";
        mensajeError.style.display = "block";
        return;
    }

    if (emailIngresado === usuarioGuardado.email && passwordIngresado === usuarioGuardado.password) {
        mensajeError.style.display = "none";
        localStorage.setItem("sesionActiva", "true");
        localStorage.setItem("usuarioActivo", usuarioGuardado.email);
        window.location.href = "../index.html";
    } else {
        mensajeError.textContent = "Correo o contraseña incorrectos.";
        mensajeError.style.display = "block";
    }
});
