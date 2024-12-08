"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar2";
import Footer from "../../components/Footer";

export default function RegisterPage() {
  const [carritos, setCarritos] = useState<any[]>([]);
  const [carritoSeleccionado, setCarritoSeleccionado] = useState<any>(null); // Carrito en la modal
  const [gestionarEnvio, setEnvioGestionado] = useState<any>(null); // Estado para gestionar envío

  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const carritosPorPagina = 5; // Cantidad de carritos por página

  // Obtener carritos al cargar la página
  useEffect(() => {
    fetch("http://localhost:3001/envios")
      .then((response) => response.json())
      .then((data) => setCarritos(data))
      .catch((error) => console.error("Error al obtener los carritos:", error));
  }, []);

  // Carritos paginados
  const indiceInicio = (paginaActual - 1) * carritosPorPagina;
  const indiceFin = indiceInicio + carritosPorPagina;
  const carritosPaginados = carritos.slice(indiceInicio, indiceFin);

  // Cambio de página
  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina < 1 || nuevaPagina > Math.ceil(carritos.length / carritosPorPagina)) return;
    setPaginaActual(nuevaPagina);
  };

  // Manejador para el formulario de gestionar envío
  const handleGestionarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const empleado = e.currentTarget.empleado.value;
    const vehiculo = e.currentTarget.vehiculo.value;

    // Aquí puedes hacer una solicitud al backend para actualizar el envío
    fetch(`http://localhost:3001/gestionarEnvio/${gestionarEnvio.idCarrito}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ empleado, vehiculo }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Gestión completada:", data);
        setEnvioGestionado(null); // Cerrar modal después de gestionar
      })
      setEnvioGestionado(null);
      setCarritoSeleccionado(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-start p-8 flex-grow">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Gestión de Envíos</h1>

        {/* Vista previa de carritos */}
        <div className="w-full max-w-7xl space-y-6">
          {carritosPaginados.map((carrito) => (
            <div key={carrito.idCarrito} className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Carrito ID: {carrito.idCarrito}</h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => setCarritoSeleccionado(carrito)}
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="mt-8 flex justify-center">
          <button
            className="bg-gray-200 px-4 py-2 mx-1 rounded"
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          <span className="mx-2 text-lg">{`Página ${paginaActual} de ${Math.ceil(carritos.length / carritosPorPagina)}`}</span>
          <button
            className="bg-gray-200 px-4 py-2 mx-1 rounded"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === Math.ceil(carritos.length / carritosPorPagina)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de detalles */}
      {carritoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Detalles del Carrito ID: {carritoSeleccionado.idCarrito}
              </h2>
              <button
                className="text-red-500 text-lg font-bold hover:text-red-600"
                onClick={() => setCarritoSeleccionado(null)}
              >
                X
              </button>
            </div>

            {/* Detalles del Cliente */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-xl font-bold mb-2">Información del Cliente</h3>
              <p className="text-gray-700"><strong>Nombre:</strong> {carritoSeleccionado.cliente.NombreCompleto}</p>
              <p className="text-gray-700"><strong>Teléfono:</strong> {carritoSeleccionado.cliente.telefono}</p>
              <p className="text-gray-700"><strong>Ubicación:</strong> {carritoSeleccionado.cliente.UbicacionDetalles}</p>
            </div>

            {/* Lista de Productos */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-2">Productos</h3>
              {carritoSeleccionado.productos.map((producto: any, index: number) => (
                <div key={producto.idProducto || index} className="flex justify-between items-center bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-600">{producto.cantidad}</p>
                  <h3 className="text-lg font-semibold text-gray-700">{producto.producto}</h3>
                  <p className="text-gray-600"> L{producto.precioVenta.toFixed(2)} c/u</p>
                  <h3 className="text-gray-600">Total: L{producto.Total}</h3>
                </div>
              ))}
            </div>

            {/* Resumen del Carrito */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h3 className="text-xl font-bold mb-2">Resumen del Carrito</h3>
            <p className="text-gray-700"><strong>Total de Productos:</strong> {carritoSeleccionado.resumen.TotalProductos}</p>
            <p className="text-gray-600">
              <strong>Total del Carrito:</strong> L{carritoSeleccionado.resumen.TotalCarrito.toFixed(2)}
            </p>
          </div>


            {/* Botón Gestionar Envío */}
            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-500 texxt-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => setEnvioGestionado(carritoSeleccionado)}
              >
                Gestionar envío
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para gestionar envío */}
      {gestionarEnvio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Gestionar Envío ID: {gestionarEnvio.idCarrito}</h2>
              <button
                className="text-red-500 text-lg font-bold hover:text-red-600"
                onClick={() => setEnvioGestionado(null)}
              >
                X
              </button>
            </div>
            {/* Formulario */}
            <form onSubmit={handleGestionarEnvio}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Empleado:</label>
                <select className="w-full border-gray-300 rounded-lg p-2" name="empleado" required>
                  <option value="">Seleccionar empleado</option>
                  <option value="empleado1">Empleado 1</option>
                  <option value="empleado2">Empleado 2</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Vehículo:</label>
                <select className="w-full border-gray-300 rounded-lg p-2" name="vehiculo" required>
                  <option value="">Seleccionar vehículo</option>
                  <option value="vehiculo1">Vehículo 1</option>
                  <option value="vehiculo2">Vehículo 2</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"  onClick={() => { alert("Envío gestionado");}}>
                  Confirmar Envío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
