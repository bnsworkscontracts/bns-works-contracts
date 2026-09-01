import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../src/styles.css'

export const metadata: Metadata = {
  title: 'BNS Works Contracts Private Limited | General Construction',
  description: 'BNS Works Contracts Private Limited is a general construction company serving Punjab, Chandigarh and Mohali.',
  openGraph: {
    title: 'BNS Works Contracts Private Limited',
    description: 'General construction, civil works and infrastructure execution across Punjab.',
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
