const express = require('express')
const router = express.Router();
const { readPedidoConFiltros, readPedido, createPedido, updatePedido, deletePedido } = require("./pedido.controller");
const { respondWithError } = require('../utils/functions');
const {verificarTokenJWT} = require('../login/login.actions'); // Función para crear tokens
const {getLibroMongo} = require('../libro/libro.actions'); // Función para crear tokens

async function GetPedidos(req, res) {
    try {
        // llamada a controlador con los filtros
        const clavesDeseadas = ["estado"];
     
        // Crear nuevo objeto solo con claves existentes
        const filtros = Object.fromEntries(
          Object.entries(req.query).filter(([clave]) => clavesDeseadas.includes(clave))
        );
        console.log(filtros)
        if (req.query.fechafin && req.query.fechainicio){
            filtros = {
                ...filtros,
                createdAt: {
                    $gte: req.query.fechainicio,
                    $lte: req.query.fechafin,
                  },
            }
        }
        console.log(filtros)

        var resultadosBusqueda;
        if(req.query.isDeleted==="true"){
            resultadosBusqueda = await readPedidoConFiltros({...filtros});

        }else{
            resultadosBusqueda = await readPedidoConFiltros({...filtros , isDeleted: false });
        }
        res.status(200).json({
            ...resultadosBusqueda
        })
    } catch(e) {
        res.status(500).json({msg: ""})
    }
}
async function GetPedidosId(req, res) {
    try {
        const resultadosBusqueda = await readPedido(req.params.id);
        res.status(200).json({
            resultadosBusqueda
        })
    } catch(e) {
        res.status(500).json({msg: "Pedido no encontrado"})
    }
}
async function PostPedido(req, res) {
    console.log('Inicio de PostPedido'); // Depuración
    console.log('req.userId:', req.userId); // Depuración
  
    const pedidoData = {
      ...req.body,
      idComprador: req.userId, // El ID del usuario autenticado
    };
  
    // Manejo de errores para verificar libros
    try {
      for (const idlibro of req.body.libros) {
        // Verifica cada libro para asegurar que existe
        const libro = await getLibroMongo(idlibro);
  
        if (!libro) {
          throw new Error('Libro no encontrado: ' + idlibro); // Error si el libro no existe
        }
      }
    } catch (error) {
      res.status(404).json({ error: "Libro no encontrado, verifique los IDS" }); // Respuesta al cliente
      return; // Detiene la ejecución
    }
  
    // Manejo de errores para crear el pedido
    try {
      // Crea el pedido con la información proporcionada
      const pedidoCreado = await createPedido(pedidoData);
  
      res.status(200).json({
        mensaje: 'Pedido creado exitosamente.',
        pedido: pedidoCreado,
      });
    } catch (error) {
      console.error('Error al crear el pedido:', error); // Manejo de errores
      res.status(500).json({ error: error.message }); // Respuesta al cliente
    }
  }
  
async function PatchPedidos(req, res) {
    try {
        // llamada a controlador con los datos
        await updatePedido(req.body,req.userId);

        res.status(200).json({
            mensaje: "Pedido."
        })
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}


async function DeletePedidos(req, res) {
    try {
        // llamada a controlador con los datos
        await deletePedido(req.params.id, req.userId);
        res.status(200).json({
            mensaje: "Exito."
        })
    } catch(e) {
        res.status(500).json({ error: e.message }); // Devuelve respuesta al cliente
    }
}

router.get("/", GetPedidos);
router.get("/:id", GetPedidosId);
router.post("/", verificarTokenJWT, PostPedido);
router.patch("/", verificarTokenJWT, PatchPedidos);
router.delete("/:id",verificarTokenJWT, DeletePedidos);


module.exports = router;