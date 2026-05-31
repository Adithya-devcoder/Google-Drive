const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
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

// GET /api/files — return files from DB with optional view filter
// ?view=all (default, non-trashed) | recent | starred | trash
router.get('/', async (req, res) => {
  try {
    const { view } = req.query;
    let where = {};
    let order = [['createdAt', 'DESC']];

    switch (view) {
      case 'starred':
        where = { starred: true, trashed: false };
        break;
      case 'trash':
        where = { trashed: true };
        break;
      case 'recent':
        where = { trashed: false };
        order = [['updatedAt', 'DESC']];
        break;
      default:
        // "my-drive" — show only non-trashed files
        where = { trashed: false };
        break;
    }

    const files = await File.findAll({ where, order });
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

// GET /api/files/preview/:filename — serve file inline for preview
router.get('/preview/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(filePath);
});

// PATCH /api/files/:id/star — toggle starred status
router.patch('/:id/star', async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    file.starred = !file.starred;
    await file.save();
    res.json(file);
  } catch (error) {
    console.error('Error starring file:', error);
    res.status(500).json({ error: 'Failed to star file' });
  }
});

// PATCH /api/files/:id/trash — move to trash (soft delete)
router.patch('/:id/trash', async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    file.trashed = true;
    await file.save();
    res.json(file);
  } catch (error) {
    console.error('Error trashing file:', error);
    res.status(500).json({ error: 'Failed to trash file' });
  }
});

// PATCH /api/files/:id/restore — restore from trash
router.patch('/:id/restore', async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    file.trashed = false;
    await file.save();
    res.json(file);
  } catch (error) {
    console.error('Error restoring file:', error);
    res.status(500).json({ error: 'Failed to restore file' });
  }
});

// DELETE /api/files/:id — permanently delete from DB and remove physical file
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

    res.json({ message: 'File deleted permanently' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
