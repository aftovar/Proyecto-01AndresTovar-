const express = require('express')
const router = express.Router();
const {  readUsuario, createUsuario, updateUsuario, deleteUsuario } = require("./usuario.controller");
const { respondWithError } = require('../utils/functions');
const {verificarTokenJWT} = require('../login/login.actions'); // Función para crear tokens


async function GetUsuariosId(req, res) {
    try {
        const resultadosBusqueda = await readUsuario(req.params.id);
        res.status(200).json({
            resultadosBusqueda
        })
    } catch(e) {
        res.status(500).json({msg: "Usuario no encontrado"})
    }
}
async function PostUsuario(req, res) {
    // Manejo de errores para crear el usuario
    try {
      const usuarioCreado = await createUsuario(req.body);
  
      res.status(200).json({
        mensaje: 'Usuario creado exitosamente.',
        usuario: usuarioCreado,
      });
    } catch (error) {
      console.error('Error al crear el usuario:', error); // Manejo de errores
      res.status(500).json({ error: error.message }); // Respuesta al cliente
    }
  }
  
async function PatchUsuarios(req, res) {
    try {
        // llamada a controlador con los datos
        await updateUsuario(req.body,req.userId);

        res.status(200).json({
            mensaje: "Usuario. 👍"
        })
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}


async function DeleteUsuarios(req, res) {
    try {
        // llamada a controlador con los datos
        await deleteUsuario(req.params.id, req.userId);
        res.status(200).json({
            mensaje: "Exito. 👍"
        })
    } catch(e) {
        res.status(500).json({ error: e.message }); // Devuelve respuesta al cliente
    }
}


router.get("/:id", GetUsuariosId);
router.post("/", PostUsuario);
router.patch("/", verificarTokenJWT, PatchUsuarios);
router.delete("/:id",verificarTokenJWT, DeleteUsuarios);


module.exports = router;