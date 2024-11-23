'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


// Componente Slide de Imágenes
function ImageSlider() {
  return (
    <div style={{ justifyContent:'center',display: 'flex', overflowX: 'scroll', gap: '1rem', padding: '1rem' }}>
      <img src="https://res.cloudinary.com/dybrsccg2/image/upload/v1732324629/Screenshot_2024-11-10_at_2.02.20_srlgxa.png" alt="Slide 1" style={{ width: '180px', height: '180px' }} />
      <img src="/images/logo.png" alt="Slide 2" style={{ width: '180px', height: 'auto' }} />
      <img src="/images/logo.png" alt="Slide 3" style={{ width: '180px', height: 'auto' }} />
    </div>
  );
}

// Componente Cuadrícula de Categorías
function CategoryGrid() {
  const categories = [
    { name: 'Herramientas', path: '/departamentos' },
    { name: 'Pinturas', path: '/pinturas' },
    { name: 'Materiales de Construcción', path: '/materiales' },
    { name: 'Jardinería', path: '/jardineria' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', padding: '1rem' }}>
      {categories.map(category => (
        <div key={category.name} style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center' }}>
          <h2>{category.name}</h2>
          <Link href={category.path} legacyBehavior>
            <a style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
              Ver más
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}

// Componente Footer


// Página Principal
export default function Home() {
  return (
    <div>
      <Navbar />
      <ImageSlider />
      <CategoryGrid />
      <Footer />
    </div>
  );
}