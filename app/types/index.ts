export interface Partner {
  id: string;
  name: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  revenue: number;
  dealsCount: number;
  status: 'Active' | 'Inactive' | 'Pending';
  email: string;
  phone?: string;
  joinedDate: string;
}

export interface Deal {
  id: string;
  title: string;
  partnerId: string;
  partnerName: string;
  value: number;
  stage: 'Prospect' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number;
  closeDate: string;
  createdDate: string;
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
  type: 'deal' | 'partner' | 'lead' | 'system';
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  value: number;
  source: string;
  status: 'Unassigned' | 'Assigned' | 'Contacted' | 'Qualified';
  assignedTo?: string;
  createdDate: string;
}

export interface DashboardStats {
  totalPartners: number;
  pipelineValue: number;
  activeDeals: number;
  monthlyGrowth: {
    partners: number;
    revenue: number;
  };
}