// Cargar comentarios guardados en localStorage
document.addEventListener("DOMContentLoaded", () => {
    mostrarComentarios();
});

// Guardar en localStorage
function guardarComentario(nombre, ubicacion, texto) {
    const nuevoComentario = {
        nombre,
        ubicacion,
        texto,
        avatar: `https://i.pravatar.cc/45?u=${nombre}${ubicacion}`,
        id: Date.now()
    };

    const comentarios = JSON.parse(localStorage.getItem("foroComentarios")) || [];
    comentarios.push(nuevoComentario);

    localStorage.setItem("foroComentarios", JSON.stringify(comentarios));
}

// Mostrar comentarios en pantalla
function mostrarComentarios() {
    const contenedor = document.getElementById("lista-comentarios");
    contenedor.innerHTML = "";

    const comentarios = JSON.parse(localStorage.getItem("foroComentarios")) || [];

    comentarios.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("comentario");

        div.innerHTML = `
            <div class="usuario">
                <img src="${c.avatar}">
                <div>
                    <h3>${c.nombre}</h3>
                    <small>${c.ubicacion}</small>
                </div>
            </div>
            <p>${c.texto}</p>
        `;

        contenedor.appendChild(div);
    });
}

// Manejar botón de publicar
document.getElementById("btn-publicar").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const comentario = document.getElementById("comentario").value.trim();

    if (!nombre || !edad || !comentario) {
        alert("Por favor completa todos los campos.");
        return;
    }

    guardarComentario(nombre, ubicacion, comentario);
    mostrarComentarios();

    document.getElementById("nombre").value = "";
    document.getElementById("ubicacion").value = "";
    document.getElementById("comentario").value = "";
});
