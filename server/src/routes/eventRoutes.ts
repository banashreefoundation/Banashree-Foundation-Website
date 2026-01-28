import { Router } from 'express';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, getEnabledEvents } from '../controllers/event.controller';
import auth from '../middleware/auth';

class EventRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/events', auth, createEvent);
        this.router.get('/events', getAllEvents);
        this.router.get('/events/isEventEnabled/:value', getEnabledEvents);
        this.router.get('/events/:id', getEventById);
        this.router.put('/events/:id', auth, updateEvent);
        this.router.delete('/events/:id', auth, deleteEvent);
    }
}

export default new EventRoutes().router;