// ==========================================
// SISTEMA DE RESERVAS INTERACTIVO
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const scheduleButtons = document.querySelectorAll('.btn-circle');
    const confirmarBtn = document.querySelector('.btn-confirmar');
    const scheduleItems = document.querySelectorAll('.schedule-item');

    // Contador de reservas
    let reservaCounter = 0;

    // Variables para almacenar la información de la reserva actual
    let reservaInfo = {
        fecha: null,
        hora: null,
        notificacion: false
    };

    // ==========================================
    // BOTÓN DE FECHA - Crear input date
    // ==========================================
    scheduleButtons[0].addEventListener('click', function() {
        const scheduleItem = scheduleItems[0];

        // Verificar si ya existe un input
        if (scheduleItem.querySelector('input[type="date"]')) {
            return;
        }

        // Crear input de fecha
        const fechaInput = document.createElement('input');
        fechaInput.type = 'date';
        fechaInput.className = 'input-reserva';
        fechaInput.min = new Date().toISOString().split('T')[0]; // No permitir fechas pasadas

        // Evento cuando se selecciona una fecha
        fechaInput.addEventListener('change', function() {
            reservaInfo.fecha = this.value;
            scheduleButtons[0].style.backgroundColor = '#28a745';
            scheduleButtons[0].innerHTML = '<i class="fas fa-check"></i>';
        });

        // Agregar el input después del label
        scheduleItem.appendChild(fechaInput);
        fechaInput.focus();
    });

    // ==========================================
    // BOTÓN DE HORA - Crear input time
    // ==========================================
    scheduleButtons[1].addEventListener('click', function() {
        const scheduleItem = scheduleItems[1];

        // Verificar si ya existe un input
        if (scheduleItem.querySelector('input[type="time"]')) {
            return;
        }

        // Crear input de hora
        const horaInput = document.createElement('input');
        horaInput.type = 'time';
        horaInput.className = 'input-reserva';

        // Evento cuando se selecciona una hora
        horaInput.addEventListener('change', function() {
            reservaInfo.hora = this.value;
            scheduleButtons[1].style.backgroundColor = '#28a745';
            scheduleButtons[1].innerHTML = '<i class="fas fa-check"></i>';
        });

        // Agregar el input después del label
        scheduleItem.appendChild(horaInput);
        horaInput.focus();
    });

    // ==========================================
    // BOTÓN DE NOTIFICACIÓN - Crear checkbox
    // ==========================================
    scheduleButtons[2].addEventListener('click', function() {
        const scheduleItem = scheduleItems[2];

        // Verificar si ya existe un checkbox
        if (scheduleItem.querySelector('input[type="checkbox"]')) {
            const checkbox = scheduleItem.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            reservaInfo.notificacion = checkbox.checked;

            if (checkbox.checked) {
                scheduleButtons[2].style.backgroundColor = '#28a745';
                scheduleButtons[2].innerHTML = '<i class="fas fa-check"></i>';
            } else {
                scheduleButtons[2].style.backgroundColor = '#007c91';
                scheduleButtons[2].innerHTML = '<i class="fas fa-plus"></i>';
            }
            return;
        }

        // Crear contenedor para checkbox
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';
        checkboxContainer.innerHTML = `
            <input type="checkbox" id="notificacion-checkbox" class="input-checkbox">
            <label for="notificacion-checkbox" style="margin-left: 10px; cursor: pointer;">
                ¿Desea recibir notificaciones?
            </label>
        `;

        // Agregar el checkbox después del label
        scheduleItem.appendChild(checkboxContainer);

        const checkbox = checkboxContainer.querySelector('input[type="checkbox"]');
        checkbox.checked = true;
        reservaInfo.notificacion = true;

        // Cambiar apariencia del botón
        scheduleButtons[2].style.backgroundColor = '#28a745';
        scheduleButtons[2].innerHTML = '<i class="fas fa-check"></i>';

        // Evento cuando cambia el checkbox
        checkbox.addEventListener('change', function() {
            reservaInfo.notificacion = this.checked;

            if (this.checked) {
                scheduleButtons[2].style.backgroundColor = '#28a745';
                scheduleButtons[2].innerHTML = '<i class="fas fa-check"></i>';
            } else {
                scheduleButtons[2].style.backgroundColor = '#007c91';
                scheduleButtons[2].innerHTML = '<i class="fas fa-plus"></i>';
            }
        });
    });

    // ==========================================
    // BOTÓN CONFIRMAR RESERVA
    // ==========================================
    confirmarBtn.addEventListener('click', function() {
        // Validar que se haya seleccionado fecha y hora
        if (!reservaInfo.fecha || !reservaInfo.hora) {
            alert('⚠️ Por favor, complete la fecha y hora de su visita antes de confirmar.');
            return;
        }

        // Incrementar contador de reservas
        reservaCounter++;

        // Formatear la fecha
        const fechaObj = new Date(reservaInfo.fecha + 'T00:00:00');
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opciones);

        // Crear elemento de reserva confirmada
        const reservaElement = document.createElement('div');
        reservaElement.className = 'reserva-confirmada';
        reservaElement.innerHTML = `
            <div class="reserva-header">
                <h3>✅ Reserva ${reservaCounter}</h3>
                <button class="btn-eliminar-reserva" onclick="eliminarReserva(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="reserva-info">
                <p><i class="fas fa-calendar"></i> <strong>Fecha:</strong> ${fechaFormateada}</p>
                <p><i class="fas fa-clock"></i> <strong>Hora:</strong> ${reservaInfo.hora}</p>
                <p><i class="fas fa-bell"></i> <strong>Notificaciones:</strong> ${reservaInfo.notificacion ? 'Sí' : 'No'}</p>
            </div>
        `;

        // Agregar la reserva al contenedor de reservas
        let reservasContainer = document.getElementById('reservas-lista');

        // Si no existe el contenedor, crearlo
        if (!reservasContainer) {
            reservasContainer = document.createElement('div');
            reservasContainer.id = 'reservas-lista';
            reservasContainer.className = 'reservas-lista';

            // Agregar título
            const tituloReservas = document.createElement('h2');
            tituloReservas.className = 'titulo-reservas';
            tituloReservas.textContent = 'Mis Reservas';

            // Insertar después de la sección de detalles
            const mainContent = document.querySelector('.main-content');
            mainContent.appendChild(tituloReservas);
            mainContent.appendChild(reservasContainer);
        }

        // Agregar la nueva reserva al inicio
        reservasContainer.insertBefore(reservaElement, reservasContainer.firstChild);

        // Mostrar mensaje de confirmación
        alert(`✅ ¡Reserva ${reservaCounter} confirmada exitosamente!\n\nFecha: ${fechaFormateada}\nHora: ${reservaInfo.hora}\nNotificaciones: ${reservaInfo.notificacion ? 'Sí' : 'No'}`);

        // Resetear el formulario
        resetearFormulario();
    });

    // ==========================================
    // FUNCIÓN PARA RESETEAR EL FORMULARIO
    // ==========================================
    function resetearFormulario() {
        // Resetear información de reserva
        reservaInfo = {
            fecha: null,
            hora: null,
            notificacion: false
        };

        // Resetear botones
        scheduleButtons.forEach((btn, index) => {
            btn.style.backgroundColor = '#007c91';
            btn.innerHTML = '<i class="fas fa-plus"></i>';
        });

        // Eliminar inputs creados
        document.querySelectorAll('.input-reserva, .checkbox-container').forEach(el => el.remove());
    }
});

// ==========================================
// FUNCIÓN GLOBAL PARA ELIMINAR RESERVA
// ==========================================
function eliminarReserva(button) {
    if (confirm('¿Está seguro que desea eliminar esta reserva?')) {
        const reservaElement = button.closest('.reserva-confirmada');
        reservaElement.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            reservaElement.remove();

            // Si no quedan reservas, eliminar el contenedor y título
            const reservasContainer = document.getElementById('reservas-lista');
            if (reservasContainer && reservasContainer.children.length === 0) {
                reservasContainer.previousElementSibling.remove(); // Título
                reservasContainer.remove();
            }
        }, 300);
    }
}

