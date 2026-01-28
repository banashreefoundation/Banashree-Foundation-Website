import { Router } from "express";
import ProjectController from "../controllers/projects.controller";

class ProjectRoutes {
    public router: Router;

    constructor(){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/projects', ProjectController.getAllProjects);
        this.router.post('/projects', ProjectController.createProject);
        this.router.get('/projects/:id', ProjectController.getProjectById);
        this.router.put('/projects/:id', ProjectController.updateProject);
        this.router.delete('/projects/:id', ProjectController.deleteProject);
        
    }
}

export default new ProjectRoutes().router;