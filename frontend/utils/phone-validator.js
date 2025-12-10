/**
 * Validación Universal de Teléfono
 * Limita campos de teléfono a máximo 9 dígitos y solo números
 */

// Función para validar y formatear teléfono
function validarTelefono(input) {
    // Remover todo excepto números
    let valor = input.value.replace(/\D/g, '');

    // Limitar a 9 dígitos
    if (valor.length > 9) {
        valor = valor.substring(0, 9);
    }

    input.value = valor;

    // Validar longitud
    if (valor.length > 0 && valor.length < 9) {
        input.setCustomValidity('El teléfono debe tener 9 dígitos');
    } else {
        input.setCustomValidity('');
    }

    return valor.length === 9 || valor.length === 0;
}

// Aplicar validación a todos los campos de teléfono automáticamente
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los inputs que contengan "telefono", "celular", "phone" en su id o name
    const camposTelefono = document.querySelectorAll(
        'input[id*="telefono" i], input[id*="celular" i], input[id*="phone" i], ' +
        'input[name*="telefono" i], input[name*="celular" i], input[name*="phone" i], ' +
        'input[type="tel"]'
    );

    camposTelefono.forEach(input => {
        // Agregar atributos de validación
        input.setAttribute('maxlength', '9');
        input.setAttribute('pattern', '[0-9]{9}');
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('placeholder', 'Ej: 987654321');

        // Evento para validar mientras escribe
        input.addEventListener('input', function () {
            validarTelefono(this);
        });

        // Evento para pegar
        input.addEventListener('paste', function (e) {
            setTimeout(() => validarTelefono(this), 0);
        });

        // Feedback visual
        input.addEventListener('blur', function () {
            if (this.value && this.value.length !== 9) {
                this.classList.add('border-red-500', 'focus:ring-red-500');
                this.classList.remove('border-green-500');
            } else if (this.value.length === 9) {
                this.classList.add('border-green-500');
                this.classList.remove('border-red-500', 'focus:ring-red-500');
            } else {
                this.classList.remove('border-red-500', 'border-green-500', 'focus:ring-red-500');
            }
        });
    });

    console.log(`✅ Validación de teléfono activada en ${camposTelefono.length} campos`);
});

// Exportar función para uso manual si es necesario
window.validarTelefono = validarTelefono;
