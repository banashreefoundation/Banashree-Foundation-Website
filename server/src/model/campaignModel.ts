import mongoose, { Schema, Document, Model } from 'mongoose';

export interface CampaignInterface extends Document {
    title: string;
    tagline: string;
    goal: string;
    campaignStory: string;
    specificBreakdown?: string;
    impactOfContribution: string;
    timeline: string;
    beneficiaryInformation: string;
    mediaUrl: string;
    donateOption: string;
    campaignUpdates?: string;
    shareOptions: string;
    endorsementsOrPartnerships?: string;
    isActive: boolean;
    campaignID: string;
}

const CampaignSchema: Schema = new Schema({
    title: { type: String, required: false },
    tagline: { type: String, required: false },
    goal: { type: String, required: false },
    campaignStory: { type: String, required: false },
    specificBreakdown: { type: String },
    impactOfContribution: { type: String, required: false },
    timeline: { type: String, required: false },
    beneficiaryInformation: { type: String, required: false },
    mediaUrl: { type: String, required: false },
    donateOption: { type: String, required: false },
    campaignUpdates: { type: String },
    shareOptions: { type: String, required: false },
    endorsementsOrPartnerships: { type: String },
    isActive: { type: Boolean, required: false, default: true },
    campaignID: { type: String, required: false}
});

export const Campaign: Model<CampaignInterface> = mongoose.model<CampaignInterface>('Campaign', CampaignSchema);
export { CampaignSchema };