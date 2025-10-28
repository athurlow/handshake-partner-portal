'use client';
import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, Clock, XCircle, Edit, Trash2, Eye } from 'lucide-react';

export default function DealRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [deals, setDeals] = useState([
    {
      id: 1,
      dealName: 'Enterprise Software License',
      company: 'Acme Corporation',
      partner: 'Global Systems Inc',
      value: 125000,
      status: 'approved',
      submittedDate: '2024-10-01',
      expectedCloseDate: '2024-11-15'
    },
    {
      id: 2,
      dealName: 'Cloud Migration Project',
      company: 'Tech Innovations Ltd',
      partner: 'TechCorp Solutions',
      value: 85000,
      status: 'pending',
      submittedDate: '2024-10-05',
      expectedCloseDate: '2024-12-01'
    },
    {
      id: 3,
      dealName: 'Security Infrastructure Upgrade',
      company: 'SecureNet Inc',
      partner: 'Innovation Partners',
      value: 200000,
      status: 'rejected',
      submittedDate: '2024-09-28',
      expectedCloseDate: '2024-10-30'
    }
  ]);

  const [formData, setFormData] = useState({
    dealName: '',
    company: '',
    partner: '',
    value: '',
    expectedCloseDate: '',
    description: ''
  });

  const handleSubmit = () => {
    if (!formData.dealName || !formData.company || !formData.partner || !formData.value || !formData.expectedCloseDate) {
      alert('Please fill in all required fields');
      return;
    }
    const newDeal = {
      id: deals.length + 1,
      ...formData,
      value: parseFloat(formData.value),
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setDeals([newDeal, ...deals]);
    setFormData({
      dealName: '',
      company: '',
      partner: '',
      value: '',
      expectedCloseDate: '',
      description: ''
    });
    setShowForm(false);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700'
    };
    const icons = {
      approved: <CheckCircle size={14} />,
      pending: <Clock size={14} />,
      rejected: <XCircle size={14} />
    };
    return (
      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || deal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Deal Registration</h1>
        <p className="text-gray-600">Register and manage partner deals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Total Deals</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{deals.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {deals.filter(d => d.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {deals.filter(d => d.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Register New Deal
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Deal Registration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name*</label>
              <input
                type="text"
                value={formData.dealName}
                onChange={(e) => setFormData({...formData, dealName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name*</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner*</label>
              <select
                value={formData.partner}
                onChange={(e) => setFormData({...formData, partner: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Partner</option>
                <option value="Global Systems Inc">Global Systems Inc</option>
                <option value="TechCorp Solutions">TechCorp Solutions</option>
                <option value="Innovation Partners">Innovation Partners</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value*</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date*</label>
              <input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Add deal details..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Submit Deal
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{deal.dealName}</p>
                      <p className="text-sm text-gray-500">{deal.company}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{deal.partner}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">${deal.value.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(deal.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">Close: {deal.expectedCloseDate}</p>
                      <p className="text-gray-500">Submitted: {deal.submittedDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
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
