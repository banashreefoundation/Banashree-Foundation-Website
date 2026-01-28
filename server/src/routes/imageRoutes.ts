import express from 'express';
import {
  uploadImage,
  updateImageConfig,
  getImageConfig,
  deleteImage,
  listImages,
  getImage,
  updateImage,
  upload
} from '../controllers/image.controller';
import auth from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/v1/images/upload:
 *   post:
 *     summary: Upload a new image
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               category:
 *                 type: string
 *               key:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/upload', upload.single('image'), uploadImage);

/**
 * @swagger
 * /api/v1/images/config:
 *   post:
 *     summary: Update images.json configuration
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 */
router.post('/config', updateImageConfig);

/**
 * @swagger
 * /api/v1/images/config:
 *   get:
 *     summary: Get current images.json configuration
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 */
router.get('/config', getImageConfig);

/**
 * @swagger
 * /api/v1/images/list:
 *   get:
 *     summary: List all uploaded images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Images listed successfully
 */
router.get('/list', listImages);

/**
 * @swagger
 * /api/v1/images/{filename}:
 *   delete:
 *     summary: Delete an uploaded image
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 */
router.delete('/:id', deleteImage);

/**
 * @swagger
 * /api/v1/images/{id}:
 *   get:
 *     summary: Get a single image by ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image retrieved successfully
 */
router.get('/:id', getImage);

/**
 * @swagger
 * /api/v1/images/{id}:
 *   put:
 *     summary: Update image metadata and optionally replace the file
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New image file (optional)
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               alt:
 *                 type: string
 *               category:
 *                 type: string
 *               key:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               alt:
 *                 type: string
 *               category:
 *                 type: string
 *               key:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Image updated successfully
 */
router.put('/:id', upload.single('image'), updateImage);

export default router;
