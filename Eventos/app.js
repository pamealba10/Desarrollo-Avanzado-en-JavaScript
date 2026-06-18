// ==============================
// REGISTRO DE EVENTOS - SCRIPT
// ==============================

class RegistroEventos {
    constructor() {
        this.form = document.getElementById('registroForm');
        this.modal = document.getElementById('successModal');
        this.modalBody = document.getElementById('modalBody');
        
        // Configuración de validación
        this.config = {
            maxFileSize: 5 * 1024 * 1024, // 5MB
            allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
            minAge: 18,
            maxAge: 120,
            telefonoRegex: /^(\d{2,3}\s?)?\d{3,4}\s?\d{4}$/
        };
        
        // Inicializar eventos
        this.initEventListeners();
    }

    // ==============================
    // INICIALIZACIÓN
    // ==============================

    initEventListeners() {
        // Validación en tiempo real (al escribir)
        document.getElementById('nombre').addEventListener('input', (e) => this.validarNombre(e.target));
        document.getElementById('email').addEventListener('input', (e) => this.validarEmail(e.target));
        document.getElementById('telefono').addEventListener('input', (e) => this.validarTelefono(e.target));
        document.getElementById('edad').addEventListener('input', (e) => this.validarEdad(e.target));
        document.getElementById('fecha').addEventListener('change', (e) => this.validarFecha(e.target));
        document.getElementById('documento').addEventListener('change', (e) => this.validarArchivo(e.target));
        
        // Validación de intereses y horario al cambiar
        document.querySelectorAll('input[name="intereses"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.validarIntereses());
        });
        
        document.querySelectorAll('input[name="horario"]').forEach(radio => {
            radio.addEventListener('change', () => this.validarHorario());
        });
        
        // Validación de términos
        document.getElementById('terminos').addEventListener('change', (e) => this.validarTerminos(e.target));
        
