'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link'; // Importamos Link de Next.js

// Definir la interfaz para el tipo de producto en el carrito
interface ProductoCarrito {
  idProducto: number;
  nombre: string;
  precioVenta: number;
  cantidad: number;
  Total: number;
  ruta: string; // La ruta de la imagen
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
            const carritoData = carritoResponse.data.productos;

            // Ahora que tenemos los productos en el carrito, vamos a obtener la ruta de la imagen para cada uno
            const productosConRuta = await Promise.all(
              carritoData.map(async (producto: any) => {
                try {
                  const productoResponse = await axios.get(`http://localhost:3001/producto/${producto.idProducto}`);
                  if (productoResponse.status === 200) {
                    return {
                      ...producto,
                      ruta: productoResponse.data.ruta, // Asumimos que la respuesta tiene la ruta del producto
                    };
                  } else {
                    throw new Error('No se pudo obtener la ruta del producto');
                  }
                } catch (error) {
                  console.error(error);
                  return {
                    ...producto,
                    ruta: '', // En caso de error, dejamos la ruta vacía
                  };
                }
              })
            );

            setProductos(productosConRuta);
          } else {
            setError('No se pudo obtener los productos del carrito.');
          }
        } else {
          setError('No se encontró el cliente.');
        }
      } catch (err: any) {
        console.error('Error al conectar con el servidor:', err);
        setError('Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdCliente();
  }, [idPersona]);

  // Calcular el total general
  const calcularTotalGeneral = () => {
    return productos.reduce((acumulador, producto) => acumulador + producto.Total, 0);
  };

  // Manejar el cambio de cantidad de productos
  const handleCantidadChange = (idProducto: number, nuevaCantidad: number) => {
    setProductos((productosAnteriores) =>
      productosAnteriores.map((producto) =>
        producto.idProducto === idProducto
          ? { ...producto, cantidad: nuevaCantidad, Total: nuevaCantidad * producto.precioVenta }
          : producto
      )
    );
  };

  // Manejar la confirmación de la cantidad de productos
  const handleConfirmarCantidad = async (idProducto: number, cantidad: number) => {
    try {
      const response = await axios.post('http://localhost:3001/carrito/agregar', {
        idProducto,
        cantidad,
        idPersona,
      });
      if (response.status === 200) {
        alert('Cantidad actualizada correctamente');
      } else {
        alert('Error al actualizar la cantidad');
      }
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
      alert('Error al actualizar la cantidad');
    }
  };

  // Manejar la eliminación de productos
  const handleEliminarProducto = async (idProducto: number) => {
    try {
      const response = await axios.post('http://localhost:3001/carrito/eliminar', {
        idProducto,
        idPersona,
      });
      if (response.status === 200) {
        setProductos((productosAnteriores) =>
          productosAnteriores.filter((producto) => producto.idProducto !== idProducto)
        );
        alert('Producto eliminado correctamente');
      } else {
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  if (loading) return <p>Cargando productos del carrito...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Tu Carrito</h1>
        {productos.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <div className="space-y-4">
            {productos.map((producto) => (
              <div
                key={producto.idProducto}
                className="flex flex-col sm:flex-row items-center border p-4 bg-white rounded-lg shadow-md gap-4"
              >
                <img
                  src={producto.ruta || '/images/logo.png'}
                  alt={producto.nombre}
                  className="w-32 h-32 object-contain mr-4 mb-4 sm:mb-0"
                />
                <div className="flex-1 mr-4">
                  <h2 className="text-lg font-medium text-gray-900">{producto.nombre}</h2>
                </div>
                <p className="text-gray-600 mr-4">Precio: ${producto.precioVenta.toFixed(2)}</p>
                <div className="flex items-center gap-2 mr-4">
                  <label htmlFor={`cantidad-${producto.idProducto}`} className="text-gray-600">
                    Cantidad:
                  </label>
                  <input
                    id={`cantidad-${producto.idProducto}`}
                    type="number"
                    value={producto.cantidad}
                    min="1"
                    onChange={(e) => handleCantidadChange(producto.idProducto, parseInt(e.target.value))}
                    className="w-16 p-1 border rounded-md border-gray-300"
                  />
                </div>
                <p className="text-gray-600 mr-4">
                  Subtotal: ${(producto.cantidad * producto.precioVenta).toFixed(2)}
                </p>
                <div className="flex justify-center w-full sm:w-auto gap-4 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleConfirmarCantidad(producto.idProducto, producto.cantidad)}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white border-none cursor-pointer"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleEliminarProducto(producto.idProducto)}
                    className="px-4 py-2 rounded-md bg-red-600 text-white border-none cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {/* Mostrar el total general */}
            <div className="mt-8 text-right text-xl font-semibold text-gray-800">
              Total General: ${calcularTotalGeneral().toFixed(2)}
            </div>
            {/* Botón Pagar */}
            <div className="mt-4 flex justify-between items-center">
              <Link
                href="/"
                className="py-2 px-4 rounded-md bg-orange-600 text-white font-medium shadow-md hover:bg-gray-600 transition duration-300"
              >
                Seguir comprando
              </Link>
              <Link
                href="/tarjeta"
                className="py-2 px-4 rounded-md bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition duration-300"
              >
                Pagar
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
