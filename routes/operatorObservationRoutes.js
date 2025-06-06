const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authendicate');
const {
  addOrReplaceOperatorObservation,
  deleteOperatorObservation,
  getOperatorObservationByUserId,
} = require('../controllers/operatorObservationController');

// Route to add or replace an operator observation
router.post('/add', authenticate, addOrReplaceOperatorObservation);

router.get('/:userId', authenticate, getOperatorObservationByUserId);

// Route to delete an operator observation
router.delete(
  '/delete/:observationId',
  authenticate,
  deleteOperatorObservation,
);

module.exports = router;
