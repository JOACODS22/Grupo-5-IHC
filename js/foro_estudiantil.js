//Cargar comentarios guardados en localStorage, aca si necesite ayuda profe
document.addEventListener("DOMContentLoaded", () => {
    mostrarComentarios();
});

//Guardar en localStorage, aca si necesite ayuda profe
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

//Función para mostrar comentarios
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

document.getElementById("btn-publicar").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const comentario = document.getElementById("comentario").value.trim();

    if (!nombre || !ubicacion || !comentario) {
        alert("Por favor completa todos los campos.");
        return;
    }

    guardarComentario(nombre, ubicacion, comentario);
    mostrarComentarios();

    document.getElementById("nombre").value = "";
    document.getElementById("ubicacion").value = "";
    document.getElementById("comentario").value = "";
});
