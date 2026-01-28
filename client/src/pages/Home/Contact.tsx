import React, { useState, useEffect } from 'react';
import { ContactService } from './services/ContactService'; // Adjust path as needed

// Initialize the service with your API base URL
const contactService = ContactService(`${import.meta.env.VITE_API_URL}`);

interface FormData {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Auto-hide submit status after 10 seconds
  useEffect(() => {
    if (submitStatus.type) {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: null, message: '' });
      }, 10000); // 10 seconds

      // Cleanup timer if component unmounts or submitStatus changes
      return () => clearTimeout(timer);
    }
  }, [submitStatus.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s\-+()]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset submit status
    setSubmitStatus({ type: null, message: '' });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        inquiryType: formData.inquiryType,
        subject: formData.subject.trim(),
        message: formData.message.trim()
      };

      // Call the contact service
      const response: any = await contactService.createContact(contactData);

      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for contacting us! We will get back to you soon.'
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: '',
          subject: '',
          message: ''
        });

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(response.error || 'Failed to submit contact form');
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to submit the form. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative hearts */}
      <span className="absolute top-8 left-1/4 text-teal-400 text-4xl transform -rotate-12 select-none">♥</span>
      <span className="absolute top-1/3 right-1/4 text-red-400 text-3xl transform rotate-6 select-none">♥</span>
      <span className="absolute bottom-16 left-1/3 text-yellow-500 text-2xl transform rotate-45 select-none">♥</span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-300 text-8xl opacity-20 select-none">♥</span>

      {/* Success/Error Message with auto-hide after 10 seconds */}
      {submitStatus.type && (
        <div className={`max-w-6xl w-full mb-4 p-4 rounded-lg z-10 transition-opacity duration-500 ${
          submitStatus.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl mr-2">
                {submitStatus.type === 'success' ? '✓' : '✕'}
              </span>
              <p>{submitStatus.message}</p>
            </div>
            <button
              onClick={() => setSubmitStatus({ type: null, message: '' })}
              className="ml-4 text-gray-500 hover:text-gray-700"
              aria-label="Close notification"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start z-10 p-4">
        {/* Left Section */}
        <div className="text-center md:text-left md:col-span-1 py-8">
          <p className="text-2xl font-semibold text-gray-700 font-serif italic mb-2">Need Help..</p>
          <h1 className="text-5xl font-extrabold text-stone-800 leading-tight mb-4">
            Your Thought Might Lighten
          </h1>
          <p className="text-3xl text-stone-700">
            the Burden of Another
          </p>
        </div>

        {/* Right Section: Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-xl w-full md:col-span-1">
          <h2 className="text-3xl font-bold text-stone-800 mb-6 text-center">Get In Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm`}
                placeholder="Your Name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone-number" className="sr-only">Phone Number</label>
              <input
                id="phone-number"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm`}
                placeholder="Phone Number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Inquiry Type */}
            <div>
              <label htmlFor="inquiry-type" className="sr-only">Inquiry Type</label>
              <select
                id="inquiry-type"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.inquiryType ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm`}
              >
                <option value="">Select Inquiry Type</option>
                <option value="general">General Inquiry</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="volunteer">Volunteer Information</option>
                <option value="donation">Donation Support</option>
                <option value="other">Other</option>
              </select>
              {errors.inquiryType && <p className="mt-1 text-sm text-red-600">{errors.inquiryType}</p>}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="sr-only">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm`}
                placeholder="Subject"
              />
              {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm`}
                placeholder="Your Message"
              ></textarea>
              {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isSubmitting 
                    ? 'bg-yellow-400 cursor-not-allowed' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </form>

          {/* Address Section */}
          <div className="mb-8 text-center border-t pt-4 border-gray-200">
            <h3 className="text-xl font-bold text-stone-800 mb-2">Our Location</h3>
            <p className="text-gray-700">Address - Survey No. 260/2, Varur Village</p>
            <p className="text-gray-700">Taluk: Hubballi, District: Dharwad,</p>
            <p className="text-gray-700">Karnataka</p>
          </div>

          {/* Social Media Links */}
          <div className="text-center border-t pt-4 border-gray-200">
            <h3 className="text-xl font-bold text-stone-800 mb-2">Connect With Us</h3>
            <div className="flex justify-center space-x-4">
              <a href="https://www.linkedin.com/company/cisco" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 text-lg font-semibold">
                LinkedIn
              </a>
              <a href="https://twitter.com/Cisco" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 text-lg font-semibold">
                Twitter
              </a>
              <a href="https://www.facebook.com/Cisco" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-lg font-semibold">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full max-w-6xl mt-12 mb-12 bg-white rounded-lg shadow-xl overflow-hidden z-10">
        <h2 className="text-3xl font-bold text-stone-800 p-6 text-center">Find Us on the Map</h2>
        <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.878099056937!2d75.05822131520988!3d15.315471989356107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb8d7e5b6ad2a7d%3A0x8ef4b0d5c5c88d14!2sVarur%20Village%2C%20Karnataka%20581207!5e0!3m2!1sen!2sin!4v1691830400000!5m2!1sen!2sin" 
            width="100%"
            height="100%"
            style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
}