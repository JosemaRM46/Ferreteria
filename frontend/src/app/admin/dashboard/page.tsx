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
     console.log("Datos del empleado del mes:", response.data);
 
     // Verificar si hay una imagen proporcionada, asignar la predeterminada si no
     const empleadoData = response.data;
     setEmpleado({
       nombre: empleadoData.Empleado,
       imagen: empleadoData.Imagen || '/images/noimagen.jpg' // Imagen predeterminada si no hay
     });
   })
   .catch(error => {
     console.error("Error al obtener el empleado del mes:", error);
   });
}, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Panel de Administración</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Estadísticas de ventas */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Estadística de ventas</h3>
            <Line data={data} />
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
          <div className="bg-blue-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition cursor-pointer" onClick={() => window.location.href = '/inventario'}>
            <img src="/images/inventario.gif" alt="Inventario" className="w-25 h-25 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center text-blue-600">Inventario</h3>
            <p className="text-center text-gray-600">Gestiona y revisa los productos en inventario.</p>
          </div>

          <div className="bg-green-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition cursor-pointer" onClick={() => window.location.href = '/personal'}>
            <img src="/images/Personal.gif" alt="Personal" className="w-25 h-25 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center text-green-600">Personal</h3>
            <p className="text-center text-gray-600">Administra la información de los empleados.</p>
          </div>

          <div className="bg-yellow-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition cursor-pointer" onClick={() => window.location.href = '/pedidos'}>
            <img src="/images/pedido.gif" alt="Pedidos" className="w-25 h-25 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center text-yellow-600">Pedidos</h3>
            <p className="text-center text-gray-600">Consulta y gestiona los pedidos en curso.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}