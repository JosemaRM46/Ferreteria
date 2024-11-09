'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/persona')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Data from MySQL</h1>
      <ul>
        {data.map(persona => (
          <li key={persona.idPersona}>{persona.pNombre}</li>
        ))}
      </ul>
    </div>
  );
}