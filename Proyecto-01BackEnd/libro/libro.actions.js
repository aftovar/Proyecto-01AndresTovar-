const Libro = require("./libro.model")

async function getLibrosMongo(filtros) {
    const cantidadLibros = await Libro.countDocuments(filtros);
    const LibrosFiltrados = await Libro.find(filtros);
    return {
        resultados: LibrosFiltrados,
        // paginaMax: cantidadLibros / 20,
        // paginaActual: 1,
        cantidadLibros: cantidadLibros
    };
}
async function getLibroMongo(id) {
  try{
    const libro = await Libro.findById(id);
    console.log(libro)
    if (libro.isDeleted || !libro){
      throw error;
    }else{
      return libro

    }
  }catch(error){
    throw error
  }
}
async function createLibroMongo(datos) {
    try {

  
      // Si el vendedor es válido, crea el libro
      const libroCreado = await Libro.create(datos); // Crea el libro con los datos proporcionados
  
      return libroCreado; // Devuelve el libro creado
    } catch (error) {
      console.error('Error al crear el libro:', error); // Registro de error en consola
      throw error; // Vuelve a lanzar el error para que el llamador lo maneje
    }
  }
async function updateLibroMongo(id, cambios, userId) {
  const libro =await Libro.findById(id)
  if (!libro){
    throw new Error('El libro no existe' );

  }
  const dueño = libro.vendedor.toHexString()
  if(dueño !== userId){
    throw new Error('Usted no es el dueño de este libro' );
  }else{
    const resultado = await Libro.findByIdAndUpdate(id, cambios);
    return resultado

  }
}


async function softDeleteLibroMongo(id, userId) {
  try {
    const libro = await Libro.findById(id)
    console.log(libro)
    if(!libro){
      throw new Error('Libro no encontrado' );
    }else{
      dueño = libro.vendedor.toHexString()
      if(dueño!==userId){
        throw new Error('Usted no es el dueño de este libro' );
      }
    }
    // Encuentra el libro por ID y marca isDeleted como true
    const libroEliminado = await Libro.findByIdAndUpdate(
      id, // ID del libro
      { isDeleted: true }, // Campos a actualizar
      { new: true } // Devuelve el documento actualizado
    );


    return libroEliminado; // Devuelve el libro marcado como eliminado
  } catch (error) {
    throw error
  }
}

module.exports = {
  getLibrosMongo,
    createLibroMongo,
    getLibroMongo,
    updateLibroMongo,
    softDeleteLibroMongo
};