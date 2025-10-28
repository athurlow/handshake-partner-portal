'use client';
import React, { useState } from 'react';
import { Users, TrendingUp, Award, AlertCircle, ArrowRight, Clock } from 'lucide-react';

export default function LeadDistribution() {
  const [selectedPartner, setSelectedPartner] = useState(null);

  const partners = [
    {
      id: 1,
      name: 'Global Systems Inc',
      tier: 'Platinum',
      leadsAssigned: 45,
      leadsConverted: 23,
      conversionRate: 51,
      avgResponseTime: '2.3 hours',
      capacity: 85,
      status: 'active'
    },
    {
      id: 2,
      name: 'TechCorp Solutions',
      tier: 'Gold',
      leadsAssigned: 32,
      leadsConverted: 14,
      conversionRate: 44,
      avgResponseTime: '4.1 hours',
      capacity: 65,
      status: 'active'
    },
    {
      id: 3,
      name: 'Innovation Partners',
      tier: 'Silver',
      leadsAssigned: 28,
      leadsConverted: 9,
      conversionRate: 32,
      avgResponseTime: '6.5 hours',
      capacity: 45,
      status: 'active'
    }
  ];

  const recentDistributions = [
    {
      id: 1,
      leadName: 'ABC Manufacturing',
      partner: 'Global Systems Inc',
      value: 85000,
      assignedDate: '2024-10-08',
      status: 'contacted'
    },
    {
      id: 2,
      leadName: 'Tech Startups Co',
      partner: 'TechCorp Solutions',
      value: 45000,
      assignedDate: '2024-10-08',
      status: 'new'
    },
    {
      id: 3,
      leadName: 'Enterprise Solutions Ltd',
      partner: 'Innovation Partners',
      value: 120000,
      assignedDate: '2024-10-07',
      status: 'qualified'
    },
    {
      id: 4,
      leadName: 'Digital Innovations Inc',
      partner: 'Global Systems Inc',
      value: 65000,
      assignedDate: '2024-10-07',
      status: 'contacted'
    }
  ];

  const distributionRules = [
    { name: 'Geographic Territory', enabled: true, description: 'Assign based on partner location' },
    { name: 'Industry Expertise', enabled: true, description: 'Match partner specialization' },
    { name: 'Capacity Management', enabled: true, description: 'Balance workload across partners' },
    { name: 'Performance Based', enabled: false, description: 'Prioritize high-performing partners' },
  ];

  const getTierColor = (tier: string) => {
    const colors = {
      Platinum: 'bg-purple-100 text-purple-700',
      Gold: 'bg-amber-100 text-amber-700',
      Silver: 'bg-gray-100 text-gray-700'
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      qualified: 'bg-green-100 text-green-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Lead Distribution</h1>
        <p className="text-gray-600">Manage and distribute leads to your partners</p>
      </div>
      <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-indigo-600" size={24} />
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Leads Distributed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">105</p>
          <p className="text-xs text-green-600 mt-1">+12% this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <p className="text-gray-600 text-sm font-medium">Avg Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">42%</p>
          <p className="text-xs text-green-600 mt-1">+5% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-amber-600" size={24} />
          </div>
          <p className="text-gray-600 text-sm font-medium">Avg Response Time</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">4.3h</p>
          <p className="text-xs text-red-600 mt-1">+0.5h from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="text-purple-600" size={24} />
          </div>
          <p className="text-gray-600 text-sm font-medium">Active Partners</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{partners.length}</p>
          <p className="text-xs text-gray-500 mt-1">All accepting leads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Partner Performance</h2>
          </div>
          <div className="p-6">
            {partners.map((partner) => (
              <div 
                key={partner.id}
                className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTierColor(partner.tier)}`}>
                        {partner.tier}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Leads Assigned</p>
                        <p className="font-semibold text-gray-900">{partner.leadsAssigned}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Converted</p>
                        <p className="font-semibold text-green-600">{partner.leadsConverted}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Conv. Rate</p>
                        <p className="font-semibold text-gray-900">{partner.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Avg Response</p>
                        <p className="font-semibold text-gray-900">{partner.avgResponseTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Capacity Usage</span>
                    <span className="font-semibold text-gray-900">{partner.capacity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        partner.capacity > 80 ? 'bg-red-500' : 
                        partner.capacity > 60 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${partner.capacity}%` }}
                    />
                  </div>
                  {partner.capacity > 80 && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-2">
                      <AlertCircle size={14} />
                      <span>Partner approaching capacity limit</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Distribution Rules</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {distributionRules.map((rule, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{rule.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {rule.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm">
              Configure Rules
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Distributions</h2>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
            View All
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentDistributions.map((dist) => (
                <tr key={dist.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{dist.leadName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{dist.partner}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">${dist.value.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{dist.assignedDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(dist.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
