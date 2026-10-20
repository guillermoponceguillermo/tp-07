const dns = require("node:dns");
const mongoose = require("mongoose");
const { leerUriMongo } = require("./entorno");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarBaseDeDatos() {
  const uri = leerUriMongo();
  await mongoose.connect(uri, { dbName: "reservas_salas_u7" });
}

async function cerrarBaseDeDatos() {
  await mongoose.disconnect();
}

function diagnosticarError(error) {
  return {
    nombre: error.name || "Error",
    codigo:
      error.code ||
      error.cause?.code ||
      error.reason?.cause?.code ||
      "sin código",
    operacion: error.syscall || error.cause?.syscall || "conexión a MongoDB",
  };
}

module.exports = { conectarBaseDeDatos, cerrarBaseDeDatos, diagnosticarError };
