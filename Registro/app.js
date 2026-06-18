// ================================
// REGISTRO CON VALIDACIÓN ZOD
// ================================
// Este archivo controla la validación del formulario, la interacción en tiempo real y el mensaje de éxito.

// ================================
// 1. DEFINIR ESQUEMA DE VALIDACIÓN CON ZOD
// ================================

// Creamos el esquema de validación
const esquemaRegistro = Zod.object({
    nombre: Zod.string()
        .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
        .max(50, { message: 'El nombre no puede exceder 50 caracteres' })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
            message: 'El nombre solo puede contener letras y espacios'
        })
        .trim(),
    
    email: Zod.string()
        .email({ message: 'Ingresa un correo electrónico válido' })
        .min(1, { message: 'El correo electrónico es obligatorio' })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: 'El formato del correo no es válido'
        })
        .toLowerCase()
        .trim(),
    
    password: Zod.string()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
        .max(100, { message: 'La contraseña es demasiado larga' })
        .regex(/[A-Z]/, {
            message: 'La contraseña debe contener al menos una mayúscula'
        })
        .regex(/[a-z]/, {
            message: 'La contraseña debe contener al menos una minúscula'
        })
        .regex(/[0-9]/, {
            message: 'La contraseña debe contener al menos un número'
        })
        .regex(/[^A-Za-z0-9]/, {
            message: 'La contraseña debe contener al menos un carácter especial'
        })
        .trim(),
    
    confirmPassword: Zod.string()
        .min(1, { message: 'Confirma tu contraseña' }),
    
    terminos: Zod.boolean()
        .refine(val => val === true, {
            message: 'Debes aceptar los términos y condiciones'
        })
});

// ================================
// 2. CLASE PRINCIPAL
// ================================

class RegistroZod {
    constructor() {
        // Guardar referencias a los campos y bloques de error para usarlos en toda la clase.
        this.form = document.getElementById('registroForm');
        this.nombreInput = document.getElementById('nombre');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.terminosInput = document.getElementById('terminos');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.userData = document.getElementById('userData');
        
        // Elementos de error
        this.errorElements = {
            nombre: document.getElementById('nombreError'),
            email: document.getElementById('emailError'),
            password: document.getElementById('passwordError'),
            confirmPassword: document.getElementById('confirmPasswordError'),
            terminos: document.getElementById('terminosError')
        };
        
        // Variables internas para controlar el envío y el temporizador de validación.
        this.isSubmitting = false;
        this.validationTimer = null;
        
        // Inicializar
        this.initEventListeners();
    }

    // ================================
    // 3. INICIALIZAR EVENTOS
    // ================================

    initEventListeners() {
        // Escuchar cambios en cada campo para validar mientras el usuario escribe.
        this.nombreInput.addEventListener('input', () => this.debounceValidate('nombre'));
        this.emailInput.addEventListener('input', () => this.debounceValidate('email'));
        this.passwordInput.addEventListener('input', () => {
            this.debounceValidate('password');
            this.updatePasswordStrength();
        });
        this.confirmPasswordInput.addEventListener('input', () => this.debounceValidate('confirmPassword'));
        this.terminosInput.addEventListener('change', () => this.validateField('terminos'));
        
        // Mostrar u ocultar la contraseña desde el botón del ojo.
        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
        
        // Submit del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Reset del formulario
        this.form.addEventListener('reset', () => this.handleReset());
    }

    // ================================
    // 4. VALIDACIÓN CON DEBOUNCE
    // ================================

    debounceValidate(field) {
        // Evita validar en cada pulsación y espera un pequeño intervalo antes de ejecutar la validación.
        clearTimeout(this.validationTimer);
        this.validationTimer = setTimeout(() => {
            this.validateField(field);
        }, 300);
    }

    // ================================
    // 5. VALIDAR UN CAMPO ESPECÍFICO
    // ================================

    validateField(field) {
        // Valida un campo concreto y pinta errores o estado correcto según el resultado.
        const data = this.getFormData();
        const errorElement = this.errorElements[field];
        const inputElement = this.getInputElement(field);
        
        // Validar solo el campo específico
        try {
            // Para confirmPassword necesitamos validación cruzada
            if (field === 'confirmPassword') {
                if (data.password && data.confirmPassword !== data.password) {
                    throw new Error('Las contraseñas no coinciden');
                }
                // Si está vacío
                if (!data.confirmPassword) {
                    throw new Error('Confirma tu contraseña');
                }
            }
            
            // Para términos
            if (field === 'terminos') {
                if (!data.terminos) {
                    throw new Error('Debes aceptar los términos y condiciones');
                }
                this.showSuccess(inputElement, errorElement);
                return true;
            }
            
            // Validar con Zod
            const fieldSchema = this.getFieldSchema(field);
            const result = fieldSchema.parse(data[field]);
            
            // Si llegamos aquí, la validación pasó
            this.showSuccess(inputElement, errorElement);
            return true;
            
        } catch (error) {
            // Error de Zod
            const message = error.errors ? error.errors[0].message : error.message;
            this.showError(inputElement, errorElement, message);
            return false;
        }
    }

    // ================================
    // 6. VALIDAR TODO EL FORMULARIO
    // ================================

    validateAll() {
        // Recorre todos los campos obligatorios y confirma que el formulario completo es válido.
        const fields = ['nombre', 'email', 'password', 'confirmPassword', 'terminos'];
        let isValid = true;
        
        for (const field of fields) {
            const fieldValid = this.validateField(field);
            if (!fieldValid) isValid = false;
        }
        
        return isValid;
    }

