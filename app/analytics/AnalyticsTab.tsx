'use client';
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('6months');

  const revenueData = [
    { month: 'Apr', revenue: 125000, deals: 12 },
    { month: 'May', revenue: 158000, deals: 15 },
    { month: 'Jun', revenue: 142000, deals: 14 },
    { month: 'Jul', revenue: 189000, deals: 18 },
    { month: 'Aug', revenue: 215000, deals: 21 },
    { month: 'Sep', revenue: 198000, deals: 19 },
    { month: 'Oct', revenue: 235000, deals: 23 }
  ];

  const partnerPerformanceData = [
    { name: 'Global Systems Inc', deals: 45, revenue: 520000 },
    { name: 'TechCorp Solutions', deals: 32, revenue: 380000 },
    { name: 'Innovation Partners', deals: 28, revenue: 295000 },
    { name: 'Digital Ventures', deals: 22, revenue: 210000 },
    { name: 'CloudTech Partners', deals: 18, revenue: 165000 }
  ];

  const dealStageData = [
    { name: 'Prospecting', value: 35, color: '#6366f1' },
    { name: 'Qualification', value: 28, color: '#8b5cf6' },
    { name: 'Proposal', value: 22, color: '#ec4899' },
    { name: 'Negotiation', value: 15, color: '#f59e0b' },
    { name: 'Closed Won', value: 45, color: '#10b981' }
  ];

  const industryBreakdown = [
    { industry: 'Technology', percentage: 35 },
    { industry: 'Healthcare', percentage: 25 },
    { industry: 'Finance', percentage: 20 },
    { industry: 'Manufacturing', percentage: 12 },
    { industry: 'Retail', percentage: 8 }
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$1.57M',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Partners',
      value: '48',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-indigo-600'
    },
    {
      title: 'Win Rate',
      value: '68%',
      change: '+5.3%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Deal Size',
      value: '$52.4K',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Comprehensive insights into partner performance and revenue</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400" size={20} />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-gray-50">
                <kpi.icon className={kpi.color} size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {kpi.change}
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">{kpi.title}</p>
            <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Deals Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={{ fill: '#6366f1', r: 4 }}
                name="Revenue ($)"
              />
              <Line 
                type="monotone" 
                dataKey="deals" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                name="Deals Closed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Pipeline by Stage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dealStageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dealStageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Partner Performance</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={partnerPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="deals" fill="#6366f1" name="Deals Closed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Industry Breakdown</h2>
          <div className="space-y-4">
            {industryBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.industry}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-green-100 rounded">
                  <TrendingUp className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 text-sm mb-1">Strong Revenue Growth</h3>
                  <p className="text-sm text-green-700">Revenue increased by 18.2% compared to last period, driven by higher deal volumes.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 rounded">
                  <Target className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm mb-1">Improved Win Rate</h3>
                  <p className="text-sm text-blue-700">Win rate improved to 68%, indicating better lead quality and partner performance.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-amber-100 rounded">
                  <Users className="text-amber-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 text-sm mb-1">Partner Expansion</h3>
                  <p className="text-sm text-amber-700">Added 6 new partners this quarter, expanding market coverage by 12.5%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Lead Conversion Rate</span>
                <span className="text-sm font-semibold text-gray-900">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Partner Satisfaction</span>
                <span className="text-sm font-semibold text-gray-900">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Deal Velocity (Days)</span>
                <span className="text-sm font-semibold text-gray-900">45</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Active Partner Engagement</span>
                <span className="text-sm font-semibold text-gray-900">73%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '73%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Revenue Target Achievement</span>
                <span className="text-sm font-semibold text-gray-900">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-amber-500 h-3 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}