import { Router } from "express";
import ProgramController from "../controllers/program.controller";

class ProgramRoutes {
    public router: Router;

    constructor(){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/programs', ProgramController.getAllPrograms);
        this.router.post('/programs', ProgramController.createProgram);
        this.router.get('/programs/:id', ProgramController.getProgramById);
        this.router.put('/programs/:id', ProgramController.updateProgram);
        this.router.delete('/programs/:id', ProgramController.deleteProgram);
    }
}

export default new ProgramRoutes().router;
