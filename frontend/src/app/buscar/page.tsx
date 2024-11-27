'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Definir la interfaz para el tipo de producto
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

const BuscarPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    if (query) {
      axios.get('http://localhost:3001/buscar', {
        params: { query }
      })
      .then(response => {
        setSearchResults(response.data);
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
    }
  }, [query]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Resultados de búsqueda para "{query}"</h1>
        {searchResults.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {searchResults.map(product => (
              <Link key={product.idProducto} href={`/productos/${product.idProducto}`} passHref>
                <div style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={product.ruta || "/images/logo.png"} alt={product.nombre} style={{ width: '100px', height: '100px', marginBottom: '1rem' }} />
                  <h2>{product.nombre}</h2>
                  <p>{product.precioVenta}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BuscarPage;