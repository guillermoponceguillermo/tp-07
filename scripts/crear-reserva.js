const Reserva = require("../src/modelos/reserva");
const {
  conectarBaseDeDatos,
  cerrarBaseDeDatos,
  diagnosticarError,
} = require("../src/config/base-datos");

async function crearReserva() {
  try {
    await conectarBaseDeDatos();
    const reserva = await Reserva.create({
      estudiante: "Ana Ejemplo",
      email: "ana@example.com",
      sala: "Sala Norte",
      fecha: "2026-10-21",
      turno: "Mañana",
      personas: 2,
    });
    console.log(`Reserva guardada. _id: ${reserva._id.toString()}`);
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error(
        "La reserva no pasó la validación. Campos a revisar:",
        Object.keys(error.errors),
      );
    } else if (error.name === "CastError") {
      console.error(`No se pudo convertir el campo ${error.path}.`);
    } else {
      console.error("No se pudo guardar la reserva:", diagnosticarError(error));
    }
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

crearReserva();
