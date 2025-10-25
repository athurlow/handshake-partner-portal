import { NextResponse } from 'next/server'

interface TopPartner {
  id: number
  name: string
  tier: string
  revenue: number
  dealsCount: number
  status: 'active' | 'inactive'
  email: string
  phone: string
  joinedDate: string
}

const mockTopPartners: TopPartner[] = [
  {
    id: 1,
    name: 'Global Systems Inc',
    tier: 'Platinum',
    revenue: 420000,
    dealsCount: 8,
    status: 'active',
    email: 'contact@globalsystems.com',
    phone: '555-0101',
    joinedDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'TechCorp Solutions',
    tier: 'Gold',
    revenue: 285000,
    dealsCount: 6,
    status: 'active',
    email: 'contact@techcorp.com',
    phone: '555-0102',
    joinedDate: '2024-03-20',
  },
  {
    id: 3,
    name: 'Innovation Partners',
    tier: 'Silver',
    revenue: 195000,
    dealsCount: 5,
    status: 'active',
    email: 'contact@innovation.com',
    phone: '555-0103',
    joinedDate: '2024-05-10',
  },
]

export async function GET() {
  return NextResponse.json(mockTopPartners)
}
