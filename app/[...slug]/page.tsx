import SiteApp from '../../src/main'

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { slug: ['about'] },
    { slug: ['services'] },
    { slug: ['capabilities'] },
    { slug: ['contact'] },
  ]
}

export default function SitePage() {
  return <SiteApp />
}
