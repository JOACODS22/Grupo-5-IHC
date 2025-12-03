// ==========================================
// SISTEMA DE COMENTARIOS Y RESEÑAS CON USUARIOS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Verificar si hay usuario logueado
    const user = SessionManager ? SessionManager.getUser() : null;
    const nombreInput = document.getElementById("nombre");
    const checkboxResena = document.getElementById("checkbox-resena");
    const resenaSection = document.getElementById("resena-section");
    const starRating = document.getElementById("star-rating");
    const ratingValue = document.getElementById("rating-value");

    let selectedRating = 0;

    // Autocompletar nombre si hay usuario logueado
    if (user) {
        nombreInput.value = user.nombre;
        nombreInput.readOnly = true;

        // Cargar viviendas reservadas por el usuario
        cargarViviendasReservadas(user.email);
    } else {
        nombreInput.readOnly = false;
        nombreInput.placeholder = "Tu nombre";
    }

    // Mostrar/ocultar sección de reseña
    checkboxResena.addEventListener("change", function() {
        if (this.checked) {
            if (!user) {
                alert("Debes iniciar sesión para publicar una reseña de vivienda");
                this.checked = false;
                return;
            }

            const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
            const userReservations = reservas[user.email] || [];

            if (userReservations.length === 0) {
                alert("Debes tener al menos una reserva para publicar una reseña");
                this.checked = false;
                return;
            }

            resenaSection.style.display = "block";
        } else {
            resenaSection.style.display = "none";
            selectedRating = 0;
            updateStars(0);
        }
    });

    // Sistema de estrellas
    const stars = starRating.querySelectorAll("i");
    stars.forEach(star => {
        star.addEventListener("click", function() {
            selectedRating = parseInt(this.dataset.rating);
            updateStars(selectedRating);
            ratingValue.textContent = selectedRating;
        });

        star.addEventListener("mouseenter", function() {
            const rating = parseInt(this.dataset.rating);
            updateStars(rating);
        });
    });

    starRating.addEventListener("mouseleave", function() {
        updateStars(selectedRating);
    });

    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove("far");
                star.classList.add("fas");
            } else {
                star.classList.remove("fas");
                star.classList.add("far");
            }
        });
    }

    // Cargar comentarios al inicio
    mostrarComentarios();

    // ==========================================
    // NAVEGAR AUTOMÁTICAMENTE SI VIENE DESDE PERFIL
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('navegar') === 'true') {
        const viviendaABuscar = localStorage.getItem("viviendaABuscar");
        if (viviendaABuscar) {
            localStorage.removeItem("viviendaABuscar");
            // Dar tiempo para que se cargue la página
            setTimeout(() => {
                navegarAVivienda(viviendaABuscar);
            }, 100);
        }
    }

    // ==========================================
    // MANEJAR PUBLICACIÓN
    // ==========================================
    document.getElementById("btn-publicar").addEventListener("click", () => {
        const nombre = nombreInput.value.trim();
        const ubicacion = document.getElementById("ubicacion").value.trim();
        const comentario = document.getElementById("comentario").value.trim();
        const esResena = checkboxResena.checked;

        if (!nombre || !ubicacion || !comentario) {
            alert("Por favor completa todos los campos.");
            return;
        }

        let viviendaData = null;
        let rating = 0;

        if (esResena) {
            const selectVivienda = document.getElementById("select-vivienda");
            const selectedValue = selectVivienda.value;

            if (!selectedValue) {
                alert("Por favor selecciona una vivienda para tu reseña");
                return;
            }

            viviendaData = JSON.parse(selectedValue);
            rating = selectedRating;

            if (rating === 0) {
                alert("Por favor selecciona una calificación de estrellas");
                return;
            }
        }

        guardarComentario(
            nombre,
            ubicacion,
            comentario,
            esResena,
            viviendaData,
            rating,
            user ? user.email : null
        );

        mostrarComentarios();

        // Limpiar formulario
        if (!user) {
            nombreInput.value = "";
        }
        document.getElementById("ubicacion").value = "";
        document.getElementById("comentario").value = "";
        checkboxResena.checked = false;
        resenaSection.style.display = "none";
        ratingValue.textContent = "0";
        selectedRating = 0;

        // Resetear estrellas
        updateStars(0);

        alert(esResena ? "¡Reseña publicada exitosamente!" : "¡Comentario publicado exitosamente!");
    });
});

