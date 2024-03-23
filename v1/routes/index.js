const {Router} = require('express');
const userRoute = require('./user');
const passwordRoute = require('./password');

const router = Router();

router.get('/', (req, res) => {
    return res.status(200).json({
        status: true,
        message: "Welcome to the v1 (version 1) of CircleUp API. We are pleased to have you here!. While this is basically for testing we are so excited about releasing the next version. Tune in for update 😊🚀"
    })
});

router.use('/user', userRoute);
router.use('/password', passwordRoute);

router.get('*' || '/*/*', (req, res) => {
    // Send a 404 Not Found response
    res.status(404).send('Not Found! 😢');
  });

module.exports = router;