const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// GET /api/files — return all files from DB
router.get('/', async (req, res) => {
  try {
    const files = await File.findAll({ order: [['createdAt', 'DESC']] });
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// POST /api/files/upload — upload a file and save metadata to DB
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileRecord = await File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json(fileRecord);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// GET /api/files/download/:filename — download file from /uploads
router.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath);
});

// DELETE /api/files/:id — delete from DB and remove physical file
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete physical file from uploads folder
    const filePath = path.join(__dirname, '..', 'uploads', file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from DB
    await file.destroy();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