// ==========================================
// CARGAR VIVIENDAS RESERVADAS
// ==========================================
function cargarViviendasReservadas(userEmail) {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
    const userReservations = reservas[userEmail] || [];
    const selectVivienda = document.getElementById("select-vivienda");

    // Limpiar opciones previas (excepto la primera)
    selectVivienda.innerHTML = '<option value="">-- Selecciona una vivienda --</option>';

    // Obtener viviendas únicas
    const viviendasUnicas = [...new Set(userReservations.map(r => r.inmueble))];

    viviendasUnicas.forEach((vivienda) => {
        const reserva = userReservations.find(r => r.inmueble === vivienda);
        const option = document.createElement("option");
        option.value = JSON.stringify({
            nombre: vivienda,
            precio: reserva.inmueblePrecio,
            ubicacion: reserva.inmuebleUbicacion || "Lima"
        });
        option.textContent = vivienda;
        selectVivienda.appendChild(option);
    });
}

// ==========================================
// GUARDAR COMENTARIO O RESEÑA
// ==========================================
function guardarComentario(nombre, ubicacion, texto, esResena, viviendaData, rating, userEmail) {
    const nuevoComentario = {
        nombre,
        ubicacion,
        texto,
        avatar: `https://i.pravatar.cc/45?u=${nombre}${ubicacion}`,
        id: Date.now(),
        fecha: new Date().toLocaleDateString('es-PE'),
        esResena: esResena || false,
        vivienda: viviendaData || null,
        rating: rating || 0,
        userEmail: userEmail || null // Vincular al usuario
    };

    const comentarios = JSON.parse(localStorage.getItem("foroComentarios")) || [];
    comentarios.push(nuevoComentario);
    localStorage.setItem("foroComentarios", JSON.stringify(comentarios));

    // Si es de un usuario logueado, guardar también en su perfil
    if (userEmail) {
        guardarEnPerfilUsuario(userEmail, nuevoComentario);
    }
}

// ==========================================
// GUARDAR EN PERFIL DE USUARIO
// ==========================================
function guardarEnPerfilUsuario(userEmail, comentario) {
    const interacciones = JSON.parse(localStorage.getItem("userInteracciones")) || {};

    if (!interacciones[userEmail]) {
        interacciones[userEmail] = {
            comentarios: [],
            resenas: []
        };
    }

    if (comentario.esResena) {
        interacciones[userEmail].resenas.push(comentario);
    } else {
        interacciones[userEmail].comentarios.push(comentario);
    }

    localStorage.setItem("userInteracciones", JSON.stringify(interacciones));
}

