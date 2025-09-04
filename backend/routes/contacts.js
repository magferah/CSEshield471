const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const { listContacts, addContact, removeContact } = require('../controllers/contactController');

const router = Router();

// Remove authentication requirement for demo
// router.use(requireAuth());
router.get('/', listContacts);
router.post('/', addContact);
router.delete('/:contactId', removeContact);

module.exports = router;