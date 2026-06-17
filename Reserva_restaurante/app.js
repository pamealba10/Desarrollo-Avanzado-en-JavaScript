// Configuración inicial del restaurante
const MESAS_DISPONIBLES = 10;

// Función que simula verificar disponibilidad de mesas
function verificarDisponibilidad(mesasSolicitadas) {
    return new Promise((resolve, reject) => {
        // Simulamos un pequeño retraso para hacer más realista
        setTimeout(() => {
            // Validamos que el número de mesas sea válido
            if (typeof mesasSolicitadas !== 'number' || mesasSolicitadas <= 0) {
                reject(new Error('El número de mesas solicitadas debe ser un número positivo'));
                return;
            }

            // Verificamos si hay suficientes mesas disponibles
            if (mesasSolicitadas <= MESAS_DISPONIBLES) {
                resolve({
                    disponible: true,
                    mesasDisponibles: MESAS_DISPONIBLES,
                    mesasSolicitadas: mesasSolicitadas,
                    mensaje: `✅ ${mesasSolicitadas} mesas disponibles para la reserva`
                });
            } else {
                reject(new Error(`❌ No hay suficientes mesas disponibles. Solicitadas: ${mesasSolicitadas}, Disponibles: ${MESAS_DISPONIBLES}`));
            }
        }, 1000); // Simula 1 segundo de procesamiento
    });
}

// Función que simula el envío de correo de confirmación
function enviarConfirmacionReserva(nombreCliente) {
    return new Promise((resolve, reject) => {
        // Simulamos un pequeño retraso para hacer más realista
        setTimeout(() => {
            // Validamos que el nombre sea válido
            if (!nombreCliente || typeof nombreCliente !== 'string' || nombreCliente.trim() === '') {
                reject(new Error('El nombre del cliente es requerido'));
                return;
            }

            // Simulamos éxito o error con Math.random()
            const exito = Math.random() > 0.3; // 70% de probabilidad de éxito
            
            if (exito) {
                resolve({
                    enviado: true,
                    mensaje: `📧 Correo de confirmación enviado exitosamente a ${nombreCliente}`,
                    destinatario: nombreCliente,
                    fecha: new Date().toLocaleString()
                });
            } else {
                reject(new Error(`❌ Error al enviar el correo de confirmación a ${nombreCliente}. Intente nuevamente.`));
            }
        }, 1500); // Simula 1.5 segundos de procesamiento
    });
}

// Función principal que maneja todo el proceso de reserva
async function hacerReserva(nombreCliente, mesasSolicitadas) {
    console.log(`\n🔍 Iniciando proceso de reserva para ${nombreCliente} (${mesasSolicitadas} mesas)...`);
    
    try {
        // Paso 1: Verificar disponibilidad de mesas
        console.log('⏳ Verificando disponibilidad...');
        const disponibilidad = await verificarDisponibilidad(mesasSolicitadas);
        console.log(disponibilidad.mensaje);

        // Si llegamos aquí, significa que hay mesas disponibles
        console.log(`📋 Confirmando reserva para ${nombreCliente}...`);
        
        // Paso 2: Enviar correo de confirmación
        console.log('⏳ Enviando correo de confirmación...');
        const correo = await enviarConfirmacionReserva(nombreCliente);
        console.log(correo.mensaje);
        
        // Paso 3: Reserva exitosa
        console.log(`🎉 ¡Reserva completada con éxito para ${nombreCliente}!`);
        console.log(`📊 Resumen: ${mesasSolicitadas} mesas reservadas para ${new Date().toLocaleDateString()}`);
        console.log(`📬 Confirmación enviada a: ${nombreCliente}`);
        
        return {
            exitoso: true,
            cliente: nombreCliente,
            mesas: mesasSolicitadas,
            confirmacion: correo
        };
        
    } catch (error) {
        // Manejo de errores centralizado
        console.error(`❌ ERROR en la reserva: ${error.message}`);
        console.log('🔄 Por favor, intente nuevamente más tarde o contacte al restaurante.');
        
        // Podríamos tener lógica adicional aquí, como reintentos o logging
        return {
            exitoso: false,
            error: error.message,
            cliente: nombreCliente,
            mesas: mesasSolicitadas
        };
    } finally {
        // Este bloque siempre se ejecuta
        console.log(`🏁 Proceso de reserva finalizado para ${nombreCliente}`);
    }
}

// Función auxiliar para probar múltiples reservas
async function probarSistema() {
    console.log('🚀 === INICIANDO PRUEBAS DEL SISTEMA DE RESERVAS === 🚀');
    
    // Prueba 1: Reserva exitosa (3 mesas)
    const resultado1 = await hacerReserva('Juan Pérez', 3);
    console.log('Resultado 1:', resultado1);
    
    // Prueba 2: Reserva fallida (12 mesas - excede capacidad)
    const resultado2 = await hacerReserva('María García', 12);
    console.log('Resultado 2:', resultado2);
    
    // Prueba 3: Reserva con posibilidad de error en correo
    const resultado3 = await hacerReserva('Carlos López', 5);
    console.log('Resultado 3:', resultado3);
    
    // Prueba 4: Caso borde - número negativo
    const resultado4 = await hacerReserva('Ana Martínez', -2);
    console.log('Resultado 4:', resultado4);
    
    // Prueba 5: Caso borde - nombre vacío
    const resultado5 = await hacerReserva('', 4);
    console.log('Resultado 5:', resultado5);
    
    console.log('\n🏁 === PRUEBAS COMPLETADAS === 🏁');
}

// Ejecutar todas las pruebas
probarSistema();