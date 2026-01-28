import { Router, Request, Response } from 'express';

class LoginRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/admin/login', this.getUsers);
        this.router.get('/admin/addUser', this.getUserById);
        this.router.post('/users', this.createUser);
    }

    private getUsers(req: Request, res: Response) {
        // Simulated data - replace with your data source
        const users = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
        res.json(users);
    }

    private getUserById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        // Simulated data - replace with your data source
        const user = { id, name: 'John Doe' }; 
        res.json(user);
    }

    private createUser(req: Request, res: Response) {
        const newUser = req.body; // Ensure you have body parsing middleware
        // Simulated data creation - replace with your data source
        res.status(201).json(newUser);
    }
}

export default new LoginRoutes().router;