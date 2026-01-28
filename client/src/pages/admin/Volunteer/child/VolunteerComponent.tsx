// import "./program.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const personalDetailsSchema = z.object({
  fullname: z.string().min(5, {message:"Full name must be at least 5 characters"}),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().regex(phoneRegex, "Invalid Phone Number!"),
  location: z.string().min(5, "Full name must be at least 5 characters"),
  city: z.string().min(5, "Full name must be at least 5 characters"),
  state: z.string().min(5, "Full name must be at least 5 characters"),
  availability: z.string().min(1, "Please select an email to display."),
})

const skillsAndInterestsDetailsSchema = z.object({
  interests: z.string().min(5, {message:"Interest must be at least 5 characters"}),
  skills: z.string().min(5, {message:"Skills must be at least 5 characters"}),
})

const volunteerTypeDetailsSchema = z.object({
  volunteerType: z.string().min(1, "Please select an volunteer type to display."),
  isAvailableForTravel: z.string().min(1, "Please select an option for available for travel.")
})

const motivationDetailsSchema = z.object({
  reasonForJoinBanashree: z.string().min(10, {message:"Reason must be at least 10 characters"}),
  objective: z.string().min(10, {message:"Objective must be at least 10 characters"})
})

const emergencyContactDetailsSchema = z.object({
  contactName: z.string().min(2, {message:"Name must be at least 2 characters"}),
  phoneNumber: z.string().min(10, {message:"Phone Number must be at least 10 characters"}),
  relation: z.string().min(2, {message:"Relation must be at least 2 characters"})
})

const volunteerSchema = z.object({
  personalDetails: personalDetailsSchema,
  skillsAndInterestsDetails: skillsAndInterestsDetailsSchema,
  volunteerTypeDetails:volunteerTypeDetailsSchema,
  motivationDetails: motivationDetailsSchema,
  emergencyContactDetails: emergencyContactDetailsSchema,
  termConditionAndPermissionDetails: z.object ({
    permission: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
    termcondition: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    })
  })
  // typeofVolunteerDetails: z.object({}),
  // motivationDetails: z.object({}),
  // emergencyContactDetails: z.object({}),
  // volunteerAgreementDetails: z.object({
  //   isPermissionSet: z.boolean(),
  //   isGuidelineAgreed: z.boolean()
  // })
});

type volunteerFormData = z.infer<typeof volunteerSchema>;

