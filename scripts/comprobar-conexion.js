const {
  conectarBaseDeDatos,
  cerrarBaseDeDatos,
  diagnosticarError,
} = require("../src/config/base-datos");

async function comprobarConexion() {
  try {
    await conectarBaseDeDatos();
    console.log("Conexión con MongoDB Atlas establecida.");
  } catch (error) {
    console.error("Falló la conexión con MongoDB:", diagnosticarError(error));
    process.exitCode = 1;
  } finally {
    try {
      await cerrarBaseDeDatos();
    } catch (error) {
      console.error(
        "No se pudieron cerrar los recursos de MongoDB:",
        diagnosticarError(error),
      );
      process.exitCode = 1;
    }
  }
}

comprobarConexion();
