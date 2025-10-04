import React from 'react'
import Announcements from './Announcements'
import UpcomingEvents from './UpcomingEvents'

const CalenderView = () => {
    return (
        <section id="calender_view" className="w-full py-10 px-6 min-h-[85vh] bg-slate-100 flex items-center">
            <div className="w-full max-w-7xl mx-auto text-center">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Calender Events
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Pick a glance at your academic schedule
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