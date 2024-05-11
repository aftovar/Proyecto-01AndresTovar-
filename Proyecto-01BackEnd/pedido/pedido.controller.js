const { throwCustomError } = require("../utils/functions");
const { createPedidoMongo, getPedidoMongo,getPedidosMongo, updatePedidoMongo, softDeletePedidoMongo} = require("./pedido.actions");

async function readPedidoConFiltros(query) {
    const resultadosBusqueda = await getPedidosMongo(query);
    return resultadosBusqueda;
}
async function readPedido(id) {
    const resultadosBusqueda = await getPedidoMongo(id);
    return resultadosBusqueda;
}

async function createPedido(datos) {
    const { tipo, relleno, precio, masa, cantidad, coccion } = datos;

    // hacer llamado a base de datos con el filtro de tipo
    const PedidoCreado = await createPedidoMongo(datos);

    return PedidoCreado;
}


async function updatePedido(datos, userId) {
    const { _id, ...cambios } = datos;

    // hacer llamado a base de datos con el filtro de tipo
    const PedidoCreado = await updatePedidoMongo(_id, cambios, userId);

    return PedidoCreado;
}
async function deletePedido(id, userId) {
    try {
      // Usa `await` para asegurarte de que el error se propague adecuadamente
      const pedidoEliminado = await softDeletePedidoMongo(id, userId); 
      
      return pedidoEliminado; // Devuelve el pedido eliminado
    } catch (error) {
      throw error; // Lanza el error para que el llamador lo maneje
    }
  }
module.exports = {
    readPedidoConFiltros,
    readPedido,
    createPedido,
    updatePedido,
    deletePedido
}