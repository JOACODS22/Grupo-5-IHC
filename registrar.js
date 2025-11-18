document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const mensaje = document.getElementById('mensajeRegistro');
    const usuarioExistente = JSON.parse(localStorage.getItem("usuario"));

    if (usuarioExistente) {
        alert("Ya existe un usuario registrado. Debes iniciar sesión.");
        window.location.href = "iniciar_sesion.html";
        return;
    }
    const usuario = {
        email: email,
        password: password,
        nombre: nombre,
        celular: celular
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));

    mensaje.style.display = "block";

    setTimeout(() => {
        window.location.href = "iniciar_sesion.html";
    }, 1500);
});
