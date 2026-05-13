import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono, Fraunces } from 'next/font/google'
import SmoothScroll from '../components/SmoothScroll'
import GrainOverlay from '../components/UI/GrainOverlay'
import CrosshairCursor from '../components/UI/CrosshairCursor'
import IssuePreloader from '../components/UI/IssuePreloader'
import RevealOnView from '../components/UI/RevealOnView'
import WanderingAvatar from '../components/UI/WanderingAvatar'
import './globals.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '700'],
})

const serifAccent = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  axes: ['SOFT', 'WONK', 'opsz'],
})

export const metadata: Metadata = {
  title: 'Adam Bytniewski — Archive Vol. 01',
  description:
    'Personal archive of Adam Bytniewski. AI engineer, builder. Cinematic web, n8n automations, second brain, AI media. Updated continuously.',
  authors: [{ name: 'Adam Bytniewski' }],
  metadataBase: new URL('https://adam.example'),
  openGraph: {
    title: 'Adam Bytniewski — Archive Vol. 01',
    description:
      'Cinematic web · Automatyzacje · Second Brain · AI media. Living archive.',
    type: 'website',
    locale: 'pl_PL',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={`${display.variable} ${mono.variable} ${serifAccent.variable}`}>
      <body className="font-mono antialiased bg-paper text-ink">
        <IssuePreloader />
        <CrosshairCursor />
        <GrainOverlay />
        <RevealOnView />
        <WanderingAvatar />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
