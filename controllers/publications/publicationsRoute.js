const express = require('express');
const router = express.Router();
const publication = require('./publicationsController');
const { upload } = require('../../utils/uploads/cloudinary');
const { auth, isAdmin } = require('../auth/authUtils');


router.get('', publication.getPublications);
router.get('publication/:id', publication.publicationById);
router.post(
    '/add-report',
    auth,
    isAdmin,
    publication.addPublication
);

router.delete('/delete-report/:id', auth, isAdmin, publication.deletePublication);


module.exports = router;
