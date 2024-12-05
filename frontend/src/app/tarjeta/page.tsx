'use client';

import { useState, useEffect } from "react";
import axios from "axios";

export default function FormularioTarjeta() {
  const [numero, setNumero] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [cvv, setCvv] = useState("");
  const [idPersona, setIdPersona] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para mensajes de error

  useEffect(() => {
    const personaId = localStorage.getItem("idPersona");
    if (personaId) {
      setIdPersona(personaId);
      console.log("idPersona recuperado:", personaId);
    } else {
      console.log("No se encontró idPersona en el localStorage");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Limpiar errores previos

    if (!idPersona) {
      setError("No se encontró idPersona en el localStorage. No se puede proceder.");
      setLoading(false);
      return;
    }

    try {
      console.log("Enviando datos con idPersona:", idPersona);
      const response = await axios.post("http://localhost:3001/api/tarjeta", {
        numero,
        mes,
        anio,
        cvv,
        idPersona,
      });

      console.log("Respuesta del servidor:", response.data);

      if (response.status === 200 || response.status === 201) {
        alert("Tarjeta y carrito actualizados correctamente.");
        window.location.href = "/ubicacion"; // Redirige a la página /ubicacion
      } else {
        setError("Hubo un problema al guardar la tarjeta.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setError("Error al guardar la tarjeta. Por favor, inténtalo de nuevo.");
      setLoading(false);
    }
  };

  const handleRecogerClick = () => {
    window.location.href = "/recoger"; // Redirige a la página /recoger
  };

  return (
    <div className="bg-gray-50 p-8 max-w-4xl mx-auto rounded-lg shadow-md mt-10">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-10">Agregar Tarjeta</h1>
      
      {error && <p className="text-center text-red-500 text-lg mb-6">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="numero" className="text-gray-700 font-semibold mb-2">Número de tarjeta</label>
          <input
            type="text"
            id="numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex flex-col w-1/3">
            <label htmlFor="mes" className="text-gray-700 font-semibold mb-2">Mes</label>
            <input
              type="number"
              id="mes"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col w-1/3">
            <label htmlFor="anio" className="text-gray-700 font-semibold mb-2">Año</label>
            <input
              type="number"
              id="anio"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex flex-col w-1/3">
            <label htmlFor="cvv" className="text-gray-700 font-semibold mb-2">CVV</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          {loading ? "Guardando tarjeta..." : "Guardar tarjeta"}
        </button>
      </form>

      {loading && <p className="text-center text-gray-600 mt-6">Redirigiendo a ubicación...</p>}

      <div className="mt-6 text-center">
        <p
          onClick={handleRecogerClick}
          className="text-blue-500 hover:text-blue-600 cursor-pointer underline"
        >
          Recoger en sucursal
        </p>
      </div>
    </div>
  );
}
