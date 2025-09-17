import React, { ReactNode } from 'react'

const PageWrapper = ({ children }: { children: ReactNode }) => {
   return (
      <div className='flex flex-1 flex-col gap-4 p-4'>
         {children}
      </div>
   )
}

export default PageWrapper