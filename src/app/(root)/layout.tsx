import React, { ReactNode } from 'react'
import { HomeHeader } from '@/components/layout/HomeHeader'
import { Footer } from './components/Footer'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <main className='root'>
            <div className="root-container">
                <div className="wrapper">
                    <HomeHeader />
                    {children}
                    <Footer />
                </div>
            </div>
        </main>
    )
}

export default Layout
