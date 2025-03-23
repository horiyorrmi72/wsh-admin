const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Configures a Cloudinary storage instance for handling file uploads.
 * 
 * @constant {CloudinaryStorage} storage
 * @property {Object} cloudinary - The Cloudinary instance used for storage.
 * @property {Function} params - An asynchronous function that determines the upload parameters.
 * @param {Object} req - The HTTP request object.
 * @param {Object} file - The file object being uploaded.
 * @param {string} file.mimetype - The MIME type of the file.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   @property {string} folder - The folder in Cloudinary where files will be stored ("wsh-events").
 *   @property {string|undefined} format - The file format (undefined for images, or derived from MIME type for other files).
 *   @property {string} resource_type - The type of resource ("image" for images, "raw" for other files).
 *   @property {string} access_mode - The access mode for the file ("public").
 */
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: async (req, file) => {
		const isImage = file.mimetype.startsWith("image/");
		return {
			folder: "wsh-events",
			format: isImage ? undefined : file.mimetype.split("/")[1], 
			resource_type: isImage ? "image" : "raw",
			access_mode: "public", 
		};
	},
});

const upload = multer({ storage });

module.exports = {
	upload,
	cloudinary,
};
