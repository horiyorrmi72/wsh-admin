const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
