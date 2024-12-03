"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar2";
import Footer from "../../components/Footer";

export default function RegisterPage() {
  const [carritos, setCarritos] = useState<any[]>([]);
  const [carritoSeleccionado, setCarritoSeleccionado] = useState<any>(null); // Carrito en la modal
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
              <h2 className="text-2xl font-bold">Detalles del Carrito ID: {carritoSeleccionado.idCarrito}</h2>
              <button
                className="text-red-500 text-lg font-bold hover:text-red-600"
                onClick={() => setCarritoSeleccionado(null)}
              >
                X
              </button>
            </div>
            {/* Lista de Productos */}
            <div className="space-y-4">
              {carritoSeleccionado.productos.map((producto: any) => (
                <div
                  key={producto.idProducto}
                  className="flex justify-between items-center bg-gray-100 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold text-gray-700">{producto.nombre}</h3>
                  <p className="text-gray-600">Cantidad: {producto.cantidad}</p>
                </div>
              ))}
            </div>
            {/* Total Final */}
            <div className="mt-6 text-right">
              <h3 className="text-xl font-bold text-gray-800">
                Total Final: L.{" "}
                {carritoSeleccionado.productos.reduce((acc: number, p: any) => acc + p.Total, 0)}
              </h3>
            </div>
            {/* Botón Gestionar Envío */}
            <div className="mt-6 flex justify-end">
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
                onClick={() => alert(`Gestionar envío para el carrito ID: ${carritoSeleccionado.idCarrito}`)}
              >
                Gestionar envío
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
