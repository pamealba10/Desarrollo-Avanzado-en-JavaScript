// Aquí se encuentra toda la lógica de negocio, incluyendo la gestión asincrónica de pedidos.
// Obtener referencias a los elementos del DOM
const orderList = document.getElementById('orderList');
const addOrderBtn = document.getElementById('addOrderBtn');

// Variable para generar IDs únicos e incrementales
let orderId = 1;

/**
 * Función que simula la preparación de un pedido.
 * Retorna una Promise que se resuelve después de un tiempo aleatorio (1-3 segundos).
 * @param {Object} order - El objeto del pedido.
 * @returns {Promise} - Una Promise que se resuelve cuando el pedido está listo.
 */
function prepareOrder(order) {
    // Tiempo de preparación aleatorio entre 1 y 3 segundos (1000-3000 ms)
    const preparationTime = Math.floor(Math.random() * 2000) + 1000;

    console.log(`[${new Date().toLocaleTimeString()}] Preparando pedido #${order.id}... (${preparationTime}ms)`);

    // Retornamos una nueva Promise. El Event Loop permitirá que estas tareas
    // se ejecuten de manera concurrente.
    return new Promise((resolve) => {
        setTimeout(() => {
            // Cuando el setTimeout termina, resolvemos la Promise.
            // El mensaje se mostrará en la consola para seguir el flujo.
            console.log(`[${new Date().toLocaleTimeString()}] Pedido #${order.id} preparado.`);
            resolve();
        }, preparationTime);
    });
}

/**
 * Función asincrónica que procesa un pedido de principio a fin.
 * Utiliza async/await para manejar la Promise retornada por prepareOrder.
 * @param {Object} order - El objeto del pedido a procesar.
 */
async function processOrder(order) {
    // 1. Simular la preparación del pedido (asincrónica)
    // 'await' pausa la ejecución de esta función específica, pero NO bloquea el Event Loop.
    // Otros pedidos o eventos pueden continuar procesándose mientras este espera.
    await prepareOrder(order);

    // 2. Actualizar el estado del pedido a 'Completado' una vez que la Promise se resuelve
    // Esta actualización ocurre después de que el setTimeout haya finalizado.
    updateOrderStatus(order, 'Completado');
}

/**
 * Función para añadir un nuevo pedido a la interfaz de usuario.
 * @param {Object} order - El objeto del pedido con id y estado inicial.
 */
function addOrderToUI(order) {
    const listItem = document.createElement('li');
    listItem.id = `order-${order.id}`;
    // Añadimos una clase base y una para el estado inicial
    listItem.className = 'en-proceso';
    listItem.innerHTML = `
        <span class="status-badge status-en-proceso">🔄 En Proceso</span>
        Pedido #${order.id}
    `;
    orderList.appendChild(listItem);
}

/**
 * Función para actualizar el estado de un pedido en la interfaz de usuario.
 * @param {Object} order - El objeto del pedido.
 * @param {string} newStatus - El nuevo estado ('Completado').
 */
function updateOrderStatus(order, newStatus) {
    const listItem = document.getElementById(`order-${order.id}`);
    if (listItem) {
        // Actualizamos el contenido y las clases para reflejar el nuevo estado
        if (newStatus === 'Completado') {
            listItem.className = 'completado';
            listItem.innerHTML = `
                <span class="status-badge status-completado">✅ Completado</span>
                Pedido #${order.id}
            `;
        }
        // Podríamos añadir más lógica para otros estados en el futuro
    }
}

/**
 * Manejador del evento 'click' del botón "Agregar Pedido".
 * Crea un nuevo pedido, lo añade a la UI y comienza su procesamiento asincrónico.
 */
addOrderBtn.addEventListener('click', () => {
    // 1. Crear un nuevo pedido con un ID único y estado inicial 'En Proceso'
    const newOrder = { id: orderId++, status: 'En Proceso' };

    // 2. Mostrar el pedido en la interfaz con el estado 'En Proceso'
    addOrderToUI(newOrder);

    // 3. Iniciar el procesamiento asincrónico del pedido.
    //    La función 'processOrder' es async, por lo que devuelve una Promise.
    //    No usamos 'await' aquí para que el proceso no bloquee el bucle de eventos
    //    y permita que el usuario siga agregando más pedidos inmediatamente.
    processOrder(newOrder);
});

// Mensaje opcional en consola para indicar que la aplicación está lista
console.log('🟢 Simulador de Cafetería iniciado. ¡Agrega pedidos!');
console.log('ℹ️  Observa la consola para ver el flujo asincrónico.');