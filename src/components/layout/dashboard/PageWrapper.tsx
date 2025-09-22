import React, { ReactNode } from 'react'

const PageWrapper = ({ children }: { children: ReactNode }) => {
   return (
      <div className='flex flex-1 flex-col gap-4 p-4 max-w-full overflow-x-hidden'>
         {children}
      </div>
   )
}

export default PageWrapper