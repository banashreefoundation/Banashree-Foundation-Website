import ImageWithFallback from "@/components/ImageWithFallback";
import { getOtherImage } from "@/utils/imageLoader";
// import Image from 'next/image';
export default function Contribute() {
    // Main container for the entire component
    // Main container for the entire component
    return (
        <div className="w-full min-h-screen bg-pink-50 py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative overflow-hidden">
          {/* Decorative hearts - consistent with Contact.tsx */}
          <span className="absolute top-8 left-1/4 text-teal-400 text-4xl transform -rotate-12 select-none">♥</span>
          <span className="absolute top-1/3 right-1/4 text-red-400 text-3xl transform rotate-6 select-none">♥</span>
          <span className="absolute bottom-16 left-1/3 text-yellow-500 text-2xl transform rotate-45 select-none">♥</span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-300 text-8xl opacity-20 select-none">♥</span> {/* Larger, faded heart in the background */}
    
          {/* Heading */}
          <h1 className="text-5xl font-extrabold text-stone-800 mb-3 tracking-tight text-center z-10">
            How to <span className="text-yellow-600">Donate?</span>
          </h1>
          <p className="text-gray-700 text-base text-center max-w-2xl mb-12 z-10">
            Your contribution helps us make a meaningful impact. We accept donations from Indian contributors via cheque, bank transfer, or UPI.
          </p>
    
          {/* Donation Methods Grid */}
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full z-10">
            {/* Cheque / Demand Draft */}
            <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl border border-gray-200 bg-white"> {/* Replaced Card with div */}
              <div className="p-8"> {/* Replaced CardContent with div */}
                <h2 className="text-2xl font-bold text-stone-800 mb-6 border-b-2 border-yellow-500 pb-2">For Cheque / Demand Draft</h2> {/* Adjusted text color and added yellow border */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Make it in the name of <strong className="text-stone-800">BANASHREE FOUNDATION</strong> and send it along with your name, address, email ID, and contact number for the receipt to:
                </p>
                <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-lg border border-yellow-200"> {/* Changed bg-orange-50 to bg-yellow-50 */}
                  <span className="text-yellow-600 text-2xl flex-shrink-0">📍</span> {/* Using a unicode character for MapPin */}
                  <p className="text-gray-700 text-sm">
                    #205, Manoj Park, Sulla Road, Bengeri Extension, Hubballi-580023
                  </p>
                </div>
              </div>
            </div>
    
            {/* Bank Transfer */}
            <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl border border-gray-200 bg-white"> {/* Replaced Card with div */}
              <div className="p-8"> {/* Replaced CardContent with div */}
                <h2 className="text-2xl font-bold text-stone-800 mb-6 border-b-2 border-yellow-500 pb-2">For Direct Bank Transfer</h2> {/* Adjusted text color and added yellow border */}
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-200"><td className="py-3 px-4 font-medium bg-gray-50 w-1/3 text-gray-800">In Favour of</td><td className="px-4 text-gray-700">BANASHREE FOUNDATION</td></tr>
                      <tr className="border-b border-gray-200"><td className="py-3 px-4 font-medium bg-gray-50 text-gray-800">Bank Name</td><td className="px-4 text-gray-700">State Bank of India</td></tr>
                      <tr className="border-b border-gray-200"><td className="py-3 px-4 font-medium bg-gray-50 text-gray-800">Account Number</td><td className="px-4 text-gray-700">41166768092</td></tr>
                      <tr className="border-b border-gray-200"><td className="py-3 px-4 font-medium bg-gray-50 text-gray-800">Account Type</td><td className="px-4 text-gray-700">Current Account</td></tr>
                      <tr className="border-b border-gray-200"><td className="py-3 px-4 font-medium bg-gray-50 text-gray-800">Bank Address</td><td className="px-4 text-gray-700">Hubli Main Branch, Keshwapur, Hubballi-580023</td></tr>
                      <tr><td className="py-3 px-4 font-medium bg-gray-50 text-gray-800">IFSC Code</td><td className="px-4 text-gray-700">SBIN0000846</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
    
          {/* QR Code Section */}
          <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 mt-14 rounded-2xl border border-gray-200 bg-white max-w-lg w-full z-10"> {/* Replaced Card with div */}
            <div className="p-8 flex flex-col items-center"> {/* Replaced CardContent with div */}
              <h2 className="text-2xl font-bold text-stone-800 mb-6 border-b-2 border-yellow-500 pb-2 w-full text-center">Donate via QR Code</h2> {/* Adjusted text color and added yellow border */}
              <div className="text-center mb-6">
                <p className="text-gray-700 text-sm mb-1"><strong>Merchant Name:</strong> BANASHREE FOUNDATION</p>
                <p className="text-gray-700 text-sm"><strong>UPI ID:</strong> 41166768092@sbi</p>
              </div>
              <ImageWithFallback
                src={getOtherImage('barCode')}
                alt="Banashree QR Code"
                width={200}
                height={200}
                className="rounded-lg border border-gray-300 shadow-md"
                fallbackType="placeholder"
              />
              <p className="text-gray-600 text-xs mt-6 text-center">
                All contributions are exempted from tax u/s 80G of the Income Tax Act 1961.
              </p>
              <blockquote className="mt-3 italic text-sm text-yellow-700 text-center font-medium"> {/* Adjusted text color */}
                “We Can Change”
              </blockquote>
            </div>
          </div>
        </div>
      );
    
}