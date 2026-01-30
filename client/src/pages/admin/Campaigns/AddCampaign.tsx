const AddCampaign = ({
  // title,
  formData,
  setFormData,
  errors,
  setErrors,
  programs = [],
  projects = [],
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: undefined }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "program" ? { project: "" } : {}),
    }));
  };

  return (
    <div className="w-full">
      <section className="mt-6">
        <form className="space-y-8">

          {/* ================= Campaign Name & Tagline ================= */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <label className="text-lg font-ciscosans-medium">
                Campaign Name*
              </label>
              <input
                className="border w-full h-10 px-3 mt-1"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleChange}
              />
              {errors.campaignName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.campaignName}
                </p>
              )}
              <p className="text-sm italic mt-1">
                e.g., Support Educational Needs for Shyam
              </p>
            </div>

            <div className="col-span-7">
              <label className="text-lg font-ciscosans-medium">
                Tag Line*
              </label>
              <input
                className="border w-full h-10 px-3 mt-1"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
              />
              {errors.tagline && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tagline}
                </p>
              )}
              <p className="text-sm italic mt-1">
                e.g., Empowering Shyam to achieve his dream of becoming a doctor
              </p>
            </div>
          </div>

          {/* ================= Program & Project ================= */}
         <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <label className="text-lg font-ciscosans-medium">
                Program*
              </label>
              <select
                className="border w-full h-10 px-3 mt-1 bg-white"
                name="program"
                value={formData.program}
                onChange={handleChange}
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program._id} value={program._id}>
                    {program.title}
                  </option>
                ))}
              </select>
              {errors.program && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.program}
                </p>
              )}
              <p className="text-sm italic mt-1">
                e.g., Animal Rescue and Welfare
              </p>
            </div>

            <div className="col-span-7">
              <label className="text-lg font-ciscosans-medium">
                Project (Optional)
              </label>
              <select
                className="border w-full h-10 px-3 mt-1 bg-white"
                name="project"
                value={formData.project}
                onChange={handleChange}
                disabled={!formData.program}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
              <p className="text-sm italic mt-1">
                e.g., Support planting of 100 trees
              </p>
            </div>
          </div>

          {/* ================= Dates & Time ================= */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <label>Start Date</label>
              <input type="date" className="border w-full h-10 px-2" name="startDate" onChange={handleChange} />
            </div>
            <div className="col-span-3">
              <label>Start Time</label>
              <input type="time" className="border w-full h-10 px-2" name="startTime" onChange={handleChange} />
            </div>
            <div className="col-span-3">
              <label>End Date</label>
              <input type="date" className="border w-full h-10 px-2" name="endDate" onChange={handleChange} />
            </div>
            <div className="col-span-3">
              <label>End Time</label>
              <input type="time" className="border w-full h-10 px-2" name="endTime" onChange={handleChange} />
            </div>
          </div>

          {/* ================= Description ================= */}
          <div>
            <label className="text-lg font-ciscosans-medium">
              Campaign Description*
            </label>
            <textarea
              className="border w-full p-3 mt-1"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* ================= Goal ================= */}
          <div>
            <label className="text-lg font-ciscosans-medium">
              Goal*
            </label>
            <input
              className="border w-full h-10 px-3"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
            />
            {errors.goal && (
              <p className="text-red-500 text-sm mt-1">
                {errors.goal}
              </p>
            )}
          </div>

          {/* ================= Story ================= */}
          <div>
            <label className="text-lg font-ciscosans-medium">
              Campaign Story*
            </label>
            <textarea className="border w-full p-3" rows={4} name="story" onChange={handleChange} />
          </div>

          {/* ================= Breakdown ================= */}
          <div>
            <label className="text-lg font-ciscosans-medium">
              Specific Breakdownc if any (20k for fees, 10k for uniform etc.,)*
            </label>
            <input className="border w-full h-10 px-3" name="breakdown" onChange={handleChange} />
          </div>

          {/* ================= Impact ================= */}
          <div>
            <label className="text-lg font-ciscosans-medium">
              Impact of Contribution*
            </label>
            <textarea className="border w-full p-3" rows={3} name="impact" onChange={handleChange} />
          </div>

          {/* ================= Timeline ================= */}
          <div>
            <label className="text-lg font-ciscosans-medium">
              Timeline*
            </label>
            <input className="border w-full h-10 px-3" name="timeline" onChange={handleChange} />
          </div>

          {/* ================= Beneficiary ================= */}
          <div>
            <label className="text-lg font-ciscosans-medium">
              Beneficiary Information*
            </label>
            <textarea className="border w-full p-3" rows={4} name="beneficiary" onChange={handleChange} />
          </div>

          {/* ================= Campaign Updates ================= */}
          <div>
            <label className="text-[18px] font-ciscosans-medium">
              Campaign Updates (Optional)
            </label>
            <input
              className="border w-full h-10 px-3 mt-1"
              name="campaignUpdates"
              value={formData.campaignUpdates}
              onChange={handleChange}
            />
          </div>

          {/* ================= Donate Option (CTA) ================= */}
          <div className="border p-4 rounded-md">
            <div className="text-[18px] font-ciscosans-medium mb-3">
              Donate option (Call to Action Details)*
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <label className="text-sm">Call to Action Name*</label>
                <input
                  className="border w-full h-10 px-3 mt-1"
                  name="ctaName"
                  value={formData.ctaName || "Donate"}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-8">
                <label className="text-sm">Link*</label>
                <input
                  className="border w-full h-10 px-3 mt-1"
                  name="ctaLink"
                  value={formData.ctaLink}
                  onChange={handleChange}
                />
                {errors.ctaLink && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ctaLink}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= Social Media Share ================= */}
          <div>
            <label className="text-[16px] font-ciscosans-medium block mb-2">
              Ability to share on Social Media?
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="socialShare" value="yes" checked={formData.socialShare === "yes"} onChange={handleChange} />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="socialShare" value="no" checked={formData.socialShare === "no"} onChange={handleChange} />
                No
              </label>
            </div>
          </div>

          {/* ================= Tax Benefit Toggle ================= */}
          <div>
            <label className="text-[16px] font-ciscosans-medium block mb-2">
              Do we need tax benefits and contact information details here?
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="radio" name="taxBenefit" value="yes" checked={formData.taxBenefit === "yes"} onChange={handleChange} />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="taxBenefit" value="no" checked={formData.taxBenefit === "no"} onChange={handleChange} />
                No
              </label>
            </div>
          </div>

          {/* ================= PAN & Address (Conditional) ================= */}
          {formData.taxBenefit === "yes" && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <label>Name as per PAN Card</label>
                <input className="border w-full h-10 px-3 mt-1" name="panName" value={formData.panName} onChange={handleChange} />
              </div>
              <div className="col-span-4">
                <label>PAN Number</label>
                <input className="border w-full h-10 px-3 mt-1" name="panNumber" value={formData.panNumber} onChange={handleChange} />
              </div>
              <div className="col-span-4">
                <label>Address</label>
                <input className="border w-full h-10 px-3 mt-1" name="address" value={formData.address} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* ================= Endorsement ================= */}
          <div>
            <label className="text-[18px] font-ciscosans-medium">
              Endorsement or Partnerships (Optional)
            </label>
            <textarea
              className="border w-full p-3 mt-1"
              rows={3}
              name="endorsement"
              value={formData.endorsement}
              onChange={handleChange}
            />
          </div>

        </form>
      </section>
    </div>
  );
};

export default AddCampaign;
