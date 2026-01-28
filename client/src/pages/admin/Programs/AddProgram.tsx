const AddProgram = ({ title, formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear the error for the specific field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div className="flex">
      <div className="flex-none w-full">
        <section className="header-section">
          <div className="w-full text-left font-poppins-medium text-[20px] tracking-normal text-[#334355]">
            {title}
          </div>
        </section>
        <section className="mt-[30px]">
          <form>
            <div className="h-[170px]">
              <div className="grid grid-cols-12 gap-4">
                {/* Left Section (5 columns) */}
                <div className="col-span-12 sm:col-span-5">
                  <div className="w-full h-[73px] flex-none">
                    <div className="text-[18px] text-left font-ciscosans-medium tracking-[0px] text-[#212529] opacity-100">
                      Title<sup>*</sup>
                    </div>
                    <div className="w-full h-[41px] relative top-[7px]">
                      <input
                        className="border border-[#B4B4B4] w-full pl-[15.76px] pt-[9px] pb-[7px] h-full"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                      {errors.title && (
                        <div className="text-red-500 mt-1">{errors.title}</div>
                      )}
                    </div>
                    <div className="mt-[27px] font-ciscosans-oblique text-[14px] w-full text-[#212529]">
                      Name of the Program (Animal Rescue, Water Conservation
                      etc.)
                    </div>
                  </div>
                </div>
                {/* Right Section (7 columns) */}
                <div className="col-span-12 sm:col-span-7">
                  <div className="w-full h-[73px] flex-none">
                    <div className="text-[18px] text-left font-ciscosans-medium tracking-normal text-[#212529] opacity-100">
                      Tag Line<sup>*</sup>
                    </div>
                    <div className="w-full h-[41px] relative top-[7px]">
                      <input
                        className="border border-[#B4B4B4] w-full pl-[15.76px] pt-[9px] pb-[7px] h-full"
                        type="text"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleChange}
                        required
                      />
                      {errors.tagline && (
                        <div className="text-red-500 mt-1">
                          {errors.tagline}
                        </div>
                      )}
                    </div>
                    <div className="mt-[27px] font-ciscosans-oblique text-[14px] w-full text-[#212529]">
                      Enter catchy one-liner that summarizes the initiative’s
                      goal or impact.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[170px]">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-12">
                  <div className="w-full flex-none">
                    <div className="text-[18px] text-left font-semibold tracking-normal text-[#212529] opacity-100 font-ciscosans-medium">
                      Description<sup>*</sup>
                    </div>
                    <div className="relative top-[7px]">
                      <textarea
                        className="border placeholder:text-[16px] placeholder:font-ciscosans-oblique
                      border-[#B4B4B4] w-full pl-[15.76px] pt-[9px] pb-[7px] text-[#212529] h-full"
                        name="detailedDescription"
                        value={formData.detailedDescription}
                        onChange={handleChange}
                        required
                        placeholder="Detailed explanation of what the initiative is about, its purpose, and its objectives.          
Include the background or context of why the initiative was started."
                      ></textarea>
                      {errors.detailedDescription && (
                        <div className="text-red-500 mt-1">
                          {errors.detailedDescription}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[150px]">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-12">
                  <div className="w-full flex-none">
                    <div className="text-[18px] text-left font-ciscosans-medium tracking-normal text-[#212529] opacity-100">
                      Goal<sup>*</sup>
                    </div>
                    <div className="relative h-[45px]">
                      <input
                        className="border border-[#B4B4B4] w-full pl-[15.76px] pt-[9px] pb-[7px] h-full opacity-100"
                        type="text"
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        required
                      />
                      {errors.goals && (
                        <div className="text-red-500 mt-1">{errors.goals}</div>
                      )}
                    </div>
                    <div className="mt-[27px] font-ciscosans-oblique text-[14px] w-[915px] text-[#212529]">
                      Specific goals or outcomes the initiative aims to achieve
                      (e.g., planting 10,000 trees, educating 500 children,
                      etc.).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[150px]">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-12">
                  <div className="w-full flex-none">
                    <div className="text-[18px] text-left font-ciscosans-medium tracking-normal text-[#212529] opacity-100">
                      Metrics/Statistics<sup>*</sup>
                    </div>
                    <div className="relative h-[45px]">
                      <input
                        className="border border-[#B4B4B4] w-full pl-[15.76px] pt-[9px] pb-[7px] h-full opacity-100"
                        type="text"
                        name="metrics"
                        value={formData.metrics}
                        onChange={handleChange}
                        required
                      />
                      {errors.metrics && (
                        <div className="text-red-500 mt-1">
                          {errors.metrics}
                        </div>
                      )}
                    </div>
                    <div className="mt-[27px] font-ciscosans-oblique text-[14px] w-[915px] text-[#212529]">
                      500 childern educated, 100 cows rescude
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[170px]">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-12">
                  <div className="w-full flex-none">
                    <div className="text-[18px] text-left font-semibold tracking-normal text-[#212529] opacity-100 font-ciscosans-medium">
                      Endorsement or Partnerships(some testimonial specific to
                      this campaigns) Optional
                    </div>
                    <div className="relative top-[7px]">
                      <textarea
                        className="border placeholder:text-[16px] placeholder:font-ciscosans-oblique
                      border-[#B4B4B4] w-full pl-[15.76px] pt-[9px] pb-[7px] text-[#212529] h-full"
                        name="endorsement"
                        value={formData.endorsement}
                        onChange={handleChange}
                        placeholder="Endorsement"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Additional code for file upload or other components can go here */}
          </form>
        </section>
      </div>
    </div>
  );
};

export default AddProgram;
