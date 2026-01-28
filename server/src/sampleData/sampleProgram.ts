import { Program } from '../model/programModel';

const newProgram = new Program({
    "title": "Animal Welfare and Rescue",
    "tagline": "Providing Care, Shelter, and Protection for Stray and Abandoned Animals",
    "detailedDescription": "A dedicated initiative focused on rescuing, rehabilitating, and providing lifelong care to abandoned, injured, and stray animals. We aim to create a compassionate society where animals are treated with kindness and respect.",
    "goals": [
        "Rescue and rehabilitate stray and abandoned animals",
        "Provide medical care and shelter",
        "Promote awareness about animal welfare",
        "Encourage responsible pet ownership"
    ],
    "media": {
        "images": ["goshala1.jpg", "goshala2.jpg"],
        "videos": ["goshala_intro.mp4"],
        "gallery": ["goshala_gallery1.jpg", "goshala_gallery2.jpg"]
    },
    "metrics": [
        "500+ animals rescued",
        "300+ successful adoptions",
        "1000+ community members educated on animal welfare"
    ],
    "projects": [
        {
            "name": "Goshala",
            "program": "Animal Welfare and Rescue",
            "initiative": "Animal Welfare and Rescue",
            "objective": "To provide a safe and nurturing environment for stray and abandoned cows.",
            "description": "Goshala is a shelter dedicated to rescuing and caring for abandoned and injured cows. We provide them with nutritious fodder, veterinary care, and a safe environment where they can live peacefully.",
            "beneficiaries": "Stray and abandoned cows in rural and urban areas.",
            "location": {
                "city": "Jaipur",
                "state": "Rajasthan"
            },
            "status": "In Progress",
            "key_activities": [
                "Rescue operations for injured and abandoned cows",
                "Regular veterinary check-ups and medical treatment",
                "Feeding and shelter maintenance"
            ],
            "expected_outcomes": [
                "Provide safe shelter for 200+ cows",
                "Ensure regular medical treatment for rescued cows",
                "Raise awareness about cow protection and welfare"
            ],
            "collaborating_partners": [
                "Local veterinary hospitals",
                "Animal welfare organizations"
            ],
            "gallery": [
                "goshala_shelter.jpg",
                "goshala_cows.jpg"
            ],
            "get_involved": "Volunteer with us to help feed and care for rescued cows!",
            "donate": "Support our initiative by contributing to the Goshala maintenance fund.",
            "campaign": {
                "title": "Fodder for Cow Campaign",
                "campaignID": "COW001",
                "isActive": true,
                "tagline": "Ensuring No Cow Goes Hungry",
                "goal": "Raise INR 100,000 to provide food and medical care for rescued cows.",
                "campaignStory": "Our Goshala provides shelter and medical care to abandoned and injured cows. Many of them arrive malnourished and in need of immediate care. We aim to raise INR 100,000 to ensure a steady supply of nutritious fodder, medicine, and essential care for these gentle beings.",
                "specificBreakdown": "- INR 50,000 for high-quality fodder for six months \n- INR 30,000 for medical treatment and vaccinations \n- INR 20,000 for shelter maintenance and caretakers",
                "impactOfContribution": "- Your donation ensures cows receive nutritious food and essential veterinary care. \n- Helps sustain a safe haven for rescued animals.",
                "timeline": "Goal: Raise INR 100,000 by March 31st to ensure uninterrupted fodder supply.",
                "beneficiaryInformation": "Goshala houses over 200 rescued cows who rely on community support for their well-being.",
                "mediaUrl": "fodder_campaign.jpg",
                "donateOption": true,
                "campaignUpdates": "- February 15th: We’ve raised 30% of the goal! Thank you to our generous supporters! \n- March 1st: New batch of fodder has been purchased thanks to your contributions!",
                "shareOptions": true,
                "endorsementsOrPartnerships": "- Testimonial: 'The Goshala has transformed the lives of countless cows. Your support is crucial in keeping them healthy and safe.' – Dr. Mehta, Veterinary Expert"
            }
        }
    ]
});

newProgram.save().then(() => console.log('Program Created'))
                   .catch(err => console.error('Error:', err));
