import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#23608c] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">Academics</Link></li>
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">Admissions</Link></li>
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">Campus Life</Link></li>
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">Research</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">Library</Link></li>
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">Career Services</Link></li>
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">IT Support</Link></li>
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">Athletics</Link></li>
                            <li><Link href="#" className="hover:text-gray-300 transition-colors">Alumni</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <address className="not-italic">
                            <p>123 University Avenue</p>
                            <p>City, State 12345</p>
                            <p className="mt-2">Phone: (123) 456-7890</p>
                            <p>Email: info@universitylms.edu</p>
                        </address>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4 mb-6">
                            <Link href="#" className="hover:text-[#d25400] transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-[#d25400] transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-[#d25400] transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-[#d25400] transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-[#d25400] transition-colors">
                                <Youtube className="h-5 w-5" />
                            </Link>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
                        <form className="flex mt-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-3 py-2 text-black rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-[#d25400]"
                            />
                            <button
                                type="submit"
                                className="bg-[#d25400] hover:bg-[#b34800] px-4 py-2 rounded-r-md font-medium transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-300/30 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} University LMS. All rights reserved.
                    </div>
                    <div className="text-sm flex space-x-6">
                        <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-gray-300 transition-colors">Accessibility</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}