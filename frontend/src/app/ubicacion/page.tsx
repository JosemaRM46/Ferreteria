'use client';

import { useState, useEffect } from "react";
import axios from "axios";

interface Pais {
  idPais: number;
  Nombre: string;
}

interface Departamento {
  idDepartamento: number;
  Nombre: string;
}

export default function FormularioUbicacion() {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [selectedPais, setSelectedPais] = useState<number | "">("");
  const [selectedDepartamento, setSelectedDepartamento] = useState<number | "">("");
  const [detalles, setDetalles] = useState("");
  const [idPersona, setIdPersona] = useState<string>("");

  useEffect(() => {
    // Carga idPersona desde el localStorage
    const personaId = localStorage.getItem("idPersona");
    if (personaId) {
      setIdPersona(personaId);
    } else {
      console.error("No se encontró idPersona en el localStorage.");
      alert("Error: No se encontró la información del usuario. Por favor, inicia sesión nuevamente.");
      window.location.href = "/login"; // Redirige al login si es necesario
    }

    // Carga la lista de países
    axios.get("http://localhost:3001/api/paises")
      .then((response) => setPaises(response.data))
      .catch((error) => console.error("Error al cargar países:", error));
  }, []);

  const handlePaisChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const paisId = Number(e.target.value);
    setSelectedPais(paisId);

    if (paisId) {
      // Carga los departamentos del país seleccionado
      try {
        const response = await axios.get(`http://localhost:3001/api/departamentos/${paisId}`);
        setDepartamentos(response.data);
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    } else {
      setDepartamentos([]);
      setSelectedDepartamento("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3001/api/ubicacion", {
        Detalles: detalles,
        idPais: selectedPais,
        idDepartamento: selectedDepartamento,
        idPersona,
      });
  
      if (response.status === 200) {
        alert(response.data.message || "Ubicación guardada y carrito actualizado con éxito.");
  
        // Redirigir después de un breve retraso para asegurar que todo se procese correctamente.
        setTimeout(() => {
          window.location.href = "/factura"; // Redirección manual
        }, 500); // Retardo de 500 ms
      } else {
        alert(response.data.message || "Hubo un problema al guardar la ubicación.");
      }
    } catch (error) {
      console.error("Error al guardar la ubicación:", error);
      alert("Error al guardar la ubicación. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="bg-gray-50 p-8 max-w-4xl mx-auto rounded-lg shadow-md mt-10">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-10">Agregar Ubicación</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="pais" className="block text-gray-700 font-semibold mb-2">País:</label>
          <select
            id="pais"
            value={selectedPais}
            onChange={handlePaisChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Seleccione un país</option>
            {paises.map((pais) => (
              <option key={pais.idPais} value={pais.idPais}>
                {pais.Nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="departamento" className="block text-gray-700 font-semibold mb-2">Departamento:</label>
          <select
            id="departamento"
            value={selectedDepartamento}
            onChange={(e) => setSelectedDepartamento(Number(e.target.value))}
            required
            disabled={!selectedPais}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Seleccione un departamento</option>
            {departamentos.map((dep) => (
              <option key={dep.idDepartamento} value={dep.idDepartamento}>
                {dep.Nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="detalles" className="block text-gray-700 font-semibold mb-2">Detalles:</label>
          <input
            type="text"
            id="detalles"
            maxLength={400}
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Guardar Ubicación
        </button>
      </form>
    </div>
  );
}
