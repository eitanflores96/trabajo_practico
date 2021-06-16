const router = require('express').Router()
const productosController = require('../controllers/producto')
//const  auth = require('../middleware/auth')

router.route('/productos')
    .get(productosController.listProducts)
    .post(productosController.insertProduct)

router.route('/productos/:id')
    .put(productosController.updateProduct)
//router.get('/refresh_token', userController.refreshToken)
//router.post('/login', userController.login)
//router.get('/logout', userController.logout)

//router.get('/infor',auth, userController.getUser)
module.exports = router