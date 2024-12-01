"use client";
import { useState, useEffect } from "react";
import Navbar from '../../components/Navbar2';
import Footer from "../../components/Footer";

export default function RegisterPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [productosPaginados, setProductosPaginados] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const handleBusquedaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(event.target.value);
  };

  useEffect(() => {
    fetch("http://localhost:3001/personal")
      .then((response) => response.json())
      .then((data) => {
        const productosConImagen = data.map((empleado) => ({
          ...empleado,
          fotografia: empleado.fotografia || '/images/noimagen.jpg', // Imagen predeterminada si no hay
        }));
        setProductos(productosConImagen);
        setProductosPaginados(productosConImagen);
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  useEffect(() => {
    if (busqueda === "") {
      setProductosPaginados(productos);
    } else {
      const productosFiltrados = productos.filter((empleado) =>
        empleado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        empleado.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
        empleado.cargo.toLowerCase().includes(busqueda.toLowerCase())
      );
      setProductosPaginados(productosFiltrados);
    }
  }, [busqueda, productos]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-col items-center justify-start p-8 flex-grow">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Personal</h1>

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
        
        {/* Lista de empleados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
          {productosPaginados.map((empleado) => (
            <div key={empleado.idempleado || empleado.correo} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={empleado.fotografia}
                className="w-full h-48 object-cover"
                alt={empleado.nombre || "Imagen predeterminada"}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-700">{empleado.nombre}</h2>
                <p className="text-lg font-bold text-gray-800">{empleado.cargo}</p>
                <div className="flex items-center">
                  <span className="text-5 font-semibold text-gray-700">Correo: </span>
                  <span className="text-5 text-gray-600 ml-2">{empleado.correo}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-5 font-semibold text-gray-700">Teléfono: </span>
                  <span className="text-5 text-gray-600 ml-2">{empleado.numero}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-5 font-semibold text-gray-700">Fecha Inicio del cargo: </span>
                  <span className="text-5 text-gray-600 ml-2">{empleado.fechaInicio}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-5 font-semibold text-gray-700">Tiempo en el cargo: </span>
                  <span className="text-5 text-gray-600 ml-2">{empleado.tiempoCargo}</span>
                </div>
              </div>
              <div className="flex justify-between p-4 border-t">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">Editar</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
