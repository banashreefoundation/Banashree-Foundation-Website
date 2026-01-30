import { Router } from 'express';
import {
    createTestimonial,
    getTestimonials,
    getTestimonial,
    updateTestimonial,
    deleteTestimonial,
    approveTestimonial,
    rejectTestimonial,
    publishTestimonial,
    unpublishTestimonial,
    getPublishedTestimonialsHandler,
    getTestimonialStatsHandler,
    uploadTestimonialImage,
} from '../controllers/testimonial.controller';
import auth from '../middleware/auth';

class TestimonialRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Public routes - No authentication required
        this.router.get('/testimonials/published', getPublishedTestimonialsHandler);
        
        // Protected routes - Stats and admin queries (require authentication)
        this.router.get('/testimonials/stats', auth, getTestimonialStatsHandler);

        // Protected routes - CRUD operations (require authentication)
        this.router.post('/testimonials', auth, uploadTestimonialImage.single('image'), createTestimonial);
        this.router.get('/testimonials', auth, getTestimonials);
        this.router.get('/testimonials/:id', auth, getTestimonial);
        this.router.put('/testimonials/:id', auth, uploadTestimonialImage.single('image'), updateTestimonial);
        this.router.delete('/testimonials/:id', auth, deleteTestimonial);

        // Protected routes - Status management (require authentication)
        this.router.put('/testimonials/:id/approve', auth, approveTestimonial);
        this.router.put('/testimonials/:id/reject', auth, rejectTestimonial);
        this.router.put('/testimonials/:id/publish', auth, publishTestimonial);
        this.router.put('/testimonials/:id/unpublish', auth, unpublishTestimonial);
    }
}

export default new TestimonialRoutes().router;
