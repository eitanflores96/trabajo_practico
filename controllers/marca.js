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
    insertBrand: async(req,res)=>{
        try {
            const{name} = req.body
            const findBrand = 'SELECT name FROM marcas WHERE name = ?'
            const brand = await runquery(findBrand,name) 
            console.log(brand)
            if(brand.length > 0) return res.status(400).json({msg: "Debe ingresar otro NOMBRE DE MARCA ya que el ingresado se encuentra registrado."})
            
            const insertBrand = ' INSERT INTO marcas SET ?'
            const id_nuevo = await runquery(insertBrand,{name})
            res.status(200).json({msg:"Marca ingresada con id: " + id_nuevo })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateBrand: async(req,res)=>{
        try{
            const updateBrand = 'UPDATE marcas SET ? WHERE id = ' + req.params.id
            const findBrand = 'SELECT id FROM marcas where name = ?'
            const find = await runquery(findBrand,req.body.name) 
            console.log(find)

            if(find.length > 0) return res.status(400).json({msg: "Debe ingresar otro NOMBRE DE MARCA ya que el ingresado se encuentra registrado."})

             await runquery(updateBrand, req.body)
            res.status(200).json({msg: "Marca Actualizada"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    listBrands: async(req,res)=>{
        try{
            const listAll = 'SELECT * FROM marcas ORDER BY name'
            const brands = await runquery(listAll)
            res.status(200).json({marcas: brands })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = controller