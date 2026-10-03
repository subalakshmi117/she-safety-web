import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  Search,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { EmergencyContact } from '../types';

export const ContactsPage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load contacts
  const fetchContacts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contacts:', error);
      } else if (data) {
        setContacts(data as EmergencyContact[]);
      }
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setRelationship('Friend');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter contact full name.');
      return;
    }

    // Phone validation: numbers, +, -, (), spaces, min 7 digits
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      setFormError('Please enter a valid phone number with at least 7 digits.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        // Edit existing
        const { error } = await supabase
          .from('emergency_contacts')
          .update({
            name: name.trim(),
            phone: phone.trim(),
            relationship,
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('emergency_contacts')
          .insert({
            user_id: user?.id,
            name: name.trim(),
            phone: phone.trim(),
            relationship,
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
      }

      await fetchContacts();
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save contact.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (id: string, contactName: string) => {
    if (!confirm(`Are you sure you want to remove ${contactName} from your emergency contacts?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Emergency Contacts
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {contacts.length} Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            These trusted individuals will receive immediate notifications and GPS coordinates during an SOS event.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Recommendation:</span>
          <p className="text-amber-900 leading-relaxed">
            Keep at least 2 to 3 trusted contacts (such as a parent, sibling, roommate, or close friend) with active mobile numbers so someone is always reachable in urgent circumstances.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      {contacts.length > 3 && (
        <div className="relative max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-rose-500"
          />
        </div>
      )}

      {/* Contacts List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 mt-3">Loading your emergency contacts from Supabase...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Emergency Contacts Added Yet</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Add parents, siblings, or friends who should be immediately alerted when you trigger the emergency SOS button.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Your First Contact</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{contact.name}</h3>
                    <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {contact.relationship}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(contact)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Contact"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteContact(contact.id, contact.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.phone}</span>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                  >
                    <span>Call Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm">
                  {editingId ? 'Edit Emergency Contact' : 'Add New Emergency Contact'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Include country/area code if possible.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
                >
                  <option value="Parent">Parent (Mother / Father)</option>
                  <option value="Sibling">Sibling (Sister / Brother)</option>
                  <option value="Friend">Best Friend / Friend</option>
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Roommate">Roommate / Hostel Peer</option>
                  <option value="Colleague">Colleague / Coworker</option>
                  <option value="Guardian">Legal Guardian</option>
                  <option value="Other">Other Trusted Contact</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Contact' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
