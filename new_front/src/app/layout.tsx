import SideBar from '@/components/navigation/sideBar'
import TopBar from '@/components/navigation/topBar'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart room project',
  description: 'Smart room project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='min-h-screen h-full bg-black'>
      <body className='relative min-h-screen w-full h-full'>
        <Providers>
          <TopBar />
          <div className='relative pl-24 pt-14'>
            {children}
          </div>
          <SideBar />
        </Providers>
      </body>
    </html>
  )
}