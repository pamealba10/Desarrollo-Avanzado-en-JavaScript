# Sistema de Reservas para Restaurante

## Descripcion del proyecto

Este proyecto en JavaScript simula el proceso de reserva de mesas en un restaurante. El codigo esta pensado para practicar el uso de **Promises**, **async/await**, manejo de errores y ejecucion asincronica con `setTimeout`.

El programa no usa interfaz grafica: todo el comportamiento se observa desde la consola de Node.js.

## Que hace el codigo

El flujo principal del programa es el siguiente:

1. Define una cantidad fija de mesas disponibles.
2. Verifica si la cantidad de mesas solicitadas por un cliente es valida.
3. Comprueba si hay suficientes mesas para completar la reserva.
4. Simula el envio de un correo de confirmacion.
5. Muestra en consola si la reserva fue exitosa o si ocurrio un error.

## Funcionamiento por partes

### 1. Disponibilidad de mesas

La constante `MESAS_DISPONIBLES` define cuantas mesas tiene el restaurante en total. En este caso el valor es 10.

La funcion `verificarDisponibilidad(mesasSolicitadas)`:
- valida que el dato recibido sea un numero positivo
- simula una espera de 1 segundo
- confirma si hay mesas suficientes
- devuelve un objeto con el resultado cuando la reserva es posible
- rechaza la operacion si la solicitud es invalida o excede la capacidad

### 2. Confirmacion por correo

La funcion `enviarConfirmacionReserva(nombreCliente)` simula el envio de un correo electronico:
- valida que el nombre del cliente exista
- espera 1.5 segundos
- genera un exito o fallo aleatorio
- devuelve un mensaje de confirmacion si todo sale bien

Esto permite probar tanto casos exitosos como errores simulados.

### 3. Proceso completo de reserva

La funcion `hacerReserva(nombreCliente, mesasSolicitadas)` coordina todo el proceso:
- inicia el flujo de reserva
- espera la verificacion de mesas disponibles
- si hay disponibilidad, intenta enviar la confirmacion
- imprime mensajes de progreso en consola
- captura errores con `try/catch`
- siempre ejecuta un bloque `finally` al terminar

Si algo falla, el error se muestra en consola y el sistema devuelve un objeto con el detalle del problema.

### 4. Pruebas automaticas

La funcion `probarSistema()` ejecuta varios escenarios para mostrar el comportamiento del codigo:
- una reserva exitosa
- una reserva que excede la capacidad
- una reserva con posibilidad de error en el correo
- un caso con numero negativo
- un caso con nombre vacio

Al final, el archivo llama a `probarSistema()` para ejecutar todas las pruebas automaticamente.

## Conceptos de JavaScript que demuestra

- uso de `Promise`
- manejo de `async/await`
- validacion de datos de entrada
- manejo centralizado de errores con `try/catch`
- uso de `finally`
- simulacion de procesos asincronos con `setTimeout`

## Como ejecutar el proyecto

1. Abre una terminal en la carpeta `Reserva_restaurante`.
2. Ejecuta el archivo con Node.js:

```bash
node app.js
```

## Resultado esperado

Al ejecutar el programa veras en consola mensajes que indican:
- inicio del proceso de reserva
- verificacion de mesas disponibles
- envio de confirmacion
- exito o error final
- resumen de cada prueba

## Posibles mejoras

- Agregar una interfaz web con formulario de reservas
- Guardar reservas en una base de datos o archivo JSON
- Implementar reintentos para el envio del correo
- Permitir cancelar o modificar reservas existentes
- Reemplazar el numero fijo de mesas por un inventario dinamico

## Estructura del archivo principal

- `app.js`: contiene toda la logica de la simulacion de reservas
