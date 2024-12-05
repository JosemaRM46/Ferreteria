"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Recoger() {
  const [idCarrito, setIdCarrito] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const personaId = localStorage.getItem("idPersona");

    if (!personaId) {
      setError("No se encontró idPersona en el localStorage.");
      setLoading(false);
      return;
    }

    const fetchCarrito = async () => {
      try {
        console.log("Enviando solicitud con idPersona:", personaId); // Agregar depuración

        // Aquí hacemos la solicitud pasando el idPersona como parámetro
        const response = await axios.get(`http://localhost:3001/api/carrito`, {
          params: { idPersona: personaId },
        });

        console.log("Respuesta del backend:", response); // Verifica la respuesta del servidor

        if (response.status === 200) {
          setIdCarrito(response.data.idCarrito);
        } else {
          setError("No se pudo obtener el idCarrito.");
        }
      } catch (error) {
        console.error("Error al obtener el idCarrito:", error); // Error detallado
        setError("Hubo un error al obtener el idCarrito.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarrito();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="bg-gray-50 p-8 max-w-4xl mx-auto rounded-lg shadow-md mt-10">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-10">Recoger en Sucursal</h1>
      {idCarrito ? (
        <p>
          Tu ID de carrito es: <strong>{idCarrito}</strong>. Por favor, menciónalo en la sucursal.
        </p>
      ) : (
        <p>No se pudo encontrar el ID del carrito.</p>
      )}
    </div>
  );
}
