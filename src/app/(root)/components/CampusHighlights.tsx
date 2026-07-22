import { CAMPUSHIGHLIGHTS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function CampusHighlights() {
    return (
        <section id="campus_highlight" className="w-full py-16 px-6 min-h-[85vh] flex items-center bg-white dark:bg-gray-800">
            <div className="w-full max-w-7xl mx-auto text-center">
                <div className="text-center mb-12">
                    <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-3 block">
                        Campus
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Campus Highlights</h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Experience what makes our university special through our state-of-the-art facilities and vibrant community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CAMPUSHIGHLIGHTS.map((ch, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-xl h-64 w-auto">
                            <Image
                                src={ch.imageUrl}
                                fill
                                alt={ch.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Functional scrim so the caption stays legible over the photo */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                <h3 className="text-white font-semibold text-lg text-left">{ch.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="#"
                        className="inline-flex items-center justify-center bg-accent hover:bg-accent-600 text-accent-foreground font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Take a Virtual Tour
                    </Link>
                </div>
            </div>
        </section>
    );
}