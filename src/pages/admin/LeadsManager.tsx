import React, { useState, useEffect } from 'react';
import { storage } from '../../lib/storage';
import { Mail, Phone, Calendar, Trash2, CheckCircle, Clock, Filter, Search, MessageSquare, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../../lib/utils';

interface Lead {
  id: string;
  name?: string;
  email?: string;
  mobile: string;
  projectType: string;
  budget: number;
  status: 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';
  createdAt: any;
  source: string;
}

export const LeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const leadsData = await storage.getLeads();
        setLeads(leadsData);
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast.error('Failed to load leads. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
    // In a real app we might poll or use a custom event, but for now just fetch once
  }, []);

  const handleExportCSV = () => {
    try {
      const headers = ['Date', 'Name', 'Email', 'Phone', 'Project Type', 'Status', 'Source'];
      const csvContent = [
        headers.join(','),
        ...filteredLeads.map(lead => [
          new Date(lead.createdAt).toLocaleDateString(),
          `"${lead.name || 'N/A'}"`,
          `"${lead.email || 'N/A'}"`,
          `"${lead.mobile}"`,
          `"${lead.projectType}"`,
          lead.status,
          lead.source
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Leads exported to CSV');
    } catch (error) {
      console.error('CSV Export Error:', error);
      toast.error('Failed to export CSV');
    }
  };

  const updateStatus = async (id: string, newStatus: Lead['status']) => {
    try {
      await storage.updateLeadStatus(id, newStatus);
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      toast.success(`Lead status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await storage.deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      toast.success('Lead deleted');
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.projectType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'qualified': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'closed': return 'bg-green-100 text-green-700 border-green-200';
      case 'lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const openWhatsApp = (mobile: string) => {
    const clean = mobile.replace(/[\s\-\(\)\+]/g, '');
    window.open(`https://wa.me/${clean}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Leads Management</h1>
          <p className="text-neutral-500 mt-1">Track and manage inquiries from your chatbot.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-all text-sm font-medium shadow-sm"
          >
            <Download size={16} />
            Export CSV
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full">
            <Clock size={14} />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search by mobile or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-all appearance-none bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div className="flex items-center justify-end gap-4 px-2">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Total Leads</p>
            <p className="text-xl font-black text-neutral-900">{filteredLeads.length}</p>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Contact</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Project & Budget</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-900">
                          {formatDate(lead.createdAt, 'MMM d, yyyy')}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {formatDate(lead.createdAt, 'h:mm a')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-900">{lead.mobile}</span>
                        </div>
                        <button 
                          onClick={() => openWhatsApp(lead.mobile)}
                          className="text-[10px] text-green-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <MessageSquare size={10} />
                          Chat on WhatsApp
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-neutral-900">{lead.projectType}</span>
                        <span className="text-xs text-neutral-500">Budget: ${lead.budget.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value as Lead['status'])}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all outline-none cursor-pointer ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Lead"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={48} className="text-neutral-200" />
                      <p>No leads found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsManager;
