const Reserva = require("../src/modelos/reserva");
const {
  conectarBaseDeDatos,
  cerrarBaseDeDatos,
  diagnosticarError,
} = require("../src/config/base-datos");

async function listarReservas() {
  try {
    await conectarBaseDeDatos();
    const reservas = await Reserva.find().lean();

    for (const reserva of reservas) {
      console.log(
        JSON.stringify({ ...reserva, _id: reserva._id.toString() }, null, 2),
      );
    }
    console.log(`Cantidad recuperada: ${reservas.length}`);
  } catch (error) {
    console.error(
      "No se pudieron consultar las reservas:",
      diagnosticarError(error),
    );
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

listarReservas();
