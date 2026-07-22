import React from 'react'
import Announcements from './Announcements'
import UpcomingEvents from './UpcomingEvents'

const CalenderView = () => {
    return (
        <section id="calender_view" className="w-full py-10 px-6 min-h-[85vh] bg-slate-100 dark:bg-gray-900 flex items-center">
            <div className="w-full max-w-7xl mx-auto text-center">
                <div className="text-center mb-12">
                    <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-3 block">
                        Stay Updated
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Announcements &amp; Events
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A glance at your academic schedule and the latest campus news.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
                    <div className="lg:col-span-2">
                        <Announcements />
                    </div>
                    <div>
                        <UpcomingEvents />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CalenderView