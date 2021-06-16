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
    register: async(req,res)=>{
        try {
            const{name,last_name,username,password,client_type,hazer_coins} = req.body
            const findUser = 'SELECT id FROM clientes where username = ?'
            const user = await runquery(findUser,username) 
            console.log(user)
            if(user.length > 0) return res.status(400).json({msg: "Debe ingresar otro USERNAME ya que el ingresado se encuentra en uso."})
            
            const insertUser = ' INSERT INTO clientes SET ?'
            const id_nuevo = await runquery(insertUser,{name,last_name,username,password,client_type,hazer_coins})
            res.status(200).json({msg:"Cliente ingresado con id: " + id_nuevo })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async(req,res)=>{
        try{
            const updateUser = 'UPDATE clientes SET ? WHERE id =' + req.params.id
            const findUser = 'SELECT id FROM clientes where username = ?'
            const user = await runquery(findUser,req.body.username) 
            console.log(user)
            if(user.length > 0) return res.status(400).json({msg: "Debe ingresar otro USERNAME ya que el ingresado se encuentra en uso."})
             await runquery(updateUser, req.body)
            res.status(200).json({msg: "CLiente Actualizado" })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    listUsers: async(req,res)=>{
        try{
            const listAll = 'SELECT * FROM clientes'
            const users = await runquery(listAll)
            res.status(200).json({usuarios: users })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = controller