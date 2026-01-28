// landingContent.js

import { getBackgroundImage, getLogoImage, getProgramImage, getProjectImage } from "@/utils/imageLoader";

import {
	GraduationCap,
	Stethoscope,
	Utensils,
} from "lucide-react";

// Export as a function to be called after image cache is loaded
export const getDynamicContent = () => ({
	hero: {
		bgColor: "#ede6e6",
		headline: "Your Thought of Helping\nMight Lighten the\nBurden of Another !",
		subtext: "Need Help..",
		contributeText: "Contribute",
		discoverText: "Discover Us",
		backgroundImages: {
			rectBg: getBackgroundImage('rectBg'),
			groupBg: getBackgroundImage('groupBg'),
			childrenImg: getBackgroundImage('children')
		}
	},
	navLinks: [
		{ to: "#home", label: "Home", id: "home"  ,active: true },
		{ to: "#about", label: "About Us", id: "about" },
		{ to: "#programs", label: "Programs", id: "programs" },
		{ to: "#projects", label: "Projects", id: "projects" },
		// { to: "#volunteer", label: "Volunteer", id: "volunteer" },
		{ to: "#events", label: "Events", id: "events" },
		{ to: "#campaigns", label: "Campaigns", id: "campaigns" },
		{ to: "#contactUs", label: "Contact Us", id: "contactUs" }
	],
	logo: getLogoImage('main'),
	aboutData: {
	heading: "Transforming Communities, Inspiring Lives",
	subHeading: "About Us",
	 "Our Vision": "At Banashree foundation, we aspire to build a society where all animals are treated with compassion and respect, farmers are empowered to thrive sustainably, the elderly and orphans receive love and care, and communities are strengthened through cultural and social upliftment.",
     "Our Mission": "We endeavor to create a nurturing and protective environment for those in need by providing lifetime shelter and healthcare, imparting education and awareness, and building a sense of community. Our goal is to overcome socio-economic barriers and foster a world where every individual is respected and enriched.",
	description:`Banashree Foundation established in 2022 is a dedicated and passionate non-profit organization committed to making a positive and lasting impact on society. We embrace kindness, respect, compassion, awareness, integrity, and aim to address key issues and promote holistic development across various sectors.
\n\n At Banashree Foundation, we believe in the inherent worth and dignity of every living being. We work tirelessly to ensure the well-being and rights of animals, providing them with a safe haven and advocating for their protection. We firmly believe that, together, we can create a compassionate society through our vision.
\n\n We trust that our values, decisions, conduct, and behavior will be a model for others in their care and treatment of animals. We hope you join us on our journey towards building a better and more harmonious world for all.`,
	videoUrl: "https://www.youtube.com/embed/Hw25Q3S91XY?si=XTIR8Jy6FVq_2fRR",
},
programsData: [
	{
		img: getProgramImage('animalWelfare'),
		title: "Animal Welfare And Rescue11",
		description: "Rescue and rehabilitate 500 animals annually and set up 10 permanent water/food stations for strays.",
	},
	{
		img: getProgramImage('elderCare'),
		title: "Elderly Care",
		description: "Support 100+ elderly individuals monthly through health, ration, and companionship initiatives.",
	},
	{
		img: getProgramImage('waterConservation'),
		title: "Water Conservation",
		description: "Revive 2 water bodies annually and train 500 farmers on water-efficient practices.",
	},
	{
		img: getProgramImage('childCare'),
		title: "Child Care And Education",
		description: "Support 1000 students annually through scholarships, kits, and mentoring.",
	},
	{
		img: getProgramImage('farmerEmpowerment'),
		title: "Farmer Empowerment",
		description: "Train 500 farmers annually, create 2 model farms and improve livelihoods in 3 villages.",
	},
	{
		img: getProgramImage('communityBuilding'),
		title: "Community Building, Cultural & Social Upliftment",
		description: "Conduct 10 community events annually, engage 1000+ villagers in development efforts.",
	},
],
projectsData: [
	{
		img: getProjectImage('goshala'),
		title: "Goshala Development Project",
		description: "To provide a safe, nurturing, and permanent shelter for rescued cows, ensuring their well-being through proper care, nutrition, and veterinary support.",
	},
	{
		img: getProjectImage('waterProject'),
		title: "Ecological Lake Creation Initiative",
		description: "To create a man-made lake that enhances groundwater recharge, prevents seasonal flooding, supports 50+ acres of farmland, and fosters biodiversity by serving as a habitat for local wildlife and Goshala animals.",
	},
],
programsResp: [
	{
		id: "education",
		title: "Education Projects in India",
		icon: <GraduationCap className="h-8 w-8 mb-2" />,
		bgColor: "#09AC8E",
		image: getBackgroundImage('greenBg'),
		textColor: "text-white",
	},
	{
		id: "health",
		title: "Health Access for Refugees Programme",
		icon: <Stethoscope className="h-8 w-8 mb-2" />,
		bgColor: "#8C1201",
		image: getBackgroundImage('redBg'),
		textColor: "text-white",
	},
	{
		id: "food",
		title: "Food Assistance for Refugees",
		icon: <Utensils className="h-8 w-8 mb-2" />,
		bgColor: "#D09C1F",
		image: getBackgroundImage('orangeBg'),
		textColor: "text-white",
	},
	{
		id: "education1",
		title: "Education Projects in India",
		icon: <GraduationCap className="h-8 w-8 mb-2" />,
		bgColor: "#09AC8E",
		image: getBackgroundImage('greenBg'),
		textColor: "text-white",
	},
	{
		id: "health1",
		title: "Health Access for Refugees Programme",
		icon: <Stethoscope className="h-8 w-8 mb-2" />,
		bgColor: "#8C1201",
		image: getBackgroundImage('redBg'),
		textColor: "text-white",
	},
	{
		id: "food1",
		title: "Food Assistance for Refugees",
		icon: <Utensils className="h-8 w-8 mb-2" />,
		bgColor: "#D09C1F",
		image: getBackgroundImage('orangeBg'),
		textColor: "text-white",
	},
	{
		id: "education2",
		title: "Education Projects in India",
		icon: <GraduationCap className="h-8 w-8 mb-2" />,
		bgColor: "#09AC8E",
		image: getBackgroundImage('greenBg'),
		textColor: "text-white",
	},
	{
		id: "health2",
		title: "Health Access for Refugees Programme",
		icon: <Stethoscope className="h-8 w-8 mb-2" />,
		bgColor: "#8C1201",
		image: getBackgroundImage('redBg'),
		textColor: "text-white",
	},
	{
		id: "food2",
		title: "Food Assistance for Refugees",
		icon: <Utensils className="h-8 w-8 mb-2" />,
		bgColor: "#D09C1F",
		image: getBackgroundImage('orangeBg'),
		textColor: "text-white",
	}
]
});
  