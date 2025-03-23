const { default: mongoose } = require('mongoose');
const Publication = require('../../models/publicationsModel');
const { cloudinary } = require('../../utils/uploads/cloudinary');

const addPublication = async (req, res) => {
    let { title, description, authors = 'Women Safe House', publicationDate, publicationUrl, category } = req.body;

    if (!title || !description || !publicationDate || !category) {
        return res.status(400).json({ message: 'Publication missing required parameters.' });
    }

    try {
        const existingPublication = await Publication.findOne({ title });
        if (existingPublication) {
            return res.status(409).json({ message: 'Publication with a similar title already exists' });
        }

        // let fileUrl = null;
        // let filePublicId = null;

        // if (req.file) {
            // console.log('Received file:', {
            //     originalname: req.file.originalname,
            //     mimetype: req.file.mimetype,
            //     size: req.file.size,
            //     path: req.file.path
            // });

//             const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
//                 folder: "wsh-events",
//                 resource_type: "auto",
//                 access_mode: "public",
//             });

//             console.log('Cloudinary upload response:', uploadedFile);

//             fileUrl = uploadedFile.resource_type === 'raw'
//                 ? uploadedFile.url.replace('/upload/', '/raw/upload/')
//                 : uploadedFile.secure_url;
// ;
//             console.log('cloud data:', fileUrl);
//             filePublicId = uploadedFile.public_id;
        //         }
        
        const validCategories = ['Policy', 'Report', 'Research', 'Article', 'News', 'Brief', 'Others'];

        category = validCategories.find(cat => cat.toLowerCase() === category.toLowerCase());

        if (!category)
        {
            return res.status(400).json({ message: 'Invalid category. Must be one of: ' + validCategories.join(', ') });
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

    } catch (error) {
        console.error('Error in addPublication:', error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


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

const getPublications = async (req, res) => { 
    try {
        const publications = await Publication.find();
        return res.status(200).json({ publications });
    } catch (error) {
        console.error('Error in getPublications:', error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}


module.exports = {
    addPublication,
    deletePublication,
    getPublications
};
