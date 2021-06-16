const router = require('express').Router()
const marcasController = require('../controllers/marca')
//const  auth = require('../middleware/auth')

router.route('/marcas')
    .get(marcasController.listBrands)
    .post(marcasController.insertBrand)

router.route('/marcas/:id')
    .put(marcasController.updateBrand)
//router.get('/refresh_token', userController.refreshToken)
//router.post('/login', userController.login)
//router.get('/logout', userController.logout)

//router.get('/infor',auth, userController.getUser)
module.exports = router