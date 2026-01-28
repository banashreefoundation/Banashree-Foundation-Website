// PartnersSection.tsx
import React from "react";
import { getEmpowermentImage } from "@/utils/imageLoader";

const partners = [
 getEmpowermentImage('woman'),
 getEmpowermentImage('health'),
 getEmpowermentImage('woman'),
 getEmpowermentImage('education'),
 getEmpowermentImage('health'),
 getEmpowermentImage('education')
];

export default function PartnersSection() {
  return (
    <section className="max-w-[1180px] mx-auto py-16 px-6">
      {/* Title */}
      <div className="mb-12">
        <div className="text-sm text-[#8f3f1a] uppercase font-medium mb-2">
         
        </div>
         <div  className="text-[#830f00] font-medium text-3xl mb-2 font-maku"
                style={{ fontFamily: "Maku, sans-serif" }} >
                     Our Partners In Change
                </div>

        <h2 className="text-[48px] font-semibold leading-tight text-[#3e3e2e]">
          Driving progress together—<br />
          because transformation starts with partnership.
        </h2>
      </div>

      {/* Logo grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {partners.map((src, i) => (
          <div
            key={i}
            className="flex items-center justify-center bg-white rounded-lg shadow-md h-32"
          >
            {/* Replace with <img> or inline svg as needed */}
            <img
              src={src}
              alt={`Company logo ${i + 1}`}
              className="max-h-16 object-contain opacity-60"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
