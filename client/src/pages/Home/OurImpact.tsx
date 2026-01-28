import ImageWithFallback from "@/components/ImageWithFallback";
import { getOtherImage } from "@/utils/imageLoader";

const OurImpact = () => {
    // The provided JSON data for impact metrics
    const impactData = {
        "impactMetric": {
            "title": "Impact Metric",
            "metrics": [
                { "label": "Volunteers", "value": "800+" },
                { "label": "Education", "value": "1200" },
                { "label": "Animals supported", "value": "180" },
                { "label": "Community Support", "value": "400" },
                { "label": "Cisco Champions", "value": "13" },
                { "label": "Events Organized", "value": "25+" },
                { "label": "Students supported", "value": "600" },
                { "label": "Lives impacted", "value": "1300+" },
                { "label": "Projects Planned", "value": "2" }
            ]
        }
    };

    // Define an array of colors to cycle through for the impact circles
    const circleColors = [
        "bg-[#610000]", // Red
        "bg-[#D6A400]", // Yellow
        "bg-[#00AAA7]", // Teal
        "bg-[#4B4B4B]"  // Gray
    ];

    return (
        <>
            {/* Impact Section */}
            <section className="max-w-6xl mx-auto px-4 bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
                    {/* Images */}
                    <div className="flex gap-4 justify-center md:justify-start items-end">
                        <ImageWithFallback
                            src={getOtherImage('smallGirl')}
                            alt="Smiling girl large"
                            className="w-152 h-72 object-cover rounded"
                            fallbackType="placeholder"
                        />
                    </div>

                    {/* Text and Stats */}
                    <div>
                        <p className="text-[#8B1201] text-lg font-semibold mb-2">Our Impact</p>
                        <h2 className="text-4xl font-bold text-[#41402c] mb-4">We're making an impact</h2>
                        <p className="text-gray-700 mb-6">
                            Every action we take is driven by the desire to create a meaningful and lasting impact.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Dynamically render stats using map/forEach */}
                            {impactData.impactMetric.metrics.map((metric, index) => (
                                <div className="flex items-start gap-2" key={index}>
                                    <div className={`w-3 h-3 mt-1 rounded-full ${circleColors[index % circleColors.length]}`}></div>
                                    <div>
                                        <p className="text-xl font-bold text-[#41402c]">{metric.value}</p>
                                        <p className="text-sm text-gray-600">{metric.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default OurImpact;