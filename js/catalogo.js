// ===============================
//      NORMALIZAR TEXTO
// ===============================
function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ===============================
//      LEVENSHTEIN (fuzzy search)
// ===============================
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

document.addEventListener("DOMContentLoaded", () => {
  if (!location.pathname.includes("catalogo.html")) return;

  const cards = Array.from(document.querySelectorAll(".property-card"));

  // Insertar características en cada card
  cards.forEach(card => {
    const hab = card.dataset.habitaciones;
    const ban = card.dataset.banos;
    const wifi = card.dataset.wifi;
    const cerc = card.dataset.cercania;

    if (card.querySelector(".feat-habit"))
      card.querySelector(".feat-habit").textContent = `${hab} Habitación(es)`;

    if (card.querySelector(".feat-banos"))
      card.querySelector(".feat-banos").textContent = `${ban} Baño(s)`;

    if (card.querySelector(".feat-wifi"))
      card.querySelector(".feat-wifi").textContent = wifi;

    if (card.querySelector(".feat-cerca"))
      card.querySelector(".feat-cerca").textContent = cerc;
  });

  const emptyMsg = document.getElementById("catalogoEmpty");
  const pagination = document.getElementById("catalogoPagination");

  const input = document.getElementById("catalogoSearchInput");
  const form = document.getElementById("catalogoSearchForm");
  const suggestionsList = document.getElementById("catalogoSuggestionsList");

  let filteredCards = cards.slice();
  let currentPage = 1;
  const perPage = 4;

  const zonas = [
    "surco", "surquillo", "san borja", "monterrico",
    "san isidro", "jesus maria", "san miguel"
  ];

  // ==========================
  // CLICK EN CARD → AGENDAR
  // ==========================
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const inmueble = {
        titulo: card.querySelector("h3").textContent,
        descripcion: card.querySelector("p").textContent,
        precio: card.querySelector("span").textContent,
        imagen: card.querySelector("img").src,
        zona: card.dataset.zona,
        habitaciones: card.dataset.habitaciones,
        banos: card.dataset.banos,
        wifi: card.dataset.wifi,
        cercania: card.dataset.cercania,
        rating: card.dataset.rating,
        desc: card.dataset.desc,
        precioNumero: card.dataset.precio
      };

      localStorage.setItem("inmuebleSeleccionado", JSON.stringify(inmueble));
      window.location.href = "agendar_visita.html";
    });
  });

  // FILTRAR
  function filterCatalog(query) {
    const qNorm = normalizeText(query.trim());

    filteredCards = cards.filter(card => {
      const text = normalizeText(card.textContent);
      const zone = normalizeText(card.dataset.zona || "");

      if (text.includes(qNorm)) return true;

      return levenshtein(qNorm, zone) <= 2;
    });

    renderPage(1);
  }

  // Buscador en tiempo real
  input.addEventListener("input", () => {
    const text = normalizeText(input.value.trim());
    suggestionsList.innerHTML = "";

    if (!text) {
      suggestionsList.style.display = "none";
      return;
    }

    zonas
      .filter(z => normalizeText(z).includes(text))
      .forEach(z => {
        const li = document.createElement("li");
        li.textContent = z;
        li.onclick = () => {
          input.value = z;
          suggestionsList.style.display = "none";
        };
        suggestionsList.appendChild(li);
      });

    suggestionsList.style.display = suggestionsList.children.length ? "block" : "none";
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".catalogo-search-bar"))
      suggestionsList.style.display = "none";
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    filterCatalog(input.value);
  });

  // ============================
  // 🔥 FILTRO AUTOMÁTICO POR ZONA
  // ============================
  const params = new URLSearchParams(location.search);

  const zonaParam = params.get("zona");
  const qFromURL = params.get("q");

  if (zonaParam) {
    const zNorm = zonaParam.toLowerCase();
    input.value = zonaParam;
    filterCatalog(zNorm);

    setTimeout(() => {
      document.querySelector(".catalogo-list-section").scrollIntoView({
        behavior: "smooth"
      });
    }, 300);

  } else if (qFromURL) {
    input.value = qFromURL;
    filterCatalog(qFromURL);

  } else {
    renderPage(1);
  }

  // PAGINACIÓN
  function renderPage(page) {
    currentPage = page;
    const total = filteredCards.length;
    const totalPages = Math.ceil(total / perPage) || 1;

    cards.forEach(c => (c.style.display = "none"));

    if (!total) {
      emptyMsg.style.display = "block";
      pagination.innerHTML = "";
      return;
    }

    emptyMsg.style.display = "none";

    const start = (page - 1) * perPage;
    const end = start + perPage;

    filteredCards.slice(start, end).forEach(c => {
      c.style.display = "flex";
    });

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    pagination.innerHTML = "";
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className =
        "pagination-btn" + (i === currentPage ? " active" : "");
      btn.onclick = () => renderPage(i);
      pagination.appendChild(btn);
    }
  }
});

// ===============================
//      DESPLAZARSE A PROPIEDAD
// ===============================
function scrollToProperty(propertyIndex) {
  const cards = Array.from(document.querySelectorAll(".property-card"));
  if (propertyIndex > 0 && propertyIndex <= cards.length) {
    const targetCard = cards[propertyIndex - 1];
    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
