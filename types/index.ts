export interface DashboardStats {
  totalPartners: number;
  pipelineValue: number;
  activeDeals: number;
  monthlyGrowth: {
    partners: number;
    revenue: number;
  };
}

export interface Partner {
  id: string;
  name: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  revenue: number;
  deals: number;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface Deal {
  id: string;
  name: string;
  partnerId: string;
  partnerName: string;
  value: number;
  stage: string;
  closeDate: string;
  status: 'open' | 'won' | 'lost';
}

export interface Notification {
  id: number;
  text: string;
  time: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  value: number;
  status: 'new' | 'qualified' | 'contacted' | 'converted';
  assignedTo?: string;
  createdAt: string;
}
