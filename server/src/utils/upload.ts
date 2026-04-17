import multer from "multer";
import { ApiError } from "./index";

// file formats
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

// max size (e.g. 2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// storage (memory → better for cloud upload later)
const storage = multer.memoryStorage();

// file filter
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (!ALLOWED_FORMATS.includes(file.mimetype)) {
    return cb(
      new ApiError(
        400,
        "Invalid file type. Only JPEG, PNG, WEBP, JPG allowed"
      )
    );
  }

  cb(null, true);
};

// multer instance
export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});