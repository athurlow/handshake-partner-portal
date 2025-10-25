"use client";

import type { Partner } from '@/types';
import { Mail, Phone, TrendingUp } from 'lucide-react';

interface PartnerTableProps {
  partners: Partner[];
}

export default function PartnerTable({ partners }: PartnerTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Partner
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Revenue
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deals
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {partners.map((partner) => (
            <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-semibold text-gray-900">{partner.name}</div>
                <div className="text-sm text-gray-500">Joined {partner.joinedDate}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  partner.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                  partner.tier === 'Gold' ? 'bg-amber-100 text-amber-700' :
                  partner.tier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {partner.tier}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="font-semibold text-gray-900">
                  ${partner.revenue.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="font-semibold text-gray-900">{partner.deals}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  partner.status === 'Active' ? 'bg-green-100 text-green-700' :
                  partner.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {partner.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <a href={`mailto:${partner.email}`} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800">
                    <Mail size={14} />
                    {partner.email}
                  </a>
                  {partner.phone && (
                    <a href={`tel:${partner.phone}`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                      <Phone size={14} />
                      {partner.phone}
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {partners.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No partners found
        </div>
      )}
    </div>
  );
}
