// components/ProductCard.tsx
import React from 'react';
import Link from 'next/link'; // Importa Link para manejar la navegación

interface ProductCardProps {
  idProducto: number;
  idDepartamento: number; // Necesitarás el ID del departamento
  nombre: string;
  precioVenta: number;
  ruta: string | null;
  onAddToCart: (idProducto: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ idProducto, idDepartamento, nombre, precioVenta, ruta, onAddToCart }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Link href={`/departamentos/${idDepartamento}/productos/${idProducto}`}>
        {/* Al hacer clic en la imagen, se redirige a la página dinámica */}
        <img
          src={ruta || '/images/logo.png'} // Imagen por defecto si la ruta está vacía
          alt={nombre}
          style={{ width: '100px', height: '100px', marginBottom: '1rem', objectFit: 'contain', cursor: 'pointer' }}
        />
      </Link>
      <h2>{nombre}</h2>
      <p>{`$${precioVenta.toFixed(2)}`}</p>
      <button
        onClick={() => onAddToCart(idProducto)}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductCard;
