'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar2';
import Footer from '../../components/Footer';
import { FaWhatsapp } from 'react-icons/fa'; 

interface Proveedor {
  idproveedor: number;
  nombre: string;
  correo: string;
  telefono: string;
  ruta: string; 
}

export default function ContactoProveedor() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    // Obtener la información de todos los proveedores desde el backend
    axios.get('http://localhost:3001/proveedor')
      .then(response => {
        setProveedores(response.data); // Guardar todos los proveedores
      })
      .catch(error => {
        console.error('Error al obtener la información de los proveedores:', error);
      });
  }, []);

  if (proveedores.length === 0) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Contacto con los Proveedores</h1>
        
        {/* Lista de proveedores */}
        <div className="space-y-6">
          {proveedores.map((proveedor) => (
            <div 
              key={proveedor.idproveedor} 
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center space-x-6"
            >
              {/* Logo del proveedor */}
              <img 
                src={proveedor.ruta} 
                alt={proveedor.nombre} 
                className="w-32 h-32 object-contain rounded-md border border-gray-300 mb-4 sm:mb-0"
              />
              
              {/* Información del proveedor */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-700">{proveedor.nombre}</h2>
                  
                  {/* Enlace de correo */}
                  <p className="mt-2 text-gray-600">
                    <strong>Correo:</strong> 
                    <a 
                      href={`mailto:${proveedor.correo}`} 
                      className="text-blue-600 hover:underline"
                    >
                      {proveedor.correo}
                    </a>
                  </p>

                  {/* Enlace de teléfono */}
                  <p className="mt-2 text-gray-600">
                    <strong>Teléfono:</strong> 
                    <a 
                      href={`tel:${proveedor.telefono}`} 
                      className="text-blue-600 hover:underline"
                    >
                      {proveedor.telefono}
                    </a>
                  </p>
                </div>
                
                {/* Icono de WhatsApp */}
                <a
                  href={`https://wa.me/${proveedor.telefono.replace(/\D/g, '')}`} // Enlace para contactar por WhatsApp
                  className="mt-4 sm:mt-0 text-green-600 hover:text-green-800 flex items-center space-x-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp size={24} />
                  <span>Contactar por WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">¿Necesitas más información?</h3>
          <p className="text-gray-600">
            Si tienes alguna pregunta o necesitas más detalles, puedes ponerte en contacto con cualquiera de los proveedores a través de su correo, teléfono o el enlace de WhatsApp.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
