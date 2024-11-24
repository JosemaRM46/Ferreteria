const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Middleware para manejar JSON

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ferreteria',
  port: 3306
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Conexión exitosa');
});

app.get('/persona', (req, res) => {
  connection.query('SELECT pNombre FROM persona', (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.get('/categoria', (req, res) => {
  connection.query('SELECT idCategoria, nombre FROM categoria', (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.get('/producto', (req, res) => {
  connection.query('SELECT * FROM producto c', (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.post('/login', (req, res) => {
  const { Correo, Contraseña } = req.body;
  console.log('Datos recibidos:', Correo, Contraseña); // Log para depuración
  const query = 'SELECT * FROM iniciosesion WHERE Correo = ? AND Contraseña = ?';
  connection.query(query, [Correo, Contraseña], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err); // Log para depuración
      res.status(500).send('Error en el servidor');
      return;
    }
    console.log('Resultados de la consulta:', results); // Log para depuración
    if (results.length > 0) {
      res.json({ idPersona: results[0].idPersona });
    } else {
      res.status(401).send('Correo o contraseña incorrectos');
    }
  });
});


app.get('/perfil/:idPersona', (req, res) => {
  const { idPersona } = req.params;
  const query = 'SELECT pNombre, sNombre, pApellido, sApellido, direccion FROM persona WHERE idPersona = ?';
  connection.query(query, [idPersona], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Perfil no encontrado');
    }
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});