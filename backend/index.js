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
  connection.query('SELECT * FROM producto', (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.get('/productos/departamento/:idCategoria', (req, res) => {
  const { idCategoria } = req.params;
  const query = 'SELECT * FROM producto WHERE idCategoria = ?';
  connection.query(query, [idCategoria], (err, results) => {
    if (err) {
      console.error('Error fetching products by department:', err);
      res.status(500).send('Error fetching products by department');
      return;
    }
    res.json(results);
  });
});

app.post('/login', (req, res) => {
  const { Correo, Contraseña } = req.body;
  const query = `
    SELECT i.idPersona, 
           (SELECT COUNT(*) FROM Empleado e WHERE e.idPersona = i.idPersona AND e.idJefe IS NULL) AS isJefe
    FROM iniciosesion i
    WHERE i.Correo = ? AND i.Contraseña = ?;
  `;
  connection.query(query, [Correo, Contraseña], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    if (results.length > 0) {
      const { idPersona, isJefe } = results[0];
      res.json({ idPersona, isJefe: isJefe > 0 });
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

app.post('/registro', (req, res) => {
  const { pNombre, sNombre, pApellido, sApellido, direccion, genero, correo, contraseña } = req.body;

  if (!pNombre || !pApellido) {
    return res.status(400).send('El primer nombre y el primer apellido son obligatorios');
  }

  const personaQuery = 'INSERT INTO persona (pNombre, sNombre, pApellido, sApellido, direccion, genero) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(personaQuery, [pNombre, sNombre, pApellido, sApellido, direccion, genero], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en el servidor');
      return;
    }

    const idPersona = results.insertId;
    const inicioSesionQuery = 'INSERT INTO iniciosesion (Correo, Contraseña, idPersona) VALUES (?, ?, ?)';
    connection.query(inicioSesionQuery, [correo, contraseña, idPersona], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        res.status(500).send('Error en el servidor');
        return;
      }

      res.status(201).send('Registro exitoso');
    });
  });
});

app.get('/producto/:idProducto', (req, res) => {
  const { idProducto } = req.params;
  const query = 'SELECT * FROM producto WHERE idProducto = ?';
  connection.query(query, [idProducto], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      res.status(500).send('Error fetching product');
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});