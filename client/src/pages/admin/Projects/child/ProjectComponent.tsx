// import "./program.scss";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getAllPrograms } from "../../Common/dataFetchFunctions";



const ProjectSchema = z.object({
  projectName: z.string().min(5, "Must be at least 5 characters"),
  tagLine: z.string().min(5, "Must be at least 5 characters"),
  program: z.string().min(1, "Please select Program."),
  projectObjective: z.string().min(5, "Must be at least 5 characters"),
  projectDescription: z.string().min(5, "Must be at least 5 characters"),
  targetBeneficiaries: z.string().min(5, "Must be at least 5 characters"),
  projectLocation: z.string().min(5, "Must be at least 5 characters"),
  keyActivities: z.string().min(5, "Must be at least 5 characters"),
  expectedOutcome: z.string().min(5, "Must be at least 5 characters"),
  collaboratingPartners: z.string().min(5, "Must be at least 5 characters"),
  metrics: z.string().min(5, "Must be at least 5 characters"),
  endorsementAndPartnership: z.string().optional()
});

type projectFormData = z.infer<typeof ProjectSchema>;

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

const TextAreaStyle = {
  fontFamily: "CiscoSans-Medium",
  fontWeight: "600",
  letterSpacing: "0px",
  // color: "#212529",
  borderRadius: "2px",
  border: "1px solid #B4B4B4",
  paddingLeft: "15px",
  paddingRight: "15px",
  fontSize: "15px",
};

const ProjectComponent = ({
  title,
  actionType,
  onFormValid,
  onSubmit,
  setFormState,
  defaultValues,
}) => {
  const [isReadonly, setIsReadOnly] = useState(() =>
    actionType === "view" ? true : false
  );
  const [isViewProfile, setIsViewProfile] = useState(() =>
    actionType === "view" || actionType === "edit" ? true : false
  );

  const [programs, setPrograms] = useState([{name: "", value: ""}])

  const form = useForm<projectFormData>({
    mode: "onChange",
    "resolver": zodResolver(ProjectSchema),
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const fetchProgram = async () => {
    try {
      const programList = await getAllPrograms();
      const mappedProgramList = programList.map(program => {
        return {name : program.title, value: program['_id']}
      })

      setPrograms(mappedProgramList)
    } catch (error) {
      console.log("Error while getting the error", JSON.stringify(error));
    }
  };

  useEffect(() => {
    fetchProgram();
    setFormState({
      isValid: form.formState.isValid,
      handleSubmit: form.handleSubmit,
    });
  }, [isValid, onFormValid, setFormState]);

  
  return (
    <div className="flex container">
      <div className="flex-none w-full">
        <section>
          <div
            className="text-lg font-extrabold"
            style={{ fontFamily: "CiscoSans-Medium" }}
          >
            {title}
          </div>
        </section>
        <section className="form-section">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
              <div className="flex w-full flex-row items-center mb-8 ">
                <div className="w-1/2 ml-6 mr-6 min-h-[70px]">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Project Name *</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isReadonly}
                            style={InputStyle}
                            placeholder="Project Name"
                            className="data-[disabled]:opacity-50 opacity-25"
                            {...field}
                          />
                        </FormControl>
                        {errors && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2 ml-6 mr-6 min-h-[70px]">
                  <FormField
                    control={form.control}
                    name="tagLine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Tag Line *</FormLabel>
                        <FormControl>
                          <Input
                            style={InputStyle}
                            placeholder="Tag Line"
                            disabled={isReadonly}
                            {...field}
                          />
                        </FormControl>
                        {errors && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row items-center pb-8">
                <div className="w-1/2 ml-6 mr-6">
                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Program *</FormLabel>

                        <Select
                          disabled={isReadonly}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="w-full"
                              style={InputStyle}
                            >
                              <SelectValue placeholder="Select Program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            
                            <SelectGroup>
                              {programs && (
                                 programs.map( program => {
                                  if (program.value !== "") {
                                    return <SelectItem key={program.value} value={program.value}>{program.name}</SelectItem>
                                  }
                                 })
                                
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-1/2 ml-6 mr-6">
                  <FormField
                    control={form.control}
                    name="projectObjective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>
                          Project Objective *
                        </FormLabel>
                        <FormControl>
                          <Input
                            style={InputStyle}
                            className="placeholder-gray-500 placeholder-opacity-75"
                            placeholder="Project Objectives"
                            disabled={isReadonly}
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
                    name="projectDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Project Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed explanation of what the initiative is about, its purpose, and its objectives. Include the background or context of why the initiative was started."
                            className="h-32 placeholder-gray-500 placeholder-opacity-75"
                            style={TextAreaStyle}
                            
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
                    name="targetBeneficiaries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>
                        Target Beneficiaries *
                        </FormLabel>
                        <FormControl>
                          <Input
                            style={InputStyle}
                            className="placeholder-gray-500 placeholder-opacity-75"
                            placeholder="Target Beneficiaries"
                            disabled={isReadonly}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    
                </div>
              </div>

              <div className="flex w-full flex-row items-center mb-8 ">
                <div className="w-1/2 ml-6 mr-6 min-h-[70px]">
                  <FormField
                    control={form.control}
                    name="projectLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Project Location *</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isReadonly}
                            style={InputStyle}
                            placeholder="Project Location"
                            className="data-[disabled]:opacity-50 opacity-25"
                            {...field}
                          />
                        </FormControl>
                        {errors && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2 ml-6 mr-6 min-h-[70px]">
                  <FormField
                    control={form.control}
                    name="keyActivities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Key Activities *</FormLabel>
                        <FormControl>
                          <Input
                            style={InputStyle}
                            placeholder="Key Activities"
                            disabled={isReadonly}
                            {...field}
                          />
                        </FormControl>
                        {errors && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex w-full flex-row items-center pb-8">
                <div className="w-full ml-6 mr-6">
                <FormField
                    control={form.control}
                    name="expectedOutcome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>
                        Expected Outcome *
                        </FormLabel>
                        <FormControl>
                          <Input
                            style={InputStyle}
                            className="placeholder-gray-500 placeholder-opacity-75"
                            placeholder="Expected Outcome"
                            disabled={isReadonly}
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
                    name="collaboratingPartners"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>
                        Collaborating Partners *
                        </FormLabel>
                        <FormControl>
                          <Input
                            style={InputStyle}
                            className="placeholder-gray-500 placeholder-opacity-75"
                            placeholder="Collaborating Partners Name"
                            disabled={isReadonly}
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
                    name="metrics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>
                        Metrics/Statistics *
                        </FormLabel>
                        <FormControl>
                          <Input
                            style={InputStyle}
                            className="placeholder-gray-500 placeholder-opacity-75"
                            placeholder="Metrics/Statistics"
                            disabled={isReadonly}
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
                    name="endorsementAndPartnership"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Endorsement or Patnerships (some testimonial specific to this project) Optional</FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-32 placeholder-gray-500 placeholder-opacity-75"
                            style={TextAreaStyle}
                            
                            {...field}
                          />
                        </FormControl>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* <fieldset className="border-2 border-gray-200 p-4 rounded-md mt-12">
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
              </fieldset> */}

              {/* <div
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
                
              </div> */}
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
};
export default ProjectComponent;
