import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageWithFallback from "@/components/ImageWithFallback";
import { getOtherImage } from "@/utils/imageLoader";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "./Modal"; // Adjust the path according to your structure
import { createVolunteer } from "../admin/Common/volunteer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the schema for validation using Zod
const volunteerSchema = z.object({
  personalDetails: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    location: z.string().min(1, "Location is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
  }),
  skillsAndInterests: z.object({
    skills: z.string().optional(),
    interests: z.string().optional(),
  }),

   volunteerTypeDetails: z.object({
    isAvailableForTravel: z.string().min(1, "Please select your availabity"),
    volunteerType: z.string().min(1, "Please select a volunteering type"),
  }),
    
  motivation: z
    .string()
    .min(10, "Motivation must be at least 10 characters long"),
  emergencyContactDetails: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    phoneNumber: z
      .string()
      .min(10, "Emergency contact number must be at least 10 digits"),
    relation: z.string().min(1, "Relation to you is required"),
  }),
  termConditionAndPermissionDetails: z.object({
    permission: z.boolean().refine((value) => value === true, {
      message: "You must agree to the permission statement",
    }),
    termcondition: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms and conditions",
    }),
  }),
});

const VolunteerSection = ({ onFormValid, defaultValues }: { onFormValid?: any; defaultValues?: any } = {}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(volunteerSchema),
    defaultValues: defaultValues || {},
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = form;

  useEffect(() => {
    if (onFormValid) {
      onFormValid({
        isValid: form.formState.isValid,
        handleSubmit: form.handleSubmit,
      });
    }
  }, [form.formState.isValid, form.handleSubmit, onFormValid]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

 const handleAddVolunteer = async (volunteerData: any) => {
    // Restructure the data to match the backend API expectations
  const formattedData = {
  "personalDetails.fullname": volunteerData.personalDetails.name ,
  "personalDetails.email": volunteerData?.personalDetails?.email,
  "personalDetails.phoneNumber": volunteerData?.personalDetails?.phone ?? "",
  "personalDetails.location": volunteerData?.personalDetails?.location ?? "",
  "personalDetails.city": volunteerData?.personalDetails?.city ?? "NA",
  "personalDetails.state": volunteerData?.personalDetails?.state ?? "NA",
  "personalDetails.availability": volunteerData?.personalDetails?.availability ?? "NA",

  "volunteerTypeDetails.volunteerType": volunteerData?.volunteerTypeDetails.volunteerType ?? "NA",
  "volunteerTypeDetails.isAvailableForTravel": volunteerData?.volunteerTypeDetails.isAvailableForTravel ?? "NA",

  "skillsAndInterestsDetails.skills": volunteerData?.skillsAndInterestsDetails?.skills ?? "NA",
  "skillsAndInterestsDetails.interests": volunteerData?.skillsAndInterestsDetails?.interests ?? "NA",

  "motivationDetails.objective": volunteerData.motivation,
  "motivationDetails.reasonForJoinBanashree": volunteerData?.motivationDetails?.reasonForJoinBanashree ?? "NA",
  "emergencyContactDetails.contactName": volunteerData?.emergencyContactDetails?.name ?? "",
  "emergencyContactDetails.phoneNumber": volunteerData?.emergencyContactDetails?.phoneNumber ?? "",
  "emergencyContactDetails.relation": volunteerData?.emergencyContactDetails?.relation ?? "",

  "termConditionAndPermissionDetails.permission": volunteerData?.termConditionAndPermissionDetails?.permission ?? false,
  "termConditionAndPermissionDetails.termcondition": volunteerData?.termConditionAndPermissionDetails?.termcondition ?? false,
};
    const response = await createVolunteer(formattedData);
    if (response) {
      toast.success("Volunteer created successfully.");
      handleCloseModal();
      form.reset(); // Resetting the form after successful submission
    } else {
      console.error("Failed to create the Volunteer.");
      toast.error("Failed to create the Volunteer.");
    }
  };

  const onSubmit = (data: any) => {
    handleAddVolunteer(data);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 bg-white relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 px-4 py-16 items-center">
        <div>
          <p className="text-[#8B1201] text-lg font-semibold mb-2">Join Us</p>
          <h1 className="text-4xl font-bold text-[#41402c] mb-4">
            Become a Volunteer
          </h1>
          <p className="text-[#41402c] font-medium text-lg mb-2">
            Your gift today can help to change a future life
          </p>
          <p className="text-gray-700 mb-6">
            Volunteering is a powerful way to make a difference in the lives of
            others while also gaining valuable experiences. By becoming a
            volunteer, you contribute your time, skills, and passion to support
            meaningful causes and uplift communities.
          </p>
          <button
            className="bg-[#8B1201] text-white px-6 py-2 rounded-md"
            onClick={handleOpenModal}
          >
            Join Us
          </button>
        </div>

        <div className="flex justify-center md:justify-end">
          <ImageWithFallback
            src={getOtherImage('boyHands')}
            alt="Volunteer"
            className="w-full max-w-md object-contain"
            fallbackType="placeholder"
          />
        </div>
      </div>

      {/* Modal for the Form */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <section>
          <div
            className="text-lg font-extrabold"
            style={{ fontFamily: "CiscoSans-Medium" }}
          >
            Volunteer for Banashree Foundation’s Initiatives
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
            {/* Personal Details */}
            <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-4">
              <legend className="text-base font-thin">Personal Details</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1" htmlFor="name">
                    Name *
                  </label>
                  <input
                    {...register("personalDetails.name")}
                    className="w-full border rounded-md p-2"
                    placeholder="Your Name"
                  />
                  {errors.personalDetails?.name && (
                    <span className="text-red-500">
                      {errors.personalDetails.name.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-1" htmlFor="email">
                    Email *
                  </label>
                  <input
                    {...register("personalDetails.email")}
                    className="w-full border rounded-md p-2"
                    placeholder="Your Email"
                    type="email"
                  />
                  {errors.personalDetails?.email && (
                    <span className="text-red-500">
                      {errors.personalDetails.email.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-1" htmlFor="phone">
                    Phone *
                  </label>
                  <input
                    {...register("personalDetails.phone")}
                    className="w-full border rounded-md p-2"
                    placeholder="Your Phone Number"
                    type="tel"
                  />
                  {errors.personalDetails?.phone && (
                    <span className="text-red-500">
                      {errors.personalDetails.phone.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-1" htmlFor="location">
                    Location *
                  </label>
                  <input
                    {...register("personalDetails.location")}
                    className="w-full border rounded-md p-2"
                    placeholder="Your Location"
                  />
                  {errors.personalDetails?.location && (
                    <span className="text-red-500">
                      {errors.personalDetails.location.message}
                    </span>
                  )}
                </div>
                  <div>
                  <label className="block mb-1" htmlFor="city">
                    City *
                  </label>
                  <input
                    {...register("personalDetails.city")}
                    className="w-full border rounded-md p-2"
                    placeholder="Your City"
                  />
                  {errors.personalDetails?.city && (
                    <span className="text-red-500">
                      {errors.personalDetails.city.message}
                    </span>
                  )}
                </div>

                  <div>
                  <label className="block mb-1" htmlFor="state">
                    State *
                  </label>
                  <input
                    {...register("personalDetails.state")}
                    className="w-full border rounded-md p-2"
                    placeholder="Your state"
                  />
                  {errors.personalDetails?.state && (
                    <span className="text-red-500">
                      {errors.personalDetails.state.message}
                    </span>
                  )}
                </div>
                
                
              </div>
            </fieldset>

            {/* Skills and Interests */}
            <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-4">
              <legend className="text-base font-thin">
                Skills and Interests
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1" htmlFor="skills">
                    Skills
                  </label>
                  <input
                    {...register("skillsAndInterests.skills")}
                    className="w-full border rounded-md p-2"
                    placeholder="Your Skills"
                  />
                  {errors.skillsAndInterests?.skills && (
                    <span className="text-red-500">
                      {errors.skillsAndInterests.skills.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-1" htmlFor="interests">
                    Interests
                  </label>
                  <input
                    {...register("skillsAndInterests.interests")}
                    className="w-full border rounded-md p-2"
                    placeholder="Your Interests"
                  />
                  {errors.skillsAndInterests?.interests && (
                    <span className="text-red-500">
                      {errors.skillsAndInterests.interests.message}
                    </span>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Preferred Type of Volunteering */}
           <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-4">
            <legend className="text-base font-thin">
              Preferred Type of Volunteering
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-1"
                  htmlFor="volunteerTypeDetails.volunteerType"
                >
                  Select Preferred Volunteering Format *
                </label>
                <select
                  {...register("volunteerTypeDetails.volunteerType")}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select...</option>
                  <option value="Virtual">Virtual</option>
                  <option value="In-Person">In Person</option>
                </select>
                {errors.volunteerTypeDetails?.volunteerType && (
                  <span className="text-red-500">
                    {errors.volunteerTypeDetails.volunteerType.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  className="block mb-1"
                  htmlFor="volunteerTypeDetails.isAvailableForTravel"
                >
                  Are you available for travel? *
                </label>
                <select
                  {...register("volunteerTypeDetails.isAvailableForTravel")}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.volunteerTypeDetails?.isAvailableForTravel && (
                  <span className="text-red-500">
                    {errors.volunteerTypeDetails.isAvailableForTravel.message}
                  </span>
                )}
              </div>
            </div>
          </fieldset>


            {/* Motivation */}
            <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-4">
              <legend className="text-base font-thin">Motivation</legend>
              <div>
                <label className="block mb-1" htmlFor="motivation">
                  Your Motivation *
                </label>
                <textarea
                  {...register("motivation")}
                  className="w-full border rounded-md p-2"
                  rows="4"
                  placeholder="Why do you want to volunteer?"
                ></textarea>

                {errors.motivation && (
                  <span className="text-red-500">
                    {errors.motivation.message}
                  </span>
                )}
              </div>
            </fieldset>

            {/* Emergency Contact Details */}
            <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-4">
              <legend className="text-base font-thin">
                Emergency Contact Details
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1" htmlFor="emergencyContactName">
                    Emergency Contact Name *
                  </label>
                  <input
                    {...register("emergencyContactDetails.name")}
                    className="w-full border rounded-md p-2"
                    placeholder="Emergency Contact Name"
                  />
                  {errors.emergencyContactDetails?.name && (
                    <span className="text-red-500">
                      {errors.emergencyContactDetails.name.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-1" htmlFor="emergencyContactPhone">
                    Emergency Contact Phone *
                  </label>
                  <input
                    {...register("emergencyContactDetails.phoneNumber")}
                    className="w-full border rounded-md p-2"
                    placeholder="Emergency Contact Phone Number"
                    type="tel"
                  />
                  {errors.emergencyContactDetails?.phoneNumber && (
                    <span className="text-red-500">
                      {errors.emergencyContactDetails.phoneNumber.message}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    className="block mb-1"
                    htmlFor="emergencyContactRelation"
                  >
                    Relation to You *
                  </label>
                  <input
                    {...register("emergencyContactDetails.relation")}
                    className="w-full border rounded-md p-2"
                    placeholder="Relation"
                  />
                  {errors.emergencyContactDetails?.relation && (
                    <span className="text-red-500">
                      {errors.emergencyContactDetails.relation.message}
                    </span>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Terms and Conditions */}
            <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-4">
              <legend className="text-base font-thin">
                Terms and Conditions
              </legend>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  {...register("termConditionAndPermissionDetails.permission")}
                  className="mr-2"
                />
                <span>I agree to the permission statement *</span>
              </div>
              {errors.termConditionAndPermissionDetails?.permission && (
                <span className="text-red-500">
                  {errors.termConditionAndPermissionDetails.permission.message}
                </span>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register(
                    "termConditionAndPermissionDetails.termcondition"
                  )}
                  className="mr-2"
                />
                <span>I agree to the terms and conditions *</span>
              </div>
              {errors.termConditionAndPermissionDetails?.termcondition && (
                <span className="text-red-500">
                  {
                    errors.termConditionAndPermissionDetails.termcondition
                      .message
                  }
                </span>
              )}
            </fieldset>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="bg-[#8B1201] text-white px-6 py-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </section>
      </Modal>
       <ToastContainer />
    </section>
  );
};

// Export the component
export default VolunteerSection;

