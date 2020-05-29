const express = require('express');
const {
    getQuotations,
    createQuotation,
    quotationByUser,
    quotationById,
    isPoster,
    updateQuotation,
    deleteQuotation,
    singleQuotation,
} = require('../controllers/quotation');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createQuotationValidator } = require('../validator');

const router = express.Router();

router.get('/quotation', getQuotations);
// post routes
router.post('/quotation/new/:userId', requireSignin, createQuotation, createQuotationValidator);
router.get('/quotation/by/:userId', requireSignin, quotationByUser);
router.get('/quotation/:quotationId', singleQuotation);
router.put('/quotation/:quotationId', requireSignin, isPoster, updateQuotation);
router.delete('/quotation/:quotationId', requireSignin, isPoster, deleteQuotation);

// any route containing :userId, our app will first execute userById()
router.param('userId', userById);
// any route containing :postId, our app will first execute postById()
router.param('quotationId', quotationById);

module.exports = router;