import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, X, Navigation, PhoneCall, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { SosAlert } from '../types';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlertCreated?: (alert: SosAlert) => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, onAlertCreated }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'confirm' | 'submitting' | 'active'>('confirm');
  const [activeAlert, setActiveAlert] = useState<SosAlert | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Ready to acquire coordinates');
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('confirm');
    setActiveAlert(null);
    setErrorMsg(null);
    onClose();
  };

  const executeSos = async () => {
    setStep('submitting');
    setLocationStatus('Querying GPS coordinates...');

    let lat: number | null = null;
    let lng: number | null = null;

    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 7000,
            maximumAge: 10000,
          });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        setCoords({ lat, lng });
        setLocationStatus(`Captured: ${lat.toFixed(5)}°, ${lng.toFixed(5)}°`);
      } catch (err: any) {
        console.warn('Geolocation acquisition skipped or denied:', err);
        setLocationStatus('GPS coordinate access not granted, continuing with alert registration');
      }
    } else {
      setLocationStatus('Geolocation unsupported on this browser');
    }

    try {
      const alertData = {
        user_id: user?.id || 'guest_user',
        latitude: lat,
        longitude: lng,
        status: 'Active' as const,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('sos_alerts')
        .insert(alertData)
        .single();

      if (error) {
        setErrorMsg('Failed to record alert in database: ' + error.message);
        setStep('confirm');
        return;
      }

      const recordedAlert: SosAlert = data || {
        id: 'sos_' + Date.now(),
        ...alertData,
      };

      setActiveAlert(recordedAlert);
      setStep('active');
      if (onAlertCreated) {
        onAlertCreated(recordedAlert);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unexpected error while triggering SOS.');
      setStep('confirm');
    }
  };

  const handleResolveAlert = async () => {
    if (!activeAlert) {
      handleClose();
      return;
    }

    try {
      await supabase
        .from('sos_alerts')
        .update({ status: 'Resolved' })
        .eq('id', activeAlert.id);

      handleClose();
    } catch (err) {
      console.error('Error resolving alert:', err);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border border-red-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Ribbon */}
        <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <h3 className="font-bold text-lg tracking-tight">
              {step === 'active' ? 'Emergency SOS Broadcast Active' : 'Emergency SOS Confirmation'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-rose-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
              {errorMsg}
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Are you sure you want to trigger an Emergency SOS?</p>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Confirming this action will immediately create an urgent SOS record in the database, capture your GPS location, and prepare notifications for your emergency contacts.
                  </p>
                </div>
              </div>

              {/* Disclaimer statement */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block mb-0.5">Platform Safety Notice:</span>
                This demo platform records alerts and formats emergency coordinate broadcasts. It does not automatically contact police or ambulance services unless an appropriate telecommunication gateway is configured. In life-threatening danger, dial <strong>112</strong> or <strong>911</strong> immediately.
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={executeSos}
                  className="flex-1 py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-5 h-5" />
                  Yes, Trigger Emergency SOS
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 'submitting' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-rose-600 border-t-transparent animate-spin mx-auto"></div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Registering Emergency SOS Alert</h4>
                <p className="text-xs text-slate-500 mt-1">{locationStatus}</p>
              </div>
            </div>
          )}

          {step === 'active' && activeAlert && (
            <div className="space-y-4">
              {/* Success Message Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">SOS alert recorded successfully.</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Your emergency record has been stored in the database with status <span className="font-semibold uppercase tracking-wider text-emerald-900">Active</span>.
                  </p>
                </div>
              </div>

              {/* Alert Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Alert ID</span>
                  <span className="font-mono font-semibold text-slate-900">{activeAlert.id}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Timestamp</span>
                  <span className="font-medium text-slate-900">{new Date(activeAlert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">GPS Coordinates</span>
                  {activeAlert.latitude && activeAlert.longitude ? (
                    <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-900">
                      <Navigation className="w-3.5 h-3.5 text-rose-600" />
                      <span>{activeAlert.latitude.toFixed(5)}°, {activeAlert.longitude.toFixed(5)}°</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Not available (permission withheld)</span>
                  )}
                </div>

                {activeAlert.latitude && activeAlert.longitude && (
                  <div className="pt-1 flex justify-end">
                    <a
                      href={`https://www.google.com/maps?q=${activeAlert.latitude},${activeAlert.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Location in Maps
                    </a>
                  </div>
                )}
              </div>

              {/* Simulated SMS Alert Preview */}
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
                <span className="font-semibold text-rose-900 block mb-1">Simulated Emergency SMS Dispatched:</span>
                <p className="font-mono text-[11px] text-rose-950 bg-white p-2 rounded-md border border-rose-200/60">
                  &quot;SAFEHER SOS ALERT: I need immediate assistance. My coordinates: {activeAlert.latitude && activeAlert.longitude ? `${activeAlert.latitude.toFixed(5)}, ${activeAlert.longitude.toFixed(5)}` : 'Location unavailable'}. Time: {new Date(activeAlert.created_at).toLocaleTimeString()}.&quot;
                </p>
              </div>

              {/* Direct Emergency Call Button */}
              <div className="flex items-center gap-2">
                <a
                  href="tel:112"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                  Call Emergency 112 / 911
                </a>
                <button
                  type="button"
                  onClick={handleResolveAlert}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel / Close Alert
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-normal">
                This demo does not automatically contact emergency services unless an appropriate service is configured.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
