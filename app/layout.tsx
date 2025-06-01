import type { Metadata } from 'next'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'MeetingIQ Pro',
  description: 'AI-powered meeting analysis and insights platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  )
}
