const Libro = require("../libro/libro.model");
const Usuario = require("./usuario.model")


async function getUsuarioMongo(id) {
    const usuario = await Usuario.findById(id);
    if (usuario.isDeleted) {
        throw error;
    } else {
        return usuario

    }
}
async function createUsuarioMongo(datos) {
    try {
        const usuarioCreado = await Usuario.create(datos); // Crea el usuario con los datos proporcionados
        return usuarioCreado; // Devuelve el usuario creado
    } catch (error) {
        console.error('Error al crear el usuario:', error); // Registro de error en consola
        throw error; // Vuelve a lanzar el error para que el llamador lo maneje
    }
}
async function updateUsuarioMongo(id, cambios, userId) {
    try {
        console.log(cambios)
        const usuario = await Usuario.findById(id)
        if (!usuario) {
            throw new Error("Usuario no existe")
        }
        if (id !== userId) {
            throw new Error('Esta no es su cuenta, no puede modificarla');
        }
        const resultado = await Usuario.findByIdAndUpdate(id, cambios);
        return resultado


    }


    catch (e) {
        throw e
    }
}


async function softDeleteUsuarioMongo(id, userId) {
    try {
        const usuario = await Usuario.findById(id)
        console.log(usuario)
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        } else {
            dueño = usuario._id.toHexString()
            if (dueño !== userId) {
                throw new Error('Usted no es el dueño de esta cuenta');
            }
        }
        // Encuentra el usuario por ID y marca isDeleted como true
        const usuarioEliminado = await Usuario.findByIdAndUpdate(
            id, // ID del usuario
            { isDeleted: true }, // Campos a actualizar
            { new: true } // Devuelve el documento actualizado
        );


        return usuarioEliminado; // Devuelve el usuario marcado como eliminado
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUsuarioMongo,
    getUsuarioMongo,
    updateUsuarioMongo,
    softDeleteUsuarioMongo
};