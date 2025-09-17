"use client";

import React, { useState } from 'react';
import { Plus, X, MessageCircle, Bug, Lightbulb, Send, Check } from 'lucide-react';

const TeacherFeedbackIntegration = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const feedbackTypes = [
        {
            id: 'bug',
            label: 'Report Bug',
            icon: Bug,
            color: 'text-red-500',
            bgColor: 'bg-red-50',
            description: 'Something isn\'t working correctly'
        },
        {
            id: 'suggestion',
            label: 'Feature Request',
            icon: Lightbulb,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50',
            description: 'Suggest an improvement or new feature'
        },
        {
            id: 'general',
            label: 'General Feedback',
            icon: MessageCircle,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            description: 'Share your thoughts or experiences'
        }
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!subject.trim() || !message.trim()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitted(true);
        setIsSubmitting(false);

        // Reset form after 2 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setIsOpen(false);
            setFeedbackType('');
            setSubject('');
            setMessage('');
        }, 2000);
    };

    const resetForm = () => {
        setFeedbackType('');
        setSubject('');
        setMessage('');
        setIsSubmitted(false);
    };

    return (
        <div data-me="mee" className="fixed inset-0 pointer-events-none z-50">
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 pointer-events-auto"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Floating Feedback Button */}
            <div className="fixed bottom-20 right-6 pointer-events-auto">
                {!isOpen ? (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 group"
                        aria-label="Open feedback form"
                    >
                        <Plus className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
                    </button>
                ) : (
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200"
                        aria-label="Close feedback form"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Feedback Modal */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] pointer-events-auto">
                    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h3 className="text-lg font-semibold text-white">Share Your Feedback</h3>
                            <p className="text-blue-100 text-sm mt-1">Help us improve your experience</p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {!isSubmitted ? (
                                <div className="space-y-6">
                                    {/* Feedback Type Selection */}
                                    {!feedbackType ? (
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                What type of feedback would you like to share?
                                            </label>
                                            {feedbackTypes.map(type => {
                                                const Icon = type.icon;
                                                return (
                                                    <button
                                                        key={type.id}
                                                        type="button"
                                                        onClick={() => setFeedbackType(type.id)}
                                                        className={`w-full p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors text-left ${type.bgColor}`}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <Icon className={`w-5 h-5 ${type.color}`} />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{type.label}</h4>
                                                                <p className="text-sm text-gray-600">{type.description}</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Selected Type Display */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    {(() => {
                                                        const selectedType = feedbackTypes.find(t => t.id === feedbackType);
                                                        const Icon = selectedType?.icon;
                                                        return (
                                                            <>
                                                                {Icon && (
                                                                    <Icon className={`w-5 h-5 ${selectedType?.color}`} />
                                                                )}
                                                                <span className="font-medium text-gray-900">{selectedType?.label}</span>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={resetForm}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Change
                                                </button>
                                            </div>

                                            {/* Subject Input */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Subject
                                                </label>
                                                <input
                                                    type="text"
                                                    value={subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                    placeholder="Brief description of your feedback"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            {/* Message Input */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Message
                                                </label>
                                                <textarea
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    placeholder="Please provide detailed information about your feedback..."
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                onClick={() => handleSubmit}
                                                disabled={isSubmitting || !subject.trim() || !message.trim()}
                                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        <span>Send Feedback</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Success Message */
                                <div className="text-center py-6">
                                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h4>
                                    <p className="text-gray-600">
                                        {` Your feedback has been sent successfully. We'll review it and get back to you if needed.`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Demo Content (for context) */}
            {/* <div className="fixed top-4 left-4 bg-blue-50 border border-blue-200 rounded-lg p-4 pointer-events-auto max-w-sm">
                <h4 className="font-medium text-blue-900 mb-2">Demo Context</h4>
                <p className="text-sm text-blue-700">
                    This is a demo of the teacher feedback integration. The floating "+" button in the bottom-right corner allows teachers to report issues or share suggestions.
                </p>
            </div> */}
        </div>
    );
};

export default TeacherFeedbackIntegration;