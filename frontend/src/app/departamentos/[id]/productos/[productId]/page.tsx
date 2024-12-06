'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';

// Definir la interfaz para el tipo de producto
interface Product {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  idCategoria: number;
  idMarca: number;
  ruta: string | null;
}

export default function ProductPage() {
  const { id, productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      axios
        .get(`http://localhost:3001/producto/${productId}`)
        .then((response) => {
          setProduct(response.data);
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
        });
    }
  }, [productId]);

  const agregarAlCarrito = async (idProducto: number) => {
    const idPersona = localStorage.getItem('idPersona'); // Obtener idPersona desde localStorage
    const cantidad = 1; // Puedes permitir que el usuario elija la cantidad

    if (!idPersona) {
      alert('No estás logueado');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idPersona,
          idProducto,
          cantidad,
        }),
      });

      if (response.ok) {
        alert('Producto agregado al carrito');
      } else {
        alert('Error al agregar producto al carrito');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al agregar el producto al carrito');
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-xl">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-5xl">
          {/* Imagen del producto */}
          <div className="w-80 h-80 flex-shrink-0">
            <img
              src={product.ruta || '/images/logo.png'}
              alt={product.nombre}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
          </div>
          {/* Detalles del producto */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start gap-4">
            <h1 className="text-4xl font-bold text-gray-800">{product.nombre}</h1>
            <p className="text-gray-600 text-lg">{product.descripcion}</p>
            <div className="flex flex-col gap-2 text-gray-700 text-lg">
              <p>
                <span className="font-semibold text-gray-800">Precio: </span>
                <span className="text-green-500 font-bold">${product.precioVenta.toFixed(2)}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-800">Marca ID: </span>{product.idMarca}
              </p>
            </div>
            <button
              onClick={() => agregarAlCarrito(product.idProducto)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
