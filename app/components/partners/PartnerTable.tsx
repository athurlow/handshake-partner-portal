import React from 'react';
import { TrendingUp, Mail, Phone, Calendar } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  tier: string;
  revenue: number;
  deals: number;
  status: 'active' | 'inactive';
  email?: string;
  phone?: string;
  joinedDate?: string;
}

interface PartnerTableProps {
  partners: Partner[];
  onEdit?: (partner: Partner) => void;
  onDelete?: (partnerId: string) => void;
}

export default function PartnerTable({ partners, onEdit, onDelete }: PartnerTableProps) {
  const getTierColor = (tier: string) => {
    const colors = {
      Platinum: 'bg-purple-100 text-purple-700',
      Gold: 'bg-amber-100 text-amber-700',
      Silver: 'bg-gray-100 text-gray-700',
      Bronze: 'bg-orange-100 text-orange-700'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deals</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {partners.map((partner) => (
            <tr key={partner.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{partner.name}</p>
                    {partner.joinedDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar size={12} />
                        <span>Joined {partner.joinedDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTierColor(partner.tier)}`}>
                  {partner.tier}
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-green-600">${partner.revenue?.toLocaleString() || 0}</p>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="font-semibold text-gray-900">{partner.deals || 0}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  partner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {partner.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {partner.email && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail size={12} />
                      <span>{partner.email}</span>
                    </div>
                  )}
                  {partner.phone && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone size={12} />
                      <span>{partner.phone}</span>
                    </div>
                  )}
                  {!partner.email && !partner.phone && (
                    <span className="text-sm text-gray-400">No contact info</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
