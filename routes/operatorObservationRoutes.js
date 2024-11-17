const express = require('express');
const router = express.Router();
const { addOrReplaceOperatorObservation, deleteOperatorObservation } = require('../controllers/operatorObservationController');

// Route to add or replace an operator observation
router.post('/add', addOrReplaceOperatorObservation);

// Route to delete an operator observation
router.delete('/delete/:observationId', deleteOperatorObservation);

module.exports = router;
