const jwt =  require('jsonwebtoken')
const mysql = require('mysql')
const moment = require('moment')
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
    insertSwap: async(req,res)=>{
        try {
            // me llega un array objetos tipo: {producto_id,cantidad}, debo ir a buscar por cada producto el precio de cada uno y luego multiplicarlo por la cantidad 
             // const products2 = [{ id: 1,cuantity: 2},{ id: 2,cuantity: 2}]
            const{client,products} = req.body
            
            var hazercoins = 0
            var products_cuantity = 0

            const products_id = products.map((p)=>{
                return p.id
            })
            let searchHazerCoins = 'SELECT price FROM productos WHERE id IN ('+products_id.join(',') + ')'
            let precio = await runquery(searchHazerCoins)
            for (let index = 0; index < precio.length; index++) {
                hazercoins = hazercoins + precio[index].price * products[index].cuantity;
                products_cuantity =   products_cuantity + products[index].cuantity
            }
           //const newDate = moment().format("DD-MM-YYYY");
            const insert = 'INSERT INTO canjes SET ?'
            const id_nuevo = await runquery(insert,{cliente:client,total_hazercoins:hazercoins,products_cuantity,date:new Date()})

            for (let index = 0; index < products.length; index++) {
                let insertDetail = 'INSERT INTO canjes_detalle SET ?'
                await runquery(insertDetail,{canje:id_nuevo,producto: products[index].id, cuantity:products[index].cuantity})
            }
         

            res.status(200).json({msg:"CANJE ingresado con id: " + id_nuevo })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    listSwaps: async(req,res)=>{
        try{
            const listAll = 'SELECT canjes.id,clientes.name,canjes.total_hazercoins,canjes.products_cuantity,canjes.date   FROM canjes INNER JOIN clientes ON canjes.cliente = clientes.id '
            const brands = await runquery(listAll)
            res.status(200).json({marcas: brands })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    listSwapsByClient: async(req,res)=>{
        try{
            const listAll = 'SELECT canjes.id,canjes.total_hazercoins,canjes.products_cuantity FROM canjes WHERE cliente = ?'
            const canjes = await runquery(listAll,req.params.id)

            const listDetails = 'SELECT canjes.id, productos.name, canjes_detalle.cuantity FROM canjes_detalle INNER JOIN productos ON canjes_detalle.producto = productos.id INNER JOIN canjes ON canjes_detalle.canje = canjes.id WHERE canjes.cliente = ?'
            const detalles = await runquery(listDetails,req.params.id)


            const swaps = {
                canjes,
                detallesCanje: detalles
            }

            res.status(200).json({result: swaps })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = controller