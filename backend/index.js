require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Middleware para manejar JSON

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
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
  connection.query('SELECT idCategoria, nombre, Ruta FROM categoria', (err, results) => {
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
  const queryCarrito = 'SELECT idCarrito, idTarjeta FROM Carrito WHERE idCliente = ?';

  connection.query(queryCarrito, [idCliente], (err, result) => {
    if (err) {
      console.error('Error al obtener el idCarrito:', err);
      return res.status(500).send('Error en el servidor');
    }

    if (result.length === 0) {
      return res.status(404).send('Carrito no encontrado');
    }

    const idCarrito = result[0].idCarrito;
    const idTarjeta = result[0].idTarjeta;

    // Ahora obtenemos los productos en ese carrito
    const queryProductos = `
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

    connection.query(queryProductos, [idCarrito], (err, products) => {
      if (err) {
        console.error('Error al obtener los productos del carrito:', err);
        return res.status(500).send('Error en el servidor');
      }

      // Calcular el total general del carrito
      const totalGeneral = products.reduce((total, producto) => total + producto.Total, 0);

      // Obtener detalles de la tarjeta asociada
      const queryTarjeta = 'SELECT * FROM Tarjeta WHERE idTarjeta = ?';
      connection.query(queryTarjeta, [idTarjeta], (err, tarjeta) => {
        if (err) {
          console.error('Error al obtener la tarjeta:', err);
          return res.status(500).send('Error al obtener la tarjeta');
        }

        // Obtener detalles de la ubicación asociada
        const queryUbicacion = `
          SELECT ud.Detalles, p.Nombre AS Pais, d.Nombre AS Departamento
          FROM Ubicacion_detalle ud
          INNER JOIN Pais p ON p.idPais = ud.idPais
          INNER JOIN Departamento d ON d.idDepartamento = ud.idDepartamento
          WHERE ud.idCarrito = ?
        `;
        
        connection.query(queryUbicacion, [idCarrito], (err, ubicacion) => {
          if (err) {
            console.error('Error al obtener la ubicación:', err);
            return res.status(500).send('Error al obtener la ubicación');
          }

          // Devolver los productos, el total general, la tarjeta y la ubicación
          res.json({
            productos: products,
            totalGeneral: totalGeneral,
            tarjeta: tarjeta[0],  // Tarjeta asociada al carrito
            ubicacion: ubicacion[0] // Detalles de la ubicación
          });
        });
      });
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
        const queryCrearCarrito = `
            INSERT INTO Carrito (idCliente, idUbicacion, idSucursal, idTarjeta, Total, Estado)
            VALUES (?, 1, 1, NULL, NULL, 'En espera')
        `;
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
            cantidad = VALUES(cantidad),
            Total = (SELECT precioVenta FROM Producto WHERE idProducto = ?) * VALUES(cantidad);
        `;

        connection.query(query, [idCarrito, idProducto, cantidad, idProducto, cantidad, idProducto], (err) => {
          if (err) {
            console.error('Error al agregar producto al carrito:', err);
            res.status(500).send('Error en el servidor');
            return;
          }

          // Ahora, recalcular el total del carrito
          const queryTotal = `
            SELECT SUM(Total) AS totalGeneral 
            FROM Carrito_has_Producto 
            WHERE idCarrito = ?
          `;
          connection.query(queryTotal, [idCarrito], (err, result) => {
            if (err) {
              console.error('Error al calcular el total del carrito:', err);
              res.status(500).send('Error al calcular el total');
              return;
            }

            const totalGeneral = result[0].totalGeneral || 0;

            // Actualizar el total del carrito
            const queryActualizarTotal = 'UPDATE Carrito SET Total = ? WHERE idCarrito = ?';
            connection.query(queryActualizarTotal, [totalGeneral, idCarrito], (err) => {
              if (err) {
                console.error('Error al actualizar el total del carrito:', err);
                res.status(500).send('Error al actualizar el total');
                return;
              }

              res.send('Producto agregado al carrito');
            });
          });
        });
      }
    });
  });
});


