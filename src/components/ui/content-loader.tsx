import { Loader2 } from 'lucide-react'
import React from 'react'

const ContentLoader = ({ message }: { message?: string }) => {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2 text-cyan-800">{(message) ? message : "Loading your data..."}</span>
        </div>
    )
}

export default ContentLoader

export const SpinLoader = ({ message }: { message?: string }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-indigo-600 border-l-purple-500 border-r-teal-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                {(message) ? message : "Loading your data..."}
            </p>
        </div>
    )
}