import { AlertCircle } from 'lucide-react'
import React from 'react'

const ContentEmpty = () => {
    return (
        <div className="flex items-center justify-center gap-2 text-orange-600">
            <AlertCircle className="h-5 w-5" />
            <p>No record found. Please Check your network and try again.</p>
        </div>
    )
}

export default ContentEmpty
