const router = require('express').Router()
const clienteController = require('../controllers/cliente')
//const  auth = require('../middleware/auth')

router.route('/clientes')
    .get(clienteController.listUsers)
    .post(clienteController.register)

router.route('/clientes/:id')
    .patch(clienteController.updateUser)
//router.get('/refresh_token', userController.refreshToken)
//router.post('/login', userController.login)
//router.get('/logout', userController.logout)

//router.get('/infor',auth, userController.getUser)
module.exports = router