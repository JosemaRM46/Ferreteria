'use client';
import Navbar from '../../../components/Navbar2';
import Footer from '../../../components/Footer';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement);

interface ProductoAgotado {
  nombre: string;
  existencia: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Ventas',
        data: [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  });

  const [alertas, setAlertas] = useState<ProductoAgotado[]>([]);
  const [empleado, setEmpleado] = useState({ nombre: '', imagen: '/placeholder-image.jpg' });
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    // Obtener estadísticas de ventas
    axios.get('http://localhost:3001/Ventas')
      .then(response => {
        const ventasData = response.data;
        setData(prevData => ({
          labels: ventasData.meses,
          datasets: [
            {
              ...prevData.datasets[0],
              data: ventasData.ventas,
            }
          ]
        }));
      })
      .catch(error => {
        console.error("Error al obtener los datos de ventas:", error);
      });

    // Obtener alertas de productos agotados
    axios.get('http://localhost:3001/productosagotados')
      .then(response => {
        setAlertas(response.data);
      })
      .catch(error => {
        console.error("Error al obtener las alertas:", error);
      });

    // Consulta empleado del mes
    axios.get('http://localhost:3001/EmpleadoDelMes')
      .then(response => {
        const empleadoData = response.data;
        setEmpleado({
          nombre: empleadoData.Empleado,
          imagen: empleadoData.Imagen || '/images/noimagen.jpg',
        });
      })
      .catch(error => {
        console.error("Error al obtener el empleado del mes:", error);
      })
      .finally(() => {
        setIsLoading(false); // Cargar datos completado
      });
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="loader">Cargando...</div> {/* Aquí puedes agregar tu spinner o animación de carga */}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Panel de Administración</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Estadísticas de ventas */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Estadística de ventas</h3>
            <Line 
              data={data} 
              options={{
                animation: {
                  duration: 0, // Desactivar animación de carga
                },
              }} 
            />
          </div>

          {/* Alertas de productos agotados */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Alerta de Productos en Agotamiento</h3>
            {alertas.length > 0 ? (
              <>
                <ul className="list-disc list-inside text-gray-600">
                  {alertas.map((producto, index) => (
                    <li key={index}>
                      {producto.nombre} ({producto.existencia} en stock)
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={() => window.location.href = '/proveedor'}
                >
                  Contactar Proveedor
                </button>
              </>
            ) : (
              <p className="text-green-600 font-medium">Todo está correcto, no hay productos en agotamiento.</p>
            )}
          </div>

          {/* Empleado del mes */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Empleado del mes </h3>
            <div className="flex flex-col items-center">
              <img src={empleado.imagen} className="w-24 h-24 rounded-full mb-4" />
              <p className="text-gray-600">{empleado.nombre}</p>
            </div>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tarjeta Inventario */}
          <div 
            className="group relative bg-blue-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition cursor-pointer" 
            onClick={() => window.location.href = '/inventario'}
          >
            <img 
              src="/images/inventario.gif" 
              alt="Inventario" 
              className="w-25 h-25 mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-500" 
            />
            {/* Texto dentro de la tarjeta */}
            <div className="absolute inset-0 bg-blue-600 bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <h3 className="text-4xl font-semibold text-white group-hover:text-blue-100 transition-colors">
                Inventario
              </h3>
            </div>
            <p className="text-2xl text-center font-semibold text-black group-hover:text-blue-100"> Inventario.</p>
            <p className="text-center text-gray-600">Gestiona y revisa los productos en inventario.</p>
          </div>

          {/* Tarjeta Personal */}
          <div 
            className="group relative bg-green-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition cursor-pointer" 
            onClick={() => window.location.href = '/empleados'}
          >
            <img 
              src="/images/Personal.gif" 
              alt="Personal" 
              className="w-25 h-25 mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-500" 
            />
            {/* Texto dentro de la tarjeta */}
            <div className="absolute inset-0 bg-green-600 bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <h3 className="text-4xl font-semibold text-white group-hover:text-green-100 transition-colors">
                Personal
              </h3>
            </div>
            <p className="text-2xl text-center font-semibold text-black group-hover:text-blue-100"> Personal.</p>
            <p className="text-center text-gray-600">Administra la información de los empleados.</p>
          </div>

          {/* Tarjeta Envios */}
          <div 
            className="group relative bg-yellow-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition cursor-pointer" 
            onClick={() => window.location.href = '/pedidos'}
          >
            <img 
              src="/images/pedido.gif" 
              alt="Pedidos" 
              className="w-25 h-25 mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-500" 
            />
            {/* Texto dentro de la tarjeta */}
            <div className="absolute inset-0 bg-yellow-600 bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <h3 className="text-4xl font-semibold text-white group-hover:text-yellow-100 transition-colors">
                Envios
              </h3>
            </div>
            <p className="text-2xl text-center font-semibold text-black group-hover:text-blue-100"> Envios.</p>
            <p className="text-center text-gray-600">Consulta y gestiona los envios en curso.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
