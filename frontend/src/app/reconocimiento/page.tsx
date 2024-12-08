"use client";
import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';

interface Empleado {
  Empleado: string;
  CantidadEntregas: number;
  Imagen: string;  // URL de la imagen
}

const EmpleadoDelMes: React.FC = () => {
  const [empleado, setEmpleado] = useState<Empleado | null>(null);

  // Obtener datos del empleado desde la API
  useEffect(() => {
    const fetchEmpleado = async () => {
      try {
       const response = await axios.get('http://localhost:3001/EmpleadoDelMes');
        setEmpleado(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del empleado del mes:', error);
      }
    };

    fetchEmpleado();
  }, []);

  const generarPDF = () => {
    if (!empleado) return;

    const doc = new jsPDF();

    // Definir fuentes y colores
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 0, 0); // Rojo para el título
    doc.text('Empleado del Mes', 20, 20);

    // Añadir logo (si existe)
    if (empleado.Imagen) {
      doc.addImage(empleado.Imagen, 'JPEG', 20, 30, 50, 50); // Imagen del empleado
    }

    // Añadir cuerpo del reconocimiento
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Negro para el texto

    // Información del empleado
    doc.text(`Nombre: ${empleado.Empleado}`, 20, 90);
    doc.text(`Cantidad de entregas: ${empleado.CantidadEntregas}`, 20, 100);

    // Información adicional (puedes añadir más)
    doc.text('Gracias por tu esfuerzo y dedicación', 20, 110);

    // Barra roja debajo del texto
    doc.setFillColor(255, 0, 0); // Color rojo
    doc.rect(0, 130, 210, 10, 'F');

    // Firma
    doc.setTextColor(0, 0, 0); // Negro
    doc.text('Firma:', 20, 150);

    // Guardar el PDF
    doc.save(`${empleado.Empleado}-reconocimiento.pdf`);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Empleado del Mes</h1>
      {empleado ? (
        <>
          <p className="text-lg"><strong>Nombre:</strong> {empleado.Empleado}</p>
          <p className="text-lg"><strong>Cantidad de entregas:</strong> {empleado.CantidadEntregas}</p>
          {empleado.Imagen && <img src={empleado.Imagen} alt="Empleado" className="w-20 h-20 rounded-full mt-4" />}
          
          <button
            onClick={generarPDF}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Generar PDF
          </button>
        </>
      ) : (
        <p>Cargando datos del empleado del mes...</p>
      )}
    </div>
  );
};


export default EmpleadoDelMes;
