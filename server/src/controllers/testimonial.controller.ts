import Testimonial, { ITestimonial } from '../model/testimonialModel';
import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/auth';
import { Types } from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Configure multer for testimonial image uploads
const storage = multer.diskStorage({
    destination: async (_req: any, _file: any, cb: any) => {
        const uploadDir = path.join(__dirname, '../../uploads/testimonials');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error as Error, uploadDir);
        }
    },
    filename: (_req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase();
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter: multer.Options['fileFilter'] = (_req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'));
    }
};

export const uploadTestimonialImage = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max file size for profile images
    },
    fileFilter: fileFilter,
});


// Utility function to validate ObjectId
const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
};

// Utility function to sanitize input
const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
};

// Core business logic functions
const createTestimonialEntry = async (testimonialData: Partial<ITestimonial>, imagePath?: string) => {
    const { name, designation, message } = testimonialData;

    if (!name || !designation || !message) {
        return {
            error: 'Please provide all the required fields (name, designation, message)',
        };
    }

    // Validate name length
    if (name.length < 2) {
        return {
            error: 'Name must be at least 2 characters long',
        };
    }

    if (name.length > 100) {
        return {
            error: 'Name cannot exceed 100 characters',
        };
    }

    // Validate designation length
    if (designation.length > 150) {
        return {
            error: 'Designation cannot exceed 150 characters',
        };
    }

    // Validate message length
    if (message.length < 10) {
        return {
            error: 'Message must be at least 10 characters long',
        };
    }

    if (message.length > 1000) {
        return {
            error: 'Message cannot exceed 1000 characters',
        };
    }

    // Sanitize inputs
    const sanitizedData: any = {
        name: sanitizeInput(name),
        designation: sanitizeInput(designation),
        message: sanitizeInput(message),
        status: 'pending' as const,
        isPublished: false,
    };

    // Add image path if provided
    if (imagePath) {
        sanitizedData.image = imagePath;
    }

    const newTestimonial = new Testimonial(sanitizedData);
    await newTestimonial.save();

    return {
        testimonial: newTestimonial,
        message: 'Testimonial submitted successfully',
    };
};

const getAllTestimonials = async (filters: any) => {
    const {
        page = 1,
        limit = 10,
        status,
        isPublished,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = filters;

    const query: any = {};

    // Apply filters
    if (status) {
        query.status = status;
    }

    if (isPublished !== undefined) {
        query.isPublished = isPublished === 'true' || isPublished === true;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort configuration
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const testimonials = await Testimonial.find(query)
        .sort(sortConfig)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

    const totalCount = await Testimonial.countDocuments(query);

    return {
        testimonials,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            totalItems: totalCount,
            itemsPerPage: parseInt(limit),
        },
    };
};

const getTestimonialById = async (id: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid testimonial ID',
        };
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        return {
            error: 'Testimonial not found',
        };
    }

    return {
        testimonial,
    };
};

const updateTestimonialEntry = async (id: string, updateData: Partial<ITestimonial>, imagePath?: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid testimonial ID',
        };
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        return {
            error: 'Testimonial not found',
        };
    }

    // Validate and sanitize update data
    if (updateData.name) {
        if (updateData.name.length < 2 || updateData.name.length > 100) {
            return {
                error: 'Name must be between 2 and 100 characters',
            };
        }
        testimonial.name = sanitizeInput(updateData.name);
    }

    if (updateData.designation) {
        if (updateData.designation.length > 150) {
            return {
                error: 'Designation cannot exceed 150 characters',
            };
        }
        testimonial.designation = sanitizeInput(updateData.designation);
    }

    if (updateData.message) {
        if (updateData.message.length < 10 || updateData.message.length > 1000) {
            return {
                error: 'Message must be between 10 and 1000 characters',
            };
        }
        testimonial.message = sanitizeInput(updateData.message);
    }

    if (updateData.status) {
        testimonial.status = updateData.status;
    }

    if (updateData.order !== undefined) {
        testimonial.order = updateData.order;
    }

    // Update image if new one is provided
    if (imagePath) {
        testimonial.image = imagePath;
    }

    await testimonial.save();

    return {
        testimonial,
        message: 'Testimonial updated successfully',
    };
};

const deleteTestimonialEntry = async (id: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid testimonial ID',
        };
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
        return {
            error: 'Testimonial not found',
        };
    }

    return {
        message: 'Testimonial deleted successfully',
    };
};

const approveTestimonialEntry = async (id: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid testimonial ID',
        };
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        return {
            error: 'Testimonial not found',
        };
    }

    await testimonial.approve();

    return {
        testimonial,
        message: 'Testimonial approved successfully',
    };
};

const rejectTestimonialEntry = async (id: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid testimonial ID',
        };
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        return {
            error: 'Testimonial not found',
        };
    }

    await testimonial.reject();

    return {
        testimonial,
        message: 'Testimonial rejected successfully',
    };
};

const publishTestimonialEntry = async (id: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid testimonial ID',
        };
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        return {
            error: 'Testimonial not found',
        };
    }

    try {
        await testimonial.publish();
        return {
            testimonial,
            message: 'Testimonial published successfully',
        };
    } catch (error: any) {
        return {
            error: error.message || 'Failed to publish testimonial',
        };
    }
};

const unpublishTestimonialEntry = async (id: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid testimonial ID',
        };
    }

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        return {
            error: 'Testimonial not found',
        };
    }

    await testimonial.unpublish();

    return {
        testimonial,
        message: 'Testimonial unpublished successfully',
    };
};

const getPublishedTestimonials = async () => {
    const testimonials = await Testimonial.findPublished();

    return {
        testimonials,
    };
};

const getTestimonialStats = async () => {
    const stats = await Testimonial.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    const published = await Testimonial.countDocuments({ isPublished: true });
    const total = await Testimonial.countDocuments();

    return {
        stats: {
            byStatus: stats,
            published,
            total,
        },
    };
};

// Express route handlers
export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = (req as any).file;
        const imagePath = file ? `/uploads/testimonials/${file.filename}` : undefined;
        
        const result = await createTestimonialEntry(req.body, imagePath);

        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }

        res.status(201).json(result);
    } catch (error: any) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getAllTestimonials(req.query);
        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getTestimonialById(req.params.id);

        if (result.error) {
            res.status(404).json({ error: result.error });
            return;
        }

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error fetching testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = (req as any).file;
        const imagePath = file ? `/uploads/testimonials/${file.filename}` : undefined;
        
        const result = await updateTestimonialEntry(req.params.id, req.body, imagePath);

        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await deleteTestimonialEntry(req.params.id);

        if (result.error) {
            res.status(404).json({ error: result.error });
            return;
        }

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const approveTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await approveTestimonialEntry(req.params.id);

        if (result.error) {
            res.status(404).json({ error: result.error });
            return;
        }

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error approving testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const rejectTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await rejectTestimonialEntry(req.params.id);

        if (result.error) {
            res.status(404).json({ error: result.error });
            return;
        }

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error rejecting testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const publishTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await publishTestimonialEntry(req.params.id);

        if (result.error) {
            res.status(400).json({ error: result.error });
            return;
        }

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error publishing testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const unpublishTestimonial = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await unpublishTestimonialEntry(req.params.id);

        if (result.error) {
            res.status(404).json({ error: result.error });
            return;
        }

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error unpublishing testimonial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPublishedTestimonialsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getPublishedTestimonials();
        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error fetching published testimonials:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTestimonialStatsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getTestimonialStats();
        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error fetching testimonial stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
