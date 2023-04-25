const router = require('express').Router();
const userRoutes = require('./v1/user.route')

router.use('/v1/users', userRoutes);

module.exports = router;