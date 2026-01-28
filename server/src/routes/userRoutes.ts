import { Router } from 'express';
import { getProfile, handleLoginUser, handleRegisterUser, logoutAllUser, logoutUser } from '../controllers/user.controller';
import auth from '../middleware/auth';

class UserRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/register', handleRegisterUser);
        this.router.post('/login', handleLoginUser);
        this.router.get('/me', auth, getProfile);
        this.router.post('/logout', auth, logoutUser);
        this.router.post('/logoutall', auth, logoutAllUser);
    }
}

export default new UserRoutes().router;