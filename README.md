# TP 07 - Persistencia inicial de reservas de salas

Laboratorio de Mongoose para crear y consultar reservas persistentes desde procesos de terminal. El sitio Express sigue usando su arreglo en memoria; no se conecta a MongoDB ni comparte todavía los documentos del laboratorio.

## Origen y versiones

El código original de TP06 no estaba en el workspace, solo su PDF. Se reconstruyó una copia modular en `tp-06-salas-modular` a partir de la app funcional `tp-05-pipeline`; esta entrega parte de esa copia y conserva las mismas rutas, controladores, servicio en memoria, vistas y recursos. La matriz HTTP se probó antes y después de modularizar. TP05, TP06 y TP07 permanecen en carpetas separadas. La unidad 8 integrará la persistencia en HTTP.

Proyecto CommonJS. Node.js 20.6 o superior; dependencias principales: Express 4, Mongoose 8, EJS 3, express-ejs-layouts y Morgan. ESLint 9 y Prettier 3 se usan para calidad. `package-lock.json` registra las versiones instaladas.

## Instalación y Atlas

1. Instalar Node.js y npm; desde la raíz de esta carpeta ejecutar:

```powershell
npm install
Copy-Item .env.example .env
```

2. En MongoDB Atlas, crear o reutilizar un clúster gratuito Free (M0). En Database Access crear un usuario con lectura y escritura. En Network Access habilitar la IP pública desde la que se conectará el proyecto.
3. En Connect, elegir la conexión para Node.js y copiar la URI privada. En `.env`, reemplazar `USUARIO`, `CLAVE` y `HOST`, manteniendo las opciones originales de Atlas y el nombre `reservas_salas_u7`. Codificar en URL los caracteres reservados de usuario o contraseña. No pegar la URI en el repositorio, capturas ni mensajes.
4. `.env.example` es la plantilla pública; `.env` y `node_modules/` están excluidos por `.gitignore`. La colección explícita es `reservas`.

La conexión configura una sola vez los resolutores DNS de Node con `dns.setServers(["8.8.8.8", "1.1.1.1"])` antes de conectar, como indica la consigna de clase. Esto no cambia la configuración DNS del sistema, la autenticación ni la lista de IPs de Atlas. Si la red requiere otros resolutores o funciona con los predeterminados, acordarlo con el docente y actualizar `src/config/base-datos.js` y esta nota. Los resolutores públicos pueden estar bloqueados en algunas redes; no se debe atribuir a la aplicación un fallo que sea de red.

## Comandos

Ejecutar desde la raíz del proyecto:

```bash
npm start
node --env-file=.env scripts/comprobar-conexion.js
node --env-file=.env scripts/crear-reserva.js
node --env-file=.env scripts/listar-reservas.js
npm run format
npm run check
```

El sitio web no requiere `MONGODB_URI`; `/`, `/estado` y `/reservas` siguen funcionando sin Atlas. Los tres scripts sí requieren la URI. La prueba de conexión espera a `mongoose.connect`, no crea documentos e intenta cerrar la conexión tanto en éxito como en error. Un error termina con código distinto de cero; el diagnóstico muestra nombre, código y operación sin imprimir URI ni mensaje completo del controlador.

`crear-reserva.js` crea una reserva ficticia nueva en cada ejecución y muestra el `_id` solo después de que `Reserva.create` confirma la escritura. Ejecutarlo dos veces puede crear dos documentos distintos, aunque los campos coincidan. `listar-reservas.js` hace un `find`, muestra `_id` y datos, indica la cantidad recuperada y no agrega ni elimina documentos. Cada programa cierra la conexión en `finally`.

## Estructura y modelo

| Archivo | Responsabilidad |
| --- | --- |
| `src/config/entorno.js` | Configura el puerto del sitio y valida/lee `MONGODB_URI` para los scripts. |
| `src/config/base-datos.js` | Configura DNS una sola vez, conecta y cierra Mongoose, y produce diagnósticos seguros. |
| `src/modelos/reserva.js` | Modelo `Reserva`, asociado explícitamente a la colección `reservas`. |
| `src/app.js`, `src/rutas/`, `src/controladores/`, `src/middleware/` | Aplicación modular heredada de TP06; las rutas web usan el servicio en memoria. |
| `src/servicios/reservas.js` | Único servicio HTTP en memoria; no accede a Mongoose. |
| `scripts/comprobar-conexion.js` | Verifica conexión sin escribir documentos. |
| `scripts/crear-reserva.js` | Inserta una reserva ficticia por ejecución. |
| `scripts/listar-reservas.js` | Lee e imprime las reservas persistidas. |
| `src/index.js` | Crea la semilla y el servicio compartido, configura el sitio y escucha. |

