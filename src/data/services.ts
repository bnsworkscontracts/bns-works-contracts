export type Service = {
  title: string
  description: string
  icon: 'structure' | 'road' | 'building' | 'grid' | 'briefcase' | 'tender' | 'transport' | 'repair' | 'civil' | 'tools'
}

export const services: Service[] = [
  { title: 'General Construction', description: 'Coordinated execution for diverse construction requirements.', icon: 'structure' },
  { title: 'Civil Construction', description: 'Civil works planned around practical site and project needs.', icon: 'civil' },
  { title: 'Building Construction', description: 'Construction capability for building and associated works.', icon: 'building' },
  { title: 'Infrastructure Development', description: 'Delivery support for essential public and private infrastructure.', icon: 'grid' },
  { title: 'Road & Highway Construction', description: 'Road construction work including village and intercity roads.', icon: 'road' },
  { title: 'Government Contracting', description: 'Execution capability for government construction requirements.', icon: 'briefcase' },
  { title: 'Government Tenders', description: 'Tender-focused support for government work opportunities.', icon: 'tender' },
  { title: 'Engineering & Transportation', description: 'Engineering and transportation requirements for site delivery.', icon: 'transport' },
  { title: 'Maintenance & Repair', description: 'Practical maintenance and repair work for constructed assets.', icon: 'repair' },
  { title: 'Private Civil Works', description: 'Civil construction support for private-sector requirements.', icon: 'tools' },
]
