const express = require('express')
const router = express.Router();
const { readLibroConFiltros, readLibro, createLibro, updateLibro, deleteLibro } = require("./libro.controller");
const { respondWithError } = require('../utils/functions');
const {verificarTokenJWT} = require('../login/login.actions'); // Función para crear tokens

async function GetLibros(req, res) {
    try {
        // llamada a controlador con los filtros
        const clavesDeseadas = ["genero", "fechaPublicacion", "editorial", "titulo", "autor"];

        // Crear nuevo objeto solo con claves existentes
        const filtros = Object.fromEntries(
          Object.entries(req.query).filter(([clave]) => clavesDeseadas.includes(clave))
        );
        var resultadosBusqueda;
        console.log(req.query.isDeleted)
        if(req.query.isDeleted==="true"){
            resultadosBusqueda = await readLibroConFiltros({...filtros });

        }else{
            resultadosBusqueda = await readLibroConFiltros({...filtros , isDeleted: false });
        }
        res.status(200).json({
            ...resultadosBusqueda
        })
    } catch(e) {
        res.status(500).json({msg: ""})
    }
}
async function GetLibrosId(req, res) {
    try {
        const resultadosBusqueda = await readLibro(req.params.id);
        res.status(200).json({
            resultadosBusqueda
        })
    } catch(e) {
        res.status(500).json({msg: "Libro no encontrado"})
    }
}
async function PostLibro(req, res) {
    try {
      console.log('Inicio de PostLibro'); // Depuración
      console.log('req.userId:', req.userId); // Depuración
      // Agrega el ID del usuario (vendedor) a los datos del libro
      const libroData = {
        ...req.body,
        vendedor: req.userId, // El ID del usuario autenticado
      };
      console.log('libroData:', libroData); // Depuración
      // Llamada a la función para crear el libro con el ID del vendedor
      const libroCreado = await createLibro(libroData);
  
      res.status(200).json({ mensaje: 'Libro creado exitosamente.', libro: libroCreado }); // Respuesta exitosa
    } catch (error) {
      console.error('Error al crear el libro:', error);
      res.status(500).json({ error: 'Error interno del servidor' }); // Manejo de errores
    }
  }

async function PatchLibros(req, res) {
    try {
        // llamada a controlador con los datos
        await updateLibro(req.body,req.userId);

        res.status(200).json({
            mensaje: "Libro actualizado."
        })
    } catch(e) {
        res.status(500).json({ error: e.message }); // Manejo de errores
    }
}


async function DeleteLibros(req, res) {
    try {
        // llamada a controlador con los datos
        await deleteLibro(req.params.id, req.userId);
        res.status(200).json({
            mensaje: "Exito."
        })
    } catch(e) {
        res.status(500).json({ error: e.message }); // Devuelve respuesta al cliente
    }
}

router.get("/", GetLibros);
router.get("/:id", GetLibrosId);
router.post("/", verificarTokenJWT, PostLibro);
router.patch("/", verificarTokenJWT, PatchLibros);
router.delete("/:id",verificarTokenJWT, DeleteLibros);


module.exports = router;