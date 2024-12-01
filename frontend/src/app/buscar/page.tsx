'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard'; // Importar ProductCard

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

  // Función para agregar al carrito
  const handleAddToCart = (idProducto: number) => {
    const idPersona = localStorage.getItem('idPersona'); // Suponiendo que tienes el idPersona en el localStorage

    if (!idPersona) {
      alert('Por favor, inicia sesión para agregar productos al carrito');
      return;
    }

    axios.post('http://localhost:3001/carrito/agregar', {
      idProducto,
      cantidad: 1, // Puedes hacer que la cantidad sea dinámica si lo deseas
      idPersona,
    })
    .then(() => {
      alert('Producto agregado al carrito');
    })
    .catch(error => {
      console.error('Error al agregar al carrito:', error);
      alert('Hubo un error al agregar el producto al carrito');
    });
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Resultados de búsqueda para "{query}"
        </h1>
        {searchResults.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {searchResults.map(product => (
              <ProductCard
                key={product.idProducto}
                idProducto={product.idProducto}
                nombre={product.nombre}
                precioVenta={product.precioVenta}
                ruta={product.ruta}
                onAddToCart={handleAddToCart} // Pasar la función onAddToCart
              />
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
