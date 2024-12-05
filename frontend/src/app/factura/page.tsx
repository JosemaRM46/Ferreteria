'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface Producto {
  Producto: string;
  Cantidad: number;
  PrecioUnidad: number; // Esto es el precio por unidad
  TotalProducto: number; // Total del producto
}

interface Factura {
  idPersona: number;
  pNombre: string;
  sNombre: string;
  pApellido: string;
  sApellido: string;
  NumeroTarjeta: string;
  idCarrito: number;
  TotalCarrito: number;
  UbicacionDetalles: string;
  Pais: string;
  Departamento: string;
  Productos: Producto[];
}

export default function FacturaPage() {
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const idPersona = localStorage.getItem("idPersona");

    if (!idPersona) {
      setError("No se encontró idPersona en el localStorage");
      setLoading(false);
      return;
    }

    const fetchFactura = async () => {
      try {
        const response = await axios.post<Factura[]>(
          "http://localhost:3001/api/factura",
          { idPersona: parseInt(idPersona, 10) }
        );
        if (response.data.length > 0) {
          setFactura(response.data[0]); // Seleccionamos la primera factura
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener la factura:", error);
        setError("Error al obtener la factura");
        setLoading(false);
      }
    };

    fetchFactura();
  }, []);

  const handlePagar = async () => {
    if (!factura) return;

    try {
      const response = await axios.put("http://localhost:3001/api/carrito/pagar", {
        idCarrito: factura.idCarrito,
      });
      setMensaje(response.data.message); // Mensaje de éxito
    } catch (error) {
      console.error("Error al pagar el carrito:", error);
      setError("Error al pagar el carrito");
    }
  };

  if (loading) return <p>Cargando factura...</p>;
  if (error) return <p>{error}</p>;
  if (!factura) return <p>No se encontró factura para este usuario.</p>;

  return (
    <div className="bg-gray-50 p-8 max-w-4xl mx-auto rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-10">Factura</h1>
      
      {mensaje && <p className="text-center text-green-500 text-lg mb-6">{mensaje}</p>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Datos del Cliente</h2>
        <p className="text-gray-700">{factura.pNombre} {factura.sNombre} {factura.pApellido} {factura.sApellido}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tarjeta</h2>
        <p className="text-gray-700">Número: {factura.NumeroTarjeta}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Carrito</h2>
        <p className="text-gray-700">ID Carrito: {factura.idCarrito}</p>
        <p className="text-gray-700">Total Carrito: ${factura.TotalCarrito.toFixed(2)}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Ubicación</h2>
        <p className="text-gray-700">Detalles: {factura.UbicacionDetalles}</p>
        <p className="text-gray-700">País: {factura.Pais}</p>
        <p className="text-gray-700">Departamento: {factura.Departamento}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Productos</h2>
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left text-gray-700">Producto</th>
              <th className="py-3 px-4 text-left text-gray-700">Cantidad</th>
              <th className="py-3 px-4 text-left text-gray-700">Precio por Unidad</th>
              <th className="py-3 px-4 text-left text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {factura.Productos && factura.Productos.length > 0 ? (
              factura.Productos.map((producto, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{producto.Producto}</td>
                  <td className="py-3 px-4">{producto.Cantidad}</td>
                  <td className="py-3 px-4">${producto.PrecioUnidad.toFixed(2)}</td>
                  <td className="py-3 px-4">${producto.TotalProducto.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-3 px-4 text-center">No hay productos en esta factura</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total Carrito debajo de la tabla */}
      <div className="flex justify-end font-semibold text-gray-700">
        <span>Total Carrito: </span>
        <span className="ml-4 text-xl">${factura.TotalCarrito.toFixed(2)}</span>
      </div>

      <button onClick={handlePagar} className="w-full mt-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
        Pagar
      </button>
    </div>
  );
}
