const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Asegúrate de que esta contraseña coincida con la configuración de tu MySQL
  database: 'ferreteria'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/persona', (req, res) => {
  db.query('SELECT * FROM Persona', (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error fetching data from the database');
      return;
    }
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});