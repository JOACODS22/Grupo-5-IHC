// ==========================================
// SESSION MANAGER - Manejo de sesiones y LocalStorage
// ==========================================

const SessionManager = {
  getUser: function () {
    const usuarioActivoEmail = localStorage.getItem("usuarioActivo");
    if (!usuarioActivoEmail) return null;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    return usuarios.find(user => user.email === usuarioActivoEmail) || null;
  },

  isLoggedIn: function () {
    return localStorage.getItem("sesionActiva") === "true";
  },

  logout: function () {
    localStorage.removeItem("sesionActiva");
    localStorage.removeItem("usuarioActivo");
    window.location.href = this.getBasePath() + "index.html";
  },

  getBasePath: function () {
    return window.location.pathname.includes("/page/") ? "../" : "";
  },

  protectPage: function () {
    if (!this.isLoggedIn()) {
      alert("Debes iniciar sesión para acceder a esta página");
      window.location.href = this.getBasePath() + "page/iniciar_sesion.html";
    }
  },

  updateUserName: function (nuevoNombre) {
    const usuarioActivoEmail = localStorage.getItem("usuarioActivo");
    if (!usuarioActivoEmail) return false;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const i = usuarios.findIndex(u => u.email === usuarioActivoEmail);
    if (i === -1) return false;

    usuarios[i].nombre = nuevoNombre;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    return true;
  }
};

// ==========================================
// HEADER MANAGER
// ==========================================

const HeaderManager = {
  updateHeader: function () {
    const user = SessionManager.getUser();
    const basePath = SessionManager.getBasePath();
    const logged = SessionManager.isLoggedIn();

    const btnLogin = document.getElementById("btnLogin");
    const btnRegister = document.getElementById("btnRegister");
    const btnLoginDesk = document.getElementById("btnLoginDesktop");
    const btnRegisterDesk = document.getElementById("btnRegisterDesktop");

    if (logged && user) {
      this.showUserProfile(user, basePath);
      if (btnLogin) btnLogin.style.display = "none";
      if (btnRegister) btnRegister.style.display = "none";
      if (btnLoginDesk) btnLoginDesk.style.display = "none";
      if (btnRegisterDesk) btnRegisterDesk.style.display = "none";
    } else {
      this.showLoginButtons(basePath);
      const profile = document.getElementById("userProfileDropdown");
      if (profile) profile.remove();
    }
  },

  showUserProfile: function (user, basePath) {
    const navButtons = document.querySelector(".nav-buttons");
    if (!navButtons) return;

    let cont = document.getElementById("userProfileDropdown");
    if (!cont) {
      cont = document.createElement("div");
      cont.id = "userProfileDropdown";
      cont.className = "user-profile-dropdown";

      cont.innerHTML = `
        <div class="user-profile-trigger">
          <div class="user-avatar">👤</div>
          <span class="user-name">${user.nombre}</span>
          <i class="fas fa-chevron-down dropdown-arrow"></i>
        </div>

        <div class="dropdown-menu" id="dropdownMenu">
          <a href="${basePath}page/perfil_usuario.html" class="dropdown-item">
            <span class="dropdown-icon">👤</span> Ver Perfil
          </a>
          <a href="#" id="btnCerrarSesionDropdown" class="dropdown-item">
            <span class="dropdown-icon">🚪</span> Cerrar Sesión
          </a>
        </div>
      `;

      navButtons.appendChild(cont);

      const trigger = cont.querySelector(".user-profile-trigger");
      const menu = cont.querySelector(".dropdown-menu");

      trigger.addEventListener("click", e => {
        e.stopPropagation();
        menu.classList.toggle("show");
        trigger.classList.toggle("active");
      });

      document.addEventListener("click", e => {
        if (!cont.contains(e.target)) {
          menu.classList.remove("show");
          trigger.classList.remove("active");
        }
      });

      cont.querySelector("#btnCerrarSesionDropdown").addEventListener("click", e => {
        e.preventDefault();
        if (confirm("¿Cerrar sesión?")) SessionManager.logout();
      });
    } else {
      // Update the username if it changed
      const nameSpan = cont.querySelector(".user-name");
      if (nameSpan) nameSpan.textContent = user.nombre;
    }
  },

  showLoginButtons: function (basePath) {
    const ids = [
      ["btnLogin", "iniciar_sesion.html"],
      ["btnRegister", "registrar.html"],
      ["btnLoginDesktop", "iniciar_sesion.html"],
      ["btnRegisterDesktop", "registrar.html"]
    ];

    ids.forEach(([id, page]) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.style.display = "inline-block";
        btn.onclick = () => (window.location.href = basePath + "page/" + page);
      }
    });
  }
};

// ==========================================
// INICIALIZACIÓN + AUTOCOMPLETE + REDIRECCIÓN FILTRADA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  HeaderManager.updateHeader();

  const input = document.getElementById("searchInput");
  const list = document.getElementById("suggestionsList");
  const form = document.getElementById("searchForm");

  if (!input || !list || !form) return;

  const sugerencias = [
    "surco",
    "surquillo",
    "san borja",
    "monterrico",
    "san isidro",
    "jesus maria",
    "san miguel"
  ];

  input.addEventListener("input", () => {
    const txt = input.value.trim().toLowerCase();

    if (txt === "") {
      list.style.display = "none";
      return;
    }

    list.innerHTML = "";

    sugerencias
      .filter(item => item.toLowerCase().includes(txt))
      .forEach(match => {
        const li = document.createElement("li");
        li.textContent = match;

        li.style.color = "#333";
        li.style.fontSize = "15px";
        li.style.padding = "10px 15px";

        li.onclick = () => {
          input.value = match;
          list.style.display = "none";
        };

        list.appendChild(li);
      });

    list.style.display = list.children.length ? "block" : "none";
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".search-container")) list.style.display = "none";
  });

  // ======================================
  // 🔥 REDIRECCIÓN con filtro ?q=
  // ======================================
  form.addEventListener("submit", e => {
    e.preventDefault();

    const q = input.value.trim();

    window.location.href = `page/catalogo.html?q=${encodeURIComponent(q)}`;
  });
});
