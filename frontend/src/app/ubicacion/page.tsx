"use client";

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
  
      if (response.status === 201) {
        alert("Ubicación guardada y carrito actualizado con éxito.");
        window.location.href = "/factura"; 
      } else {
        alert("Hubo un problema al guardar la ubicación.");
      }
    } catch (error) {
      console.error("Error al guardar la ubicación:", error);
      alert("Error al guardar la ubicación. Por favor, inténtalo de nuevo.");
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="pais">País:</label>
          <select id="pais" value={selectedPais} onChange={handlePaisChange} required>
            <option value="">Seleccione un país</option>
            {paises.map((pais) => (
              <option key={pais.idPais} value={pais.idPais}>
                {pais.Nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="departamento">Departamento:</label>
          <select
            id="departamento"
            value={selectedDepartamento}
            onChange={(e) => setSelectedDepartamento(Number(e.target.value))}
            required
            disabled={!selectedPais}
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
          <label htmlFor="detalles">Detalles:</label>
          <input
            type="text"
            id="detalles"
            maxLength={400}
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
            required
          />
        </div>
        <button type="submit">Guardar Ubicación</button>
      </form>
    </div>
  );
}
