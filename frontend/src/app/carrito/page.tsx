'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Definir la interfaz para el tipo de producto en el carrito
interface ProductoCarrito {
  idProducto: number;
  nombre: string;
  precioVenta: number;
  cantidad: number;
  Total: number;
}

export default function CarritoPage() {
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const idPersona = localStorage.getItem('idPersona'); // Obtener idPersona desde localStorage

  useEffect(() => {
    if (!idPersona) {
      setError('No estás logueado');
      setLoading(false);
      return;
    }

    const fetchIdCliente = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/cliente/${idPersona}`);
        if (response.status === 200) {
          const data = response.data;
          const idCarrito = data.idCliente; // Usamos idCliente para obtener el carrito

          const carritoResponse = await axios.get(`http://localhost:3001/carrito/${idCarrito}`);
          if (carritoResponse.status === 200) {
            setProductos(carritoResponse.data);
          } else {
            setError('No se pudo obtener los productos del carrito.');
          }
        } else {
          setError('No se encontró el cliente.');
        }
      } catch (err) {
        setError('Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdCliente();
  }, [idPersona]);

  if (loading) return <p>Cargando productos del carrito...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Tu Carrito</h1>
        {productos.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {productos.map((producto) => (
              <div
                key={producto.idProducto}
                style={{ display: 'flex', border: '1px solid #ccc', padding: '1rem', alignItems: 'center', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                <img src="/images/logo.png" alt={producto.nombre} style={{ width: '100px', height: '100px', marginRight: '1rem' }} />
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#1a202c' }}>{producto.nombre}</h2>
                  <p style={{ color: '#4a5568' }}>ID Producto: {producto.idProducto}</p>
                  <p style={{ color: '#4a5568' }}>Cantidad: {producto.cantidad}</p>
                  <p style={{ color: '#4a5568' }}>Precio: ${producto.precioVenta.toFixed(2)}</p>
                  <p style={{ fontWeight: 'bold', color: '#2d3748' }}>Total: ${producto.Total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}