Campos: `estudiante` (String obligatorio y recortado), `email` (String obligatorio, trim y `@`), `sala` (enum Sala Norte/Sala Sur/Sala Multimedia), `fecha` (String obligatorio y trim), `turno` (enum Mañana/Tarde/Noche) y `personas` (Number obligatorio, entero entre 1 y 6). Se usa el ObjectId de MongoDB; no se generan IDs consecutivos. Un ObjectId que Mongoose asigne al construir un objeto no prueba que se haya guardado: la escritura solo queda confirmada cuando termina correctamente la operación `create`/`save`.

No se valida el formato completo del email, fechas imposibles o futuras, solapamientos, cupos compartidos ni reservas repetidas. No se requiere índice único.

## Evidencia de persistencia

Completar esta tabla después de ejecutar los procesos contra la base Atlas individual. No hay conexión Atlas configurada en esta copia, por lo que los resultados remotos se dejan pendientes y no se inventan.

| Ensayo | Resultado observado |
| --- | --- |
| Conexión válida / diagnóstico DNS, si ocurrió | Pendiente de ejecutar con Atlas. |
| URI ausente | Ejecutado sin `MONGODB_URI`: falló con `MONGODB_URI_REQUIRED`, código de salida 1 y sin intento de conexión. |
| Prefijo incorrecto | Pendiente de ejecutar. |
| Fallo de autenticación controlado | Pendiente de ejecutar; no cambiar credenciales en Atlas. |
| Listado inicial y cantidad | Pendiente de ejecutar. |
| Crear reserva y guardar `_id` | Pendiente de ejecutar. |
| Listado desde proceso nuevo y cantidad | Pendiente de ejecutar. |
| Segunda consulta sin escrituras | Pendiente de ejecutar. |
| Validaciones directas del modelo | Ejecutado localmente: reserva válida aceptada; estudiante/email/sala/turno/fecha y personas 0, 7, 2.5 y texto no numérico rechazados. No se conectó a MongoDB. |
| Casos inválidos y cantidad antes/después en Atlas | Pendiente de ejecutar. |
| Sitio y controles HTTP | Ejecutado sin URI en puerto 3127: `/`, `/estado`, `/reservas`, `/reservas/nueva`, `/reservas/1` y CSS dieron 200; detalle/ruta inexistente 404; formulario inválido 400; válido 302; contador pasó de 4 a 5 en memoria. Proceso detenido al terminar la prueba. |

Calidad local: `npm run format` y `npm run check` terminaron correctamente. `node --check` también pasó para los módulos de la app, configuración, modelo y scripts.

Para demostrar persistencia, listar y anotar cantidad inicial, crear una reserva una sola vez y guardar su `_id`, dejar terminar el proceso, listar desde otro proceso y comprobar el mismo `_id` y el aumento de uno, y volver a listar para verificar cantidad estable. Capturar también Data Explorer de Atlas mostrando `reservas_salas_u7`, colección `reservas` y ese mismo `_id`. Las capturas deben distinguir comandos/procesos y ocultar credenciales.

Los ensayos de validación deben cambiar un campo por vez en el objeto fijo de creación, comprobar que no aumenta la cantidad y restaurar el objeto válido al terminar. No borrar documentos para fabricar una colección vacía. Para autenticación, modificar solo temporalmente la contraseña del `.env` privado, ejecutar la prueba de conexión, restaurarla y confirmar conexión válida; nunca cambiar la contraseña del usuario en Atlas.

## Continuidad HTTP y alcance

El sitio conserva su servicio de reservas en memoria, heredado de TP06; los programas Mongoose usan directamente el modelo y no importan ni modifican ese servicio. Por eso, una reserva creada en consola no aparece en `/reservas`, y una reserva del formulario no aparece en MongoDB. Esto es intencional en TP07: en unidad 8 se reemplazará el servicio HTTP por operaciones asíncronas y HTML y API consultarán la misma colección. No se agregaron semillas ni escrituras automáticas al iniciar o listar.

La URI, contraseñas y datos personales reales no forman parte de esta entrega. El ejemplo usa datos ficticios.