const VolunteerComponent = ({ title, actionType, onFormValid, onSubmit, setFormState, defaultValues }) => {
  const [isReadonly, setIsReadOnly] = useState(() => actionType === "view" ? true : false)
  const [isViewProfile, setIsViewProfile] = useState(() => actionType === "view" || actionType === "edit" ? true : false)
  const [image, setImage] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  
  const form = useForm<volunteerFormData>({
    "mode": 'onChange',
    "resolver": zodResolver(volunteerSchema),
    "defaultValues": defaultValues,
  });

  const { handleSubmit, formState: {errors, isValid}} = form

 useEffect(() => {
  setFormState({ isValid: form.formState.isValid, handleSubmit: form.handleSubmit })
 }, [isValid, onFormValid, setFormState])

  const legendStyle = {
    textAlign: "left",
    
    fontWeight: "600",
    letterSpacing: "0px",
    color: "#212529",
    opacity: 1,
    fontSize: "19px",
  };

  const labelStyle = {
    textAlign: "left",
    fontFamily: "CiscoSans-Medium",
    fontWeight: "600",
    letterSpacing: "0px",
    color: "#212529",
    opacity: 1,
    fontSize: "16px",
  };

  const InputStyle = {
    fontFamily: "CiscoSans-Medium",
    fontWeight: "600",
    letterSpacing: "0px",
    color: "#212529",
    opacity: 1,
    borderRadius: "2px",
    border: "1px solid #B4B4B4",
    paddingLeft: "15px",
    paddingRight: "15px",
    fontSize: "15px",
    height: "42px",
  };
  return (
    <div className="flex container">
      <div className="flex-none w-full">
        <section >
          <div className="text-lg font-extrabold" style={{fontFamily: "CiscoSans-Medium"}}>{title}</div>
        </section>
        <section className="form-section">
          {isViewProfile && <div className="relative" >
            <AspectRatio ratio={16 / 2}>
              <img
                src="/images/user_background.png"
                alt="Image"
                className=" w-full rounded-md object-cover"
              />
            </AspectRatio>
            <div className="absolute -bottom-6 left-12" onMouseEnter={() => !isReadonly && setHover(true)} onMouseLeave={() => !isReadonly && setHover(false)}>
              <Avatar className="h-36 w-36">
                {/* <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                /> */}
                <AvatarFallback>{defaultValues.personalDetails.fullname.split(' ').map((word: string) => word.charAt(0).toUpperCase()).join('')}</AvatarFallback>
              </Avatar>
              {hover && (
        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer">
          {/* <Upload className="text-white w-6 h-6 block" /> */}
          <div className="text-xs text-white">Upload Profile Image</div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            // onChange={handleImageUpload}
          />
        </label>
      )}
            </div>
          </div>}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
              <fieldset className="border-2 border-gray-200 p-4 rounded-md">
                <legend className="text-base font-thin" style={legendStyle}>
                  Personal Details
                </legend>
                <div className="flex w-full flex-row items-center mb-8 ">
                  <div className="w-1/4 ml-6 mr-6 min-h-[70px]">
                    <FormField
                      control={form.control}
                      name="personalDetails.fullname"
                      
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>Full Name *</FormLabel>
                          <FormControl >
                            <Input
                              disabled = {isReadonly}
                              style={InputStyle}
                              placeholder="Fullname"
                              
                              className="data-[disabled]:opacity-50 opacity-25"
                              {...field}
                            />
                          </FormControl>
                          {errors && <FormMessage />}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/4 ml-6 mr-6 min-h-[70px]">
                    <FormField
                      control={form.control}
                      name="personalDetails.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Email Address *
                          </FormLabel>
                          <FormControl >
                            <Input
                              style={InputStyle}
                              placeholder="Email"
                              disabled= {isReadonly}
                              {...field}
                            />
                          </FormControl>
                          {errors && <FormMessage />}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/4 ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="personalDetails.phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Phone Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="Phone Number"
                              disabled= {isReadonly}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-72 ml-6 mr-6">
                  <FormField
                      control={form.control}
                      name="personalDetails.availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Active *
                          </FormLabel>
                          
                            <Select disabled= {isReadonly} onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger
                                className="w-72"
                                style={InputStyle}
                              >
                                <SelectValue placeholder="Select Availability" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
        
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-row items-center pb-8">
                  <div className="w-1/2 ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="personalDetails.location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>Location *</FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="Location"
                              disabled= {isReadonly}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-1/4 ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="personalDetails.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>City *</FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="City"
                              disabled= {isReadonly}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/4 ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="personalDetails.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>State *</FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="State"
                              disabled= {isReadonly}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </fieldset>
               <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-12">
                <legend className="text-base font-thin" style={legendStyle}>
                  Skills And Interests
                </legend>
                <div className="flex w-full flex-row items-center">
                  <div className="w-full ml-6 mr-6 mb-8">
                    <FormField
                      control={form.control}
                      name="skillsAndInterestsDetails.interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Areas of Interest *
                          </FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="Areas of Interest"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-row items-center mb-6">
                  <div className="w-full ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="skillsAndInterestsDetails.skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Skills and Expertise *
                          </FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="Skills"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-12">
                <legend className="text-base font-thin" style={legendStyle}>
                  Preferred Type of Volunteering:
                </legend>
                <div className="flex w-full flex-row items-center mb-6">
                  <div className="w-72 ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="volunteerTypeDetails.volunteerType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Select Preferred Volunteering Format *
                          </FormLabel>
                          <FormControl>
                          <Select disabled= {isReadonly} onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger
                                className="w-72"
                                style={InputStyle}
                              >
                                <SelectValue placeholder="Select Preferred Volunteering Format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="Vitual">Virtual</SelectItem>
                                  <SelectItem value="In-Person">In Person</SelectItem>
        
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-72 ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="volunteerTypeDetails.isAvailableForTravel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Are you available for travel? *
                          </FormLabel>
                          <FormControl>
                          <Select disabled= {isReadonly} onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger
                                className="w-72"
                                style={InputStyle}
                              >
                                <SelectValue placeholder="Are you available for travel?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
        
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </fieldset>

              

              
              <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-12">
                <legend className="text-base font-thin" style={legendStyle}>
                  Motivation:
                </legend>
                <div className="flex w-full flex-row items-center">
                  <div className="w-full ml-6 mr-6 mb-8">
                    <FormField
                      control={form.control}
                      name="motivationDetails.reasonForJoinBanashree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Why do you want to volunteer with Banashree
                            Foundation ? *
                          </FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="Why do you want to volunteer with Banashree Foundation ?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-row items-center pb-8">
                  <div className="w-full ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="motivationDetails.objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            What do you hope to achieve or learn by
                            volunteering? *
                          </FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="What do you hope to achieve or learn by volunteering?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </fieldset>
              <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-12">
                <legend className="text-base font-thin" style={legendStyle}>
                  Emergency Contact Information
                </legend>
                <div className="flex w-full flex-row items-center pb-8">
                  <div className="w-96 ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="emergencyContactDetails.contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Emergency Contact Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="Emergency Contact Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-96 ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="emergencyContactDetails.phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Emergency Contact Phone Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="Emergency Contact Phone Number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-96 ml-6 mr-6">
                    <FormField
                      control={form.control}
                      name="emergencyContactDetails.relation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Relation to you *
                          </FormLabel>
                          <FormControl>
                            <Input
                              style={InputStyle}
                              placeholder="Relation to you"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </fieldset>

              <div
                className="ml-6 inline-block text-sm font-semibold mt-8 mb-4"
                style={labelStyle}
              >
                Consent to Volunteer Agreement(Terms and Conditions):
              </div>
              <div>
                <div className="w-full ml-6 mr-6 mb-2 flex items-center">
                  <FormField 
                    control={form.control}
                    name="termConditionAndPermissionDetails.permission"
                    render={({field}) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox onCheckedChange={field.onChange} checked={Boolean(field.value)} />
                          </FormControl>
                          <FormLabel className="text-sm font-normal" style={labelStyle}>
                          I give permission to Banashree Foundation to use my
                                photos/videos for communication and promotional purposes
                        </FormLabel>
                        </FormItem>
                      )
                    } }
                   />
                  
                  
                </div>

                <div className="w-full ml-6 mr-6 flex items-center">
                <FormField 
                    control={form.control}
                    name="termConditionAndPermissionDetails.termcondition"
                    render={({field}) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                          <FormControl>
                            <Checkbox onCheckedChange={field.onChange} checked={Boolean(field.value)} />
                          </FormControl>
                          <FormLabel className="text-sm font-normal grid gap-1.5" style={labelStyle}>
                          By submitting the form I agree to the guidelines and
                      policies of Banashree Foundation while volunteering
                        </FormLabel>
                        </FormItem>
                      )
                    } }
                   />
                  
                </div>
                
              </div>
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
};
export default VolunteerComponent;