app.post('/carrito/eliminar', (req, res) => {
  const { idProducto, idPersona } = req.body;

  if (!idPersona || !idProducto) {
    console.error('Datos incompletos:', req.body);
    res.status(400).send('Datos incompletos');
    return;
  }

  console.log('Datos recibidos:', { idPersona, idProducto });

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

      if (!idCarrito) {
        res.status(404).send('Carrito no encontrado');
        return;
      }

      // Eliminar el producto del carrito
      const queryEliminarProducto = `
        DELETE FROM Carrito_has_Producto 
        WHERE idCarrito = ? AND idProducto = ?
      `;

      connection.query(queryEliminarProducto, [idCarrito, idProducto], (err) => {
        if (err) {
          console.error('Error al eliminar producto del carrito:', err);
          res.status(500).send('Error en el servidor');
          return;
        }

        // Recalcular el total del carrito
        const queryTotal = `
          SELECT SUM(Total) AS totalGeneral 
          FROM Carrito_has_Producto 
          WHERE idCarrito = ?
        `;
        connection.query(queryTotal, [idCarrito], (err, result) => {
          if (err) {
            console.error('Error al calcular el total del carrito:', err);
            res.status(500).send('Error al calcular el total');
            return;
          }

          const totalGeneral = result[0].totalGeneral || 0;

          // Actualizar el total del carrito
          const queryActualizarTotal = 'UPDATE Carrito SET Total = ? WHERE idCarrito = ?';
          connection.query(queryActualizarTotal, [totalGeneral, idCarrito], (err) => {
            if (err) {
              console.error('Error al actualizar el total del carrito:', err);
              res.status(500).send('Error al actualizar el total');
              return;
            }

            res.send('Producto eliminado del carrito');
          });
        });
      });
    });
  });
});


app.get('/carrito/total/:idCliente', (req, res) => {
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

    // Consulta para sumar los totales de carrito_has_producto
    const queryTotal = `
      SELECT SUM(Total) AS TotalCarrito
      FROM Carrito_has_Producto
      WHERE idCarrito = ?;
    `;

    connection.query(queryTotal, [idCarrito], (err, result) => {
      if (err) {
        console.error('Error al calcular el total del carrito:', err);
        return res.status(500).send('Error en el servidor');
      }

      const total = result[0].TotalCarrito || 0; // Si no hay productos, devuelve 0
      res.json({ TotalCarrito: total });
    });
  });
});




app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});


/////////////////////////////////////////////////////////////////////
////////// P A N T A L L A   A D M I N I S T R A D O R ///////////////
/////////////////////////////////////////////////////////////////////

// obtener el empleado del mes
app.get('/EmpleadoDelMes', (req, res) => {
  const query = `
    SELECT 
      CONCAT(p.pNombre, ' ', p.pApellido) AS Empleado, 
      COUNT(en.idEntrega) AS CantidadEntregas,
      e.fotografia Imagen
    FROM entrega en
    INNER JOIN empleado e ON e.idEmpleado = en.idEmpleado
    INNER JOIN persona p ON p.idPersona = e.idPersona
    INNER JOIN carrito_Entrega ce ON ce.idEntrega = en.idEntrega
    WHERE MONTH(ce.FechaEntrega) = MONTH(CURDATE()) or (CURDATE() - INTERVAL 1 MONTH)
    AND ce.estado='Entregado'
    GROUP BY CONCAT(p.pNombre, ' ', p.pApellido), e.fotografia 
    ORDER BY CantidadEntregas DESC
    LIMIT 1;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error ejecutando la consulta:", err);
      res.status(500).json({ error: 'Error al obtener el empleado del mes' });
      return;
    }
    if (results.length > 0) {
      res.json(results[0]); // Retorna el primer resultado
    } else {
      res.json({ Empleado: 'Sin datos', CantidadEntregas: 0 });
    }
  });
});

//Obtener los productos proximos en agotar 
app.get('/productosagotados', (req, res) => {
  const query = `
    SELECT p.nombre, cp.existencia 
    FROM producto p
    INNER JOIN producto_has_sucursal cp ON cp.idProducto = p.idProducto
    WHERE cp.existencia <= 100 and cp.idSucursal = 1
    ORDER BY cp.existencia DESC;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error ejecutando la consulta:", err);
      res.status(500).json({ error: 'Error al obtener los productos agotados' });
      return;
    }
    res.json(results);
  });
});

