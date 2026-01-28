import { useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, HandCoins } from "lucide-react";
import './custom.scss';
import { getDynamicContent } from "./dynamicContent"; 
 
export default function ProgramsSection() {
	const dynamicContent = useMemo(() => getDynamicContent(), []);
	const scrollRef = useRef(null);

	const scroll = (direction) => {
		if (!scrollRef.current) return;
		const container = scrollRef.current;
		const scrollAmount = container.offsetWidth;
		container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
	};

	return (
		<section className="w-full relative">
			<h3 className="text-xl font-semibold text-center mb-3 mt-6 text-[#1c1c1c]">
				Upcoming Programs, Projects, Campaigns and Events...
			</h3>

			{/* Arrow Buttons */}
			<button
				onClick={() => scroll("left")}
				className="absolute z-30 left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
			>
				<ChevronLeft className="w-6 h-6 text-[#830f00]" />
			</button>
			<button
				onClick={() => scroll("right")}
				className="absolute z-30 right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
			>
				<ChevronRight className="w-6 h-6 text-[#830f00]" />
			</button>

			{/* Scrollable Cards */}
			<div
				ref={scrollRef}
				className="flex w-full overflow-x-auto no-scrollbar scroll-smooth"
				style={{ scrollSnapType: "x mandatory" }}
			>
				{dynamicContent.programsResp.map((program) => (
					<div key={program.id} className="w-1/3 flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
						<Card
							className={`h-full  p-12 rounded-none shadow-none ${program.textColor}`}
							style={{
								backgroundImage: `url('${program.image}')`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								backgroundBlendMode: "multiply"
							}}
						>
							{program.icon}
							<h4 className="text-xl font-bold">{program.title}</h4>
							<div className="flex flex-wrap gap-2 mt-4 items-center">
								<div className="flex items-center gap-1">
									<HandCoins className="w-4 h-4" />
									<span>Contribute Us</span>
								</div>
								<div className="flex items-center gap-1 p-3">
									<HandCoins className="w-4 h-4" />
									<span>Become A Volunteer</span>
								</div>
							</div>
						</Card>
					</div>
				))}
			</div>
		</section>
	);
}
