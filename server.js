const express = require('express');
const multer = require('multer');
const path = require('path');
const { extractAadhaarInfo } = require('./extractAadhaarInfo');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

app.use(express.static('public'));

// Handle file upload and OCR processing
app.post('/upload', upload.single('aadhaarImage'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, req.file.path);
        const aadhaarInfo = await extractAadhaarInfo(filePath);
        res.json(aadhaarInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process image' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
