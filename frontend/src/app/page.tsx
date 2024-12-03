'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Slider from '../components/Slider';

// Definir la interfaz para el tipo de categoría
interface Category {
  idCategoria: number;
  nombre: string;
  Ruta: string; 
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isJefe, setIsJefe] = useState(false);

  useEffect(() => {
    const idPersona = localStorage.getItem('idPersona');
    const jefeStatus = localStorage.getItem('isJefe') === 'true';
    if (!idPersona) {
      window.location.href = '/login';
    } else {
      setIsAuthenticated(true);
      setIsJefe(jefeStatus);
      axios.get('http://localhost:3001/categoria')
        .then(response => {
          setCategories(response.data);
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    }
  }, []);

  if (!isAuthenticated) {
    return <p>Redirigiendo a la página de inicio de sesión...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Slider />
      <div className="container mx-auto p-10">
        <h1 className="text-6xl font-bold text-center text-gray-800 mb-10">Categorías</h1>
        <CategoryGrid categories={categories} />
        {isJefe && (
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Opciones de Administrador</h2>
            <Link href="/admin/dashboard" passHref>
              <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105">
                Panel de Administración
              </button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
// Componente Cuadrícula de Categorías
function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-8">
      {categories.map((category) => (
        <Link key={category.idCategoria} href={`/departamentos/${category.idCategoria}`} passHref>
          <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all ease-in-out duration-300">
            {/* Imagen de categoría */}
            <img
              src={category.Ruta}
              alt={category.nombre}
              className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            {/* Texto de categoría */}
            <div className="p-6 absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h2 className="text-5xl font-bold text-gray-900 text-center group-hover:text-gray-900 group-hover:text-opacity-80 transition">
                {category.nombre}
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

