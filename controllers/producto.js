const jwt =  require('jsonwebtoken')
const mysql = require('mysql')

const connection = mysql.createConnection({

    host: 'localhost',
    user: 'eitanflores',
    password: '147258369',
    database: 'canjes_productos'
});

const runquery = (sql, args) => new Promise((resolve, reject) => {
    connection.query(sql, args, (err, rows) => {
        console.log("sql:", sql);
        console.log("arg: ", args)
        if (err)
            return reject(err);
        //console.log(rows);
        if (rows.insertId) {
            resolve(rows.insertId)
        } else {
            resolve(rows)
        }
        //rows.changedRows  rows.affectedRows  rows.insertId ? resolve(rows) : resolve(rows);
    });
});

const controller = {
    insertProduct: async(req,res)=>{
        try {
            const{name} = req.body
            const findProduct = 'SELECT name FROM productos WHERE name = ?'
            const product = await runquery(findProduct,name) 
            console.log(product)
            if(product.length > 0) return res.status(400).json({msg: "Debe ingresar otro NOMBRE DE PRODUCTO ya que el ingresado se encuentra registrado."})
            
            const insertProduct = ' INSERT INTO productos SET ?'
            const id_nuevo = await runquery(insertProduct,req.body)
            res.status(200).json({msg:"Producto ingresado con id: " + id_nuevo })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateProduct: async(req,res)=>{
        try{
            const updateProduct = 'UPDATE productos SET ? WHERE id = ' + req.params.id
            const findProduct = 'SELECT name FROM productos WHERE name = ?'
            const product = await runquery(findProduct, req.body.name) 
            console.log(product)

            if(product.length > 0) return res.status(400).json({msg: "Debe ingresar otro NOMBRE DE PRODUCTO ya que el ingresado se encuentra registrado."})

             await runquery(updateProduct, req.body)
            res.status(200).json({msg: "Producto Actualizado"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    listProducts: async(req,res)=>{
        try{
            const listAll = 'SELECT productos.id,productos.name,productos.stock,marcas.name,productos.price FROM productos INNER JOIN marcas ON productos.brand = marcas.id ORDER BY stock DESC'
            const products = await runquery(listAll)
            res.status(200).json({productos: products })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = controller