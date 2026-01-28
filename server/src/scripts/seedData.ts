import mongoose from 'mongoose';
import { Program } from '../model/programModel';
import { Project } from '../model/projectModel';
import { Campaign } from '../model/campaignModel';
import Event from '../models/Event';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/banashree-foundation-db';

// Configuration: Set to true to clear all existing data before seeding, false to keep existing data
const CLEAN_DATABASE = true; // Change to false if you want to preserve existing data

// Helper function to get random images from uploads folder
function getRandomImages(count: number = 1): string[] {
  const uploadsDir = path.join(__dirname, '../../uploads');
  try {
    const files = fs.readdirSync(uploadsDir);
    // Filter only image files
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    );
    
    // Shuffle and pick random images
    const shuffled = imageFiles.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, imageFiles.length));
    
    // Return as API paths
    return selected.map(file => `/api/images/${file}`);
  } catch (error) {
    console.error('Error reading uploads directory:', error);
    return [];
  }
}

// Get available images once at the start
const availableImages = (() => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  try {
    const files = fs.readdirSync(uploadsDir);
    return files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    ).map(file => `/uploads/${file}`);
  } catch (error) {
    console.error('Error reading uploads directory:', error);
    return [];
  }
})();

// Helper to get specific image by index (deterministic)
function getImageByIndex(index: number): string {
  if (availableImages.length === 0) return '/images/placeholder.jpg';
  return availableImages[index % availableImages.length];
}

// 10 Programs Data
const programsData = [
  {
    title: "Animal Welfare & Rescue Program",
    tagline: "Protecting and caring for animals in need",
    detailedDescription: "Our comprehensive animal welfare program focuses on rescuing, rehabilitating, and providing sanctuary for abandoned and injured animals. We run multiple goshalas (cow shelters) and provide medical care, nutrition, and a safe environment for all animals under our care.",
    goal: "Provide care and shelter for 500+ animals annually",
    goals: ["Rescue abandoned animals", "Provide medical treatment", "Create sustainable shelters", "Promote animal welfare awareness"],
    media: {
      images: [getImageByIndex(0), getImageByIndex(1)],
      videos: [],
      gallery: [getImageByIndex(2), getImageByIndex(3)]
    },
    metrics: ["Animals rescued: 350+", "Shelters maintained: 5", "Veterinary camps conducted: 24"],
    endorsement: "Recognized by Karnataka Animal Welfare Board",
    impact: "Successfully rescued and rehabilitated over 350 animals in the past year"
  },
  {
    title: "Water Conservation Initiative",
    tagline: "Preserving water for future generations",
    detailedDescription: "A comprehensive water conservation program aimed at rainwater harvesting, pond rejuvenation, and promoting sustainable water usage practices in rural Karnataka. We work with local communities to implement effective water management systems.",
    goal: "Conserve 10 million liters of water annually",
    goals: ["Build rainwater harvesting structures", "Rejuvenate traditional water bodies", "Educate communities on water conservation", "Implement drip irrigation systems"],
    media: {
      images: [getImageByIndex(4), getImageByIndex(5)],
      videos: [],
      gallery: [getImageByIndex(6)]
    },
    metrics: ["Water bodies restored: 12", "Rainwater harvesting units: 45", "Farmers trained: 200+"],
    endorsement: "Supported by Karnataka State Water Resources Department",
    impact: "Restored 12 traditional water bodies, benefiting 15 villages"
  },
  {
    title: "Child Care & Education Program",
    tagline: "Empowering children through quality education",
    detailedDescription: "Providing quality education, nutrition, and holistic development opportunities for underprivileged children. Our program includes formal education support, skill development workshops, and health and wellness initiatives.",
    goal: "Support 1000+ children with quality education",
    goals: ["Provide scholarships", "Run after-school programs", "Ensure nutrition support", "Develop life skills"],
    media: {
      images: [getImageByIndex(7), getImageByIndex(8)],
      videos: [],
      gallery: [getImageByIndex(9), getImageByIndex(10)]
    },
    metrics: ["Children supported: 850", "Scholarships provided: 120", "Learning centers: 8"],
    endorsement: "Partnered with Karnataka Education Department",
    impact: "850 children receiving quality education and nutrition support"
  },
  {
    title: "Elderly Care & Support",
    tagline: "Honoring our elders with dignity and care",
    detailedDescription: "Dedicated to providing compassionate care, medical support, and social engagement for senior citizens. We operate day care centers and provide home-based support services for elderly individuals in need.",
    goal: "Serve 300+ elderly individuals with comprehensive care",
    goals: ["Provide medical care", "Organize social activities", "Ensure nutrition support", "Offer counseling services"],
    media: {
      images: [getImageByIndex(11), getImageByIndex(12)],
      videos: [],
      gallery: [getImageByIndex(13)]
    },
    metrics: ["Elders served: 280", "Medical camps: 36", "Day care centers: 4"],
    endorsement: "Recognized by Social Welfare Department",
    impact: "280 senior citizens receiving regular care and support"
  },
  {
    title: "Farmer Empowerment Program",
    tagline: "Supporting sustainable agriculture and farmer livelihoods",
    detailedDescription: "Empowering farmers through training in organic farming, providing access to resources, and creating market linkages. We focus on sustainable agricultural practices and improving farmer incomes.",
    goal: "Train 500+ farmers in sustainable agriculture",
    goals: ["Promote organic farming", "Provide agricultural training", "Create market linkages", "Distribute farming equipment"],
    media: {
      images: [getImageByIndex(14), getImageByIndex(15)],
      videos: [],
      gallery: [getImageByIndex(16)]
    },
    metrics: ["Farmers trained: 420", "Organic farms: 85", "Training sessions: 48"],
    endorsement: "Supported by Karnataka Agricultural University",
    impact: "420 farmers adopted organic farming practices, increasing income by 35%"
  },
  {
    title: "Community Building & Cultural Upliftment",
    tagline: "Strengthening communities through culture and tradition",
    detailedDescription: "Preserving and promoting local culture, arts, and traditions while building strong community bonds. Our program includes cultural events, skill development workshops, and community infrastructure development.",
    goal: "Engage 2000+ community members in cultural activities",
    goals: ["Organize cultural events", "Preserve traditional arts", "Build community centers", "Conduct skill workshops"],
    media: {
      images: [getImageByIndex(17), getImageByIndex(18)],
      videos: [],
      gallery: [getImageByIndex(19), getImageByIndex(20)]
    },
    metrics: ["Cultural events: 24", "Artisans supported: 150", "Community centers: 6"],
    endorsement: "Recognized by Karnataka Folklore Academy",
    impact: "Preserved 15 traditional art forms and supported 150 artisans"
  },
  {
    title: "Gurukul Education System",
    tagline: "Blending traditional wisdom with modern education",
    detailedDescription: "A unique educational approach combining traditional gurukul methods with contemporary curriculum. Students receive holistic education including academics, yoga, meditation, and cultural studies.",
    goal: "Establish 5 gurukul centers serving 500 students",
    goals: ["Build gurukul infrastructure", "Train teachers", "Develop curriculum", "Provide scholarships"],
    media: {
      images: [getImageByIndex(21), getImageByIndex(22)],
      videos: [],
      gallery: [getImageByIndex(23)]
    },
    metrics: ["Gurukul centers: 3", "Students enrolled: 285", "Teachers trained: 42"],
    endorsement: "Approved by Karnataka Education Board",
    impact: "285 students receiving holistic education combining tradition and modernity"
  },
  {
    title: "Women Empowerment Program",
    tagline: "Empowering women through skills and entrepreneurship",
    detailedDescription: "Focused on women's economic empowerment through skill development, entrepreneurship training, and creating livelihood opportunities. We support women in rural areas to become self-reliant.",
    goal: "Train 800+ women in income-generating skills",
    goals: ["Provide vocational training", "Support micro-enterprises", "Offer financial literacy", "Create self-help groups"],
    media: {
      images: [getImageByIndex(24), getImageByIndex(25)],
      videos: [],
      gallery: [getImageByIndex(26), getImageByIndex(27)]
    },
    metrics: ["Women trained: 650", "SHGs formed: 45", "Micro-enterprises: 120"],
    endorsement: "Supported by Karnataka Women's Commission",
    impact: "650 women trained, with 120 starting their own businesses"
  },
  {
    title: "Health & Wellness Program",
    tagline: "Promoting community health and well-being",
    detailedDescription: "Comprehensive healthcare program providing medical camps, health education, and preventive care services in rural areas. We focus on maternal health, child nutrition, and general wellness.",
    goal: "Conduct 100+ health camps annually",
    goals: ["Organize medical camps", "Provide health education", "Ensure maternal care", "Distribute medicines"],
    media: {
      images: [getImageByIndex(28), getImageByIndex(29)],
      videos: [],
      gallery: [getImageByIndex(30)]
    },
    metrics: ["Health camps: 96", "Patients treated: 8500+", "Health centers: 7"],
    endorsement: "Partnered with District Health Department",
    impact: "Over 8500 patients received medical care through our camps"
  },
  {
    title: "Environmental Conservation Program",
    tagline: "Protecting nature for a sustainable future",
    detailedDescription: "Dedicated to environmental protection through tree plantation, waste management, and promoting eco-friendly practices. We work on creating green spaces and raising environmental awareness.",
    goal: "Plant 50,000 trees and create 10 green zones",
    goals: ["Conduct tree plantation drives", "Promote waste segregation", "Create awareness programs", "Build green spaces"],
    media: {
      images: [getImageByIndex(31), getImageByIndex(32)],
      videos: [],
      gallery: [getImageByIndex(33), getImageByIndex(34)]
    },
    metrics: ["Trees planted: 42,000", "Green zones: 8", "Awareness programs: 56"],
    endorsement: "Recognized by Karnataka Forest Department",
    impact: "42,000 trees planted across 8 districts, creating sustainable green cover"
  }
];

