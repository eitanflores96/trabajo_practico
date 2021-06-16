const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const port = 3001;

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.listen(port, () => console.log(`Server running on port ${port}`))

const connection = mysql.createConnection({

    host: 'localhost',
    user: 'eitanflores',
    password: '147258369',
    database: 'canjes_productos'
});

// ROUTES
app.use('/api', require('./routes/clientes'))
app.use('/api', require('./routes/marcas'))
app.use('/api', require('./routes/productos'))
app.use('/api', require('./routes/canjes'))
/* app.use('/api', require('./routes/categoriaRouter'))
app.use('/api', require('./routes/propiedadRouter'))*/

//Check connect
connection.connect(error => {
    if (error) throw error;
    console.log('La base de datos de CANJES_PRODCUTOS ESTA LEVANTADA');
})
