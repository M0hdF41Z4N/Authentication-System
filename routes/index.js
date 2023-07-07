// Importing express
const express = require('express');
const router= express.Router();

// router.use('/user',require('./user'));
router.get('/', (req, res) => {
    res.render('index',{title:"Authentication System"});
  });

module.exports = router;