// 10 Projects Data
const projectsData = [
  {
    projectName: "Sacred Cow Sanctuary - Varur",
    tagLine: "A sanctuary of love and care for abandoned cattle",
    program: "Animal Welfare And Rescue",
    projectObjective: "To provide shelter, medical care, and nourishment to abandoned and injured cows in the Varur region",
    projectDescription: "The Sacred Cow Sanctuary in Varur is home to over 150 rescued cows, providing them with comprehensive care including veterinary services, nutritious feed, and a safe living environment. The sanctuary also serves as an educational center for animal welfare.",
    targetBeneficiaries: "150+ abandoned and injured cattle",
    projectLocation: "Varur Village, Dharwad District, Karnataka",
    keyActivities: "Daily feeding and care, Regular veterinary check-ups, Medical treatment for injured animals, Awareness programs on animal welfare",
    expectedOutcome: "Rehabilitation of 150+ cattle, Zero mortality rate through proper care, Increased community awareness about animal welfare",
    collaboratingPartners: "Karnataka Animal Husbandry Department, Local Veterinary College, Village Panchayat",
    metrics: "Cattle rescued and sheltered: 156, Medical treatments provided: 2400+, Fodder distributed: 180 tons/year",
    endorsementAndPartnership: "Supported by Karnataka Animal Welfare Board and partnered with Veterinary College, Dharwad",
    image: getImageByIndex(35)
  },
  {
    projectName: "Community Pond Restoration - Hubli",
    tagLine: "Reviving traditional water bodies for sustainable water management",
    program: "Water Conservation",
    projectObjective: "To restore and rejuvenate the historic community pond in Hubli for rainwater harvesting and groundwater recharge",
    projectDescription: "This project focuses on the complete restoration of a 2-acre community pond that had been neglected for decades. The restored pond now serves as a primary water source for 500+ families and supports local agriculture.",
    targetBeneficiaries: "500+ families, 85 farmers in surrounding areas",
    projectLocation: "Old Hubli, Hubli-Dharwad, Karnataka",
    keyActivities: "Pond desilting and deepening, Construction of recharge wells, Plantation around pond area, Community awareness programs",
    expectedOutcome: "Water storage capacity of 2 million liters, Groundwater level increase by 3-4 feet, Irrigation support for 50 acres of farmland",
    collaboratingPartners: "Karnataka Water Resources Department, HDMC, Local Farmers Association",
    metrics: "Water storage capacity: 2.2 million liters, Groundwater recharge: 1.5 million liters/year, Families benefited: 520",
    endorsementAndPartnership: "Funded by District Water Conservation Authority",
    image: getImageByIndex(36)
  },
  {
    projectName: "Scholarship Program for Girl Child",
    tagLine: "Empowering girls through education and opportunity",
    program: "Child Care And Education",
    projectObjective: "To provide financial assistance and educational support to underprivileged girl students from Class 8 to Graduation",
    projectDescription: "A comprehensive scholarship program covering tuition fees, books, uniforms, and additional educational materials for deserving girl students. The program also includes mentorship and career guidance.",
    targetBeneficiaries: "200 girl students from economically disadvantaged backgrounds",
    projectLocation: "Dharwad, Hubli, and surrounding villages",
    keyActivities: "Scholarship distribution, Career counseling sessions, Skill development workshops, Parent awareness meetings",
    expectedOutcome: "100% retention rate in schools, 80% students pursuing higher education, Improved academic performance",
    collaboratingPartners: "Karnataka Education Department, Local Schools, NGO Partners",
    metrics: "Scholarships provided: 185, Students completed secondary education: 156, Students in higher education: 124",
    endorsementAndPartnership: "Recognized by District Education Officer and supported by Rotary Club",
    image: getImageByIndex(37)
  },
  {
    projectName: "Dignity Home for Senior Citizens",
    tagLine: "A warm and caring home for our elders",
    program: "Elderly Care",
    projectObjective: "To provide residential care, medical support, and social engagement for elderly individuals without family support",
    projectDescription: "Dignity Home offers 24/7 care for 35 elderly residents with facilities including medical care, nutritious meals, recreational activities, and spiritual programs. The home emphasizes maintaining dignity and quality of life.",
    targetBeneficiaries: "35 senior citizens (60+ years)",
    projectLocation: "Dharwad City, Karnataka",
    keyActivities: "Daily care and assistance, Medical check-ups and treatment, Recreational and spiritual activities, Nutritious meal provision",
    expectedOutcome: "Improved health and well-being of residents, Regular social interaction and engagement, Access to quality medical care",
    collaboratingPartners: "District Hospital, Social Welfare Department, Local Healthcare Providers",
    metrics: "Residents served: 35, Medical consultations: 420/year, Wellness activities: 365/year",
    endorsementAndPartnership: "Licensed by Social Welfare Department and supported by District Administration",
    image: getImageByIndex(38)
  },
  {
    projectName: "Organic Farming Training Center",
    tagLine: "Cultivating sustainable agriculture practices",
    program: "Farmer Empowerment",
    projectObjective: "To train farmers in organic farming techniques and help transition from chemical to organic agriculture",
    projectDescription: "A state-of-the-art training center with demonstration farms showcasing various organic farming techniques. Farmers receive hands-on training in composting, natural pest control, and sustainable farming practices.",
    targetBeneficiaries: "300+ farmers from 25 villages",
    projectLocation: "Kundagol Taluk, Dharwad District",
    keyActivities: "Organic farming training programs, Demonstration plots, Seed bank establishment, Market linkage support",
    expectedOutcome: "250+ farmers transitioning to organic farming, 30% increase in farmer income, Reduced chemical fertilizer usage by 70%",
    collaboratingPartners: "Karnataka Agricultural University, NABARD, Organic Certification Agencies",
    metrics: "Farmers trained: 285, Organic farms established: 78, Training sessions: 42",
    endorsementAndPartnership: "Certified by Organic Farming Association of India",
    image: getImageByIndex(39)
  },
  {
    projectName: "Cultural Heritage Center",
    tagLine: "Preserving traditions, celebrating culture",
    program: "Community Building, Cultural & Social Upliftment",
    projectObjective: "To preserve and promote local cultural heritage through a dedicated center for traditional arts, crafts, and performances",
    projectDescription: "A vibrant center showcasing Karnataka's rich cultural heritage with facilities for traditional music, dance, handicrafts, and folk arts. The center provides training and performance opportunities for local artisans.",
    targetBeneficiaries: "120 artisans and performers, 5000+ community members",
    projectLocation: "Dharwad City, Karnataka",
    keyActivities: "Traditional arts training, Cultural performances and exhibitions, Handicraft workshops, Youth cultural programs",
    expectedOutcome: "Preservation of 10+ traditional art forms, Income generation for 100 artisans, 50+ cultural events annually",
    collaboratingPartners: "Karnataka Folklore Academy, Tourism Department, Local Artists Association",
    metrics: "Artisans trained: 118, Cultural events: 48, Visitors annually: 12,000+",
    endorsementAndPartnership: "Recognized by Karnataka Janapada Academy",
    image: getImageByIndex(40)
  },
  {
    projectName: "Vedic Gurukul - Kundagol",
    tagLine: "Traditional learning meets modern education",
    program: "Gurukul Systems",
    projectObjective: "To establish a residential gurukul providing holistic education combining Vedic studies with contemporary curriculum",
    projectDescription: "A residential gurukul accommodating 85 students offering education from Class 5 to 10 with focus on Vedic studies, yoga, meditation, Sanskrit, and regular academic subjects. Students live in a traditional gurukul environment.",
    targetBeneficiaries: "85 students aged 10-16 years",
    projectLocation: "Kundagol, Dharwad District",
    keyActivities: "Vedic and modern education, Yoga and meditation sessions, Character development programs, Cultural activities",
    expectedOutcome: "Holistic development of students, 100% pass rate in board exams, Strong foundation in traditional values",
    collaboratingPartners: "Karnataka Secondary Education Board, Sanskrit University, Yoga Institutes",
    metrics: "Students enrolled: 82, Teachers: 16, Board exam pass rate: 100%",
    endorsementAndPartnership: "Affiliated with Karnataka Secondary Education Board",
    image: getImageByIndex(41)
  },
  {
    projectName: "Women's Skill Development Center",
    tagLine: "Skills that empower, opportunities that transform",
    program: "Community Building, Cultural & Social Upliftment",
    projectObjective: "To provide vocational training and entrepreneurship support to rural women for economic independence",
    projectDescription: "A comprehensive skill development center offering training in tailoring, handicrafts, computer skills, and entrepreneurship. The program includes market linkage support and micro-credit assistance.",
    targetBeneficiaries: "250 women from 15 villages",
    projectLocation: "Hubli-Dharwad region",
    keyActivities: "Vocational training programs, Business development support, Market linkage facilitation, Financial literacy training",
    expectedOutcome: "200+ women trained in skills, 100+ micro-enterprises established, 40% increase in household income",
    collaboratingPartners: "Karnataka Skill Development Corporation, Self-Help Group Federations, Microfinance Institutions",
    metrics: "Women trained: 235, Businesses started: 94, Average income increase: 45%",
    endorsementAndPartnership: "Recognized by National Skill Development Corporation",
    image: getImageByIndex(42)
  },
  {
    projectName: "Mobile Health Clinic - Rural Outreach",
    tagLine: "Bringing healthcare to every doorstep",
    program: "Community Building, Cultural & Social Upliftment",
    projectObjective: "To provide accessible healthcare services to remote villages through fully-equipped mobile medical units",
    projectDescription: "Two mobile health clinics covering 30 remote villages, providing basic healthcare, maternal care, child immunization, and health education. Each clinic visits villages on a scheduled rotation.",
    targetBeneficiaries: "15,000+ people across 30 villages",
    projectLocation: "Remote villages of Dharwad and Haveri districts",
    keyActivities: "Regular health check-ups, Medicine distribution, Health awareness programs, Referral services",
    expectedOutcome: "Monthly health coverage for 30 villages, 80% immunization coverage, Early disease detection and treatment",
    collaboratingPartners: "District Health Department, Primary Health Centers, Pharmaceutical Companies",
    metrics: "Villages covered: 32, Patients treated monthly: 1250+, Health camps: 96/year",
    endorsementAndPartnership: "Supported by National Health Mission",
    image: getImageByIndex(43)
  },
  {
    projectName: "Green Karnataka - Tree Plantation Drive",
    tagLine: "One tree at a time, building a greener tomorrow",
    program: "Community Building, Cultural & Social Upliftment",
    projectObjective: "To plant and nurture 25,000 trees across rural and urban areas of Karnataka",
    projectDescription: "A massive tree plantation initiative focusing on native species, fruit-bearing trees, and creation of urban green spaces. The project includes maintenance for 3 years ensuring high survival rate.",
    targetBeneficiaries: "Entire community - cleaner air, better environment for 100,000+ people",
    projectLocation: "Dharwad, Haveri, and Gadag districts",
    keyActivities: "Mass tree plantation drives, School greening programs, Urban forest creation, Community awareness",
    expectedOutcome: "25,000 trees planted, 80%+ survival rate, 5 urban green zones created",
    collaboratingPartners: "Karnataka Forest Department, Municipal Corporations, Schools and Colleges",
    metrics: "Trees planted: 23,500, Survival rate: 84%, Green zones: 6",
    endorsementAndPartnership: "Recognized by Karnataka State Environment Department",
    image: getImageByIndex(44)
  }
];

