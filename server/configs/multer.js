import multer from "multer";

// do the rest
const storage = multer.diskStorage({});

const upload = multer({ storage });

export default upload;
