'use client';

import React, { useState } from 'react';
import { X, FileText, Clock, GraduationCap, BookOpen, Download } from 'lucide-react';
import { SITE_TITLE } from '@/config';

interface ProgramRequirementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    downloadUrl?: string; // Optional URL for the DOCX file
}

const ProgramRequirementsModal: React.FC<ProgramRequirementsModalProps> = ({
    isOpen,
    onClose,
    downloadUrl = "/documents/PROGRAMME_AND_REQUIREMENTS.docx", // Default path
}) => {
    const handleDownload = () => {
        // Create a temporary link element and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'PROGRAMME_AND_REQUIREMENTS.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Programme Requirements & Duration
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {SITE_TITLE}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                title="Download DOCX file"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Close"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {/* Duration Section */}
                        <section className="mb-8">
                            <div className="flex items-center space-x-2 mb-4">
                                <Clock className="w-5 h-5 text-orange-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Duration of Programmes</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Each programme is provided with minimum and maximum durations. Students are encouraged to strive towards completing the programmes at the minimum duration.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-800 mb-2">PGD Programmes</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Minimum: Two Semesters</li>
                                        <li>• Maximum: Three Semesters</li>
                                    </ul>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-green-800 mb-2">MSc Programmes</h4>
                                    <ul className="text-sm text-green-700 space-y-1">
                                        <li>• Minimum: Four Semesters</li>
                                        <li>• Maximum: Six Semesters</li>
                                    </ul>
                                </div>

                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-purple-800 mb-2">PhD Programmes</h4>
                                    <ul className="text-sm text-purple-700 space-y-1">
                                        <li>• Minimum: Eight Semesters</li>
                                        <li>• Maximum: Twelve Semesters</li>
                                    </ul>
                                </div>

                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-orange-800 mb-2">DBA and DPA Programmes</h4>
                                    <ul className="text-sm text-orange-700 space-y-1">
                                        <li>• Minimum: Six Semesters</li>
                                        <li>• Maximum: Ten Semesters</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* PGD Requirements */}
                        <section className="mb-8">
                            <div className="flex items-center space-x-2 mb-4">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Professional Post Graduate Diploma Requirements</h3>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-gray-700 mb-3">
                                    Candidates are required to hold relevant University Degrees, HND, or appropriate professional qualifications such as:
                                </p>
                                <p className="text-sm text-gray-600 mb-3">
                                    ACCA, ACA, ACIS, ACQA/ACMA, AN, AIA, ACCA, AIB, ICAN, ANAN, CIBN, or equivalent qualifications
                                </p>
                                <p className="text-sm text-gray-600">
                                    Plus 5 Credit level passes at the Ordinary level (WASSCE, GCE, etc.) in not more than 2 sittings.
                                </p>
                            </div>

                            <h4 className="font-medium text-gray-800 mb-2">Available Programmes:</h4>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li>Management</li>
                                <li>Security Management and Conflict Resolution</li>
                                <li>Governance and Legislative Studies</li>
                            </ul>
                        </section>

                        {/* EMBA Requirements */}
                        <section className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">EMBA, EMPA, MILR, MMP Requirements</h3>
                            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                                <h4 className="font-medium text-yellow-800 mb-2">General Requirements:</h4>
                                <ul className="text-sm text-yellow-700 space-y-2">
                                    <li>• {`Five Credit level passes at "O" level (not more than two sittings)`}</li>
                                    <li>• {`Bachelor's degree from approved universities`}</li>
                                    <li>• HND (Upper Credit minimum) with 5+ years experience may be considered</li>
                                    <li>• PGD in management sciences or allied disciplines</li>
                                    <li>• Minimum 3 years supervisory/managerial work experience</li>
                                    <li>• Pass admission test and interview</li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Executive MBA Options:</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Business Administration</li>
                                        <li>• Project Management</li>
                                        <li>• Engineering Management</li>
                                        <li>• Marketing</li>
                                        <li>• Banking and Finance</li>
                                        <li>• Accounting</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Executive MPA:</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Public Administration</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* MSc Requirements */}
                        <section className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Executive MSc Requirements</h3>
                            <div className="bg-green-50 p-4 rounded-lg mb-4">
                                <p className="text-green-700 text-sm">
                                    {`5 "O" level credit passes including English and Mathematics, plus good Honours Degree
                                    (Second Class minimum with 2.5 CGPA on 5-point scale)`}
                                </p>
                            </div>

                            <h4 className="font-medium text-gray-800 mb-2">Available MSc Programmes:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                                <ul className="space-y-1">
                                    <li>• Industrial Relations & HR Management</li>
                                    <li>• Applied Economics</li>
                                    <li>• Management (various options)</li>
                                    <li>• Accountancy</li>
                                    <li>• Marketing</li>
                                    <li>• Business Administration</li>
                                    <li>• Public Administration</li>
                                    <li>• Communication Management</li>
                                </ul>
                                <ul className="space-y-1">
                                    <li>• Entrepreneurship and Innovation</li>
                                    <li>• Forensic Accounting</li>
                                    <li>• Governance and Legislative Studies</li>
                                    <li>• Risk Management</li>
                                    <li>• Security Studies and Conflict Resolution</li>
                                </ul>
                            </div>
                        </section>

                        {/* DBA/DPA Requirements */}
                        <section className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">DBA and DPA Requirements</h3>
                            <div className="bg-purple-50 p-4 rounded-lg mb-4">
                                <p className="text-purple-700 text-sm">
                                    An MBA/MPA/MSc is required for admission into the Doctor of Business Administration (DBA) and Doctor of Public Administration (DPA) programmes.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Executive DBA:</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Business Administration</li>
                                        <li>• Engineering Management</li>
                                        <li>• Project Management</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800 mb-2">Executive DPA:</h4>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li>• Public Administration</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* PhD Requirements */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">PhD Programme Requirements</h3>
                            <div className="bg-red-50 p-4 rounded-lg mb-4">
                                <p className="text-red-700 text-sm">
                                    MSc Degree in the proposed field of study with minimum FCGPA of 3.00 on a 5-point scale.
                                </p>
                            </div>

                            <h4 className="font-medium text-gray-800 mb-2">Available PhD Programmes:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                                <ul className="space-y-1">
                                    <li>• PhD Accounting</li>
                                    <li>• PhD Applied Economics</li>
                                    <li>• PhD Banking and Finance</li>
                                    <li>• PhD Business Administration</li>
                                    <li>• PhD Communication Management</li>
                                    <li>• PhD Entrepreneurship and Innovation</li>
                                    <li>• PhD Forensic Accounting</li>
                                </ul>
                                <ul className="space-y-1">
                                    <li>• PhD Governance and Legislative Studies</li>
                                    <li>• PhD Marketing</li>
                                    <li>• PhD Public Administration</li>
                                    <li>• PhD Risk Management</li>
                                    <li>• PhD Security and Strategic Studies</li>
                                    <li>• PhD Industrial Relations and HR</li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <FileText className="w-4 h-4" />
                                <span>Need the complete document?</span>
                                <button
                                    onClick={handleDownload}
                                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                >
                                    Download DOCX file
                                </button>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Link component to trigger the modal
interface ProgramRequirementsLinkProps {
    children?: React.ReactNode;
    className?: string;
    downloadUrl?: string; // Pass through to modal
}

export const ProgramRequirementsLink: React.FC<ProgramRequirementsLinkProps> = ({
    children = "View Programme Requirements",
    className = "",
    downloadUrl,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors ${className}`}
            >
                <BookOpen className="w-4 h-4" />
                <span>{children}</span>
            </button>

            <ProgramRequirementsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                downloadUrl={downloadUrl}
            />
        </>
    );
};

export default ProgramRequirementsModal;
