import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Dashboard } from './components/Dashboard'

export default async function StudentDashboard() {
    const session = await auth()

    if (!session) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen">
            <main className="w-full mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <Dashboard />
                </div>
            </main>
        </div>
    )
}