    // ================================
    // 7. OBTENER DATOS DEL FORMULARIO
    // ================================

    getFormData() {
        // Devuelve un objeto con los valores actuales del formulario.
        return {
            nombre: this.nombreInput.value,
            email: this.emailInput.value,
            password: this.passwordInput.value,
            confirmPassword: this.confirmPasswordInput.value,
            terminos: this.terminosInput.checked
        };
    }

    getInputElement(field) {
        // Relaciona cada nombre de campo con su input correspondiente.
        const map = {
            nombre: this.nombreInput,
            email: this.emailInput,
            password: this.passwordInput,
            confirmPassword: this.confirmPasswordInput,
            terminos: this.terminosInput
        };
        return map[field];
    }

    getFieldSchema(field) {
        // Selecciona la regla de Zod adecuada para el campo que se está validando.
        const schemas = {
            nombre: esquemaRegistro.shape.nombre,
            email: esquemaRegistro.shape.email,
            password: esquemaRegistro.shape.password,
            confirmPassword: Zod.string(),
            terminos: Zod.boolean()
        };
        return schemas[field];
    }

    // ================================
    // 8. MOSTRAR ERRORES Y ÉXITOS
    // ================================

    showError(input, errorElement, message) {
        // Muestra el mensaje de error y marca el campo con estilo visual de fallo.
        errorElement.textContent = message;
        errorElement.classList.add('visible');
        
        if (input) {
            input.classList.remove('success');
            input.classList.add('error');
        }
    }

    showSuccess(input, errorElement) {
        // Limpia el error del campo y aplica estilo de validación correcta.
        errorElement.classList.remove('visible');
        errorElement.textContent = '';
        
        if (input && input.value.trim()) {
            input.classList.remove('error');
            input.classList.add('success');
        }
    }

    // ================================
    // 9. FORTALEZA DE CONTRASEÑA
    // ================================

    updatePasswordStrength() {
        // Calcula la fortaleza de la contraseña y actualiza la barra y el texto de ayuda.
        const password = this.passwordInput.value;
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (!password) {
            strengthFill.className = 'strength-fill';
            strengthFill.style.width = '0%';
            strengthText.textContent = '—';
            strengthText.className = 'strength-text';
            return;
        }
        
        let score = 0;
        const checks = [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ];
        
        score = checks.filter(Boolean).length;
        
        const levels = [
            { score: 0, label: 'Muy débil', className: 'weak' },
            { score: 1, label: 'Débil', className: 'weak' },
            { score: 2, label: 'Media', className: 'medium' },
            { score: 3, label: 'Fuerte', className: 'strong' },
            { score: 4, label: 'Muy fuerte', className: 'very-strong' },
            { score: 5, label: 'Excelente', className: 'very-strong' }
        ];
        
        const level = levels[Math.min(score, 5)];
        
        strengthFill.className = `strength-fill ${level.className}`;
        strengthText.textContent = level.label;
        strengthText.className = `strength-text ${level.className}`;
    }

    // ================================
    // 10. TOGGLE CONTRASEÑA
    // ================================

    togglePasswordVisibility() {
        // Alterna el tipo de ambos campos de contraseña entre texto y oculto.
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        this.confirmPasswordInput.type = type;
        
        const button = document.getElementById('togglePassword');
        button.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    }

    // ================================
    // 11. MANEJAR SUBMIT
    // ================================

    handleSubmit(e) {
        // Evita el envío nativo, valida todo el formulario y simula el registro exitoso.
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validar todo
        const isValid = this.validateAll();
        
        if (!isValid) {
            // Scroll al primer error
            const firstError = document.querySelector('.error-message.visible');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Simular envío
        this.isSubmitting = true;
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = '<span>⏳</span> Procesando...';
        
        setTimeout(() => {
            // Mostrar éxito
            this.showSuccessMessage();
            this.isSubmitting = false;
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<span>🚀</span> Registrarse';
        }, 1500);
    }

    // ================================
    // 12. MENSAJE DE ÉXITO
    // ================================

    showSuccessMessage() {
        // Oculta el formulario y muestra un resumen simple con los datos capturados.
        const data = this.getFormData();
        
        // Ocultar formulario
        this.form.style.display = 'none';
        
        // Mostrar mensaje de éxito
        this.successMessage.style.display = 'block';
        
        // Mostrar datos del usuario
        this.userData.innerHTML = `
            <p><strong>👤 Nombre:</strong> ${data.nombre}</p>
            <p><strong>📧 Email:</strong> ${data.email}</p>
            <p><strong>🔐 Contraseña:</strong> ••••••••</p>
        `;
    }

    // ================================
    // 13. MANEJAR RESET
    // ================================

    handleReset() {
        // Limpia errores, estilos y estado visual para dejar el formulario como nuevo.
        Object.values(this.errorElements).forEach(el => {
            el.classList.remove('visible');
            el.textContent = '';
        });
        
        // Limpiar estilos de inputs
        document.querySelectorAll('.input-wrapper input').forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        // Resetear fortaleza
        document.getElementById('strengthFill').className = 'strength-fill';
        document.getElementById('strengthFill').style.width = '0%';
        document.getElementById('strengthText').textContent = '—';
        document.getElementById('strengthText').className = 'strength-text';
        
        // Resetear estado
        this.isSubmitting = false;
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = '<span>🚀</span> Registrarse';
        
        // Mostrar formulario, ocultar éxito
        this.form.style.display = 'block';
        this.successMessage.style.display = 'none';
    }
}

// ================================
// 14. INICIALIZAR APLICACIÓN
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Arranca la aplicación cuando el DOM ya está listo.
    new RegistroZod();
});