// 10 Campaigns Data
const campaignsData = [
  {
    title: "Save Our Goshalas - Emergency Medical Fund",
    tagline: "Help us provide critical medical care to 200+ rescued cattle",
    goal: "To raise ₹5,00,000 for emergency medical treatments and veterinary care for injured and sick cattle in our goshalas",
    campaignStory: "Our goshalas are currently sheltering 156 rescued cattle, many of whom come to us severely injured or ill. In the past month, we've had 23 emergency cases requiring immediate medical intervention. The cost of veterinary care, medicines, and surgical procedures is mounting, and we need your support to ensure no animal suffers due to lack of medical care.",
    specificBreakdown: "₹2,00,000 - Emergency surgeries and treatments, ₹1,50,000 - Regular veterinary consultations and medicines, ₹1,00,000 - Medical equipment and supplies, ₹50,000 - Nutritional supplements for recovering animals",
    impactOfContribution: "Your contribution will directly save lives. ₹1,000 can provide a month's medication for one cow, ₹5,000 can cover an emergency surgery, and ₹10,000 can equip our veterinary clinic with essential supplies. Every rupee counts in our mission to provide the best possible care.",
    timeline: "Campaign Duration: 60 days (January 22, 2026 - March 22, 2026). Immediate impact as funds are utilized on a rolling basis for ongoing treatments.",
    beneficiaryInformation: "Direct beneficiaries: 156 cattle currently in our care. Indirect beneficiaries: Local community learning about animal welfare and compassion.",
    mediaUrl: getImageByIndex(0),
    donateOption: "true",
    campaignUpdates: "Week 1: Successfully treated 5 emergency cases. Week 2: New veterinary equipment arrived. Week 3: 3 cows fully recovered and healthy.",
    shareOptions: "Share on Facebook, Twitter, WhatsApp, Email",
    endorsementsOrPartnerships: "Endorsed by Karnataka Animal Welfare Board. Partnership with Veterinary College, Dharwad for subsidized treatments.",
    isActive: true,
    campaignID: "CAM001"
  },
  {
    title: "Restore Village Ponds - Water for Future",
    tagline: "Bring water back to 10 drought-affected villages",
    goal: "Raise ₹8,00,000 to restore 10 traditional village ponds and create sustainable water sources for 3,000+ families",
    campaignStory: "Ten villages in the Dharwad district are facing severe water scarcity. Their traditional ponds, once vibrant water sources, have dried up due to neglect and siltation. Women walk 2-3 kilometers daily for water. Children miss school to help fetch water. We have the expertise and community support to restore these ponds - we just need your financial backing.",
    specificBreakdown: "₹4,00,000 - Desilting and deepening 10 ponds, ₹2,00,000 - Construction of recharge wells, ₹1,00,000 - Plantation around pond areas, ₹1,00,000 - Community training and awareness",
    impactOfContribution: "₹5,000 helps desilt one pond partially, ₹25,000 funds one complete recharge well, ₹50,000 restores one complete village pond. Your contribution will provide water security to 3,000+ people.",
    timeline: "Campaign: 90 days (Jan 22 - Apr 22, 2026). Implementation: May - July 2026 (before monsoon). Impact: Immediate post-monsoon (July onwards)",
    beneficiaryInformation: "3,000+ families across 10 villages, 500+ farmers for irrigation, entire ecosystem around the ponds",
    mediaUrl: getImageByIndex(1),
    donateOption: "true",
    campaignUpdates: "Completed village surveys and technical assessments. Community mobilization meetings held in all 10 villages. Equipment procurement in progress.",
    shareOptions: "Share on social media platforms",
    endorsementsOrPartnerships: "Supported by Karnataka Water Resources Department. Technical support from IIT Dharwad. Community partnership with 10 village panchayats.",
    isActive: true,
    campaignID: "CAM002"
  },
  {
    title: "Educate a Girl Child - Transform a Family",
    tagline: "Sponsor education for 100 deserving girl students",
    goal: "Raise ₹6,00,000 to provide one-year educational support (tuition, books, uniforms) for 100 girl students",
    campaignStory: "Meet Anjali, a brilliant Class 10 student who scores 95% but might drop out because her family can't afford ₹6,000 annual school expenses. There are 99 more Anjalis waiting for someone to believe in their dreams. Education is not just about books - it's about breaking the cycle of poverty and creating empowered women leaders.",
    specificBreakdown: "₹3,60,000 - Tuition fees for 100 students (₹3,600 each), ₹1,20,000 - Books and educational materials, ₹80,000 - Uniforms and school supplies, ₹40,000 - Career counseling and mentorship programs",
    impactOfContribution: "₹6,000 sponsors one complete year for one girl, ₹500/month provides ongoing support, ₹1,000 covers books for one student. Every contribution creates a ripple effect - an educated girl educates her family and community.",
    timeline: "Campaign: 45 days. Academic Year: June 2026 - March 2027. Impact: Lifelong transformation",
    beneficiaryInformation: "100 girl students from Classes 8-12 from economically disadvantaged backgrounds. Selection based on merit and need. Indirect beneficiaries: 100 families (500+ people)",
    mediaUrl: getImageByIndex(2),
    donateOption: "true",
    campaignUpdates: "Student applications received: 145. Selection committee formed. First batch of 50 students identified. Mentorship program partners confirmed.",
    shareOptions: "Share this campaign",
    endorsementsOrPartnerships: "Partnership with 15 schools. Endorsed by District Education Officer. Mentorship support from professional women's network.",
    isActive: true,
    campaignID: "CAM003"
  },
  {
    title: "Dignity for Elders - Senior Care Expansion",
    tagline: "Help us expand our elderly care home to accommodate 20 more senior citizens",
    goal: "Raise ₹10,00,000 to construct additional facilities and provide care for 20 more abandoned elderly persons",
    campaignStory: "We currently shelter 35 senior citizens who have nowhere else to go. Every week, we receive 3-4 requests from elderly individuals or concerned citizens about seniors abandoned by families. Our current facility is at full capacity, and we have a waiting list of 28 people. We have the land and the heart - we need your support to build the infrastructure.",
    specificBreakdown: "₹5,00,000 - Construction of additional residential wing (20 beds), ₹2,00,000 - Medical equipment and facilities, ₹1,50,000 - Furniture and essential amenities, ₹1,00,000 - First year operational costs, ₹50,000 - Emergency medical fund",
    impactOfContribution: "₹50,000 sponsors construction of one room, ₹10,000 provides medical equipment, ₹5,000 furnishes one bed, ₹2,000 provides monthly care for one elder. Your contribution provides dignity, care, and love to those who have none.",
    timeline: "Fundraising: 60 days. Construction: 90 days (Apr-Jun 2026). Occupancy: July 2026 onwards",
    beneficiaryInformation: "20 additional senior citizens (60+ years) without family support. Indirect benefit to existing 35 residents through better facilities.",
    mediaUrl: getImageByIndex(3),
    donateOption: "true",
    campaignUpdates: "Architectural plans approved. Land cleared and leveled. Building permissions obtained. Contractor finalized. Construction to begin upon 50% funding.",
    shareOptions: "Help spread the word",
    endorsementsOrPartnerships: "Licensed by Karnataka Social Welfare Department. Medical support from District Hospital. Endorsed by National Council for Senior Citizens.",
    isActive: true,
    campaignID: "CAM004"
  },
  {
    title: "Organic Farming Revolution - Pesticide-Free Food",
    tagline: "Support 150 farmers to transition to 100% organic farming",
    goal: "Raise ₹7,50,000 to train and support 150 farmers in transitioning from chemical to organic agriculture",
    campaignStory: "Chemical pesticides and fertilizers are killing our soil, polluting our water, and causing health problems. 150 motivated farmers want to switch to organic farming but need training, initial inputs, and certification support. This campaign will create a pesticide-free farming cluster producing healthy food while protecting our environment.",
    specificBreakdown: "₹3,00,000 - Organic farming training programs (₹2,000 per farmer), ₹2,00,000 - Organic inputs and seeds, ₹1,50,000 - Organic certification costs, ₹1,00,000 - Composting infrastructure, ₹1,00,000 - Market linkage and branding",
    impactOfContribution: "₹5,000 trains one farmer completely, ₹2,000 provides organic inputs for one season, ₹10,000 helps certify one farm as organic. Your support creates healthy food for thousands while protecting the environment.",
    timeline: "Training: Mar-Apr 2026. Kharif season implementation: Jun-Nov 2026. Certification: Jan 2027. First organic harvest: Nov 2026",
    beneficiaryInformation: "150 farmers (touching 750 family members). End consumers: 5,000+ people getting access to organic food. Environment: 300 acres of chemical-free land.",
    mediaUrl: getImageByIndex(4),
    donateOption: "true",
    campaignUpdates: "Farmer mobilization complete - 165 farmers registered. Training modules prepared. Organic input suppliers identified. Certification agency partnership confirmed.",
    shareOptions: "Share for healthy food",
    endorsementsOrPartnerships: "Technical support from Karnataka Agricultural University. Certification by Organic Farming Association of India. Market linkage with 5 organic food retail chains.",
    isActive: true,
    campaignID: "CAM005"
  },
  {
    title: "Preserve Our Heritage - Traditional Arts Revival",
    tagline: "Save 5 dying traditional art forms from extinction",
    goal: "Raise ₹4,00,000 to train 50 young artisans in endangered traditional arts and create sustainable livelihoods",
    campaignStory: "Karnataka's rich cultural heritage is vanishing. Traditional arts like Suggi Kunitha, Dollu Kunitha, and Lambani embroidery have less than 10 masters left alive. Young people don't learn these arts as there's no income. We've identified 50 passionate youth willing to learn, and aging masters willing to teach - we need funds to make it sustainable.",
    specificBreakdown: "₹1,50,000 - Stipend for 50 trainees for 6 months (₹500/month each), ₹1,00,000 - Guru dakshina and master artist fees, ₹80,000 - Raw materials and equipment, ₹40,000 - Documentation (video, photos), ₹30,000 - Marketing and exhibitions",
    impactOfContribution: "₹8,000 sponsors one trainee completely, ₹3,000 provides materials for one art form, ₹15,000 funds one master artist's teaching for 6 months. Your contribution preserves 1000+ years of cultural heritage.",
    timeline: "Recruitment: Feb 2026. Training: Mar-Aug 2026. First performances/exhibitions: Sep 2026. Sustainability: Ongoing through product sales",
    beneficiaryInformation: "50 young artisans (ages 18-30), 5 master artists, entire Karnataka cultural heritage. Indirect: Lakhs who will experience these art forms in future.",
    mediaUrl: getImageByIndex(5),
    donateOption: "true",
    campaignUpdates: "Master artists identified and committed. 62 youth applications received. Training center space confirmed. Documentation team assembled.",
    shareOptions: "Preserve our culture - share now",
    endorsementsOrPartnerships: "Recognized by Karnataka Folklore Academy. Partnership with Rangayana Theatre. Marketing support from Karnataka Tourism.",
    isActive: true,
    campaignID: "CAM006"
  },
  {
    title: "Vedic Gurukul - Scholarship Fund",
    tagline: "Sponsor holistic education for 25 underprivileged children",
    goal: "Raise ₹5,00,000 to provide one-year residential gurukul education for 25 deserving students",
    campaignStory: "Our Vedic Gurukul combines traditional wisdom with modern education, producing well-rounded individuals. However, 25 deserving students from poor families cannot afford the ₹20,000 annual fee. These children excel academically and show strong values - they just need financial support to access this transformative education.",
    specificBreakdown: "₹3,75,000 - Tuition and boarding for 25 students (₹15,000 each), ₹75,000 - Books, uniforms, and materials, ₹30,000 - Yoga and meditation programs, ₹20,000 - Cultural activities and field trips",
    impactOfContribution: "₹20,000 sponsors one complete year for one child, ₹1,700/month provides ongoing support, ₹3,000 covers books and materials. You're not just funding education - you're shaping future leaders with strong values.",
    timeline: "Campaign: 30 days. Academic year: June 2026 - May 2027. Impact: Lifelong character and values",
    beneficiaryInformation: "25 students (ages 10-16) from economically disadvantaged backgrounds. Selection: 60% merit, 40% need. Indirect: 25 families benefit from children's holistic development.",
    mediaUrl: getImageByIndex(6),
    donateOption: "true",
    campaignUpdates: "Student applications under review. Merit tests scheduled for Feb 15. Teacher recruitment for new batch complete. Infrastructure ready for 25 additional students.",
    shareOptions: "Share this unique opportunity",
    endorsementsOrPartnerships: "Affiliated with Karnataka Education Board. Yoga certification from Patanjali Yogpeeth. Endorsed by Sanskrit University.",
    isActive: true,
    campaignID: "CAM007"
  },
  {
    title: "Women Entrepreneurs - Micro Business Fund",
    tagline: "Empower 40 rural women to start their own businesses",
    goal: "Raise ₹6,00,000 to provide micro-loans and business training for 40 women entrepreneurs",
    campaignStory: "Trained in tailoring, handicrafts, and food processing, 40 women are ready to start their own businesses. Each needs ₹15,000 as seed capital - too small for banks, too large for them to save. With your support, we'll provide interest-free micro-loans, business training, and market linkages. In 18 months, they'll repay, and we'll help 40 more women.",
    specificBreakdown: "₹4,80,000 - Micro-loans for 40 women (₹12,000 each), ₹60,000 - Business development training, ₹30,000 - Marketing and branding support, ₹30,000 - Ongoing mentorship program",
    impactOfContribution: "₹15,000 helps one woman start her business, ₹3,000 provides business training to one entrepreneur, ₹5,000 supports marketing for one business. 100% revolving fund - money gets reused to help more women.",
    timeline: "Disbursement: Mar 2026. Business launch: Apr 2026. Repayment begins: Oct 2026. Next cycle: Apr 2027",
    beneficiaryInformation: "40 women entrepreneurs (25-45 years). Indirect: 40 families (200+ people) with improved income. Future: 40 more women every 18 months through revolving fund.",
    mediaUrl: getImageByIndex(7),
    donateOption: "true",
    campaignUpdates: "Women entrepreneurs selected and trained. Business plans developed and reviewed. SHG groups formed for peer support. Market survey completed.",
    shareOptions: "Empower women - share now",
    endorsementsOrPartnerships: "Partnership with Karnataka Skill Development Corporation. Mentorship by Women Entrepreneurs Association. Market linkage through local retail networks.",
    isActive: true,
    campaignID: "CAM008"
  },
  {
    title: "Mobile Health Clinic - Reach the Unreached",
    tagline: "Bring healthcare to 20 remote villages with no medical facilities",
    goal: "Raise ₹12,00,000 to operate 2 mobile health clinics for one year serving 10,000+ rural people",
    campaignStory: "20 villages, 4+ hours from any hospital. Pregnant women deliver at home. Children die from preventable diseases. Elderly suffer in pain. We have 2 fully-equipped mobile clinics ready, with committed doctors and nurses. We need funds for fuel, medicines, salaries, and operations to bring healthcare to these forgotten villages.",
    specificBreakdown: "₹4,80,000 - Doctor and nurse salaries (₹40,000/month), ₹3,00,000 - Medicines and medical supplies, ₹2,40,000 - Fuel and vehicle maintenance (₹20,000/month), ₹1,20,000 - Laboratory equipment and tests, ₹60,000 - Health awareness programs",
    impactOfContribution: "₹1,000 provides healthcare for one family for a month, ₹5,000 covers complete medical supplies for one village visit, ₹10,000 funds clinic operations for one week. You're literally saving lives.",
    timeline: "Operations: Mar 2026 - Feb 2027. Village visits: 2 days per week per clinic (104 visits total). Impact: Immediate and ongoing",
    beneficiaryInformation: "10,000+ people across 20 villages. Special focus: 500+ pregnant women, 1,200+ children under 5, 800+ elderly persons. Zero healthcare access otherwise.",
    mediaUrl: getImageByIndex(8),
    donateOption: "true",
    campaignUpdates: "2 vehicles equipped and ready. Medical team recruited. Village schedules finalized with panchayats. Drug licenses obtained. Waiting for funding to begin operations.",
    shareOptions: "Healthcare is a right - share this",
    endorsementsOrPartnerships: "Partnership with District Health Department. Medical supplies at subsidized rates from pharmaceutical companies. Technical support from District Hospital.",
    isActive: true,
    campaignID: "CAM009"
  },
  {
    title: "Plant 10,000 Trees - Green Karnataka Mission",
    tagline: "Be part of Karnataka's largest tree plantation drive",
    goal: "Raise ₹3,00,000 to plant, nurture, and maintain 10,000 trees across Dharwad district",
    campaignStory: "Climate change is real. Temperature is rising. Water is scarce. But the solution is simple - trees! We're mobilizing 50 villages, 30 schools, and urban communities to plant 10,000 native trees. But planting is just 10% - 90% is caring for them for 3 years. Your support funds saplings, guards, watering, and maintenance for 3 years ensuring 80%+ survival.",
    specificBreakdown: "₹1,50,000 - Saplings and planting (10,000 trees at ₹15 each), ₹80,000 - Tree guards and support structures, ₹50,000 - 3-year watering and maintenance, ₹20,000 - Awareness and community mobilization",
    impactOfContribution: "₹30 plants one tree with full care, ₹300 creates a mini-forest of 10 trees, ₹3,000 plants 100 trees. Every tree absorbs 22kg CO2 annually. Your contribution fights climate change directly.",
    timeline: "Plantation: Jun-Jul 2026 (monsoon). Maintenance: 3 years (Jun 2026 - Jun 2029). Full grown: 5 years (2031)",
    beneficiaryInformation: "Entire community - cleaner air for 50,000+ people. Direct involvement: 2,000 school children, 500 farmers. Environment: Habitat for birds, insects, animals.",
    mediaUrl: getImageByIndex(9),
    donateOption: "true",
    campaignUpdates: "Plantation sites identified - 50 villages, 30 schools, 5 urban areas. 2,500 saplings already procured. Community mobilization ongoing. Plantation begins June 1st.",
    shareOptions: "Plant trees, share hope",
    endorsementsOrPartnerships: "Partnership with Karnataka Forest Department. Technical support from Institute of Wood Science. Saplings from government nurseries at subsidized rates.",
    isActive: true,
    campaignID: "CAM010"
  }
];

