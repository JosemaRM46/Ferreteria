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
  precioCosto: number;
  idCategoria: number;
  idMarca: number;
  Impuesto: number;
  ruta: string | null;
}

export default function ProductPage() {
  const { id, productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      axios.get(`http://localhost:3001/producto/${productId}`)
        .then(response => {
          setProduct(response.data);
        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    }
  }, [productId]);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={product.ruta || "/images/logo.png"} alt={product.nombre} style={{ width: '200px', height: '200px', margin: '0 auto' }} />
        </div>
        <div style={{ flex: 1, paddingLeft: '2rem' }}>
          <h1>{product.nombre}</h1>
          <p>Precio: ${product.precioVenta}</p>
          <p>{product.descripcion}</p>
          <p>Precio de Costo: ${product.precioCosto}</p>
          <p>Impuesto: {product.Impuesto}%</p>
          <p>Marca ID: {product.idMarca}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}