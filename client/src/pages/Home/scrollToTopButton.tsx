// ScrollToTopButton.jsx
import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			setVisible(window.scrollY > 300);
		};
		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	return visible ? (
		<button
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			className="fixed bottom-4 right-4 bg-[#830f00] text-white p-2 rounded-full shadow"
		>
			↑ Top
		</button>
	) : null;
}
