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

app.get('/buscar', (req, res) => {
  const { query } = req.query;
  const searchQuery = `
    SELECT * FROM producto 
    WHERE nombre LIKE ?
  `;
  const searchValue = `%${query}%`;
  connection.query(searchQuery, [searchValue], (err, results) => {
    if (err) {
      console.error('Error fetching search results:', err);
      res.status(500).send('Error fetching search results');
      return;
    }
    res.json(results);
  });
});


app.get('/cliente/:idPersona', (req, res) => {
  const { idPersona } = req.params;

  // Verifica que se esté recibiendo correctamente el idPersona
  console.log('idPersona recibido:', idPersona);

  const query = `SELECT idCliente FROM cliente WHERE idPersona = ?`;

  connection.query(query, [idPersona], (err, results) => {
    if (err) {
      console.error('Error al obtener el idCliente:', err);
      return res.status(500).send('Error en el servidor');
    }
    if (results.length > 0) {
      return res.json({ idCliente: results[0].idCliente });
    } else {
      return res.status(404).send('Cliente no encontrado');
    }
  });
});







// Ruta para obtener el carrito por idCliente
app.get('/carrito/:idCliente', (req, res) => {
  const { idCliente } = req.params;

  // Primero obtenemos el idCarrito relacionado con el idCliente
  const queryCarrito = 'SELECT idCarrito FROM Carrito WHERE idCliente = ?';
  
  connection.query(queryCarrito, [idCliente], (err, result) => {
    if (err) {
      console.error('Error al obtener el idCarrito:', err);
      return res.status(500).send('Error en el servidor');
    }

    if (result.length === 0) {
      return res.status(404).send('Carrito no encontrado');
    }

    const idCarrito = result[0].idCarrito;

    // Ahora obtenemos los productos en ese carrito
    const query = `
      SELECT 
        p.idProducto, 
        p.nombre, 
        p.precioVenta, 
        cp.cantidad, 
        (cp.cantidad * p.precioVenta) AS Total
      FROM 
        Producto p
      INNER JOIN 
        Carrito_has_Producto cp ON p.idProducto = cp.idProducto
      WHERE 
        cp.idCarrito = ?;
    `;

    connection.query(query, [idCarrito], (err, results) => {
      if (err) {
        console.error('Error al obtener los productos del carrito:', err);
        return res.status(500).send('Error en el servidor');
      }
      res.json(results); // Retornamos los productos del carrito
    });
  });
});



// Ruta para agregar al carrito
app.post('/carrito/agregar', (req, res) => {
  const { idProducto, cantidad, idPersona } = req.body;

  if (!idPersona || !idProducto || !cantidad) {
    console.error('Datos incompletos:', req.body);
    res.status(400).send('Datos incompletos');
    return;
  }

  console.log('Datos recibidos:', { idPersona, idProducto, cantidad });

  // Primero, obtén el idCliente usando el idPersona
  const queryCliente = 'SELECT idCliente FROM Cliente WHERE idPersona = ?';

  connection.query(queryCliente, [idPersona], (err, result) => {
    if (err) {
      console.error('Error al obtener idCliente:', err);
      res.status(500).send('Error en el servidor');
      return;
    }

    if (result.length === 0) {
      res.status(404).send('Cliente no encontrado');
      return;
    }

    const idCliente = result[0].idCliente;

    // Ahora que tenemos el idCliente, verifica si el carrito del cliente existe
    const queryCarrito = 'SELECT idCarrito FROM Carrito WHERE idCliente = ?';
    
    connection.query(queryCarrito, [idCliente], (err, result) => {
      if (err) {
        console.error('Error al obtener el carrito del cliente:', err);
        res.status(500).send('Error en el servidor');
        return;
      }

      let idCarrito = result.length > 0 ? result[0].idCarrito : null;

      // Si no tiene carrito, crea uno
      if (!idCarrito) {
        const queryCrearCarrito = 'INSERT INTO Carrito (idCliente) VALUES (?)';
        connection.query(queryCrearCarrito, [idCliente], (err, result) => {
          if (err) {
            console.error('Error al crear el carrito:', err);
            res.status(500).send('Error en el servidor');
            return;
          }
          idCarrito = result.insertId;
          agregarProductoAlCarrito(idCarrito);
        });
      } else {
        agregarProductoAlCarrito(idCarrito);
      }

      function agregarProductoAlCarrito(idCarrito) {
        const query = `
          INSERT INTO Carrito_has_Producto (idCarrito, idProducto, cantidad, Total)
VALUES (?, ?, ?, (SELECT precioVenta FROM Producto WHERE idProducto = ?) * ?)
ON DUPLICATE KEY UPDATE 
    cantidad = cantidad + VALUES(cantidad),
    Total = (SELECT precioVenta FROM Producto WHERE idProducto = ?) * (cantidad);

        `;

        connection.query(query, [idCarrito, idProducto, cantidad, idProducto, cantidad, idProducto], (err) => {
          if (err) {
            console.error('Error al agregar producto al carrito:', err);
            res.status(500).send('Error en el servidor');
            return;
          }
          res.send('Producto agregado al carrito');
        });
      }
    });
  });
});




app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});