import { Request, Response } from "express";
import sampleCampaign from "../sampleData/sampleCampaign";
import { Campaign } from "../model/campaignModel";
import mongoose from "mongoose";

class CampaignController {
    public async getAllCampaigns(req: Request, res: Response) {
        try {
            const campaigns = await Campaign.find();
            res.status(200).json({ success: true, data: campaigns });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'An unknown error occurred' });
            }
        }
    }

    public async createCampaign(req: Request, res: Response) {
        try {
            const campaignData = {...sampleCampaign, ...req.body};
            const newCampaign = new Campaign(campaignData);
            await newCampaign.save();
            res.status(201).json({ success: true, message: 'Campaign Created!', data: newCampaign });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'An unknown error occurred' });
            }
        }
    }

    public async getCampaignById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            // Validate ObjectId before querying
            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ success: false, message: "Invalid campaign ID" });
            } else {
                const campaign = await Campaign.findById(id);
    
                if (!campaign) {
                    res.status(404).json({ success: false, message: "Campaign not found" });
                } else {
                    res.status(200).json({ success: true, data: campaign });
                }
            }
        } catch (error) {
            console.error("Error fetching campaign:", error);
            res.status(500).json({ 
                success: false, 
                message: error instanceof Error ? error.message : "An unknown error occurred" 
            });
        }
    }

    public async updateCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedCampaign = await Campaign.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedCampaign) {
                res.status(404).json({ success: false, message: 'Campaign not found' });
            }
            res.status(200).json({ success: true, data: updatedCampaign });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'An unknown error occurred' });
            }
        }
    }

    public async deleteCampaign(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedCampaign = await Campaign.findByIdAndDelete(id);
            if (!deletedCampaign) {
                res.status(404).json({ success: false, message: 'Campaign not found' });
            }
            res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'An unknown error occurred' });
            }
        }
    }
}

export default new CampaignController();