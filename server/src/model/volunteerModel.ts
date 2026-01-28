import mongoose, { Schema, Document } from 'mongoose';

interface PersonalDetails {
  fullname: string;
  email: string;
  phoneNumber: string;
  location: string;
  city: string;
  state: string;
  availability: string;
}

interface InterestsAndSkillsDetails {
  interests: string,
  skills: string,
}

interface volunteerTypeDetails {
  volunteerType: string,
  isAvailableForTravel: string,
}

interface motivationDetails {
  reasonForJoinBanashree: string,
  objective: string
}

interface emergencyContactDetails {
  contactName: string,
  phoneNumber: string,
  relation: string
}

export interface Volunteer extends Document {
  personalDetails: PersonalDetails
  skillsAndInterestsDetails: InterestsAndSkillsDetails
  volunteerTypeDetails: volunteerTypeDetails
  motivationDetails: motivationDetails
  emergencyContactDetails: emergencyContactDetails
}

const VolunteerSchema: Schema = new Schema({
  personalDetails: {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    availability: { type: String, required: true },
  },
  skillsAndInterestsDetails: {
    interests: { type: String, required: true },
    skills: { type: String, required: true },
  },
  volunteerTypeDetails:{
    volunteerType: { type: String, required: true },
    isAvailableForTravel: { type: String, required: true },
  },
  motivationDetails: {
    reasonForJoinBanashree: { type: String, required: true },
    objective: { type: String, required: true },
  },
  emergencyContactDetails: {
    contactName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    relation: { type: String, required: true },
  }
  // title: { type: String, required: true },
  // tagline: { type: String, required: true },
  // detailedDescription: { type: String, required: false },
  // goals: { type: [String], required: false },
  // media: { 
  //   images: { type: [String], required: false },
  //   videos: { type: [String], required: false },
  //   gallery: { type: [String], required: false },
  // },
  // metrics: { type: [String], required: false },
  // projects: [{ type: ProjectSchema, required: false }] 
});

export const Volunteer = mongoose.model<Volunteer>('Volunteer', VolunteerSchema);
export {VolunteerSchema}