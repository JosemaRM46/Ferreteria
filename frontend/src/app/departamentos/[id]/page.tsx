'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

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

export default function DepartmentPage() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [departmentName, setDepartmentName] = useState<string>('');

  useEffect(() => {
    if (id) {
      // Obtener los productos del departamento
      axios.get('http://localhost:3001/productos')
        .then(response => {
          const departmentProducts = response.data.filter((product: Product) => product.idCategoria === Number(id));
          setProducts(departmentProducts);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });

      // Obtener el nombre del departamento
      axios.get('http://localhost:3001/categoria')
        .then(response => {
          const department = response.data.find((dept: { idCategoria: number }) => dept.idCategoria === Number(id));
          setDepartmentName(department?.nombre || 'Departamento');
        })
        .catch(error => {
          console.error('Error fetching department name:', error);
        });
    }
  }, [id]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Productos en el Departamento {departmentName}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {products.map((product) => (
            <Link key={product.idProducto} href={`/departamentos/${id}/productos/${product.idProducto}`} passHref>
              <div style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/images/logo.png" alt={product.nombre} style={{ width: '100px', height: '100px', marginBottom: '1rem' }} />
                <h2>{product.nombre}</h2>
                <p>{product.precioVenta}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}