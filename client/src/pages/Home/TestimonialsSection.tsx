import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { getPublishedTestimonials } from "@/pages/admin/Common/testimonials";

// Default placeholder avatar
const defaultAvatar = "/images/avatar-placeholder.svg";

export default function TestimonialsSection() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [testimonials, setTestimonials] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTestimonials = async () => {
			try {
				const data = await getPublishedTestimonials();
				setTestimonials(data);
			} catch (error) {
				console.error("Error fetching testimonials:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTestimonials();
	}, []);

	const scroll = (dir: string) => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({
left: dir === "right" ? 360 : -360,
behavior: "smooth",
});
		}
	};

	return (
<section className="relative w-full bg-[#FFF1F1] overflow-hidden py-24">
			{/* Diagonal Red Background only behind cards */}
			<div className="absolute bottom-10 right-0 w-[50%] h-[350px]   bg-[repeating-linear-gradient(-45deg,#8B1201_0px,#8B1201_20px,#7a0e00_20px,#7a0e00_40px)] z-0" />

			<div className="relative z-10 max-w-[1440px] mx-auto px-6 flex items-start gap-10">
				{/* LEFT SECTION */}
				<div className="w-[40%] relative z-10">
					{/* Decorative Elements */}
					<div className="absolute -left-10 top-0 w-[60px] h-[60px] rounded-full bg-teal-500" />
					<div className="absolute left-0 top-[-40px] text-[180px] text-[#f7dcdc] font-bold leading-none select-none">"</div>

{/* Text Content */}
<p className="text-[#8B1201] font-handwriting text-xl mb-2 z-10 relative">Testimonials</p>
<h2 className="text-5xl font-bold text-[#41402c] z-10 relative">Trusted By People</h2>
</div>

{/* RIGHT SECTION */}
<div className="w-[55%] relative z-10">
{loading ? (
<div className="flex items-center justify-center h-[240px]">
<p className="text-gray-500">Loading testimonials...</p>
</div>
) : testimonials.length === 0 ? (
<div className="flex items-center justify-center h-[240px]">
<p className="text-gray-500">No testimonials available yet.</p>
</div>
) : (
<>
<div
ref={scrollRef}
className="flex gap-6 overflow-x-auto scroll-smooth pr-14 no-scrollbar"
>
								{testimonials.map((item: any, idx: number) => {
								const baseUrl = "http://localhost:4001"; // Server base URL
								const imageUrl = item.image 
									? `${baseUrl}${item.image}` 
									: defaultAvatar;
								
								return (
									<div
										key={item._id || idx}
										className="min-w-[322px] h-[240px] bg-white shadow-md rounded-xl p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
									>
										{/* Quote Icon */}
										<Quote className="absolute top-4 right-4 w-8 h-8 text-[#8B1201]/10 group-hover:text-[#8B1201]/20 transition-colors" />
										
										<div className="flex items-center gap-4 mb-4 relative z-10">
											<img
												src={imageUrl}
												alt={item.name}
												className="w-12 h-12 rounded-full border-2 border-[#8B1201] object-cover shadow-sm"
												onError={(e: any) => {
													// Fallback to default avatar if image fails to load
													e.target.src = defaultAvatar;
												}}
											/>
												<div>
													<p className="font-semibold text-[#41402c]">{item.name}</p>
													<p className="text-sm text-gray-500">{item.designation}</p>
												</div>
											</div>
											<p className="text-sm text-gray-600 leading-relaxed line-clamp-4 relative z-10">
												"{item.message}"
											</p>
										</div>
									);
								})}
</div>
{/* Arrows */}
<button
onClick={() => scroll("left")}
className="absolute left-0 top-[45%] transform -translate-y-1/2 bg-white p-2 rounded-full shadow z-20 hover:bg-gray-100 transition"
>
<ChevronLeft className="text-[#8B1201]" />
</button>
<button
onClick={() => scroll("right")}
className="absolute right-0 top-[45%] transform -translate-y-1/2 bg-white p-2 rounded-full shadow z-20 hover:bg-gray-100 transition"
>
<ChevronRight className="text-[#8B1201]" />
</button>
</>
)}
</div>
</div>
</section>
);
}
