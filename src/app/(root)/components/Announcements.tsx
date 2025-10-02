import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, Calendar, Users, Award } from "lucide-react";
import Link from "next/link";

const announcements = [
    {
        title: "Fall 2025 Registration Now Open",
        date: "April 15, 2025",
        description: "Registration for Fall 2025 semester is now open for all students. Secure your classes early!",
        icon: Calendar,
        type: "important",
    },
    {
        title: "Research Symposium Call for Papers",
        date: "April 12, 2025",
        description: "Submit your research papers for the annual symposium by May 30th, 2025.",
        icon: Award,
        type: "academic",
    },
    {
        title: "Campus-Wide Network Maintenance",
        date: "April 10, 2025",
        description: "Network maintenance scheduled for April 20th from 2AM to 6AM. Expect service interruptions.",
        icon: AlertCircle,
        type: "alert",
    },
    {
        title: "Student Council Elections",
        date: "April 8, 2025",
        description: "Cast your vote for the student council elections on April 25-26, 2025.",
        icon: Users,
        type: "community",
    },
];

export default function Announcements() {
    return (
        <Card className="bg-white p-6 rounded-lg shadow-sm">
            <CardHeader className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#23608c]">Announcements</h2>
                <Link
                    href="#"
                    className="text-sm font-medium text-[#d25400] hover:text-[#b34800]"
                >
                    View all
                </Link>
            </CardHeader>

            <CardContent className="space-y-6">
                {announcements.map((announcement, index) => (
                    <div
                        key={index}
                        className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                        <div
                            className={`
                flex-shrink-0 p-2 rounded-full
                ${announcement.type === 'important' ? 'bg-red-100' : ''}
                ${announcement.type === 'academic' ? 'bg-blue-100' : ''}
                ${announcement.type === 'alert' ? 'bg-amber-100' : ''}
                ${announcement.type === 'community' ? 'bg-green-100' : ''}
              `}
                        >
                            <announcement.icon
                                className={`h-5 w-5
                  ${announcement.type === 'important' ? 'text-red-500' : ''}
                  ${announcement.type === 'academic' ? 'text-blue-500' : ''}
                  ${announcement.type === 'alert' ? 'text-amber-500' : ''}
                  ${announcement.type === 'community' ? 'text-green-500' : ''}
                `}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{announcement.title}</h3>
                                <span className="text-xs text-gray-500">{announcement.date}</span>
                            </div>
                            <p className="text-sm text-gray-600">{announcement.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}