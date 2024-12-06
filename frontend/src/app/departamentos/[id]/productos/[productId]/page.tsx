'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';
import ProductCard from '../../../../../components/ProductCard';

interface Product {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precioVenta: number;
  precioCosto: number;
  idCategoria: number;
  idMarca: number;
  Impuesto: number;
  ruta: string | null;
}

export default function DepartmentPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [departmentName, setDepartmentName] = useState<string>('');

  useEffect(() => {
    if (id) {
      const fetchDepartmentData = async () => {
        try {
          const [productsResponse, categoriesResponse] = await Promise.all([
            axios.get(`http://localhost:3001/productos/departamento/${id}`),
            axios.get('http://localhost:3001/categoria'),
          ]);

          setProducts(productsResponse.data);

          const department = categoriesResponse.data.find(
            (dept: { idCategoria: number }) => dept.idCategoria === Number(id)
          );
          setDepartmentName(department?.nombre || 'Departamento');
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchDepartmentData();
    }
  }, [id]);

  const agregarAlCarrito = async (idProducto: number) => {
    const idPersona = localStorage.getItem('idPersona');
    const cantidad = 1;

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Productos en el Departamento: <span className="text-blue-500">{departmentName}</span>
        </h1>
        {products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No hay productos disponibles en este departamento.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.idProducto}
                idProducto={product.idProducto}
                nombre={product.nombre}
                precioVenta={product.precioVenta}
                ruta={product.ruta}
                onAddToCart={agregarAlCarrito}
                idDepartamento={Number(id)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
