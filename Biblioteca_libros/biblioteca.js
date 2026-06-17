// 1. Datos iniciales de la biblioteca en formato JSON (objeto JavaScript)
let biblioteca = {
    "libros": [
        { "titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "genero": "Realismo mágico", "disponible": true },
        { "titulo": "1984", "autor": "George Orwell", "genero": "Distopía", "disponible": true }
    ]
};

// 2. Función para simular la lectura de datos (operación asincrónica)
function leerDatos(callback) {
    console.log("📖 Leyendo datos de la biblioteca...");
    setTimeout(() => {
        // Simulamos un retraso de 1 segundo (como si leyéramos de un archivo)
        // Llamamos al callback pasando los datos actuales
        callback(biblioteca);
    }, 1000);
}

// 3. Función para simular la escritura de datos (operación asincrónica)
function escribirDatos(nuevosDatos, callback) {
    console.log("💾 Guardando cambios en la biblioteca...");
    setTimeout(() => {
        // Simulamos un retraso de 1 segundo (como si escribiéramos en un archivo)
        // Actualizamos el objeto global 'biblioteca' con los nuevos datos
        biblioteca = nuevosDatos;
        // Ejecutamos el callback para indicar que la operación ha terminado
        callback(null, "Datos guardados exitosamente.");
    }, 1000);
}

// --- Funciones de Interacción con el Usuario (usando callbacks) ---

// 4. Función para mostrar todos los libros
function mostrarLibros() {
    leerDatos((datos) => {
        console.log("\n📚 INVENTARIO DE LIBROS:");
        if (datos.libros.length === 0) {
            console.log("   La biblioteca está vacía.");
        } else {
            datos.libros.forEach((libro, index) => {
                const estado = libro.disponible ? '✅ Disponible' : '❌ Prestado';
                console.log(`   ${index + 1}. "${libro.titulo}" - ${libro.autor} (${libro.genero}) - ${estado}`);
            });
        }
        console.log("-----------------------------\n");
    });
}

// 5. Función para agregar un nuevo libro
function agregarLibro(titulo, autor, genero, disponible = true) {
    // Primero, leemos los datos actuales para no sobrescribir nada
    leerDatos((datosActuales) => {
        // Creamos el nuevo libro
        const nuevoLibro = { titulo, autor, genero, disponible };

        // Agregamos el nuevo libro a la colección
        datosActuales.libros.push(nuevoLibro);

        // Escribimos (guardamos) los datos actualizados
        escribirDatos(datosActuales, (error, mensaje) => {
            if (error) {
                console.error("❌ Error al agregar el libro:", error);
            } else {
                console.log(`✅ Libro "${titulo}" agregado correctamente.`);
                // Mostramos el inventario actualizado (opcional)
                mostrarLibros();
            }
        });
    });
}

// 6. Función para cambiar la disponibilidad de un libro
function actualizarDisponibilidad(titulo, nuevoEstado) {
    // Primero, leemos los datos actuales
    leerDatos((datosActuales) => {
        // Buscamos el libro por su título (búsqueda insensible a mayúsculas/minúsculas)
        const libroEncontrado = datosActuales.libros.find(
            libro => libro.titulo.toLowerCase() === titulo.toLowerCase()
        );

        if (libroEncontrado) {
            // Actualizamos su estado
            libroEncontrado.disponible = nuevoEstado;

            // Escribimos (guardamos) los datos actualizados
            escribirDatos(datosActuales, (error, mensaje) => {
                if (error) {
                    console.error("❌ Error al actualizar la disponibilidad:", error);
                } else {
                    const estadoTexto = nuevoEstado ? 'Disponible' : 'Prestado';
                    console.log(`✅ Disponibilidad de "${titulo}" actualizada a: ${estadoTexto}`);
                    // Mostramos el inventario actualizado (opcional)
                    mostrarLibros();
                }
            });
        } else {
            console.log(`❌ No se encontró ningún libro con el título "${titulo}".`);
        }
    });
}

// --- Ejecución de la Aplicación (Ejemplo de uso) ---

console.log("🚀 INICIANDO SISTEMA DE GESTIÓN DE BIBLIOTECA");
console.log("============================================");

// 1. Mostrar el inventario inicial
mostrarLibros();

// 2. Agregar un nuevo libro
// Nota: Como las operaciones son asincrónicas, estas llamadas se encolan.
// El orden en que se completan dependerá del tiempo de cada setTimeout.
agregarLibro("El principito", "Antoine de Saint-Exupéry", "Fábula", true);

// 3. Actualizar la disponibilidad de un libro existente
actualizarDisponibilidad("1984", false);

// 4. (Demostración) Agregar otro libro
agregarLibro("Dune", "Frank Herbert", "Ciencia ficción", true);

// 5. (Demostración) Intentar actualizar un libro que no existe
actualizarDisponibilidad("El Hobbit", false);

// Nota: Para ver los resultados en orden, deberías esperar a que todas las
// operaciones asincrónicas terminen. En la consola, verás cómo los mensajes
// se van mostrando a medida que cada callback se ejecuta.