//Total Ventas los ultimos 3 meses
app.get('/Ventas', (req, res) => {
  const query = `
    SELECT 
      MONTHNAME(c.fecha) AS Mes, 
      SUM(cp.cantidad) AS Ventas
    FROM carrito c
    INNER JOIN carrito_has_producto cp ON cp.idCarrito = c.idCarrito
    WHERE c.fecha >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
      AND c.Estado = 'Pagado'
    GROUP BY MONTHNAME(c.fecha);
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error ejecutando la consulta:", err);
      res.status(500).json({ error: 'Error al obtener las ventas' });
      return;
    }
    res.json({
      meses: results.map(row => row.Mes),
      ventas: results.map(row => row.Ventas),
    });
  });
});

/////////////////////////////////////////////////////////////////////
////////// P A N T A L L A   I N V E N T A R I O ///////////////
/////////////////////////////////////////////////////////////////////

// Obtener todos los productos

// Endpoint para obtener productos y su cantidad de stock
app.get('/inventario', (req, res) => {
  const { idsucursal } = req.query;  
  if (!idsucursal) {
    return res.status(400).json({ error: 'Falta el parámetro idsucursal' });
  }

  // Consulta SQL para obtener los productos con su cantidad de stock
  const query = `
    SELECT p.*, ps.existencia AS existencias
    FROM producto p
    LEFT JOIN producto_has_sucursal ps ON p.idProducto = ps.idProducto
    where p.idSucursal = 1
    
  `;

  // Ejecutar la consulta
  connection.query(query, [idsucursal], (err, results) => {
    if (err) {
      console.error('Error al obtener los productos: ', err);
      return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }
    res.json(results);  // Enviar los productos con su stock
  });
});
////////////////////////////////////
// Agregar un nuevo producto
app.post('/producto', (req, res) => {
  const { nombre, descripcion, precioVenta, precioCosto, idCategoria, idMarca, Impuesto, ruta, existencia} = req.body;

  const query = `
    INSERT INTO producto (nombre, descripcion, precioVenta, precioCosto, idCategoria, idMarca, Impuesto, ruta)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [nombre, descripcion, precioVenta, precioCosto, idCategoria, idMarca, Impuesto, ruta], (err, results) => {
    if (err) {
      console.error('Error al agregar el producto:', err);
      res.status(500).send('Error al agregar el producto');
      return;
    }
    res.status(201).json({ message: 'Producto agregado con éxito', idProducto: results.insertId }); // Devuelve el ID del nuevo producto
  });

//   const query2 = `
//   INSERT INTO producto (nombre, descripcion, precioVenta, precioCosto, idCategoria, idMarca, Impuesto, ruta)
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
// `;
// connection.query(query2, [nombre, descripcion, precioVenta, precioCosto, idCategoria, idMarca, Impuesto, ruta], (err, results) => {
//   if (err) {
//     console.error('Error al agregar el producto:', err);
//     res.status(500).send('Error al agregar el producto');
//     return;
//   }
//   res.status(201).json({ message: 'Producto agregado con éxito', idProducto: results.insertId }); // Devuelve el ID del nuevo producto
// });

});

// Editar un producto
app.put('/producto/:idProducto', (req, res) => {
  const { idProducto } = req.params;
  const { nombre, descripcion, precioVenta, precioCosto, idCategoria, idMarca, Impuesto, ruta } = req.body;

  const query = `
    UPDATE producto
    SET nombre = ?, descripcion = ?, precioVenta = ?, precioCosto = ?, idCategoria = ?, idMarca = ?, Impuesto = ?, ruta = ?
    WHERE idProducto = ?
  `;

  connection.query(query, [nombre, descripcion, precioVenta, precioCosto, idCategoria, idMarca, Impuesto, ruta, idProducto], (err, results) => {
    if (err) {
      console.error('Error al editar el producto:', err);
      res.status(500).send('Error al editar el producto');
      return;
    }
    res.json({ message: 'Producto actualizado con éxito' });
  });
});


