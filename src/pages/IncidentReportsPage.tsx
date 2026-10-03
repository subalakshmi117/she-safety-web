import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  PlusCircle,
  Clock,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  X,
  Calendar,
  Eye,
  Shield,
  Navigation
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { IncidentReport, IncidentType, ReportStatus } from '../types';

interface IncidentReportsPageProps {
  initialView?: 'list' | 'create';
}

export const IncidentReportsPage: React.FC<IncidentReportsPageProps> = ({ initialView = 'list' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>(initialView);

  // Reports state
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form state
  const [incidentType, setIncidentType] = useState<IncidentType>('Harassment');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [gpsFetching, setGpsFetching] = useState(false);

  // Fetch reports for this user
  const fetchReports = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching incident reports:', error);
      } else if (data) {
        setReports(data as IncidentReport[]);
      }
    } catch (err) {
      console.error('Failed to load incident reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  // Sync initial view prop if it changes
  useEffect(() => {
    setActiveTab(initialView);
  }, [initialView]);

  // Image file handler (client-side base64 preview for demo safety)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('File size must be under 4MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-fill current location via GPS
  const handleAutoFillGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsFetching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsFetching(false);
        const { latitude, longitude } = pos.coords;
        setLocation(`GPS: ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E (Auto-detected)`);
      },
      (err) => {
        setGpsFetching(false);
        alert('Unable to fetch GPS: ' + err.message);
      },
      { timeout: 8000 }
    );
  };

  // Submit report handler
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!description.trim()) {
      setSubmitError('Please provide a detailed description of the incident.');
      return;
    }

    if (!location.trim()) {
      setSubmitError('Please specify the approximate location of the incident.');
      return;
    }

    setSubmitting(true);
    try {
      const newReport = {
        user_id: user?.id,
        incident_type: incidentType,
        description: description.trim(),
        location: location.trim(),
        incident_date: incidentDate,
        status: 'Submitted' as ReportStatus,
        image_url: imageUrl || undefined,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('incident_reports')
        .insert(newReport)
        .single();

      if (error) throw error;

      setSubmitSuccess(true);
      // Reset form
      setDescription('');
      setLocation('');
      setImageUrl('');
      setImagePreview(null);

      // Refresh list
      await fetchReports();

      // Switch to list after brief pause
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab('list');
      }, 1200);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit incident report.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.incident_type.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'All' || r.incident_type === typeFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Incident Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit confidential incident logs and monitor review statuses.
          </p>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-rose-600" />
            <span>My Reports ({reports.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* CREATE REPORT FORM VIEW */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">File a New Incident Report</h2>
              <p className="text-xs text-slate-500">Provide accurate context to record safety incidents</p>
            </div>
          </div>

          {submitSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Incident report submitted successfully!</span>
                <p className="mt-0.5 text-emerald-800">Your report has been securely saved to the database.</p>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="space-y-5 text-xs">
            {/* Incident Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Incident Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['Harassment', 'Unsafe Area', 'Threat', 'Stalking', 'Other'] as IncidentType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setIncidentType(type)}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      incidentType === type
                        ? 'border-rose-500 bg-rose-50/70 text-rose-700 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Date & Time of Incident <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="datetime-local"
                  required
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
                />
              </div>
            </div>

            {/* Approximate Location */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">
                  Approximate Location <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillGps}
                  disabled={gpsFetching}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <Navigation className={`w-3 h-3 ${gpsFetching ? 'animate-spin' : ''}`} />
                  <span>{gpsFetching ? 'Fetching GPS...' : 'Use My Current GPS'}</span>
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. West Campus Bus Stop, 5th Avenue"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe what occurred, any witnesses, descriptions of individuals involved, or unsafe hazards observed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500 leading-relaxed"
              ></textarea>
            </div>

            {/* Optional Image Upload */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Attach Supporting Photo (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-medium">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="flex items-center gap-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-slate-600">
              <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Reports are linked exclusively to your account UID. Initial status is assigned as <strong>Submitted</strong>.
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold shadow-md shadow-rose-600/20 transition-all"
              >
                {submitting ? 'Submitting Report...' : 'Submit Incident Report'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MY REPORTS LIST VIEW */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by keywords or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-rose-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-rose-500"
                >
                  <option value="All">All Types</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Unsafe Area">Unsafe Area</option>
                  <option value="Threat">Threat</option>
                  <option value="Stalking">Stalking</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-rose-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 mt-3">Loading incident records from Supabase...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No Incident Reports Filed</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  You haven&apos;t filed any incident reports yet. If you witness or experience an unsafe situation, document it here for records and follow-up.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>File First Incident Report</span>
              </button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-xs text-slate-500">
              No incident reports match your active filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => {
                const statusColor =
                  report.status === 'Resolved'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : report.status === 'Under Review'
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-slate-700 bg-slate-100 border-slate-200';

                return (
                  <div
                    key={report.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
                            {report.incident_type}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">
                            {report.location}
                          </h3>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${statusColor}`}>
                          {report.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {report.description}
                      </p>

                      {report.image_url && (
                        <div className="mt-2">
                          <img
                            src={report.image_url}
                            alt="Attachment"
                            className="w-full h-28 object-cover rounded-xl border border-slate-100"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(report.incident_date).toLocaleDateString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-rose-400 font-bold block">
                  Incident Report Details
                </span>
                <h3 className="font-bold text-sm text-white">{selectedReport.incident_type}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                  {selectedReport.status}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-medium text-slate-900">
                  {new Date(selectedReport.incident_date).toLocaleString()}
                </span>
              </div>

              <div className="pb-3 border-b border-slate-100">
                <span className="text-slate-500 block mb-1">Approximate Location</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  {selectedReport.location}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Full Description</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                  {selectedReport.description}
                </div>
              </div>

              {selectedReport.image_url && (
                <div>
                  <span className="text-slate-500 block mb-1">Attached Image</span>
                  <img
                    src={selectedReport.image_url}
                    alt="Incident attachment"
                    className="w-full max-h-56 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
