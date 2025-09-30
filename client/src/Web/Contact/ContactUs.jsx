import React, { useState } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiLocationMarker, HiOutlineUser, HiOutlineChatAlt } from 'react-icons/hi';
import { FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import Footer from '../../Component/Web/Footer';
import PagePath from '../../Component/Web/PagePath';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'error' | null

    const contactInfo = [
        {
            icon: HiOutlineMail,
            title: 'Email Us',
            info: 'support@yourcompany.com',
            description: 'Send us an email anytime!'
        },
        {
            icon: HiOutlinePhone,
            title: 'Call Us',
            info: '+1 (555) 123-4567',
            description: 'Mon-Fri from 8am to 5pm'
        },
        {
            icon: HiLocationMarker,
            title: 'Visit Us',
            info: '123 Business St, Suite 100',
            description: 'New York, NY 10001'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            errors.phone = 'Please enter a valid phone number';
        }

        if (!formData.subject.trim()) {
            errors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters long';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmissionStatus(null);

        try {
            // Call your email API
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmissionStatus('success');
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                setFormErrors({});
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Email sending error:', error);
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const InputField = ({
        label,
        name,
        type = 'text',
        placeholder,
        required = false,
        multiline = false,
        rows = 4,
        icon: Icon
    }) => (
        <div className="relative">
            <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                )}
                {multiline ? (
                    <textarea
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        rows={rows}
                        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${formErrors[name]
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}
                    />
                ) : (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${formErrors[name]
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}
                    />
                )}
            </div>
            {formErrors[name] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="w-4 h-4 mr-1" />
                    {formErrors[name]}
                </p>
            )}
        </div>
    );

    const StatusMessage = ({ type, message }) => (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
            }`}>
            {type === 'success' ? (
                <FaCheck className="w-5 h-5 text-green-600" />
            ) : (
                <FaExclamationTriangle className="w-5 h-5 text-red-600" />
            )}
            <p className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                {message}
            </p>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            <PagePath />

            <div className="container mx-auto px-4 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Get In <span className="text-blue-600">Touch</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Contact Information */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
                                <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                                <div className="space-y-6">
                                    {contactInfo.map((item, index) => (
                                        <div key={index} className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                                <p className="text-blue-100 font-medium">{item.info}</p>
                                                <p className="text-blue-200 text-sm">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

                                {/* Status Messages */}
                                {submissionStatus === 'success' && (
                                    <div className="mb-6">
                                        <StatusMessage
                                            type="success"
                                            message="Thank you! Your message has been sent successfully. We'll get back to you soon."
                                        />
                                    </div>
                                )}

                                {submissionStatus === 'error' && (
                                    <div className="mb-6">
                                        <StatusMessage
                                            type="error"
                                            message="Sorry, there was an error sending your message. Please try again or contact us directly."
                                        />
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name and Email Row */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Full Name"
                                            name="name"
                                            placeholder="Enter your full name"
                                            required
                                            icon={HiOutlineUser}
                                        />
                                        <InputField
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            icon={HiOutlineMail}
                                        />
                                    </div>

                                    {/* Phone and Subject Row */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Phone Number"
                                            name="phone"
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            icon={HiOutlinePhone}
                                        />
                                        <InputField
                                            label="Subject"
                                            name="subject"
                                            placeholder="What is this about?"
                                            required
                                        />
                                    </div>

                                    {/* Message */}
                                    <InputField
                                        label="Message"
                                        name="message"
                                        placeholder="Tell us more about your inquiry..."
                                        required
                                        multiline
                                        rows={6}
                                        icon={HiOutlineChatAlt}
                                    />

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${isSubmitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center">
                                                    <FaSpinner className="animate-spin mr-2" />
                                                    Sending Message...
                                                </div>
                                            ) : (
                                                'Send Message'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactUs;