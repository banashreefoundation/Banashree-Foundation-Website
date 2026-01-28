import volunteerController from "../controllers/volunteer.controller";
import { Router } from "express";


class volunteerRoutes {
    public router: Router;

    constructor(){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/volunteers', volunteerController.getAllVolunteers);
        this.router.post('/volunteers', volunteerController.createVolunteer);
        this.router.get('/volunteers/:id', volunteerController.getVolunteerById);
        this.router.put('/volunteers/:id', volunteerController.updateVolunteer);
        this.router.delete('/volunteers/:id', volunteerController.deleteVolunteer);
    }
}

export default new volunteerRoutes().router;
