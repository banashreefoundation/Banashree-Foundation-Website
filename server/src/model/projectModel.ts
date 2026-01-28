import mongoose, { Schema, Document, Model, Types, ObjectId } from 'mongoose';
import { CampaignSchema, CampaignInterface } from './campaignModel';
import { Program, ProgramInterface } from './programModel';

interface IProject extends Document {
  projectName: string;
  tagLine: string;
  program: Types.ObjectId | ProgramInterface | string;
  projectObjective: string;
  projectDescription: string;
  targetBeneficiaries: string;
  projectLocation: string;
  keyActivities: string;
  expectedOutcome: string;
  collaboratingPartners: string;
  metrics: string;
  endorsementAndPartnership?: string;
  image?: string; // Project main image
}

const ProjectSchema = new Schema<IProject>({
  "projectName": { type: String, required: true },
  "tagLine": { type: String, required: true },
  "program": {
    type: Schema.Types.ObjectId,
    ref: 'Program'
  },
  "projectObjective": { type: String, required: true },
  "projectDescription": { type: String, required: true },
  "targetBeneficiaries": { type: String, required: true },
  "projectLocation": { type: String, required: true },
  "keyActivities": { type: String, required: true },
  "expectedOutcome": { type: String, required: true },
  "collaboratingPartners": { type: String, required: true },
  "metrics": { type: String, required: true },
  "endorsementAndPartnership": { type: String, required: false },
  "image": { type: String, required: false },
  
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
export { ProjectSchema };
