import { Router } from 'express';
import {
    handleCreateContact,
    handleGetAllContacts,
    handleGetContactById,
    handleGetContactsByEmail,
    handleGetContactsByType,
    handleGetPendingContacts,
    handleGetContactStats,
    handleUpdateContact,
    handleUpdateContactStatus,
    handleResolveContact,
    handleDeleteContact,
    handleDeleteMultipleContacts,
    handleDeleteOldContacts,
} from '../controllers/contact.controller';
import auth from '../middleware/auth';

class ContactRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Public route - No authentication required
        this.router.post('/createContact', handleCreateContact);

        // Protected routes - Stats and special queries (require authentication)
        this.router.get('/contacts/stats', handleGetContactStats);
        this.router.get('/contacts/pending', handleGetPendingContacts);
        this.router.get('/contacts/email/:email', handleGetContactsByEmail);
        this.router.get('/contacts/type/:type', handleGetContactsByType);

        // Protected routes - CRUD operations (require authentication)
        this.router.get('/contacts', handleGetAllContacts);
        this.router.get('/contacts/:id', handleGetContactById);
        this.router.put('/contacts/:id', handleUpdateContact);
        this.router.put('/contacts/:id/status', handleUpdateContactStatus);
        this.router.put('/contacts/:id/resolve', handleResolveContact);
        this.router.delete('/contacts/:id', handleDeleteContact);

        // Bulk operations (require authentication)
        this.router.delete('/contacts/bulk/delete', handleDeleteMultipleContacts);
        this.router.delete('/contacts/old/:days', handleDeleteOldContacts);
    }
}

export default new ContactRoutes().router;