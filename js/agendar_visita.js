// Funcionalidad para los botones de agendar
document.addEventListener('DOMContentLoaded', function() {
    const scheduleButtons = document.querySelectorAll('.btn-circle');
    const confirmarBtn = document.querySelector('.btn-confirmar');

    // Variables para almacenar la información de la reserva
    let reservaInfo = {
        fecha: null,
        hora: null,
        notificacion: false
    };

    // Función para el botón de FECHA
    scheduleButtons[0].addEventListener('click', function() {
        const fechaInput = prompt('Ingrese la fecha de su visita (DD/MM/YYYY):');
        if (fechaInput) {
            reservaInfo.fecha = fechaInput;
            this.style.backgroundColor = '#28a745';
            alert('Fecha seleccionada: ' + fechaInput);
        }
    });

    // Función para el botón de HORA
    scheduleButtons[1].addEventListener('click', function() {
        const horaInput = prompt('Ingrese la hora de su visita (HH:MM):');
        if (horaInput) {
            reservaInfo.hora = horaInput;
            this.style.backgroundColor = '#28a745';
            alert('Hora seleccionada: ' + horaInput);
        }
    });

    // Función para el botón de AGREGAR NOTIFICACIÓN
    scheduleButtons[2].addEventListener('click', function() {
        const confirmar = confirm('¿Desea recibir notificaciones sobre esta reserva?');
        if (confirmar) {
            reservaInfo.notificacion = true;
            this.style.backgroundColor = '#28a745';
            alert('Se enviarán notificaciones a su correo electrónico');
        }
    });

    // Función para confirmar la reserva
    confirmarBtn.addEventListener('click', function() {
        if (!reservaInfo.fecha || !reservaInfo.hora) {
            alert('Por favor, complete la fecha y hora de su visita antes de confirmar.');
            return;
        }

        const confirmacion = confirm(
            `¿Confirmar reserva?\n\n` +
            `Fecha: ${reservaInfo.fecha}\n` +
            `Hora: ${reservaInfo.hora}\n` +
            `Notificaciones: ${reservaInfo.notificacion ? 'Activadas' : 'Desactivadas'}`
        );

        if (confirmacion) {
            alert('¡Reserva confirmada exitosamente!\n\nRecibirá un correo de confirmación en breve.');
            // Aquí se puede agregar la lógica para enviar los datos al servidor
            console.log('Información de reserva:', reservaInfo);
        }
    });

    // Animación para las estrellas de calificación
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.style.transform = 'scale(1.2)';
                }
            });
        });

        star.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                s.style.transform = 'scale(1)';
            });
        });
    });

    // Efecto de hover en los feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

