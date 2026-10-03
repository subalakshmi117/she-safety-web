import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, AlertCircle, Shield } from 'lucide-react';
import { LocationState } from '../types';

interface LocationCardProps {
  onLocationUpdate?: (lat: number, lng: number, accuracy?: number) => void;
  compact?: boolean;
}

export const LocationCard: React.FC<LocationCardProps> = ({ onLocationUpdate, compact = false }) => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    status: 'idle',
  });
  const [copied, setCopied] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null,
        status: 'error',
        errorMessage: 'Geolocation is not supported by your browser or device.',
      });
      return;
    }

    setLocation((prev) => ({ ...prev, status: 'locating', errorMessage: undefined }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const newLocation: LocationState = {
          latitude,
          longitude,
          accuracy,
          timestamp: pos.timestamp,
          status: 'success',
        };
        setLocation(newLocation);
        if (onLocationUpdate) {
          onLocationUpdate(latitude, longitude, accuracy);
        }
      },
      (err) => {
        let msg = 'Unable to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser settings to enable emergency coordinates.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable from your device GPS.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Please check your network and GPS connection.';
        }

        setLocation({
          latitude: null,
          longitude: null,
          accuracy: null,
          timestamp: null,
          status: 'error',
          errorMessage: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 10000,
      }
    );
  };

  const copyCoordinates = () => {
    if (location.latitude && location.longitude) {
      navigator.clipboard.writeText(`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mapUrl =
    location.latitude && location.longitude
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : null;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm md:text-base">Current GPS Location</h3>
            <p className="text-xs text-slate-500">Live coordinates for emergency response</p>
          </div>
        </div>

        <button
          type="button"
          onClick={requestLocation}
          disabled={location.status === 'locating'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          <Navigation className={`w-3.5 h-3.5 ${location.status === 'locating' ? 'animate-spin text-rose-400' : ''}`} />
          {location.status === 'locating'
            ? 'Acquiring GPS...'
            : location.status === 'success'
            ? 'Refresh GPS'
            : 'Get Current Location'}
        </button>
      </div>

      {/* Status & Display */}
      {location.status === 'idle' && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Your location is protected by strict privacy controls and is only requested on demand or when an SOS alert is confirmed.
          </p>
        </div>
      )}

      {location.status === 'error' && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Location Access Alert</span>
            <p className="mt-0.5 text-amber-800">{location.errorMessage}</p>
          </div>
        </div>
      )}

      {location.status === 'success' && location.latitude !== null && location.longitude !== null && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Latitude</span>
              <span className="font-mono text-sm font-semibold text-slate-900">{location.latitude.toFixed(6)}° N</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Longitude</span>
              <span className="font-mono text-sm font-semibold text-slate-900">{location.longitude.toFixed(6)}° E</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>GPS Active {location.accuracy ? `(±${Math.round(location.accuracy)}m)` : ''}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyCoordinates}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Map
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