// Eliminar un producto
app.delete('/producto/:idProducto', (req, res) => {
  const { idProducto } = req.params;

  const query = 'DELETE FROM producto WHERE idProducto = ?';

  connection.query(query, [idProducto], (err, results) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);
      res.status(500).send('Error al eliminar el producto');
      return;
    }
    res.json({ message: 'Producto eliminado con éxito' });
  });
});


/////////////////////////////////////////////////////////////////////
//////////     P A N T A L L A   P R O V E E D O R    ///////////////
/////////////////////////////////////////////////////////////////////

app.get('/proveedor', (req, res) => {
  connection.query('SELECT idproveedor, nombre, correo, telefono, ruta FROM proveedor', (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

/////////////////////////////////////////////////////////////////////
//////////     P A N T A L L A  P E R S O N A L    ///////////////
/////////////////////////////////////////////////////////////////////

app.get('/personal', (req, res) => {
  const query = `
    Select 
    CONCAT(p.pNombre, ' ', p.pApellido) AS nombre,
    ins.correo AS correo,
    t.numero,
    c.nombre cargo,
     DATE_FORMAT(ea.fechaInicio, '%d-%m-%Y') AS fechaInicio,
    CASE
        WHEN TIMESTAMPDIFF(YEAR, ea.fechaInicio, CURDATE()) = 0 THEN 
            CONCAT(TIMESTAMPDIFF(MONTH, ea.fechaInicio, CURDATE()), ' meses')
        ELSE 
            CONCAT(FLOOR(TIMESTAMPDIFF(MONTH, ea.fechaInicio, CURDATE()) / 12), ' años')
    END AS tiempoCargo,
    e.fotografia
    from persona p
    inner join empleado e on e.idpersona=p.idpersona
    inner join empleado_has_cargo ea on ea.idEmpleado=e.idEmpleado
    inner join cargo c on c.idCargo=ea.idcargo
    inner join telefono t on t.idPersona=p.idpersona
    inner join iniciosesion ins on ins.idpersona=p.idpersona
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error ejecutando la consulta:", err);
      res.status(500).json({ error: 'Error al obtener los empleados' });
      return;
    }
    res.json(results);
  });
});

/////////////////////////////////////////////////////////////////////
//////////     P A N T A L L A  E N V I O S    ///////////////
/////////////////////////////////////////////////////////////////////

app.get('/envios', (req, res) => {
  // Primera consulta: Datos del cliente, carrito y productos
  const query1 = `
    SELECT 
      ca.idCarrito,
      CONCAT(p.pNombre, ' ', p.sNombre, ' ', p.pApellido, ' ', p.sApellido) AS NombreCompleto,
      t.numero AS telefono,
      CONCAT(ub.detalles, ' ', pa.nombre, ' ', d.nombre) AS UbicacionDetalles,
      pro.nombre AS producto,
      pro.precioVenta,
      (pro.precioventa*chp.cantidad) AS Total,
      chp.cantidad
    FROM 
      Persona p
    INNER JOIN 
      Cliente c ON c.idPersona = p.idPersona
    INNER JOIN 
      Carrito ca ON ca.idCliente = c.idCliente
    INNER JOIN 
      Ubicacion_detalle ub ON ub.idCarrito = ca.idCarrito
    INNER JOIN 
      Pais pa ON pa.idPais = ub.idPais
    INNER JOIN 
      Departamento d ON d.idDepartamento = ub.idDepartamento
    INNER JOIN 
      carrito_has_producto chp ON chp.idCarrito = ca.idCarrito
    INNER JOIN 
      Producto pro ON pro.idProducto = chp.idProducto
    INNER JOIN 
      Telefono t ON t.idPersona = p.idPersona
    INNER JOIN 
    carrito_entrega ce on ce.idcarrito=ca.idcarrito
    WHERE 
      ca.estado = 'Pagado'
      
  `;
  //and ce.estado = 'Pendiente' 

  // Segunda consulta: Total de productos y total del carrito
  const query2 = `
    SELECT
      chp.idCarrito,
      SUM(chp.cantidad) AS TotalProductos,
      ROUND(SUM(chp.cantidad * pro.precioVenta), 2) AS TotalCarrito
    FROM 
      carrito_has_producto chp
    INNER JOIN 
      Producto pro ON pro.idProducto = chp.idProducto
    GROUP BY 
      chp.idCarrito
  `;

  // Ejecutar ambas consultas de manera simultánea
  connection.query(query1, (err1, results1) => {
    if (err1) {
      console.error("Error ejecutando la primera consulta:", err1);
      res.status(500).json({ error: 'Error al obtener los envíos' });
      return;
    }

    connection.query(query2, (err2, results2) => {
      if (err2) {
        console.error("Error ejecutando la segunda consulta:", err2);
        res.status(500).json({ error: 'Error al obtener el total de productos' });
        return;
      }

      // Agrupar los resultados de la primera consulta por carrito
      const carritos = results1.reduce((acc, row) => {
        const { idCarrito, NombreCompleto, telefono, UbicacionDetalles, producto, precioVenta, cantidad, Total } = row;

        if (!acc[idCarrito]) {
          acc[idCarrito] = {
            idCarrito,
            cliente: {
              NombreCompleto,
              telefono,
              UbicacionDetalles,
            },
            productos: [],
            resumen: {
              precioVenta,
              cantidad,
              Total
            },
          };
        }

        acc[idCarrito].productos.push({ producto, cantidad, precioVenta, Total });
        return acc;
      }, {});

      // Integrar los totales de la segunda consulta con los carritos
      results2.forEach(row => {
        const { idCarrito, TotalProductos, TotalCarrito } = row;
        if (carritos[idCarrito]) {
          carritos[idCarrito].resumen.TotalProductos = TotalProductos;
          carritos[idCarrito].resumen.TotalCarrito = TotalCarrito;
        }
      });

      // Devolver la respuesta con los datos completos
      res.json(Object.values(carritos));
    });
  });
});



app.post('/api/tarjeta', (req, res) => {
  const { numero, mes, anio, cvv, idPersona } = req.body;

  // Primero, comprobamos si la persona ya tiene una tarjeta registrada
  const checkCardQuery = 'SELECT COUNT(*) as count FROM Tarjeta WHERE idPersona = ?';
  connection.query(checkCardQuery, [idPersona], (err, results) => {
    if (err) {
      console.error('Error en la consulta de verificación:', err);
      return res.status(500).send('Error en la consulta de verificación');
    }

    const count = results[0]?.count || 0;

    if (count > 0) {
      // Si ya tiene una tarjeta, actualizamos
      const updateQuery = 'UPDATE Tarjeta SET numero = ?, mes = ?, anio = ?, cvv = ? WHERE idPersona = ?';
      connection.query(updateQuery, [numero, mes, anio, cvv, idPersona], (err, result) => {
        if (err) {
          console.error('Error al actualizar los datos:', err);
          return res.status(500).send('Error al actualizar los datos');
        }

        // Recuperamos el idTarjeta actualizado
        const getCardIdQuery = 'SELECT idTarjeta FROM Tarjeta WHERE idPersona = ?';
        connection.query(getCardIdQuery, [idPersona], (err, cardResults) => {
          if (err) {
            console.error('Error al obtener idTarjeta:', err);
            return res.status(500).send('Error al obtener idTarjeta');
          }
          const idTarjeta = cardResults[0]?.idTarjeta;

          // Actualizamos la tabla Carrito con el idTarjeta
          updateCarritoWithTarjeta(idPersona, idTarjeta, res);
        });
      });
    } else {
      // Si no tiene una tarjeta, la creamos
      const insertQuery = 'INSERT INTO Tarjeta (numero, mes, anio, cvv, idPersona) VALUES (?, ?, ?, ?, ?)';
      connection.query(insertQuery, [numero, mes, anio, cvv, idPersona], (err, result) => {
        if (err) {
          console.error('Error al guardar los datos:', err);
          return res.status(500).send('Error al guardar los datos');
        }

        // Recuperamos el idTarjeta insertado
        const idTarjeta = result.insertId;

        // Actualizamos la tabla Carrito con el idTarjeta
        updateCarritoWithTarjeta(idPersona, idTarjeta, res);
      });
    }
  });
});

// Función para actualizar el carrito con el idTarjeta correspondiente
function updateCarritoWithTarjeta(idPersona, idTarjeta, res) {
  // Obtenemos el idCliente asociado a la idPersona
  const getClientIdQuery = 'SELECT idCliente FROM Cliente WHERE idPersona = ?';
  connection.query(getClientIdQuery, [idPersona], (err, clientResults) => {
    if (err) {
      console.error('Error al obtener idCliente:', err);
      return res.status(500).send('Error al obtener idCliente');
    }

    const idCliente = clientResults[0]?.idCliente;
    if (!idCliente) {
      return res.status(400).send('No se encontró idCliente para esta persona');
    }

    // Actualizamos la tabla Carrito con el idTarjeta
    const updateCarritoQuery = 'UPDATE Carrito SET idTarjeta = ? WHERE idCliente = ?';
    connection.query(updateCarritoQuery, [idTarjeta, idCliente], (err, result) => {
      if (err) {
        console.error('Error al actualizar Carrito con idTarjeta:', err);
        return res.status(500).send('Error al actualizar Carrito con idTarjeta');
      }

      res.status(200).send('Tarjeta y carrito actualizados correctamente');
    });
  });
}


app.get('/api/paises', (req, res) => {
  connection.query('SELECT idPais, Nombre FROM Pais', (err, results) => {
    if (err) {
      console.error('Error al obtener países:', err);
      return res.status(500).send('Error al obtener países');
    }
    res.json(results);
  });
});


app.get('/api/departamentos/:idPais', (req, res) => {
  const { idPais } = req.params;
  connection.query(
    'SELECT idDepartamento, Nombre FROM Departamento WHERE idPais = ?',
    [idPais],
    (err, results) => {
      if (err) {
        console.error('Error al obtener departamentos:', err);
        return res.status(500).send('Error al obtener departamentos');
      }
      res.json(results);
    }
  );
});


app.post('/api/ubicacion', (req, res) => {
  const { Detalles, idPais, idDepartamento, idPersona } = req.body;

  if (!idPersona || !Detalles || !idPais || !idDepartamento) {
    console.error("Campos obligatorios faltantes:", req.body);
    return res.status(400).send({ message: "Todos los campos son obligatorios" });
  }

  // Consulta para obtener el idCarrito basado en idPersona
  const getCarritoQuery = `
    SELECT idCarrito 
    FROM Carrito 
    WHERE idCliente = (
      SELECT idCliente FROM Cliente WHERE idPersona = ?
    );`;

  connection.query(getCarritoQuery, [idPersona], (err, results) => {
    if (err) {
      console.error("Error al obtener idCarrito:", err);
      return res.status(500).send({ message: "Error al obtener el carrito" });
    }

    if (results.length === 0) {
      console.error("No se encontró un carrito para la persona con id:", idPersona);
      return res.status(404).send({ message: "No se encontró un carrito asociado a este cliente." });
    }

    const idCarrito = results[0].idCarrito;

    console.log("idCarrito obtenido:", idCarrito);

    // Consulta para verificar si ya existe una ubicación asociada al carrito
    const checkUbicacionQuery = `
      SELECT idUbicacion 
      FROM Ubicacion_detalle 
      WHERE idCarrito = ?;`;

    connection.query(checkUbicacionQuery, [idCarrito], (err, ubicacionResults) => {
      if (err) {
        console.error("Error al verificar la ubicación existente:", err);
        return res.status(500).send({ message: "Error al verificar la ubicación" });
      }

      if (ubicacionResults.length > 0) {
        // Si ya existe, actualizar la ubicación existente
        const idUbicacion = ubicacionResults[0].idUbicacion;
        console.log("Actualizando ubicación existente con idUbicacion:", idUbicacion);

        const updateUbicacionQuery = `
          UPDATE Ubicacion_detalle 
          SET Detalles = ?, idPais = ?, idDepartamento = ?
          WHERE idUbicacion = ?;`;

        connection.query(
          updateUbicacionQuery,
          [Detalles, idPais, idDepartamento, idUbicacion],
          (err) => {
            if (err) {
              console.error("Error al actualizar la ubicación:", err);
              return res.status(500).send({ message: "Error al actualizar la ubicación" });
            }

            console.log("Ubicación actualizada con éxito.");
            res.status(200).send({ message: "Ubicación actualizada con éxito." });
          }
        );
      } else {
        // Si no existe, insertar una nueva ubicación
        console.log("Insertando nueva ubicación para el carrito con idCarrito:", idCarrito);

        const insertUbicacionQuery = `
          INSERT INTO Ubicacion_detalle (Detalles, idPais, idDepartamento, idCarrito)
          VALUES (?, ?, ?, ?);`;

        connection.query(
          insertUbicacionQuery,
          [Detalles, idPais, idDepartamento, idCarrito],
          (err, result) => {
            if (err) {
              console.error("Error al guardar la nueva ubicación:", err);
              return res.status(500).send({ message: "Error al guardar la ubicación" });
            }

            const idUbicacion = result.insertId;

            console.log("Nueva ubicación creada con idUbicacion:", idUbicacion);

            
          }
        );
      }
    });
  });
});


app.post('/api/factura', (req, res) => {
  const { idPersona } = req.body;

  if (!idPersona) {
    return res.status(400).json({ error: "El campo 'idPersona' es obligatorio" });
  }

  const query = `
    SELECT 
      p.idPersona,
      p.pNombre,
      p.sNombre,
      p.pApellido,
      p.sApellido,
      t.numero AS NumeroTarjeta,
      ca.idCarrito,
      ROUND(chp.cantidad*pro.precioVenta) AS TotalCarrito,
      ub.detalles AS UbicacionDetalles,
      pa.nombre AS Pais,
      d.nombre AS Departamento
    FROM Persona p
    INNER JOIN Tarjeta t ON t.idPersona = p.idPersona
    INNER JOIN Cliente c ON c.idPersona = p.idPersona
    INNER JOIN Carrito ca ON ca.idCliente = c.idCliente
    INNER JOIN Ubicacion_detalle ub ON ub.idCarrito = ca.idCarrito
    INNER JOIN Pais pa ON pa.idPais = ub.idPais
    INNER JOIN Departamento d ON d.idDepartamento = ub.idDepartamento
    INNER JOIN carrito_has_producto chp ON chp.idCarrito = ca.idCarrito
    INNER JOIN Producto pro ON pro.idProducto = chp.idProducto
    group by ca.idcarrito
  `;

  connection.query(query, [idPersona], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res.status(500).json({ error: "Error al obtener la factura" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontró factura para esta persona" });
    }

    // Parseamos los productos de JSON
    const factura = results.map((row) => ({
      ...row,
      Productos: JSON.parse(`[${row.Productos}]`), // Convertimos los productos a un array de objetos
    }));

    res.json(factura);
  });
});


// Ruta para actualizar el estado del carrito
app.put('/api/carrito/pagar', (req, res) => {
  const { idCarrito } = req.body;

  if (!idCarrito) {
    return res.status(400).json({ error: "El campo 'idCarrito' es obligatorio" });
  }

  const query = `UPDATE Carrito SET Estado = 'Pagado' WHERE idCarrito = ?`;

  connection.query(query, [idCarrito], (err, result) => {
    if (err) {
      console.error("Error al actualizar el estado del carrito:", err);
      return res.status(500).json({ error: "Error al actualizar el carrito" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el carrito" });
    }

    res.json({ message: "El carrito ha sido pagado exitosamente" });
  });
});


app.get("/api/carrito", (req, res) => {
  const personaId = req.query.idPersona; // Obtén el idPersona desde la consulta o el body, dependiendo de cómo lo envíes
  
  // Definimos la consulta SQL
  const query = `
    SELECT c.idCarrito 
    FROM Carrito c
    JOIN Cliente cl ON c.idCliente = cl.idCliente
    WHERE cl.idPersona = ?
  `;
  
  // Ejecutamos la consulta
  connection.query(query, [personaId], (err, results) => {
    if (err) {
      console.error("Error al obtener el idCarrito:", err);
      res.status(500).send("Error al obtener el idCarrito");
      return;
    }
    
    if (results.length > 0) {
      // Si la consulta devuelve resultados, enviamos el idCarrito
      res.json({ idCarrito: results[0].idCarrito });
    } else {
      // Si no se encuentra ningún carrito para el idPersona, respondemos con un error 404
      res.status(404).send("No se encontró el carrito");
    }
  });
});