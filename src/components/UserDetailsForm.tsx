"use client";
import { useState, FormEvent } from "react";
import { User, Phone, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function UserDetailsForm({
  service = "Website Design",
  onSubmit,
}: {
  service?: string;
  onSubmit?: (details: { name: string; phone: string; email: string }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onSubmit) {
      onSubmit({ name: name.trim(), phone: phone.trim(), email: email.trim() });
    } else {
      alert(`Form submitted for ${service}!\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}`);
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'email':
        setEmail(value);
        break;
    }
  };

  return (
    <div className="container-centered">
      <div className="max-w-lg mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Almost There!
          </h2>
          <p className="text-gray-600 text-lg">
            Enter your details to get started with <span className="font-semibold text-pink-600">{service}</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="card animate-slide-up" style={{animationDelay: '200ms'}}>
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2 text-pink-500" />
                Full Name
                <span className="text-pink-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`input-primary pl-11 ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  errors.name ? 'text-red-400' : 'text-pink-500 group-hover:text-pink-600'
                }`} />
                {name && !errors.name && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center animate-fade-in">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 mr-2 text-pink-500" />
                Phone / WhatsApp Number
                <span className="text-pink-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`input-primary pl-11 ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="+256 700 123 456"
                  disabled={isSubmitting}
                />
                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  errors.phone ? 'text-red-400' : 'text-pink-500 group-hover:text-pink-600'
                }`} />
                {phone && !errors.phone && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm flex items-center animate-fade-in">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.phone}
                </p>
              )}
              <p className="text-xs text-gray-500">
                We'll use this to send you updates via WhatsApp
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 mr-2 text-pink-500" />
                Email Address
                <span className="text-gray-400 text-xs ml-2 font-normal">(Optional)</span>
              </label>
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-primary pl-11 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  errors.email ? 'text-red-400' : 'text-pink-500 group-hover:text-pink-600'
                }`} />
                {email && !errors.email && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center animate-fade-in">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.email}
                </p>
              )}
              <p className="text-xs text-gray-500">
                For project updates and important notifications
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary w-full h-12 text-base font-semibold relative overflow-hidden group"
              >
                <span className={`flex items-center justify-center transition-all duration-300 ${
                  isSubmitting ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
                }`}>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                
                {isSubmitting && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3">Processing...</span>
                  </span>
                )}
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                🔒 Your information is secure and will only be used to contact you about your project
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-500 animate-fade-in" style={{animationDelay: '400ms'}}>
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
            Secure
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
            Fast Response
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
            No Spam
          </div>
        </div>
      </div>
    </div>
  );
}
