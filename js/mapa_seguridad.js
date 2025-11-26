// =======================================
// DEFINIR COORDENADAS Y COLORES POR VIVIENDA
// =======================================
// INSTRUCCIONES: Edita este objeto para asignar coordenadas y colores a cada vivienda
// Formato: "Nombre de la vivienda": { lat: -12.XXXX, lng: -77.XXXX, color: "green" o "red" }
const coordenadasViviendas = {
    "Departamento moderno en Surco": { lat: -12.1428, lng: -76.9911, color: "green" },
    "Mini estudio en Surco": { lat: -12.1435, lng: -76.9900, color: "red" },
    "Dpto en Monterrico": { lat: -12.1060, lng: -76.9620, color: "green" },
    "Cuarto independiente en Monterrico": { lat: -12.1068, lng: -76.9612, color: "red" },
    "Dpto familiar en San Borja": { lat: -12.1044, lng: -76.9945, color: "green" },
    "Habitación en Jesús María": { lat: -12.0753, lng: -77.0494, color: "green" },
    "Loft vista al mar en San Miguel": { lat: -12.0725, lng: -77.0860, color: "green" },
    "Dpto cerca a Plaza San Miguel": { lat: -12.0732, lng: -77.0875, color: "red" },
    "Dpto premium en San Isidro": { lat: -12.0990, lng: -77.0365, color: "green" },
    "Cuarto en San Isidro": { lat: -12.1002, lng: -77.0373, color: "red" },
    "Dpto funcional en Surquillo": { lat: -12.1165, lng: -77.0162, color: "green" },
    "Estudio amoblado en Surquillo": { lat: -12.1172, lng: -77.0173, color: "red" }
};

// =======================================
// INICIALIZAR MAPA
// =======================================
const map = L.map('map').setView([-12.06, -77.04], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// =======================================
// CARGAR Y LEER EL CATÁLOGO
// =======================================
async function cargarCatalogo() {
    const resp = await fetch("catalogo.html");
    const html = await resp.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const cards = Array.from(doc.querySelectorAll(".property-card"));

    return cards.map(card => ({
        titulo: card.querySelector("h3").textContent,
        desc: card.dataset.desc,
        img: card.dataset.imagen,
        precio: card.dataset.precio,
        zona: card.dataset.zona
    }));
}

// =======================================
// MOSTRAR INFO EN PANEL
// =======================================
function mostrarEnPanel(v) {
    const panel = document.getElementById("panel-content");

    panel.innerHTML = `
        <img src="${v.img}" style="cursor: pointer; border-radius: 8px;" id="imgVivienda">
        <h3>${v.titulo}</h3>
        <p><strong>Zona:</strong> ${v.zona}</p>
        <p><strong>Precio:</strong> S/ ${v.precio}</p>
        <p>${v.desc}</p>
    `;

    // Agregar evento de clic a la imagen para ir al catálogo
    const img = document.getElementById("imgVivienda");
    img.addEventListener("click", () => {
        // Ir a la página de catálogo
        window.location.href = "catalogo.html";
    });
}

// =======================================
// CREAR MARCADORES DE VIVIENDAS
// =======================================
cargarCatalogo().then(viviendas => {
    viviendas.forEach(v => {
        // Buscar coordenadas y color en el objeto definido
        const datosVivienda = coordenadasViviendas[v.titulo];
        
        if (datosVivienda) {
            v.lat = datosVivienda.lat;
            v.lng = datosVivienda.lng;
            v.color = datosVivienda.color;
        } else {
            // Si no está definida, mostrar en consola para agregarla
            console.warn(`⚠️ Vivienda sin coordenadas: "${v.titulo}"`);
            return; // No mostrar en el mapa si no tiene coordenadas
        }

        // Crear marcador en el mapa
        L.circleMarker([v.lat, v.lng], {
            radius: 10,
            color: "white",
            fillColor: v.color === "green" ? "#2ecc71" : "#e74c3c",
            fillOpacity: 0.9
        })
        .addTo(map)
        .on("click", () => mostrarEnPanel(v));
    });
});
