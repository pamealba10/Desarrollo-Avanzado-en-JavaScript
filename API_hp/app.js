// ============================================
// 1. CONFIGURACIÓN INICIAL
// ============================================

// URL de la API de Harry Potter
// Documentación: https://hp-api.onrender.com/
const API_URL = 'https://hp-api.onrender.com/api/characters';

// Obtener elementos del DOM
const dataContainer = document.getElementById('data-container');
const loadingIndicator = document.getElementById('loading');
const fetchBtn = document.getElementById('fetchBtn');
const axiosBtn = document.getElementById('axiosBtn');
const clearBtn = document.getElementById('clearBtn');

// ============================================
// 2. FUNCIÓN PARA MOSTRAR PERSONAJES
// ============================================

/**
 * Muestra los personajes en el contenedor
 * @param {Array} characters - Lista de personajes de la API
 */
function displayCharacters(characters) {
    // Limpiar el contenedor
    dataContainer.innerHTML = '';
    
    // Si no hay personajes, mostrar mensaje
    if (!characters || characters.length === 0) {
        dataContainer.innerHTML = `
            <div class="info-text">
                <span class="icon">🔍</span>
                <p>No se encontraron personajes mágicos</p>
            </div>
        `;
        return;
    }
    
    // Crear tarjeta para cada personaje
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        
        // Determinar la clase de la casa
        let houseClass = 'unknown';
        let houseDisplay = 'Casa desconocida';
        
        if (character.house) {
            const houseLower = character.house.toLowerCase();
            if (houseLower.includes('gryffindor')) {
                houseClass = 'gryffindor';
                houseDisplay = '🦁 Gryffindor';
            } else if (houseLower.includes('slytherin')) {
                houseClass = 'slytherin';
                houseDisplay = '🐍 Slytherin';
            } else if (houseLower.includes('ravenclaw')) {
                houseClass = 'ravenclaw';
                houseDisplay = '🦅 Ravenclaw';
            } else if (houseLower.includes('hufflepuff')) {
                houseClass = 'hufflepuff';
                houseDisplay = '🦡 Hufflepuff';
            } else {
                houseDisplay = `🏠 ${character.house}`;
            }
        }
        
        // Imagen del personaje (si no tiene, usar placeholder)
        const imageUrl = character.image || 'https://via.placeholder.com/200x200/302b63/ffd700?text=No+Image';
        
        // Información adicional
        const species = character.species || 'Especie desconocida';
        const gender = character.gender || 'Género desconocido';
        const patronus = character.patronus || 'Sin patronus';
        
        // Fecha de nacimiento (si existe)
        const birthDate = character.dateOfBirth || 'Fecha desconocida';
        
        // Actor (si existe)
        const actor = character.actor || 'Actor desconocido';
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${character.name}" loading="lazy">
            <h3>${character.name}</h3>
            <span class="house ${houseClass}">${houseDisplay}</span>
            <div class="details">
                <span>🧙 ${species}</span>
                <span>⚧️ ${gender}</span>
                <span>🦌 Patronus: ${patronus}</span>
                <span>📅 Nacimiento: ${birthDate}</span>
                <span>🎭 Actor: ${actor}</span>
                ${character.alive !== undefined ? 
                    `<span>${character.alive ? '💚 Vivo' : '💔 Fallecido'}</span>` : 
                    ''}
            </div>
        `;
        
        dataContainer.appendChild(card);
    });
}

// ============================================
// 3. FUNCIONES DE CARGA (Con manejo de errores)
// ============================================

/**
 * Muestra un mensaje de error en el contenedor
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    dataContainer.innerHTML = `
        <div class="error-message">
            <strong>❌ Error mágico:</strong> ${message}
            <br><small style="display: block; margin-top: 10px;">
                ✨ La varita mágica no pudo conjurar los datos. Verifica tu conexión.
            </small>
        </div>
    `;
}

/**
 * Controla el estado de carga
 * @param {boolean} isLoading - Indica si está cargando
 */
function setLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.add('active');
    } else {
        loadingIndicator.classList.remove('active');
    }
}

// ============================================
// 4. CONSULTA CON FETCH
// ============================================

async function fetchCharacters() {
    try {
        // Mostrar loading
        setLoading(true);
        
        console.log('🪄 Iniciando hechizo Fetch...');
        
        // Realizar la solicitud con fetch
        const response = await fetch(API_URL);
        
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        // Parsear la respuesta como JSON
        const data = await response.json();
        
        // Verificar que los datos sean válidos
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No se encontraron personajes en el mundo mágico');
        }
        
        // Mostrar los personajes
        displayCharacters(data);
        
        console.log(`✅ Hechizo Fetch completado! ${data.length} personajes encontrados`);
        
    } catch (error) {
        console.error('❌ Error en el hechizo Fetch:', error);
        showError(`Error al conjurar con Fetch: ${error.message}`);
    } finally {
        // Ocultar loading
        setLoading(false);
    }
}

// ============================================
// 5. CONSULTA CON AXIOS
// ============================================

async function fetchWithAxios() {
    try {
        // Mostrar loading
        setLoading(true);
        
        console.log('🪄 Iniciando hechizo Axios...');
        
        // Realizar la solicitud con Axios
        const response = await axios.get(API_URL);
        
        // Axios ya convierte la respuesta automáticamente
        const data = response.data;
        
        // Verificar que los datos sean válidos
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No se encontraron personajes en el mundo mágico');
        }
        
        // Mostrar los personajes
        displayCharacters(data);
        
        console.log(`✅ Hechizo Axios completado! ${data.length} personajes encontrados`);
        console.log('📊 Detalles de la respuesta:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
        
    } catch (error) {
        console.error('❌ Error en el hechizo Axios:', error);
        
        // Axios proporciona información más detallada del error
        let errorMessage = error.message;
        if (error.response) {
            // El servidor respondió con un código de error
            errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
            // La solicitud se hizo pero no hubo respuesta
            errorMessage = 'El ministerio de magia no respondió (sin respuesta del servidor)';
        }
        
        showError(`Error al conjurar con Axios: ${errorMessage}`);
    } finally {
        // Ocultar loading
        setLoading(false);
    }
}

// ============================================
// 6. FUNCIÓN PARA LIMPIAR
// ============================================

function clearData() {
    dataContainer.innerHTML = `
        <div class="info-text">
            <span class="icon">🧹</span>
            <p>El mundo mágico ha sido limpiado</p>
            <p style="font-size: 0.9rem; margin-top: 10px; color: #bfb3d7;">
                ✨ Haz un nuevo hechizo con los botones para cargar personajes
            </p>
            <p style="font-size: 0.8rem; margin-top: 15px; color: #978caf;">
                🪄 "Lumos!" - Ilumina tu conocimiento con Fetch o Axios
            </p>
        </div>
    `;
    console.log('🧹 El mundo mágico ha sido limpiado');
}

// ============================================
// 7. EVENT LISTENERS
// ============================================

// Botón de Fetch
fetchBtn.addEventListener('click', () => {
    console.log('🔄 Conjurando con el hechizo Fetch...');
    fetchCharacters();
});

// Botón de Axios
axiosBtn.addEventListener('click', () => {
    console.log('🔄 Conjurando con el hechizo Axios...');
    fetchWithAxios();
});

// Botón de Limpiar
clearBtn.addEventListener('click', clearData);

// ============================================
// 8. INICIALIZACIÓN OPCIONAL
// ============================================

// Cargar personajes automáticamente al inicio (opcional)
// Descomentar la siguiente línea para cargar automáticamente
// fetchCharacters();

console.log('🪄 ¡Aplicación mágica lista para usar!');
console.log('📚 API: Harry Potter API');
console.log('🔗 URL:', API_URL);
console.log('💡 Usa los botones para conjurar personajes con Fetch o Axios');
console.log('✨ "¡Expecto Patronum!" - Feliz aprendizaje mágico ✨');

// ============================================
// 9. FUNCIÓN EXTRA: BUSCAR POR CASA
// ============================================

/**
 * Función adicional para filtrar personajes por casa
 * @param {string} house - Nombre de la casa (Gryffindor, Slytherin, etc.)
 */
async function filterByHouse(house) {
    try {
        setLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();
        
        const filtered = data.filter(char => 
            char.house && char.house.toLowerCase() === house.toLowerCase()
        );
        
        displayCharacters(filtered);
        console.log(`🏠 Mostrando ${filtered.length} personajes de ${house}`);
    } catch (error) {
        showError(`Error al filtrar por casa: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

// Descomentar para probar:
// filterByHouse('Gryffindor');