        // Evento de submit
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Evento de reset
        this.form.addEventListener('reset', (e) => this.handleReset());
    }

    // ==============================
    // VALIDACIONES INDIVIDUALES
    // ==============================

    // 1. Validación de Nombre
    validarNombre(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById('nombreError');
        
        // Validación 1: No vacío
        if (!value) {
            this.mostrarError(input, errorElement, 'El nombre es obligatorio');
            return false;
        }
        
        // Validación 2: Mínimo 2 caracteres
        if (value.length < 2) {
            this.mostrarError(input, errorElement, 'El nombre debe tener al menos 2 caracteres');
            return false;
        }
        
        // Validación 3: Solo letras y espacios
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            this.mostrarError(input, errorElement, 'El nombre solo puede contener letras y espacios');
            return false;
        }
        
        // Validación 4: No más de 50 caracteres
        if (value.length > 50) {
            this.mostrarError(input, errorElement, 'El nombre no puede exceder 50 caracteres');
            return false;
        }
        
        this.mostrarExito(input, errorElement);
        return true;
    }

    // 2. Validación de Email
    validarEmail(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById('emailError');
        
        // Validación 1: No vacío
        if (!value) {
            this.mostrarError(input, errorElement, 'El correo electrónico es obligatorio');
            return false;
        }
        
        // Validación 2: Formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.mostrarError(input, errorElement, 'Ingresa un correo electrónico válido (ejemplo@dominio.com)');
            return false;
        }
        
        // Validación 3: Dominios permitidos (ejemplo adicional)
        const allowedDomains = ['.com', '.es', '.mx', '.org', '.net'];
        const domain = value.substring(value.lastIndexOf('.'));
        if (!allowedDomains.includes(domain) && !value.endsWith('.com.mx')) {
            this.mostrarError(input, errorElement, 'El dominio del correo no está permitido');
            return false;
        }
        
        this.mostrarExito(input, errorElement);
        return true;
    }

    // 3. Validación de Teléfono
    validarTelefono(input) {
        const value = input.value.trim();
        const errorElement = document.getElementById('telefonoError');
        
        // Validación 1: No vacío
        if (!value) {
            this.mostrarError(input, errorElement, 'El número de teléfono es obligatorio');
            return false;
        }
        
        // Validación 2: Mínimo 10 dígitos
        const digits = value.replace(/\s/g, '');
        if (digits.length < 10) {
            this.mostrarError(input, errorElement, 'El teléfono debe tener al menos 10 dígitos');
            return false;
        }
        
        // Validación 3: Solo números y espacios
        if (!/^[\d\s]+$/.test(value)) {
            this.mostrarError(input, errorElement, 'El teléfono solo puede contener números y espacios');
            return false;
        }
        
        // Validación 4: Formato permitido (ej: 55 1234 5678)
        if (!this.config.telefonoRegex.test(value) && !/^\d{10}$/.test(value.replace(/\s/g, ''))) {
            this.mostrarError(input, errorElement, 'Formato sugerido: 55 1234 5678 o 5512345678');
            return false;
        }
        
        this.mostrarExito(input, errorElement);
        return true;
    }

    // 4. Validación de Edad
    validarEdad(input) {
        const value = parseInt(input.value);
        const errorElement = document.getElementById('edadError');
        
        // Validación 1: No vacío
        if (!input.value) {
            this.mostrarError(input, errorElement, 'La edad es obligatoria');
            return false;
        }
        
        // Validación 2: Es un número
        if (isNaN(value)) {
            this.mostrarError(input, errorElement, 'Ingresa un número válido');
            return false;
        }
        
        // Validación 3: Edad mínima
        if (value < this.config.minAge) {
            this.mostrarError(input, errorElement, `Debes tener al menos ${this.config.minAge} años para registrarte`);
            return false;
        }
        
        // Validación 4: Edad máxima
        if (value > this.config.maxAge) {
            this.mostrarError(input, errorElement, `La edad máxima permitida es ${this.config.maxAge} años`);
            return false;
        }
        
        this.mostrarExito(input, errorElement);
        return true;
    }

    // 5. Validación de Intereses
    validarIntereses() {
        const checkboxes = document.querySelectorAll('input[name="intereses"]:checked');
        const errorElement = document.getElementById('interesesError');
        
        // Validación: Al menos un interés seleccionado
        if (checkboxes.length === 0) {
            this.mostrarError(null, errorElement, 'Selecciona al menos un interés');
            return false;
        }
        
        // Validación extra: Máximo 3 intereses
        if (checkboxes.length > 3) {
            this.mostrarError(null, errorElement, 'Puedes seleccionar máximo 3 intereses');
            return false;
        }
        
        this.mostrarExito(null, errorElement);
        return true;
    }

    // 6. Validación de Horario
    validarHorario() {
        const radioSeleccionado = document.querySelector('input[name="horario"]:checked');
        const errorElement = document.getElementById('horarioError');
        
        // Validación: Horario seleccionado
        if (!radioSeleccionado) {
            this.mostrarError(null, errorElement, 'Selecciona un horario preferido');
            return false;
        }
        
        this.mostrarExito(null, errorElement);
        return true;
    }

    // 7. Validación de Fecha
    validarFecha(input) {
        const value = input.value;
        const errorElement = document.getElementById('fechaError');
        
        // Validación 1: Fecha seleccionada
        if (!value) {
            this.mostrarError(input, errorElement, 'Selecciona una fecha para el evento');
            return false;
        }
        
        // Validación 2: Fecha no puede ser en el pasado
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            this.mostrarError(input, errorElement, 'La fecha no puede ser en el pasado');
            return false;
        }
        
        // Validación 3: Fecha no puede ser más de 1 año después
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        if (selectedDate > maxDate) {
            this.mostrarError(input, errorElement, 'La fecha no puede ser más de 1 año en el futuro');
            return false;
        }
        
        this.mostrarExito(input, errorElement);
        return true;
    }

    // 8. Validación de Archivo
    validarArchivo(input) {
        const file = input.files[0];
        const errorElement = document.getElementById('documentoError');
        
        // Si no hay archivo, es opcional, así que no hay error
        if (!file) {
            this.mostrarExito(input, errorElement);
            return true;
        }
        
        // Validación 1: Tipo de archivo permitido
        if (!this.config.allowedFileTypes.includes(file.type)) {
            this.mostrarError(input, errorElement, 'Formato de archivo no permitido. Usa PDF, JPG o PNG');
            return false;
        }
        
        // Validación 2: Tamaño máximo
        if (file.size > this.config.maxFileSize) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            this.mostrarError(input, errorElement, `El archivo es demasiado grande (${sizeMB}MB). Máximo 5MB`);
            return false;
        }
        
        // Validación 3: Nombre del archivo (sin caracteres especiales)
        if (!/^[a-zA-Z0-9_\-.]+$/.test(file.name)) {
            this.mostrarError(input, errorElement, 'El nombre del archivo contiene caracteres no permitidos');
            return false;
        }
        
        this.mostrarExito(input, errorElement);
        return true;
    }

    // 9. Validación de Términos
    validarTerminos(input) {
        const errorElement = document.getElementById('terminosError');
        
        if (!input.checked) {
            this.mostrarError(null, errorElement, 'Debes aceptar los términos y condiciones');
            return false;
        }
        
        this.mostrarExito(null, errorElement);
        return true;
    }

    // ==============================
    // UTILIDADES DE VALIDACIÓN
    // ==============================

    mostrarError(input, errorElement, mensaje) {
        errorElement.textContent = mensaje;
        errorElement.classList.add('visible');
        
        if (input) {
            input.classList.remove('success');
            input.classList.add('error');
        }
    }

    mostrarExito(input, errorElement) {
        errorElement.classList.remove('visible');
        errorElement.textContent = '';
        
        if (input) {
            input.classList.remove('error');
            if (input.value.trim()) {
                input.classList.add('success');
            }
        }
    }

    // ==============================
    // VALIDACIÓN COMPLETA
    // ==============================

    validarFormulario() {
        // Ejecuta todas las validaciones y solo permite continuar si cada campo pasa su regla.
        const esValido = 
            this.validarNombre(document.getElementById('nombre')) &&
            this.validarEmail(document.getElementById('email')) &&
            this.validarTelefono(document.getElementById('telefono')) &&
            this.validarEdad(document.getElementById('edad')) &&
            this.validarIntereses() &&
            this.validarHorario() &&
            this.validarFecha(document.getElementById('fecha')) &&
            this.validarArchivo(document.getElementById('documento')) &&
            this.validarTerminos(document.getElementById('terminos'));
        
        return esValido;
    }

    // ==============================
    // MANEJO DE EVENTOS
    // ==============================

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validarFormulario()) {
            this.mostrarModalExito();
        } else {
            // Scrollear al primer error
            const firstError = document.querySelector('.error-message.visible');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Mostrar mensaje general
            this.mostrarMensajeGeneral('Por favor, corrige los errores marcados en el formulario', 'error');
        }
    }

    handleReset() {
        // Limpiar todos los mensajes de error y estilos
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('visible');
            el.textContent = '';
        });
        
        document.querySelectorAll('.form-group input').forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        // Ocultar mensaje general
        this.ocultarMensajeGeneral();
    }

    // ==============================
    // MODAL DE ÉXITO
    // ==============================

    mostrarModalExito() {
        // Reúne los datos del formulario para mostrarlos en el modal de confirmación.
        const formData = new FormData(this.form);
        
        const data = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            edad: formData.get('edad'),
            intereses: Array.from(formData.getAll('intereses')),
            horario: formData.get('horario'),
            fecha: formData.get('fecha'),
            documento: formData.get('documento') || 'No se subió archivo'
        };
        
        const interesesList = data.intereses.length > 0 
            ? data.intereses.map(i => {
                const labels = {
                    'tecnologia': '💻 Tecnología',
                    'negocios': '📊 Negocios',
                    'innovacion': '🚀 Innovación',
                    'sostenibilidad': '🌱 Sostenibilidad',
                    'marketing': '📈 Marketing Digital',
                    'ia': '🤖 Inteligencia Artificial'
                };
                return labels[i] || i;
            }).join(', ')
            : 'Ninguno seleccionado';
        
        const horarios = {
            'mañana': '🌅 Mañana (9:00 - 12:00)',
            'tarde': '☀️ Tarde (14:00 - 17:00)',
            'noche': '🌙 Noche (19:00 - 22:00)'
        };
        
        this.modalBody.innerHTML = `
            <p><strong>👤 Nombre:</strong> ${data.nombre}</p>
            <p><strong>📧 Email:</strong> ${data.email}</p>
            <p><strong>📱 Teléfono:</strong> ${data.telefono}</p>
            <p><strong>🎂 Edad:</strong> ${data.edad} años</p>
            <p><strong>🎯 Intereses:</strong> ${interesesList}</p>
            <p><strong>⏰ Horario:</strong> ${horarios[data.horario] || data.horario}</p>
            <p><strong>📅 Fecha:</strong> ${new Date(data.fecha).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
            <p><strong>📎 Documento:</strong> ${data.documento || 'No subido'}</p>
        `;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    cerrarModal() {
        // Cierra el modal, restaura el scroll y deja el formulario listo para un nuevo registro.
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.form.reset();
        this.handleReset();
    }

    // ==============================
    // MENSAJES GENERALES
    // ==============================

    mostrarMensajeGeneral(mensaje, tipo) {
        const existingMsg = document.querySelector('.general-message');
        if (existingMsg) existingMsg.remove();
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `general-message ${tipo}`;
        msgDiv.style.cssText = `
            padding: 12px 20px;
            border-radius: 8px;
            margin-top: 20px;
            font-weight: 600;
            ${tipo === 'error' ? 
                'background: #fff5f5; color: #e53e3e; border: 1px solid #feb2b2;' : 
                'background: #f0fff4; color: #276749; border: 1px solid #9ae6b4;'
            }
        `;
        msgDiv.textContent = mensaje;
        
        this.form.appendChild(msgDiv);
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            if (msgDiv.parentNode) msgDiv.remove();
        }, 5000);
    }

    ocultarMensajeGeneral() {
        const msg = document.querySelector('.general-message');
        if (msg) msg.remove();
    }
}

// ==============================
// EXPOSICIÓN DE FUNCIONES GLOBALES
// ==============================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new RegistroEventos();
    
    // Expone la acción del botón del modal para que pueda cerrarse desde el HTML.
    window.cerrarModal = () => {
        if (app) app.cerrarModal();
    };
});
