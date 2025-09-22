import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const session = await auth()

    if (!session) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen">
            <main className="w-full mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg font-medium mb-4">User Information</h2>

                            <MyComponent />
                            <ColorShadeDemo />
                            <SecondaryColorDemo />

                            <div className="space-y-3">
                                <p><strong>ID:</strong> {session.user?.id}</p>
                                <p><strong>Name:</strong> {session.user?.first_name}</p>
                                <p><strong>Email:</strong> {session.user?.email}</p>
                                <p><strong>Access Token:</strong> {session.user.access_token ? '✓ Present' : '✗ Missing'}</p>

                                <div className="mt-6">
                                    <h3 className="text-md font-medium text-primary-foreground mb-2">Full Session Data:</h3>
                                    <pre className="bg-secondary text-secondary-foreground p-4 rounded-md text-sm overflow-auto">
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


// Example component using the dynamic colors
const MyComponent = () => {
    return (
        <div className="bg-background text-foreground p-6">
            <h1 className="text-2xl font-bold text-primary">Primary Color Heading</h1>
            <p className="text-secondary">This text uses the secondary color</p>

            <div className="bg-primary p-4 rounded-lg mt-4">
                <p className="text-primary-foreground">This has primary background</p>
            </div>

            <div className="bg-secondary p-4 rounded-lg mt-4">
                <p className="text-secondary-foreground">This has secondary background</p>
            </div>

            <button className="bg-primary text-primary-foreground px-4 py-2 rounded mt-4 hover:bg-primary/90">
                Primary Button
            </button>

            <div className="border border-border p-4 mt-4 rounded-md">
                This has a border color
            </div>
        </div>
    )
}

const ColorShadeDemo = () => {
    return (
        <div className="space-y-4 p-6">
            <div className="bg-primary-50 text-primary-900 p-4 rounded">Primary 50</div>
            <div className="bg-primary-100 text-primary-900 p-4 rounded">Primary 100</div>
            <div className="bg-primary-200 text-primary-900 p-4 rounded">Primary 200</div>
            <div className="bg-primary-300 text-primary-900 p-4 rounded">Primary 300</div>
            <div className="bg-primary-400 text-primary-900 p-4 rounded">Primary 400</div>
            <div className="bg-primary-500 text-primary-50 p-4 rounded">Primary 500</div>
            <div className="bg-primary-600 text-primary-50 p-4 rounded">Primary 600</div>
            <div className="bg-primary-700 text-primary-50 p-4 rounded">Primary 700</div>
            <div className="bg-primary-800 text-primary-50 p-4 rounded">Primary 800</div>
            <div className="bg-primary-900 text-primary-50 p-4 rounded">Primary 900</div>
            <div className="bg-primary-950 text-primary-50 p-4 rounded">Primary 950</div>
        </div>
    )
}

const SecondaryColorDemo = () => {
    return (
        <div className="space-y-2 p-6">
            <div className="bg-secondary-50 text-secondary-900 p-3 rounded">Secondary 50</div>
            <div className="bg-secondary-100 text-secondary-900 p-3 rounded">Secondary 100</div>
            <div className="bg-secondary-200 text-secondary-900 p-3 rounded">Secondary 200</div>
            <div className="bg-secondary-300 text-secondary-900 p-3 rounded">Secondary 300</div>
            <div className="bg-secondary-400 text-secondary-900 p-3 rounded">Secondary 400</div>
            <div className="bg-secondary-500 text-secondary-50 p-3 rounded">Secondary 500 (Base)</div>
            <div className="bg-secondary-600 text-secondary-50 p-3 rounded">Secondary 600</div>
            <div className="bg-secondary-700 text-secondary-50 p-3 rounded">Secondary 700</div>
            <div className="bg-secondary-800 text-secondary-50 p-3 rounded">Secondary 800</div>
            <div className="bg-secondary-900 text-secondary-50 p-3 rounded">Secondary 900</div>
            <div className="bg-secondary-950 text-secondary-50 p-3 rounded">Secondary 950</div>

            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg mt-4">
                This uses the main secondary color
            </div>
        </div>
    )
}