// ==========================================
// BASE DE DATOS DE VIVIENDAS (para navegación)
// ==========================================
const VIVIENDAS_DB = [
    {
        titulo: "Departamento moderno en Surco",
        imagen: "../asset/dept_Surco.jpg",
        zona: "surco",
        habitaciones: "2",
        banos: "1",
        wifi: "Sí",
        cercania: "Cerca a universidades",
        rating: "5.0",
        descripcion: "Acogedor departamento de 2 dormitorios ubicado en Surco, cerca de universidades y centros comerciales. Ideal para estudiantes.",
        precio: "890000",
        precioNumero: "890000"
    },
    {
        titulo: "Departamento en San Isidro",
        imagen: "../asset/dept_SanIsidro.jpeg",
        zona: "san isidro",
        habitaciones: "3",
        banos: "2",
        wifi: "Sí",
        cercania: "Cerca al centro",
        rating: "4.8",
        descripcion: "Amplio departamento de 3 habitaciones en San Isidro, zona exclusiva y segura.",
        precio: "546460",
        precioNumero: "546460"
    },
    {
        titulo: "Casa acogedora en San Borja",
        imagen: "../asset/dept_SanBorja.jpg",
        zona: "san borja",
        habitaciones: "3",
        banos: "2",
        wifi: "Sí",
        cercania: "Cerca a parques",
        rating: "4.7",
        descripcion: "Espacioso departamento en San Borja, zona residencial tranquila.",
        precio: "1180000",
        precioNumero: "1180000"
    },
    {
        titulo: "Departamento céntrico en Jesús María",
        imagen: "../asset/dept_JesusMaria.jpg",
        zona: "jesus maria",
        habitaciones: "1",
        banos: "1",
        wifi: "Sí",
        cercania: "Cerca a universidades",
        rating: "4.2",
        descripcion: "Acogedor departamento ideal para estudiantes.",
        precio: "843150",
        precioNumero: "843150"
    },
    {
        titulo: "Casa familiar en Monterrico",
        imagen: "../asset/dept_Monterrico.jpg",
        zona: "monterrico",
        habitaciones: "4",
        banos: "3",
        wifi: "Sí",
        cercania: "Cerca a centros comerciales",
        rating: "4.9",
        descripcion: "Departamento moderno en Monterrico con excelentes acabados.",
        precio: "546460",
        precioNumero: "546460"
    },
    {
        titulo: "Departamento ejecutivo en Monterrico",
        imagen: "../asset/dept_Monterrico2.jpg",
        zona: "monterrico",
        habitaciones: "2",
        banos: "2",
        wifi: "Sí",
        cercania: "Cerca a universidades",
        rating: "4.6",
        descripcion: "Moderno departamento ejecutivo ideal para profesionales.",
        precio: "890000",
        precioNumero: "890000"
    },
    {
        titulo: "Casa moderna en San Miguel",
        imagen: "../asset/dept_SanMiguel.jpeg",
        zona: "san miguel",
        habitaciones: "3",
        banos: "2",
        wifi: "Sí",
        cercania: "Cerca a universidades",
        rating: "4.5",
        descripcion: "Casa moderna en San Miguel cerca de universidades.",
        precio: "1180000",
        precioNumero: "1180000"
    },
    {
        titulo: "Departamento espacioso en San Miguel",
        imagen: "../asset/dept_SanMiguel2.jpg",
        zona: "san miguel",
        habitaciones: "2",
        banos: "1",
        wifi: "Sí",
        cercania: "Cerca al centro",
        rating: "4.3",
        descripcion: "Departamento espacioso con buena ubicación.",
        precio: "546460",
        precioNumero: "546460"
    },
    {
        titulo: "Departamento económico en Surquillo",
        imagen: "../asset/dept_Surquillo.jpg",
        zona: "surquillo",
        habitaciones: "1",
        banos: "1",
        wifi: "Sí",
        cercania: "Cerca al centro",
        rating: "4.0",
        descripcion: "Departamento económico en Surquillo, bien ubicado.",
        precio: "843150",
        precioNumero: "843150"
    },
    {
        titulo: "Casa tradicional en Surquillo",
        imagen: "../asset/dept_Surquillo2.jpg",
        zona: "surquillo",
        habitaciones: "2",
        banos: "1",
        wifi: "No",
        cercania: "Cerca a mercados",
        rating: "3.8",
        descripcion: "Casa tradicional en Surquillo con buen precio.",
        precio: "546460",
        precioNumero: "546460"
    },
    {
        titulo: "Departamento premium en Benavides",
        imagen: "../asset/dept_benavides.jpg",
        zona: "benavides",
        habitaciones: "2",
        banos: "2",
        wifi: "Sí",
        cercania: "Cerca a la playa",
        rating: "4.8",
        descripcion: "Moderno departamento premium con excelente ubicación.",
        precio: "890000",
        precioNumero: "890000"
    },
    {
        titulo: "Casa de alto standing en San Isidro",
        imagen: "../asset/cuarto_SanIsidro.jpg",
        zona: "san isidro",
        habitaciones: "4",
        banos: "3",
        wifi: "Sí",
        cercania: "Cerca a todo",
        rating: "5.0",
        descripcion: "Casa de lujo en la mejor zona de San Isidro.",
        precio: "1180000",
        precioNumero: "1180000"
    }
];

// ==========================================
// NAVEGAR A VIVIENDA DESDE RESEÑA
// ==========================================
function navegarAVivienda(nombreVivienda) {
    console.log("🔍 Buscando vivienda:", nombreVivienda);

    // Función auxiliar para normalizar texto (eliminar acentos y espacios extras)
    const normalizar = (texto) => texto.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' ');

    const nombreNormalizado = normalizar(nombreVivienda);

    // Buscar primero por coincidencia exacta
    let vivienda = VIVIENDAS_DB.find(v => {
        const tituloNormalizado = normalizar(v.titulo);
        return tituloNormalizado === nombreNormalizado;
    });

    // Si no encuentra, buscar por palabras clave importantes (al menos 2 palabras significativas)
    if (!vivienda) {
        vivienda = VIVIENDAS_DB.find(v => {
            const tituloNormalizado = normalizar(v.titulo);
            const palabrasVivienda = nombreNormalizado.split(' ').filter(p => p.length > 3);

            // Verificar si al menos 2 palabras importantes coinciden
            const coincidencias = palabrasVivienda.filter(palabra =>
                tituloNormalizado.includes(palabra)
            );

            return coincidencias.length >= 2;
        });
    }

    // Si aún no encuentra, buscar por inclusión parcial o por zona
    if (!vivienda) {
        vivienda = VIVIENDAS_DB.find(v => {
            const tituloNormalizado = normalizar(v.titulo);
            const zonaNormalizada = normalizar(v.zona || "");

            return tituloNormalizado.includes(nombreNormalizado) ||
                   nombreNormalizado.includes(tituloNormalizado) ||
                   (zonaNormalizada && nombreNormalizado.includes(zonaNormalizada));
        });
    }

    if (vivienda) {
        console.log("✅ Vivienda encontrada:", vivienda.titulo);

        // Guardar en localStorage igual que en el catálogo
        const inmueble = {
            titulo: vivienda.titulo,
            descripcion: vivienda.descripcion,
            precio: vivienda.precio,
            imagen: vivienda.imagen,
            zona: vivienda.zona,
            habitaciones: vivienda.habitaciones,
            banos: vivienda.banos,
            wifi: vivienda.wifi,
            cercania: vivienda.cercania,
            rating: vivienda.rating,
            desc: vivienda.descripcion,
            precioNumero: vivienda.precioNumero
        };

        localStorage.setItem("inmuebleSeleccionado", JSON.stringify(inmueble));

        // Redirigir a la página de agendamiento
        window.location.href = "agendar_visita.html";
    } else {
        console.error("❌ No se encontró la vivienda:", nombreVivienda);
        console.log("📋 Viviendas disponibles:", VIVIENDAS_DB.map(v => v.titulo));
        alert("⚠️ No se encontró información de esta vivienda. Por favor intenta desde el catálogo.");
    }
}

