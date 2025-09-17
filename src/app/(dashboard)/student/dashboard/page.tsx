import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const session = await auth()

    if (!session) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>

                            <div className="space-y-3">
                                <p><strong>ID:</strong> {session.user?.id}</p>
                                <p><strong>Name:</strong> {session.user?.first_name}</p>
                                <p><strong>Email:</strong> {session.user?.email}</p>
                                <p><strong>Access Token:</strong> {session.user.access_token ? '✓ Present' : '✗ Missing'}</p>

                                <div className="mt-6">
                                    <h3 className="text-md font-medium text-gray-900 mb-2">Full Session Data:</h3>
                                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
                                        {JSON.stringify(session, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}