import React, { ReactNode } from 'react'

const PageWrapper = ({ children }: { children: ReactNode }) => {
   return (
      <div className='flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
         {children}
      </div>
   )
}

export default PageWrapper