// ==========================================
// MOSTRAR COMENTARIOS
// ==========================================
function mostrarComentarios() {
    const contenedor = document.getElementById("lista-comentarios");

    if (!contenedor) {
        console.error("❌ No se encontró el contenedor de comentarios");
        return;
    }

    contenedor.innerHTML = "";

    const comentarios = JSON.parse(localStorage.getItem("foroComentarios")) || [];

    if (comentarios.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
        return;
    }

    // Mostrar comentarios en orden inverso (más recientes primero)
    comentarios.reverse().forEach(c => {
        const div = document.createElement("div");
        div.classList.add("comentario-item");
        div.dataset.comentarioId = c.id;

        let resenaHTML = "";
        if (c.esResena && c.vivienda) {
            const stars = Array(c.rating || 0).fill('<i class="fas fa-star"></i>').join("");
            const emptyStars = Array(5 - (c.rating || 0)).fill('<i class="far fa-star"></i>').join("");

            resenaHTML = `
                <div style="margin-top: 8px; padding: 12px; background: #f0f8f9; border-left: 3px solid #00a8cc; border-radius: 4px;">
                    <span class="resena-badge" style="background: #00a8cc; color: white; padding: 3px 8px; border-radius: 3px; font-size: 0.75em; font-weight: bold; margin-right: 8px;">RESEÑA</span>
                    <span class="rating-stars" style="color: #ffc107; font-size: 0.9em;">${stars}${emptyStars}</span>
                    <div class="vivienda-info" 
                         onclick="navegarAVivienda('${c.vivienda.nombre.replace(/'/g, "\\'")}')" 
                         style="cursor: pointer; 
                                margin-top: 8px; 
                                padding: 10px; 
                                background: white; 
                                border-radius: 4px;
                                transition: all 0.3s ease;
                                border: 1px solid #e0e0e0;" 
                         onmouseover="this.style.background='#e3f2fd'; this.style.borderColor='#00a8cc'; this.style.transform='translateX(5px)';" 
                         onmouseout="this.style.background='white'; this.style.borderColor='#e0e0e0'; this.style.transform='translateX(0)';">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.2em;">🏠</span>
                            <div style="flex: 1;">
                                <strong style="color: #00a8cc; font-size: 1em;">${c.vivienda.nombre}</strong>
                                <div style="font-size: 0.85em; color: #666; margin-top: 2px;">
                                    📍 ${c.vivienda.ubicacion || 'Lima'}
                                </div>
                            </div>
                            <span style="color: #00a8cc; font-size: 1.2em;">→</span>
                        </div>
                        <small style="display: block; font-size: 0.8em; color: #888; margin-top: 6px; text-align: center; font-style: italic;">
                            Click para ver esta vivienda y agendar tu visita
                        </small>
                    </div>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="usuario" style="display: flex; gap: 15px; margin-bottom: 15px;">
                <img src="${c.avatar}" 
                     alt="Avatar de ${c.nombre}" 
                     style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 5px 0; font-size: 1.1em; color: #333;">
                        ${c.nombre}
                    </h3>
                    <small style="color: #666; font-size: 0.9em;">
                        📍 ${c.ubicacion} • 📅 ${c.fecha || 'Hoy'}
                    </small>
                    ${resenaHTML}
                </div>
            </div>
            <p style="margin: 15px 0 0 60px; line-height: 1.6; color: #444;">
                ${c.texto}
            </p>
        `;

        contenedor.appendChild(div);
    });
}

