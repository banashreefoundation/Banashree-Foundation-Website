import { Router } from "express";
import CampaignController from "../controllers/campaign.controller";
import authMiddleware from "../middleware/auth";

class CampaignRoutes {
    public router: Router;

    constructor(){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        
        this.router.get('/campaigns', CampaignController.getAllCampaigns);
        this.router.post('/campaigns', CampaignController.createCampaign); 
        this.router.get('/campaigns/:id', CampaignController.getCampaignById);
        this.router.put('/campaigns/:id', CampaignController.updateCampaign);
        this.router.delete('/campaigns/:id', CampaignController.deleteCampaign);

        // if you want to use the middleware use it like this for each route
        // this.router.delete('/campaigns/:id', authMiddleware, CampaignController.deleteCampaign);
    }

}

export default new CampaignRoutes().router;
