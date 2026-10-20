function configurarEntorno(entorno = process.env) {
  const port = entorno.PORT === undefined ? 3000 : Number(entorno.PORT);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un número entero entre 1 y 65535.");
  }

  return {
    port,
    nodeEnv: entorno.NODE_ENV || "development",
  };
}

function leerUriMongo(entorno = process.env) {
  const uri = entorno.MONGODB_URI;

  if (!uri) {
    const error = new Error("Falta configurar MONGODB_URI.");
    error.code = "MONGODB_URI_REQUIRED";
    throw error;
  }

  if (!/^mongodb(?:\+srv)?:\/\//i.test(uri)) {
    const error = new Error(
      "MONGODB_URI debe comenzar con mongodb:// o mongodb+srv://.",
    );
    error.code = "MONGODB_URI_INVALID";
    throw error;
  }

  return uri;
}

module.exports = { configurarEntorno, leerUriMongo };
