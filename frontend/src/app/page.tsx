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
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Categorías</h1>
        <CategoryGrid categories={categories} />
        {isJefe && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Opciones de Administrador</h2>
            <Link href="/admin/dashboard" passHref>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.idCategoria} href={`/departamentos/${category.idCategoria}`} passHref>
          <div className="group relative bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
            {/* Imagen de categoría */}
            <img
              src={category.Ruta}
              alt={category.nombre}
              className="w-full h-48 object-cover"
            />
            {/* Texto de categoría */}
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {category.nombre}
              </h2>
              <p className="text-sm text-gray-500">ID: {category.idCategoria}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
