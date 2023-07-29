import multer from "multer";

// Create diskStorage.
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const { name } = req.body;

    if (file.fieldname === "cv") {
      cb(null, name + "_" + "cv" + "_" + file.originalname);
    } else {
      cb(null, Date.now() + "_" + file.originalname);
    }
  },

  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, "public/photos");
    } else if (file.fieldname === "gallery") {
      cb(null, "public/gallery");
    } else if (file.fieldname === "cv") {
      cb(null, "public/cv");
    }
  },
});

// Create Middleware.
const testMulter = multer({
  storage,
}).fields([
  {
    name: "photo",
    maxCount: 1,
  },
  {
    name: "gallery",
    maxCount: 5,
  },
  {
    name: "cv",
    maxCount: 1,
  },
]);

// Export testMulter.
export default testMulter;
