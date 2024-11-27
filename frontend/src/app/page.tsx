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
    <div>
      <Navbar />
      <Slider />
      <div style={{ padding: '2rem' }}>
        <Link href="/departamentos" passHref>
          <button style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Departamentos
          </button>
        </Link>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Categorías</h1>
        <CategoryGrid categories={categories} />
        {isJefe && (
          <div>
            <h2>Opciones de Administrador</h2>
            <Link href="/admin/dashboard" passHref>
              <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Panel de Administración
              </button>
            </Link>
            {/* Aquí puedes agregar más opciones para los jefes */}
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
      {categories.map((category) => (
        <Link key={category.idCategoria} href={`/departamentos/${category.idCategoria}`} passHref>
          <div style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
            <h2>{category.nombre}</h2>
            <h2>{category.idCategoria}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}