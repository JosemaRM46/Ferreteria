"use client";

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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="numero">Número de tarjeta:</label>
          <input
            type="text"
            id="numero"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="mes">Mes:</label>
          <input
            type="number"
            id="mes"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="anio">Año:</label>
          <input
            type="number"
            id="anio"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="cvv">CVV:</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Guardando tarjeta..." : "Guardar tarjeta"}
        </button>
      </form>
      {loading && <p>Redirigiendo a ubicación...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
