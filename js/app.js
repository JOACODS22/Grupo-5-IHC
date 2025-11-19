// ==========================================
// SESSION MANAGER - Manejo de sesiones y LocalStorage
// ==========================================

const SessionManager = {
    // Obtener usuario actual
    getUser: function() {
        const usuarioActivoEmail = localStorage.getItem("usuarioActivo");
        if (!usuarioActivoEmail) return null;

        // Obtener todos los usuarios
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Buscar el usuario activo por email
        const usuario = usuarios.find(user => user.email === usuarioActivoEmail);
        return usuario || null;
    },

    // Verificar si hay sesión activa
    isLoggedIn: function() {
        return localStorage.getItem("sesionActiva") === "true";
    },

    // Cerrar sesión
    logout: function() {
        localStorage.removeItem("sesionActiva");
        localStorage.removeItem("usuarioActivo");
        window.location.href = this.getBasePath() + "index.html";
    },

    // Obtener base path dependiendo de la ubicación
    getBasePath: function() {
        const path = window.location.pathname;
        return path.includes('/page/') ? '../' : '';
    },

    // Proteger página (solo accesible si hay sesión)
    protectPage: function() {
        if (!this.isLoggedIn()) {
            alert("Debes iniciar sesión para acceder a esta página");
            window.location.href = this.getBasePath() + "page/iniciar_sesion.html";
        }
    },

    // Actualizar nombre del usuario
    updateUserName: function(nuevoNombre) {
        const usuarioActivoEmail = localStorage.getItem("usuarioActivo");
        if (!usuarioActivoEmail) return false;

        // Obtener todos los usuarios
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Encontrar el índice del usuario activo
        const indexUsuario = usuarios.findIndex(user => user.email === usuarioActivoEmail);

        if (indexUsuario === -1) return false;

        // Actualizar el nombre
        usuarios[indexUsuario].nombre = nuevoNombre;

        // Guardar en localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        return true;
    }
};

// ==========================================
// HEADER MANAGER - Manejo dinámico del header
// ==========================================

