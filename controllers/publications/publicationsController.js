const { default: mongoose } = require('mongoose');
const Publication = require('../../models/publicationsModel');
const { cloudinary } = require('../../utils/uploads/cloudinary');


const addPublication = async (req, res) => {
    try
    {
        const { title, description, publicationDate, publicationUrl, category } = req.body;
        let authors = req.body.authors ? JSON.parse(req.body.authors) : [];

        
        if (!title || !description || !publicationDate || !publicationUrl || !category || authors.length === 0)
        {
            return res.status(400).json({ message: 'All fields are required, including at least one author.' });
        }

        const existingPublication = await Publication.findOne({ title });
        if (existingPublication)
        {
            return res.status(409).json({ message: 'A publication with this title already exists.' });
        }
        const validCategories = ['Policy', 'Report', 'Research', 'Article', 'News', 'Brief', 'Others'];
        if (!validCategories.includes(category))
        {
            return res.status(400).json({ message: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
        }

        const publication = new Publication({
            title,
            description,
            authors,
            publicationDate: new Date(publicationDate),
            publicationUrl,
            category
        });

        await publication.save();
        return res.status(201).json({ message: 'Publication added successfully', publication });

    } catch (error)
    {
        console.error('Error in addPublication:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



/**
 * Deletes a publication by its ID.
 *
 * @async
 * @function deletePublication
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters from the request.
 * @param {string} req.params.id - The ID of the publication to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response indicating the result of the deletion.
 *
 * @throws {Error} Returns a 400 status if the ID is not provided.
 * @throws {Error} Returns a 404 status if the publication is not found.
 * @throws {Error} Returns a 500 status if there is an error during deletion.
 */
const deletePublication = async (req, res) => {
    const { id } = req.params;

    if (!id)
    {
        return res.status(400).json({ message: 'Please provide a publication ID to delete' });
    }

    try
    {
        const deletedPub = await Publication.findByIdAndDelete(id);
        if (!deletedPub)
        {
            return res.status(404).json({ message: 'Publication not found' });
        }

        // if (deletedPub.filePublicId)
        // {
        //     try
        //     {
        //         await cloudinary.api.delete_resources(deletedPub.filePublicId);
        //     } catch (error)
        //     {
        //         console.error(error.message);
        //         return res.status(500).json({ message: 'Error deleting file from Cloudinary', error: error.message });
        //     }
        // }

        return res.status(200).json({ message: 'Publication deleted successfully' });

    } catch (error)
    {
        console.error(error.message);
        return res.status(500).json({ message: 'Error deleting publication', error: error.message });
    }
};

/**
 * Retrieves a list of publications from the database.
 *
 * @async
 * @function getPublications
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response containing the list of publications or an error message.
 * @throws {Error} Returns a 500 status code with an error message if an exception occurs.
 */
const getPublications = async (req, res) => { 
    try {
        const publications = await Publication.find();
        return res.status(200).json({ publications });
    } catch (error) {
        console.error('Error in getPublications:', error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

/**
 * Retrieves a publication by its ID.
 *
 * @async
 * @function publicationById
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters from the request.
 * @param {string} req.params.id - The ID of the publication to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response with the publication data if found,
 * or an error message if the publication is not found or an error occurs.
 *
 * @throws {Error} Returns a 400 status if the ID is not provided.
 * Returns a 404 status if the publication is not found.
 * Returns a 500 status if an internal server error occurs.
 */
const publicationById = async (req, res) => {
    try
    {
        const { id } = req.params;
        if (!id)
        {
            return res.status(400).json({ message: 'Selected data is either deleted or does not exist!, please select a valid data.' });
        }

        const publication = await Publication.findById(id);
        if (!publication)
        {
            return res.status(404).json({ message: 'Publication not found' });
        }

        return res.status(200).json({ publication });

    }catch (error)
    {
        console.error('Error in publicationById:', error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}


module.exports = {
    addPublication,
    deletePublication,
    getPublications,
    publicationById
};
