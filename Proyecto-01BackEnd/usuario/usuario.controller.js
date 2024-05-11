const { throwCustomError } = require("../utils/functions");
const { createUsuarioMongo, getUsuarioMongo,getUsuariosMongo, updateUsuarioMongo, softDeleteUsuarioMongo} = require("./usuario.actions");


async function readUsuario(id) {
    const resultadosBusqueda = await getUsuarioMongo(id);
    return resultadosBusqueda;
}

async function createUsuario(datos) {

    // hacer llamado a base de datos con el filtro de tipo
    const UsuarioCreado = await createUsuarioMongo(datos);

    return UsuarioCreado;
}


async function updateUsuario(datos, userId) {
    const { _id, ...cambios } = datos;

    // hacer llamado a base de datos con el filtro de tipo
    const UsuarioCreado = await updateUsuarioMongo(_id, cambios, userId);

    return UsuarioCreado;
}
async function deleteUsuario(id, userId) {
    try {
      // Usa `await` para asegurarte de que el error se propague adecuadamente
      const usuarioEliminado = await softDeleteUsuarioMongo(id, userId); 
      
      return usuarioEliminado; // Devuelve el usuario eliminado
    } catch (error) {
      throw error; // Lanza el error para que el llamador lo maneje
    }
  }
module.exports = {
    
    readUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario
}