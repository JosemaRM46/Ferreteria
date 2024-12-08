"use client";
import { useState, useEffect } from "react";
import Navbar from '../../components/Navbar2';
import Footer from "../../components/Footer";

export default function RegisterPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precioVenta: "",
    precioCosto: "",
    idCategoria: "",
    idMarca: "",
    Impuesto: "",
    ruta: "",
    existencia: "",
    idProducto: undefined,
  });
  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const productosPorPagina = 15; // Cantidad de productos por página
  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito
  const [productoAEliminar, setProductoAEliminar] = useState<any>(null); // Producto a eliminar
  const [busqueda, setBusqueda] = useState(""); // Estado de la búsqueda

  // Obtener productos al cargar la página
  useEffect(() => {
    fetch("http://localhost:3001/producto")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  // Manejo de cambio en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
  };

  // Agregar o editar producto
  const guardarProducto = (e: React.FormEvent) => {
    e.preventDefault();

    if (nuevoProducto.idProducto) {
      // Si el producto tiene id, es una edición
      fetch(`http://localhost:3001/producto/${nuevoProducto.idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      })
        .then(() => {
          const productosActualizados = productos.map((producto) =>
            producto.idProducto === nuevoProducto.idProducto ? nuevoProducto : producto
          );
          setProductos(productosActualizados);
          setMensaje("Producto editado con éxito!");
          setTimeout(() => setMensaje(""), 3000); // Limpiar el mensaje después de 3 segundos
        })
        .catch((error) => console.error("Error al editar producto:", error));
    } else {
      // Si no tiene id, es un nuevo producto
      fetch("http://localhost:3001/producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      })
        .then((response) => response.json())
        .then((data) => {
          setProductos([...productos, { ...nuevoProducto, idProducto: data.idProducto }]);
          setNuevoProducto({
            nombre: "",
            descripcion: "",
            precioVenta: "",
            precioCosto: "",
            idCategoria: "",
            idMarca: "",
            Impuesto: "",
            ruta: "",
            existencia: "",
            idProducto: undefined,
          });
          setMensaje("Producto agregado con éxito!");
          setTimeout(() => setMensaje(""), 3000); // Limpiar el mensaje después de 3 segundos
        })
        .catch((error) => console.error("Error al agregar producto:", error));
    }
    setShowForm(false); // Ocultar formulario
  };

  // Editar un producto
  const editarProducto = (idProducto: number) => {
    const productoEditar = productos.find((producto) => producto.idProducto === idProducto);
    setNuevoProducto(productoEditar || {});
    setShowForm(true); // Mostrar formulario en modo de edición
  };

  // Cancelar la edición o la creación de un nuevo producto
  const cancelarEdicion = () => {
    setNuevoProducto({
      nombre: "",
      descripcion: "",
      precioVenta: "",
      precioCosto: "",
      idCategoria: "",
      idMarca: "",
      Impuesto: "",
      ruta: "",
      existencia: "",
      idProducto: undefined, // Resetear idProducto
    });
    setShowForm(false); // Ocultar formulario
  };

  // Eliminar un producto
  const eliminarProducto = (idProducto: number) => {
    if (!productoAEliminar) return;

    fetch(`http://localhost:3001/producto/${idProducto}`, {
      method: "DELETE",
    })
      .then(() => {
        setProductos(productos.filter((producto) => producto.idProducto !== idProducto));
        setMensaje("Producto eliminado con éxito!");
        setTimeout(() => setMensaje(""), 3000); // Limpiar el mensaje después de 3 segundos
        setProductoAEliminar(null); // Resetear el producto a eliminar
      })
      .catch((error) => console.error("Error al eliminar producto:", error));
  };

  // Mostrar la confirmación para eliminar un producto
  const confirmarEliminacion = (producto: any) => {
    setProductoAEliminar(producto);
  };

  // Cancelar la eliminación de un producto
  const cancelarEliminacion = () => {
    setProductoAEliminar(null);
  };

  // Productos a mostrar en la página actual
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;

  // Filtrar productos según la búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  // Función para manejar la búsqueda
  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  // Paginación de productos
  const cambiarPagina = (pagina: number) => {
    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Desplazar hacia arriba al cambiar de página
  };

  return (
  
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-col items-center justify-start p-8 flex-grow">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Gestión del Inventario</h1>

        {/* Barra de búsqueda */}
        <div className="mb-8 w-full max-w-md">
          <input
            type="text"
            value={busqueda}
            onChange={handleBusquedaChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Buscar productos..."
          />
        </div>

        {/* Mensajes de éxito */}
        {mensaje && (
          <div className="w-full max-w-7xl bg-green-500 text-white text-center p-4 mb-4 rounded-md">
            {mensaje}
          </div>
        )}

        {/* Botón para agregar nuevo producto */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white py-2 px-6 rounded-md mb-4"
        >
          Agregar Nuevo Producto
        </button>

        {/* Formulario flotante o modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <form
              className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl"
              onSubmit={guardarProducto}
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {nuevoProducto.idProducto ? "Editar Producto" : "Agregar Nuevo Producto"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campos del formulario */}
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-gray-600">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={nuevoProducto.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="descripcion" className="block text-gray-600">Descripción</label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    value={nuevoProducto.descripcion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="precioVenta" className="block text-gray-600">Precio de Venta</label>
                  <input
                    type="number"
                    id="precioVenta"
                    name="precioVenta"
                    value={nuevoProducto.precioVenta}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="precioCosto" className="block text-gray-600">Precio de Costo</label>
                  <input
                    type="number"
                    id="precioCosto"
                    name="precioCosto"
                    value={nuevoProducto.precioCosto}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="idCategoria" className="block text-gray-600">Categoría</label>
                  <input
                    type="text"
                    id="idCategoria"
                    name="idCategoria"
                    value={nuevoProducto.idCategoria}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="idMarca" className="block text-gray-600">Marca</label>
                  <input
                    type="text"
                    id="idMarca"
                    name="idMarca"
                    value={nuevoProducto.idMarca}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="Impuesto" className="block text-gray-600">Impuesto (%)</label>
                  <input
                    type="number"
                    id="Impuesto"
                    name="Impuesto"
                    value={nuevoProducto.Impuesto}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="ruta" className="block text-gray-600">Ruta de Imagen</label>
                  <input
                    type="text"
                    id="ruta"
                    name="ruta"
                    value={nuevoProducto.ruta}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="existencia" className="block text-gray-600">Existencia</label>
                  <input
                    type="text"
                    id="existencia"
                    name="existencia"
                    value={nuevoProducto.existencia}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                  {nuevoProducto.idProducto ? "Actualizar Producto" : "Agregar Producto"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Confirmación de eliminación */}
        {productoAEliminar && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">¿Estás seguro de eliminar este producto?</h2>
              <div className="flex justify-between">
                <button
                  onClick={() => eliminarProducto(productoAEliminar.idProducto)}
                  className="bg-red-600 text-white px-6 py-2 rounded-md"
                >
                  Sí, Eliminar
                </button>
                <button
                  onClick={cancelarEliminacion}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
          {productosPaginados.map((producto) => (
            <div key={producto.idProducto} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={producto.ruta}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-700">{producto.nombre}</h2>
                <p className="text-gray-600 mb-2">{producto.descripcion}</p>
                <p className="text-lg font-bold text-gray-800">Precio de Venta: L. {producto.precioVenta}</p>
                <p className="text-sm text-gray-500">Costo: L. {producto.precioCosto}</p>
                <p className="text-sm text-gray-500">Categoría: {producto.idCategoria}</p>
                <p className="text-sm text-gray-500">Marca: {producto.idMarca}</p>
                <p className="text-sm text-gray-500">Impuesto: {producto.Impuesto}%</p>
                <p className="text-sm text-gray-500">Existencia: {producto.existencia}</p>
              </div>
              <div className="flex justify-between p-4 border-t">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  onClick={() => editarProducto(producto.idProducto)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={() => confirmarEliminacion(producto)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-8">
          <button
            disabled={paginaActual === 1}
            onClick={() => cambiarPagina(paginaActual - 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mx-2"
          >
            Anterior
          </button>
          <button
            disabled={indiceFin >= productosFiltrados.length}
            onClick={() => cambiarPagina(paginaActual + 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mx-2"
          >
            Siguiente
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
