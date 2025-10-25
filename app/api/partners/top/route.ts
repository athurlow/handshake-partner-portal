import { NextResponse } from 'next/server';
import type { Partner } from '@/types';

// Same mock data as main route
const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Global Systems Inc',
    tier: 'Platinum',
    revenue: 420000,
    dealsCount: 8,
    status: 'Active',
    email: 'contact@globalsystems.com',
    phone: '555-0101',
    joinedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'TechCorp Solutions',
    tier: 'Gold',
    revenue: 285000,
    dealsCount: 6,
    status: 'Active',
    email: 'info@techcorp.com',
    phone: '555-0102',
    joinedDate: '2024-03-22',
  },
  {
    id: '3',
    name: 'Innovation Partners',
    tier: 'Silver',
    revenue: 195000,
    dealsCount: 5,
    status: 'Active',
    email: 'hello@innovationpartners.com',
    phone: '555-0103',
    joinedDate: '2024-05-10',
  },
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return top 3 partners sorted by revenue
  const topPartners = [...mockPartners]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);
  
  return NextResponse.json(topPartners);
}