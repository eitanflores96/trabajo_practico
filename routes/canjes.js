const router = require('express').Router()
const canjesController = require('../controllers/canje')
//const  auth = require('../middleware/auth')

router.route('/canjes')
    .get(canjesController.listSwaps)
    .post(canjesController.insertSwap)

router.route('/canjes/:id')
    .get(canjesController.listSwapsByClient)

module.exports = router