const HeaderManager = {
    // Actualizar header según estado de sesión
    updateHeader: function() {
        const user = SessionManager.getUser();
        const isLoggedIn = SessionManager.isLoggedIn();
        const basePath = SessionManager.getBasePath();

        // Buscar elementos del header (compatibilidad con diferentes estructuras)
        const btnLogin = document.getElementById('btnLogin');
        const btnRegister = document.getElementById('btnRegister');
        const btnLoginDesk = document.getElementById('btnLoginDesktop');
        const btnRegisterDesk = document.getElementById('btnRegisterDesktop');

        if (isLoggedIn && user) {
            // Usuario logueado - mostrar perfil
            this.showUserProfile(user, basePath);

            // Ocultar botones de login/register
            if (btnLogin) btnLogin.style.display = 'none';
            if (btnRegister) btnRegister.style.display = 'none';
            if (btnLoginDesk) btnLoginDesk.style.display = 'none';
            if (btnRegisterDesk) btnRegisterDesk.style.display = 'none';
        } else {
            // Usuario no logueado - mostrar botones
            this.showLoginButtons(basePath);

            // Remover perfil de usuario si existe
            const userProfile = document.getElementById('userProfileDropdown');
            if (userProfile) userProfile.remove();
        }
    },

    // Mostrar perfil de usuario con dropdown
    showUserProfile: function(user, basePath) {
        const navButtons = document.querySelector('.nav-buttons');
        if (!navButtons) return;

        // Verificar si ya existe el dropdown
        let userProfile = document.getElementById('userProfileDropdown');
        if (!userProfile) {
            userProfile = document.createElement('div');
            userProfile.id = 'userProfileDropdown';
            userProfile.className = 'user-profile-dropdown';
            userProfile.innerHTML = `
                <div class="user-profile-trigger">
                    <div class="user-avatar">
                        👤
                    </div>
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
            navButtons.appendChild(userProfile);

            // Agregar estilos si no existen
            this.addDropdownStyles();

            // Event listener para toggle del dropdown
            const trigger = userProfile.querySelector('.user-profile-trigger');
            const dropdownMenu = userProfile.querySelector('.dropdown-menu');

            trigger.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            // Cerrar dropdown al hacer click fuera
            document.addEventListener('click', function(e) {
                if (!userProfile.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });

            // Event listener para cerrar sesión
            const btnCerrar = document.getElementById('btnCerrarSesionDropdown');
            btnCerrar.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                    SessionManager.logout();
                }
            });
        }
    },

    // Mostrar botones de login/registro
    showLoginButtons: function(basePath) {
        const btnLogin = document.getElementById('btnLogin');
        const btnRegister = document.getElementById('btnRegister');
        const btnLoginDesk = document.getElementById('btnLoginDesktop');
        const btnRegisterDesk = document.getElementById('btnRegisterDesktop');

        // Configurar rutas correctas
        if (btnLogin) {
            btnLogin.style.display = 'block';
            btnLogin.onclick = () => window.location.href = basePath + "page/iniciar_sesion.html";
        }
        if (btnRegister) {
            btnRegister.style.display = 'block';
            btnRegister.onclick = () => window.location.href = basePath + "page/registrar.html";
        }
        if (btnLoginDesk) {
            btnLoginDesk.style.display = 'inline-block';
            btnLoginDesk.onclick = () => window.location.href = basePath + "page/iniciar_sesion.html";
        }
        if (btnRegisterDesk) {
            btnRegisterDesk.style.display = 'inline-block';
            btnRegisterDesk.onclick = () => window.location.href = basePath + "page/registrar.html";
        }
    },

    // Agregar estilos para el dropdown
    addDropdownStyles: function() {
        if (document.getElementById('dropdownStyles')) return;

        const style = document.createElement('style');
        style.id = 'dropdownStyles';
        style.textContent = `
            .user-profile-dropdown {
                position: relative;
                display: inline-block;
            }

            .user-profile-trigger {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                padding: 8px 15px;
                background-color: rgba(255, 255, 255, 0.6);
                border-radius: 25px;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }

            .user-profile-trigger:hover {
                background-color: rgba(255, 255, 255, 0.9);
                border-color: #007c91;
                box-shadow: 0 2px 8px rgba(0, 124, 145, 0.2);
            }

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #007c91 0%, #005f6b 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 22px;
                box-shadow: 0 2px 8px rgba(0, 124, 145, 0.3);
            }

            .user-name {
                color: #333;
                font-weight: 600;
                font-size: 15px;
            }

            .dropdown-arrow {
                color: #333;
                font-size: 12px;
                transition: transform 0.3s ease;
            }

            .user-profile-trigger:hover .dropdown-arrow {
                transform: rotate(180deg);
            }

            .dropdown-icon {
                font-size: 18px;
                display: inline-block;
                width: 24px;
                text-align: center;
            }

            .dropdown-menu {
                position: absolute;
                top: 110%;
                right: 0;
                background-color: white;
                min-width: 200px;
                box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                border-radius: 8px;
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .dropdown-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                transition: background-color 0.2s ease;
                font-size: 14px;
            }

            .dropdown-item:hover {
                background-color: #f5f5f5;
            }

            .dropdown-item i {
                color: #007c91;
                font-size: 16px;
                width: 20px;
            }

            .dropdown-item:first-child {
                border-bottom: 1px solid #e0e0e0;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .user-profile-trigger {
                    padding: 6px 12px;
                }

                .user-avatar {
                    width: 30px;
                    height: 30px;
                    font-size: 14px;
                }

                .user-name {
                    font-size: 14px;
                }

                .dropdown-menu {
                    min-width: 180px;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar header en todas las páginas
    HeaderManager.updateHeader();

    // Mantener compatibilidad con código existente del menú hamburguesa
    const toggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

