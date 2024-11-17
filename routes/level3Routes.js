const express = require('express');
const router = express.Router();
const level3Controller = require('../controllers/level3Controller');

// Add a new Level3 document
router.post('/add/:assignieId/:userId', level3Controller.addLevel3);

// Get a specific Level3 document by ID
router.get('/:id', level3Controller.getLevel3);

// Update a specific Level3 document by ID
router.put('/update/:id', level3Controller.updateLevel3);


module.exports = router;
