import express from 'express';
import { importDefaultImages, getDefaultImagesInfo } from '../controllers/defaultImages.controller';

const router = express.Router();

// Get information about default images (no auth required)
router.get('/info', getDefaultImagesInfo);

// Import default images into database (no auth required, same as /images/upload)
router.post('/import', importDefaultImages);

export default router;
