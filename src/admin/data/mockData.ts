export type FactoryVerification = {
  id: string
  factoryName: string
  industry: string
  documentName: string
  submittedAt: string
  status: 'Pending' | 'Reviewing'
}

export type Dispute = {
  id: string
  openedAgo: string
  partyA: string
  partyB: string
  issueType: string
  value: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM'
}

export const kpiStats = {
  pendingVerifications: { value: 12, delta: '+2%', trend: 'up' as const },
  activeDisputes: { value: 5, delta: '+15%', trend: 'coral' as const },
  resolvedToday: { value: 28, delta: '+5%', trend: 'up' as const },
  avgResponseHrs: { value: '1.5 hrs', delta: '-10%', trend: 'up' as const },
}

export const pendingFactoryVerifications: FactoryVerification[] = [
  {
    id: 'FAC-8821',
    factoryName: 'Apex Steelworks',
    industry: 'Metallurgy',
    documentName: 'License.pdf',
    submittedAt: 'Oct 24, 2023',
    status: 'Pending',
  },
  {
    id: 'FAC-8755',
    factoryName: 'Delta Polymers',
    industry: 'Plastics & Recycling',
    documentName: 'EIA_2023.pdf',
    submittedAt: 'Oct 24, 2023',
    status: 'Reviewing',
  },
  {
    id: 'FAC-8702',
    factoryName: 'Nile Textile Mills',
    industry: 'Textiles',
    documentName: 'Factory_cert.zip',
    submittedAt: 'Oct 23, 2023',
    status: 'Pending',
  },
]

export const activeDisputes: Dispute[] = [
  {
    id: '#DSP-442',
    openedAgo: '2h',
    partyA: 'EcoFabrics',
    partyB: 'PurePlast Inc.',
    issueType: 'Quality Mismatch',
    value: '$12,500',
    priority: 'CRITICAL',
  },
  {
    id: '#DSP-438',
    openedAgo: '5h',
    partyA: 'Cairo Agro Chem',
    partyB: 'Delta Organics',
    issueType: 'Delivery Delay',
    value: '$8,200',
    priority: 'HIGH',
  },
  {
    id: '#DSP-429',
    openedAgo: '1d',
    partyA: 'Scrap Co.',
    partyB: 'SmeltRight Ltd',
    issueType: 'Sample vs Bulk',
    value: '$3,100',
    priority: 'MEDIUM',
  },
]

export const highPriorityCount = 2
