import { NextResponse } from 'next/server';
import type { DashboardStats } from '@/types';

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock dashboard statistics
  const stats: DashboardStats = {
    totalPartners: 4,
    pipelineValue: 989000,
    activeDeals: 22,
    monthlyGrowth: {
      partners: 12,
      revenue: 28,
    }
  };
  
  return NextResponse.json(stats);
}