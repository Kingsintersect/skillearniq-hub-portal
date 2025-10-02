import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function UpcomingEvents() {
    const events = [
        {
            title: "Spring Career Fair",
            date: "Apr 22",
            time: "10:00 AM - 4:00 PM",
            location: "Student Union",
        },
        {
            title: "Guest Lecture: AI Ethics",
            date: "Apr 25",
            time: "2:00 PM - 3:30 PM",
            location: "Science Hall 203",
        },
        {
            title: "Campus Concert Series",
            date: "Apr 28",
            time: "7:00 PM - 9:00 PM",
            location: "Memorial Auditorium",
        },
        {
            title: "Alumni Networking Mixer",
            date: "May 5",
            time: "6:00 PM - 8:00 PM",
            location: "Business School Atrium",
        },
    ];

    return (
        <Card className="bg-white p-6 rounded-lg shadow-sm h-full">
            <CardHeader className="text-2xl font-bold text-[#23608c] mb-6">
                Upcoming Events
            </CardHeader>

            <CardContent className="space-y-4">
                {events.map((event, index) => (
                    <div
                        key={index}
                        className="flex items-start border-l-2 border-[#d25400] pl-4 py-2"
                    >
                        <div className="mr-4 text-center">
                            <div className="bg-[#23608c] text-white font-bold rounded px-3 py-1">
                                {event.date}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-gray-500">{event.time}</p>
                            <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                    </div>
                ))}
            </CardContent>

            <CardFooter className="mt-6 text-center">
                <Link
                    href="#"
                    className="inline-block bg-[#23608c] hover:bg-[#1d5175] text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                    View Calendar
                </Link>
            </CardFooter>
        </Card>
    );
}