// 10 Events Data
const eventsData = [
  {
    eventID: 1,
    title: "Annual Goshala Open Day",
    description: "Join us for a special day at our goshala where you can interact with our rescued cattle, learn about animal welfare, and participate in feeding activities. This is a perfect opportunity for families to teach children about compassion and care for animals. The day includes guided tours, educational talks by veterinarians, and hands-on experiences.",
    startDateTime: new Date("2026-02-15T09:00:00"),
    endDateTime: new Date("2026-02-15T17:00:00"),
    venue: "Banashree Foundation Goshala, Varur Village, Dharwad District, Karnataka",
    focusAreas: "Animal Welfare",
    targetAudience: "Families, School children, Animal lovers, Anyone interested in animal welfare",
    objectives: "To raise awareness about animal welfare, educate people about goshala operations, encourage community participation in animal care, generate support for abandoned cattle",
    impact: "Expected 300+ visitors will learn about animal welfare. Potential for 50+ new regular volunteers. Increased awareness about cattle rescue and care.",
    media: [getImageByIndex(10)],
    donateOption: true,
    pocDetails: "Contact: Rajesh Kumar, +91 98765 43210, Email: events@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  },
  {
    eventID: 2,
    title: "Water Conservation Workshop & Pond Visit",
    description: "An educational workshop on water conservation techniques followed by a field visit to our recently restored community pond. Participants will learn about rainwater harvesting, traditional water management systems, and sustainable water usage. The workshop includes presentations by water resource experts, interactive sessions, and practical demonstrations.",
    startDateTime: new Date("2026-02-28T10:00:00"),
    endDateTime: new Date("2026-02-28T16:00:00"),
    venue: "Community Center, Old Hubli (Workshop) followed by pond visit",
    focusAreas: "Water Conservation",
    targetAudience: "Farmers, Students, Environmental enthusiasts, Local community members, NGO workers",
    objectives: "To educate participants on water conservation methods, promote sustainable farming practices, demonstrate successful pond restoration, encourage community-led water management",
    impact: "50+ participants will gain practical knowledge. 20+ farmers expected to implement techniques. Increased community ownership of water resources.",
    media: [getImageByIndex(11)],
    donateOption: false,
    pocDetails: "Contact: Suresh Patil, +91 98765 43211, Email: water@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  },
  {
    eventID: 3,
    title: "Girl Education Success Stories - An Inspiring Evening",
    description: "A motivational event featuring testimonials from girls who have benefited from our scholarship program. Hear their inspiring journeys from struggling students to confident achievers. The evening includes cultural performances by the students, academic achievement awards, and interaction with mentors. This is an excellent opportunity for potential donors to see the real impact of their contributions.",
    startDateTime: new Date("2026-03-08T17:00:00"),
    endDateTime: new Date("2026-03-08T20:00:00"),
    venue: "Kalasagar Auditorium, Dharwad",
    focusAreas: "Education",
    targetAudience: "Donors, Potential sponsors, Parents, Students, Education policy makers, General public",
    objectives: "To showcase the success of scholarship program, motivate more girls to pursue education, attract new donors and sponsors, celebrate student achievements",
    impact: "Expected 200+ attendees. 30+ student performances. Potential for 50+ new scholarship sponsors. Strong community motivation for girl education.",
    media: [getImageByIndex(12)],
    donateOption: true,
    pocDetails: "Contact: Priya Sharma, +91 98765 43212, Email: education@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  },
  {
    eventID: 4,
    title: "Senior Citizens Wellness Camp",
    description: "A comprehensive health and wellness camp for senior citizens featuring free health check-ups, eye screening, dental check-up, yoga demonstrations, and nutritional counseling. Medical specialists will be available for consultations. This event also includes entertainment programs, social activities, and information sessions about our elderly care facilities.",
    startDateTime: new Date("2026-03-15T08:00:00"),
    endDateTime: new Date("2026-03-15T14:00:00"),
    venue: "Dignity Home for Senior Citizens, Dharwad & District Hospital premises",
    focusAreas: "Health & Wellness",
    targetAudience: "Senior citizens (60+ years), Their family members, Healthcare workers, Social workers",
    objectives: "To provide free health screening for 200+ elderly persons, offer health and nutrition guidance, create awareness about elderly care services, promote healthy aging",
    impact: "200+ seniors will receive health check-ups. Early detection of health issues. Improved awareness about elderly care. Strengthened community support network.",
    media: [getImageByIndex(13)],
    donateOption: true,
    pocDetails: "Contact: Dr. Manjunath, +91 98765 43213, Email: health@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  },
  {
    eventID: 5,
    title: "Organic Farming Field Day - From Farm to Fork",
    description: "Spend a day at our organic farming training center experiencing sustainable agriculture firsthand. The day includes farm tours, hands-on organic farming activities, composting demonstrations, natural pest control techniques, and a farm-fresh organic lunch. Experts will share insights on transitioning to organic farming and market opportunities.",
    startDateTime: new Date("2026-03-22T08:00:00"),
    endDateTime: new Date("2026-03-22T16:00:00"),
    venue: "Organic Farming Training Center, Kundagol Taluk, Dharwad District",
    focusAreas: "Environmental",
    targetAudience: "Farmers interested in organic farming, Agricultural students, Consumers interested in organic food, Environmental activists",
    objectives: "To demonstrate practical organic farming techniques, encourage farmers to adopt chemical-free agriculture, showcase successful organic farms, facilitate farmer-to-farmer learning",
    impact: "100+ farmers will gain practical exposure. Expected 30+ farmers to commit to organic transition. Increased demand for organic products. Healthier food chain.",
    media: [getImageByIndex(14)],
    donateOption: false,
    pocDetails: "Contact: Basavaraj Patil, +91 98765 43214, Email: organic@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  },
  {
    eventID: 6,
    title: "Cultural Heritage Festival - Celebrating Karnataka's Traditions",
    description: "A vibrant celebration of Karnataka's rich cultural heritage featuring traditional music, dance performances, handicraft exhibitions, folk art demonstrations, and local cuisine. The festival showcases rare art forms like Dollu Kunitha, Veeragase, and Lambani embroidery. Artists from across Karnataka will participate in this two-day extravaganza.",
    startDateTime: new Date("2026-04-05T10:00:00"),
    endDateTime: new Date("2026-04-06T20:00:00"),
    venue: "Cultural Heritage Center, Dharwad & Open Air Theater",
    focusAreas: "Community Building",
    targetAudience: "Art lovers, Cultural enthusiasts, Families, Students, Tourists, Traditional artists",
    objectives: "To preserve and promote traditional art forms, provide platform for traditional artists, educate younger generation about heritage, generate income for artisans through sales",
    impact: "Expected 5,000+ visitors over 2 days. 100+ artists will perform/exhibit. ₹2,00,000+ sales opportunity for artisans. Revival of interest in traditional arts.",
    media: [getImageByIndex(15)],
    donateOption: false,
    pocDetails: "Contact: Shilpa Rao, +91 98765 43215, Email: culture@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  },
  {
    eventID: 7,
    title: "Gurukul Open House & Parent Interaction",
    description: "An open house event at our Vedic Gurukul where prospective parents and students can experience the unique education system. The day includes classroom observations, interaction with current students and teachers, yoga and meditation sessions, traditional learning demonstrations, and detailed information about admissions and curriculum.",
    startDateTime: new Date("2026-04-12T09:00:00"),
    endDateTime: new Date("2026-04-12T15:00:00"),
    venue: "Vedic Gurukul Campus, Kundagol, Dharwad District",
    focusAreas: "Education",
    targetAudience: "Parents considering gurukul education, Students aged 10-16, Educators, Anyone interested in traditional education systems",
    objectives: "To introduce parents to gurukul education model, showcase student development and achievements, explain the blend of traditional and modern curriculum, facilitate admissions for new academic year",
    impact: "Expected 150+ parents and students. 30+ new admissions anticipated. Increased awareness about holistic education. Strengthened parent-teacher relationships.",
    media: [getImageByIndex(16)],
    donateOption: false,
    pocDetails: "Contact: Guruji Shankar, +91 98765 43216, Email: gurukul@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  },
  {
    eventID: 8,
    title: "Women Entrepreneurs Expo - Her Success, Our Pride",
    description: "An exhibition-cum-sale event featuring products made by women trained through our skill development programs. The expo includes handicrafts, textiles, food products, and home decor items. Women entrepreneurs will share their success stories, conduct live demonstrations, and sell their products. B2B meetings with retailers and bulk buyers will be organized.",
    startDateTime: new Date("2026-04-20T10:00:00"),
    endDateTime: new Date("2026-04-21T18:00:00"),
    venue: "HDMC Exhibition Grounds, Hubli",
    focusAreas: "Community Building",
    targetAudience: "Women entrepreneurs, Shoppers, Retailers, Bulk buyers, Women interested in entrepreneurship, SHG members",
    objectives: "To provide marketing platform for women entrepreneurs, generate sales and income, showcase successful women-led businesses, inspire more women to become entrepreneurs",
    impact: "80+ women entrepreneurs participating. Expected sales: ₹5,00,000+. 100+ new business contacts. Inspiration for 200+ aspiring women entrepreneurs.",
    media: [getImageByIndex(17)],
    donateOption: false,
    pocDetails: "Contact: Lakshmi Devi, +91 98765 43217, Email: women@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  },
  {
    eventID: 9,
    title: "Community Health Marathon - Run for Wellness",
    description: "A community marathon promoting health and wellness with 10K, 5K, and 3K categories. Participants include people of all ages running for various health causes. The event includes warm-up sessions, medical support, refreshment stations, and health awareness stalls. Proceeds support our mobile health clinic operations.",
    startDateTime: new Date("2026-05-01T05:30:00"),
    endDateTime: new Date("2026-05-01T10:00:00"),
    venue: "Starting from HDMC Office, Hubli - Route through city roads",
    focusAreas: "Health & Wellness",
    targetAudience: "Fitness enthusiasts, Students, Corporate teams, Families, Anyone interested in health and wellness",
    objectives: "To promote physical fitness and healthy lifestyle, raise funds for mobile health clinic, create awareness about rural healthcare needs, build community spirit through sport",
    impact: "Expected 1,000+ participants. ₹5,00,000+ raised for health clinics. Increased health consciousness. Community bonding through shared activity.",
    media: [getImageByIndex(18)],
    donateOption: true,
    pocDetails: "Contact: Ravi Kumar, +91 98765 43218, Email: marathon@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  },
  {
    eventID: 10,
    title: "Green Karnataka Day - Mass Tree Plantation",
    description: "Join thousands of volunteers in a massive tree plantation drive across 50 locations simultaneously. Participants will plant native tree species, learn about environmental conservation, and commit to nurturing their trees. The event includes environmental workshops, eco-friendly product stalls, and cultural programs celebrating nature.",
    startDateTime: new Date("2026-06-05T07:00:00"),
    endDateTime: new Date("2026-06-05T11:00:00"),
    venue: "50+ locations across Dharwad, Haveri, and Gadag districts (Check website for nearest location)",
    focusAreas: "Environmental",
    targetAudience: "Environment lovers, School and college students, Corporate CSR teams, Families, Local communities",
    objectives: "To plant 10,000 trees in one day, create environmental awareness, involve youth in green initiatives, combat climate change through community action",
    impact: "10,000 trees planted. 2,000+ volunteers participating. 50+ new green zones created. Massive awareness about environmental conservation.",
    media: [getImageByIndex(19)],
    donateOption: true,
    pocDetails: "Contact: Venkatesh Naik, +91 98765 43219, Email: green@banashreefoundation.org",
    createdBy: "Admin",
    active: true
  }
];

/**
 * Seed Database Function
 * 
 * Features:
 * - CLEARS all existing data before inserting (Programs, Projects, Campaigns, Events)
 * - Automatically loads images from the uploads folder
 * - Images are distributed using getImageByIndex() for deterministic assignment
 * - Fresh upload every time to ensure images are properly assigned
 */
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📁 Found ${availableImages.length} images in uploads folder`);

    // Clear existing data
    console.log('\n�️  Clearing existing data...');
    await Promise.all([
      Program.deleteMany({}),
      Project.deleteMany({}),
      Campaign.deleteMany({}),
      Event.deleteMany({})
    ]);
    console.log('✅ Existing data cleared');

    // Insert Programs
    console.log('\n📚 Inserting Programs...');
    const insertedPrograms = await Program.insertMany(programsData);
    console.log(`✅ Inserted ${insertedPrograms.length} programs`);

    // Upsert Projects (insert only if not exists based on projectName)
    console.log('\n📋 Inserting Projects...');
    const projectsWithProgramIds = projectsData.map(project => {
      const program = insertedPrograms.find(p => p.title.includes(project.program.split(' ').slice(0, 2).join(' ')));
      return {
        ...project,
        program: program ? program._id : insertedPrograms[0]._id
      };
    });
    const insertedProjects = await Project.insertMany(projectsWithProgramIds);
    console.log(`✅ Inserted ${insertedProjects.length} projects`);

    // Insert Campaigns
    console.log('\n🎯 Inserting Campaigns...');
    const insertedCampaigns = await Campaign.insertMany(campaignsData);
    console.log(`✅ Inserted ${insertedCampaigns.length} campaigns`);

    // Insert Events
    console.log('\n📅 Inserting Events...');
    const insertedEvents = await Event.insertMany(eventsData);
    console.log(`✅ Inserted ${insertedEvents.length} events`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✨ DATABASE SEEDING COMPLETED SUCCESSFULLY ✨');
    console.log('='.repeat(50));
    console.log(`Programs: ${insertedPrograms.length}`);
    console.log(`Projects: ${insertedProjects.length}`);
    console.log(`Campaigns: ${insertedCampaigns.length}`);
    console.log(`Events: ${insertedEvents.length}`);
    console.log(`Total Records: ${insertedPrograms.length + insertedProjects.length + insertedCampaigns.length + insertedEvents.length}`);
    console.log(`Images Available: ${availableImages.length}`);
    console.log('='.repeat(50));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
