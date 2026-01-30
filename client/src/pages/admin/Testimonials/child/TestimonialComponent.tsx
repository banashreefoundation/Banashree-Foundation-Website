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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const testimonialSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(150, "Designation must not exceed 150 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
  image: z.any().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  order: z.number().optional(),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

const TestimonialComponent = ({
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
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.image || null
  );
  const [charCount, setCharCount] = useState({
    name: defaultValues?.name?.length || 0,
    designation: defaultValues?.designation?.length || 0,
    message: defaultValues?.message?.length || 0,
  });

  // Update image preview when defaultValues changes (e.g., when opening view/edit modal)
  useEffect(() => {
    if (defaultValues?.image) {
      setImagePreview(defaultValues.image);
    } else {
      setImagePreview(null);
    }
  }, [defaultValues?.image]);

  const form = useForm<TestimonialFormData>({
    mode: "onChange",
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      designation: defaultValues?.designation || "",
      message: defaultValues?.message || "",
      image: defaultValues?.image || "",
      status: defaultValues?.status || "pending",
      order: defaultValues?.order || 0,
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = form;

  useEffect(() => {
    setFormState({
      isValid: form.formState.isValid,
      handleSubmit: form.handleSubmit,
    });
  }, [isValid, onFormValid, setFormState]);

  // Watch for character count changes
  useEffect(() => {
    const subscription = watch((value) => {
      setCharCount({
        name: value.name?.length || 0,
        designation: value.designation?.length || 0,
        message: value.message?.length || 0,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should not exceed 2MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Set the file in form
      form.setValue('image', file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('image', null);
  };


  const labelStyle = {
    textAlign: "left" as const,
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
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              {/* Name and Designation in one row */}
              <div className="flex w-full flex-row items-start pb-8 gap-4">
                <div className="w-1/2 ml-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Name*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isReadonly}
                            style={InputStyle}
                            placeholder="Full Name"
                            className="data-[disabled]:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        {!isReadonly && (
                          <FormDescription className="mt-2 font-ciscosans-oblique text-[14px] text-[#212529]">
                            Character count: {charCount.name}/100
                          </FormDescription>
                        )}
                        {errors && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-1/2 mr-6">
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>Designation*</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isReadonly}
                            style={InputStyle}
                            placeholder="Job Title / Role"
                            className="data-[disabled]:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        {!isReadonly && (
                          <FormDescription className="mt-2 font-ciscosans-oblique text-[14px] text-[#212529]">
                            Character count: {charCount.designation}/150
                          </FormDescription>
                        )}
                        {errors && <FormMessage />}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Message field - full width */}
              <div className="flex w-full flex-row items-start pb-8">
                <div className="w-full ml-6 mr-6">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>
                          Testimonial Message*
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={isReadonly}
                            placeholder="Share your experience, feedback, or testimonial..."
                            className="h-40 placeholder-gray-500 placeholder-opacity-75"
                            style={TextAreaStyle}
                            {...field}
                          />
                        </FormControl>
                        {!isReadonly && (
                          <FormDescription className="mt-2 font-ciscosans-oblique text-[14px] text-[#212529]">
                            Character count: {charCount.message}/1000 (Recommended:
                            500-750 characters for best display)
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Image Upload field - full width */}
              <div className="flex w-full flex-row items-start pb-8">
                <div className="w-full ml-6 mr-6">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={labelStyle}>
                          Profile Image (Optional)
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {!isReadonly && (
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isReadonly}
                                style={InputStyle}
                                className="cursor-pointer"
                              />
                            )}
                            {imagePreview && (
                              <div className="flex items-start gap-4">
                                <div className="border-2 border-gray-300 rounded-lg p-2">
                                  <img
                                    src={
                                      imagePreview.startsWith('http') 
                                        ? imagePreview
                                        : imagePreview.startsWith('/uploads') || imagePreview.startsWith('/') 
                                        ? `http://localhost:4001${imagePreview}`
                                        : imagePreview
                                    }
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-md"
                                    onError={(e: any) => {
                                      console.error('Image failed to load:', imagePreview);
                                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="gray">No Image</text></svg>';
                                    }}
                                  />
                                </div>
                                {!isReadonly && (
                                  <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        {!isReadonly && (
                          <FormDescription className="mt-2 font-ciscosans-oblique text-[14px] text-[#212529]">
                            Recommended size: 100x100 pixels. Max file size: 2MB. Formats: JPG, PNG, GIF, WebP
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Status and Order in one row - only for edit mode */}
              {actionType !== "add" && (
                <div className="flex w-full flex-row items-start pb-8 gap-4">
                  <div className="w-1/2 ml-6">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>Status*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isReadonly}
                          >
                            <FormControl>
                              <SelectTrigger style={InputStyle}>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          {!isReadonly && (
                            <FormDescription className="mt-2 font-ciscosans-oblique text-[14px] text-[#212529]">
                              Approve testimonial before publishing
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-1/2 mr-6">
                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel style={labelStyle}>
                            Display Order (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isReadonly}
                              type="number"
                              style={InputStyle}
                              placeholder="0"
                              className="data-[disabled]:opacity-50"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          {!isReadonly && (
                            <FormDescription className="mt-2 font-ciscosans-oblique text-[14px] text-[#212529]">
                              Lower numbers appear first
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
};

export default TestimonialComponent;
