import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import { DateTimePicker } from "@/components/ui/date-picker";

const eventSchema = z.object({
  title: z.string().min(5, "Must be at least 5 characters"),
  startDateTime: z.date({required_error: "Start date and time is required"}),
  endDateTime: z.date({required_error: "End date and time is required"}),
  venue: z.string().min(5, "Must be at least 5 characters"),
  description: z.string().min(5, "Must be at least 5 characters"),
  focusAreas: z.string().min(5, "Must be at least 5 characters"),
  targetAudience: z.string().min(5, "Must be at least 5 characters"),
  objectives: z.string().min(5, "Must be at least 5 characters"),
  impact: z.string().min(5, "Must be at least 5 characters"),
  donateOption: z.boolean().default(false),
  pocDetails: z.string().min(5, "Must be at least 5 characters")
});

type eventFormData = z.infer<typeof eventSchema>;

const EventComponent = ({ title, actionType, onFormValid, onSubmit, setFormState, defaultValues }) => {
  const [isReadonly, setIsReadOnly] = useState(() => actionType === "view" ? true : false)
  const form = useForm<eventFormData>({
    "mode": 'onChange',
    "resolver": zodResolver(eventSchema),
    "defaultValues": defaultValues,
  });
  const { handleSubmit, formState: {errors, isValid}} = form
 useEffect(() => {
  setFormState({ isValid: form.formState.isValid, handleSubmit: form.handleSubmit })
 }, [isValid, onFormValid, setFormState])

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
    borderRadius: "2px",
    border: "1px solid #B4B4B4",
    paddingLeft: "15px",
    paddingRight: "15px",
    fontSize: "15px",
  };
  
  return (
    <div className="flex container">
      <div className="flex-none w-full">
        <section >
          <div className="text-lg font-extrabold" style={{fontFamily: "CiscoSans-Medium"}}>{title}</div>
        </section>
        <section className="form-section">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div className="flex w-full flex-row items-center pb-8">
                <div className="w-full ml-6 mr-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Event Name*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isReadonly}
                            style={InputStyle}
                            placeholder="Project Name"
                            className="data-[disabled]:opacity-50 opacity-25"
                            {...field}
                          />
                        </FormControl>
                        {!isReadonly && <FormDescription className="mt-[27px] font-ciscosans-oblique text-[14px] w-full text-[#212529]">Concise and descriptive Title (Empower Through Creativity Workshop, Animal Rescue Awareness Drive etc)</FormDescription>}
                        {errors && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center mb-8">
                <div className="w-1/3 ml-6 mr-6 min-h-[70px]">
                  <FormField
                    control={form.control}
                    name="startDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Start Date and Time*</FormLabel>
                        <FormControl>
                          <DateTimePicker control={field} disabled={isReadonly} hidden={isReadonly} ></DateTimePicker>
                        </FormControl>
                        {errors && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/3 ml-6 mr-6 min-h-[70px]">
                  <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>End Date and Time*</FormLabel>
                        <FormControl>
                          <DateTimePicker control={field} disabled={isReadonly} hidden={isReadonly}></DateTimePicker>
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
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Address(Venue)*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isReadonly}
                            style={InputStyle}
                            placeholder="Address"
                            className="data-[disabled]:opacity-50 opacity-25"
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Event Description*</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={isReadonly}
                            placeholder="Detailed explanation of what the event is about, its purpose, and its objectives."
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
                    name="focusAreas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Focus Areas*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isReadonly}
                            style={InputStyle}
                            placeholder="It may or may not be associated with an initiative"
                            className="data-[disabled]:opacity-50 opacity-25"
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
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Target Audience*</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={isReadonly}
                            placeholder="Who is the event designed for? (Ex: High school students from government schools)"
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
                    name="objectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Objectives*</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={isReadonly}
                            placeholder="Detailed explanation of what the event is about, its purpose, and its objectives."
                            className="h-32 placeholder-gray-500 placeholder-opacity-75"
                            style={TextAreaStyle}
                            
                            {...field}
                          />
                        </FormControl>
                        {!isReadonly && <FormDescription className="mt-[27px] font-ciscosans-oblique text-[14px] w-full text-[#212529]">Ex: Create 100 motivational posters for school classrooms or Raise awareness about animal rescue among employees and promote sustainable practices</FormDescription>}
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
                    name="impact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Impact*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isReadonly}
                            style={InputStyle}
                            placeholder="Impact of the event"
                            className="data-[disabled]:opacity-50 opacity-25"
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
                    name="donateOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl >
                          <Checkbox disabled={isReadonly} onCheckedChange={field.onChange} checked={Boolean(field.value)} />
                        </FormControl>
                        <FormLabel className="ml-2" style={labelStyle}>Donate Option</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center pb-8">
                <div className="w-full ml-6 mr-6">
                  <FormField
                    control={form.control}
                    name="pocDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Event POC Details*</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={isReadonly}
                            placeholder="Detailed explanation of what the event POC is about, its purpose, and its objectives."
                            className="h-32 placeholder-gray-500 placeholder-opacity-75"
                            style={TextAreaStyle}
                            
                            {...field}
                          />
                        </FormControl>
                        {errors && <FormMessage />}
                      </FormItem>
                    )}
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
export default EventComponent;
