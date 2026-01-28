import { getOtherImage } from "@/utils/imageLoader";
import { useMemo } from "react";

export default function NewsSection() {
  // Call getOtherImage inside component so it runs after cache is loaded
  const newsItems = useMemo(() => [
    {
      img: getOtherImage('hubliNews'),
      excerpt:
        "Cisco Volunteers Join Hands with Banashree Foundation for Vanamahotsava Plantation Drive....",
      href: "#",
    }
  ], []);

  return (
    <section className="bg-[#7f1d1d] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">

         <div  className="text-white font-medium text-3xl mb-8 font-maku"
                style={{ fontFamily: "Maku, sans-serif" }} >
                    Banashree In The News
                </div>

        <div className="flex gap-6 overflow-x-auto pb-6 -mx-2">
          {newsItems.map((n, i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-white rounded-2xl shadow-lg w-[350px] h-[320px] p-0"
              style={{ position: "relative" }}
            >
              <div className="overflow-hidden rounded-t-2xl h-[180px]"> 
                <img
                  src={n.img}
                  alt={`news-${i}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-5 flex flex-col justify-between h-[calc(100%-250px)]">
                <p className="text-sm text-gray-800 flex-1">{n.excerpt}</p>
                <a
                  href={n.href}
                  className="mt-4 inline-block text-[#7f1d1d] font-medium"
                >
                  Read More &gt;&gt;
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="flex justify-center mt-6">
          <a
            href="#"
            className="bg-white text-black px-8 py-3 rounded-xl shadow-md font-medium hover:shadow-lg transition"
          >
            Read All
          </a>
        </div> */}
      </div>
    </section>
  );
}
