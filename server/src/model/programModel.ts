import mongoose, { Schema, Document } from 'mongoose';
import { ProjectSchema } from './projectModel';

export interface ProgramInterface extends Document {
  title: string;
  tagline: string;
  detailedDescription: string;
  goals: string[];
  media: {
    images: string[];
    videos: string[];
    gallery: string[];
  };
  metrics: string[];
  endorsement: string;
  projects: string[];
}

const ProgramSchema: Schema = new Schema({
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  detailedDescription: { type: String, required: false },
  goals: { type: [String], required: false },
  media: { 
    images: { type: [String], required: false },
    videos: { type: [String], required: false },
    gallery: { type: [String], required: false },
  },
  metrics: { type: [String], required: true },
  endorsement: { type: String, required: false },
  // projects: [{ type: ProjectSchema, required: false }] 
});

export const Program = mongoose.model<ProgramInterface>('Program', ProgramSchema);
export {ProgramSchema}