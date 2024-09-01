const Tesseract = require('tesseract.js');
const fs = require('fs');

async function extractAadhaarInfo(imagePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');

        // Regex to find Aadhaar number (12 digits) and name (assuming it's the first line)
        const aadhaarNumber = text.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
        const nameMatch = text.split('\n')[0].trim();

        return {
            name: nameMatch || 'Name not found',
            aadhaarNumber: aadhaarNumber ? aadhaarNumber[0] : 'Aadhaar number not found',
        };
    } catch (error) {
        throw new Error('Error processing image with Tesseract');
    } finally {
        // Optional: delete the image file after processing
        fs.unlinkSync(imagePath);
    }
}

module.exports = { extractAadhaarInfo };
