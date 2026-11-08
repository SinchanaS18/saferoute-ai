import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Navigation, Compass, ShieldAlert, Sparkles,
  Search, Loader2, MapPin, AlertTriangle, RotateCcw, X
} from 'lucide-react';
import { api } from '../services/api';

/* ------------------------------------------------------------------ */
/* Leaflet custom icons                                                  */
/* ------------------------------------------------------------------ */
const sourceIcon = L.divIcon({
  className: '',
  html: `<div style="background:#10b981;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px rgba(16,185,129,.9)"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
});

const destIcon = L.divIcon({
  className: '',
  html: `<div style="background:#f43f5e;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px rgba(244,63,94,.9)"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9],
});

/* ------------------------------------------------------------------ */
/* Helper: fit map bounds around all visible route coordinates          */
/* ------------------------------------------------------------------ */
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [JSON.stringify(points)]);
  return null;
}

function CenterOnLocation({ location }: { location: ConfirmedLocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], 15);
  }, [location, map]);

  return null;
}

/* ------------------------------------------------------------------ */
/* Types                                                                 */
/* ------------------------------------------------------------------ */
interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface ConfirmedLocation {
  label: string;   // short display (first 2 parts)
  full: string;    // full Nominatim display_name
  lat: number;
  lng: number;
}

interface RouteResult {
  routeId: string;
  routeType: string;
  distanceKm: number;
  durationMinutes: number;
  safetyScore: number;
  riskLevel: string;
  explanation: string;
  coordinates: [number, number][];
  isRecommended: boolean;
}

/* ------------------------------------------------------------------ */
/* City alias map — handles Mysuru/Mysore, Bengaluru/Bangalore etc.     */
/* ------------------------------------------------------------------ */
const CITY_ALIASES: Record<string, string[]> = {
  mysuru:    ['Mysore', 'Mysuru'],
  mysore:    ['Mysore', 'Mysuru'],
  bengaluru: ['Bangalore', 'Bengaluru'],
  bangalore: ['Bangalore', 'Bengaluru'],
};

function buildSearchVariants(raw: string): string[] {
  const variants: string[] = [raw];
  let swapped = raw;
  for (const [key, alts] of Object.entries(CITY_ALIASES)) {
    const re = new RegExp(key, 'gi');
    if (re.test(raw)) {
      for (const alt of alts) variants.push(raw.replace(re, alt));
      swapped = raw.replace(re, '').replace(/,\s*$/, '').trim();
    }
  }
  const parts = raw.split(',');
  if (parts.length > 1) {
    variants.push(parts[0].trim());
    variants.push(parts.slice(0, -1).join(',').trim());
  }
  if (swapped && swapped !== raw) variants.push(swapped);
  return [...new Set(variants)];
}

async function fetchNominatim(query: string): Promise<Suggestion[]> {
  const variants = buildSearchVariants(query);
  for (const variant of variants) {
    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=json&addressdetails=1&limit=7&countrycodes=in` +
      `&q=${encodeURIComponent(variant)}`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'SafeRoute-AI-MCA-Project/1.0' } });
      const data: Suggestion[] = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    } catch { /* try next variant */ }
    await new Promise(r => setTimeout(r, 180));
  }
  return [];
}

/* ------------------------------------------------------------------ */
/* Nominatim hook                                                        */
/* ------------------------------------------------------------------ */
function useNominatimSearch(query: string) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) { setSuggestions([]); setNoResult(false); return; }

    const timer = setTimeout(async () => {
      setLoading(true);
      setNoResult(false);
      const data = await fetchNominatim(trimmed);
      setSuggestions(data);
      setNoResult(data.length === 0);
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  return { suggestions, loading, noResult };
}

/* ------------------------------------------------------------------ */
/* Location Search Box component                                         */
/* ------------------------------------------------------------------ */
interface SearchBoxProps {
  id: string;
  label: string;
  placeholder: string;
  accent: 'emerald' | 'rose';
  confirmed: ConfirmedLocation | null;
  onConfirm: (loc: ConfirmedLocation) => void;
  onClear: () => void;
}

const LocationSearchBox: React.FC<SearchBoxProps> = ({
  id, label, placeholder, accent, confirmed, onConfirm, onClear
}) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { suggestions, loading, noResult } = useNominatimSearch(query);
  const boxRef = useRef<HTMLDivElement>(null);

  // Sync display text when confirmed changes externally (demo preset)
  useEffect(() => {
    if (confirmed) setQuery(confirmed.label);
  }, [confirmed?.label]);

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSelect = (s: Suggestion) => {
    const parts = s.display_name.split(',');
    const shortLabel = parts.slice(0, 2).join(',').trim();
    const loc: ConfirmedLocation = {
      label: shortLabel,
      full: s.display_name,
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lon),
    };
    setQuery(shortLabel);
    setOpen(false);
    onConfirm(loc);
  };

  const handleChange = (v: string) => {
    setQuery(v);
    setOpen(true);
    if (confirmed) onClear();   // re-typing invalidates the previous selection
  };

  const clearField = () => { setQuery(''); setOpen(false); onClear(); };

  const accentBorder = accent === 'emerald' ? 'border-emerald-600' : 'border-rose-600';
  const accentText   = accent === 'emerald' ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div ref={boxRef} className="relative">
      <label htmlFor={id} className="block text-xs text-slate-400 mb-1 font-semibold flex items-center justify-between">
        <span>{label}</span>
        {confirmed && (
          <span className={`text-[10px] font-mono ${accentText}`}>
            ✓ ({confirmed.lat.toFixed(4)}, {confirmed.lng.toFixed(4)})
          </span>
        )}
      </label>

      <div className={`relative flex items-center rounded-xl border transition-colors ${
        confirmed ? accentBorder : 'border-slate-800 focus-within:border-brand-500'
      } bg-slate-950`}>
        <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none shrink-0" />
        <input
          id={id}
          type="text"
          value={query}
          autoComplete="off"
          onChange={e => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        {loading && <Loader2 className="w-4 h-4 text-brand-400 animate-spin absolute right-3 shrink-0" />}
        {!loading && query && (
          <button onClick={clearField} className="absolute right-3 text-slate-500 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute z-[9999] left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
          {suggestions.map(s => (
            <button
              key={s.place_id}
              onClick={() => handleSelect(s)}
              className={`w-full text-left px-3 py-2.5 hover:bg-slate-800/80 border-b border-slate-900/60 cursor-pointer flex items-start space-x-2 transition-colors`}
            >
              <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${accentText}`} />
              <span className="text-xs text-slate-200 line-clamp-2 leading-snug">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {open && noResult && query.length >= 3 && !loading && (
        <div className="absolute z-[9999] left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-2xl text-xs text-slate-400 text-center leading-relaxed">
          No results for &quot;{query}&quot;.<br />
          <span className="text-slate-500">Try alternate spelling or add city name (e.g. &quot;Mysore&quot; instead of &quot;Mysuru&quot;).</span>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main MapRoute page                                                    */
/* ------------------------------------------------------------------ */
export const MapRoute: React.FC = () => {
  // Start with null — no hardcoded defaults, user must search
  const [source, setSource] = useState<ConfirmedLocation | null>(null);
  const [destination, setDestination] = useState<ConfirmedLocation | null>(null);

  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [error, setError] = useState('');
  const [routeStale, setRouteStale] = useState(false);
  const [locating, setLocating] = useState(false);

  // Whenever source or destination changes, immediately clear old route
  useEffect(() => {
    setRoutes([]);
    setSelectedIdx(0);
    setRouteStale(true);
  }, [source, destination]);

  /* -------------------------- Calculate Routes ---------------------- */
  const calculateRoutes = useCallback(async (src: ConfirmedLocation, dst: ConfirmedLocation) => {
    setLoadingRoutes(true);
    setError('');
    setRoutes([]);
    setSelectedIdx(0);
    try {
      const response = await api.post('/routes/calculate', {
        sourceLat: src.lat,
        sourceLng: src.lng,
        destinationLat: dst.lat,
        destinationLng: dst.lng,
      });
      setRoutes(response.data);
      setRouteStale(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.response?.data ?? 'Route calculation failed.';
      setError(String(msg));
    } finally {
      setLoadingRoutes(false);
    }
  }, []);

  const handleCalculate = () => {
    if (!source)      { setError('Please search and SELECT a source location from the suggestions list.'); return; }
    if (!destination) { setError('Please search and SELECT a destination location from the suggestions list.'); return; }
    calculateRoutes(source, destination);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Location services are not supported by this browser.');
      return;
    }

    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setSource({
          label: 'My current location',
          full: 'My current location',
          lat: coords.latitude,
          lng: coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError('Unable to access your location. Please allow location access and try again.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  /* ------------------- Demo preset buttons ----------------------- */
  const applyPreset = (
    srcLabel: string, srcLat: number, srcLng: number,
    dstLabel: string, dstLat: number, dstLng: number
  ) => {
    const src: ConfirmedLocation = { label: srcLabel, full: srcLabel, lat: srcLat, lng: srcLng };
    const dst: ConfirmedLocation = { label: dstLabel, full: dstLabel, lat: dstLat, lng: dstLng };
    setSource(src);
    setDestination(dst);
    // Calculate immediately with the fresh coords
    calculateRoutes(src, dst);
  };

  /* ------------------- Compute all route points for FitBounds ---- */
  const allRoutePoints: [number, number][] = routes.flatMap(r => r.coordinates || []);
  const srcDstPoints: [number, number][] = [
    ...(source      ? [[source.lat,      source.lng]]      as [number, number][] : []),
    ...(destination ? [[destination.lat, destination.lng]] as [number, number][] : []),
  ];
  // Use route geometry when available, otherwise just fit to the two markers
  const fitPoints = allRoutePoints.length >= 2 ? allRoutePoints : srcDstPoints;

  const activeRoute = routes[selectedIdx] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-indigo-500/25 rounded-2xl p-6 shadow-2xl shadow-indigo-950/40">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>AI Safety Route Engine · OpenStreetMap + Nominatim + OSRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Interactive Route Safety Planner</h1>
          <p className="text-xs text-slate-300 mt-1">
            Search any college, hospital, station, landmark or street in India. Comparing safest vs shortest path with crime-density analysis.
          </p>
        </div>

        {/* Demo presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Quick Demo:</span>
          <button
            onClick={() => applyPreset(
              'MG Road Metro Station, Bengaluru', 12.9756, 77.6066,
              'Koramangala 5th Block, Bengaluru', 12.9352, 77.6245
            )}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-indigo-900/60 border border-slate-700/60 hover:border-indigo-500/40 rounded-xl text-slate-200 hover:text-white transition-all font-semibold"
          >
            MG Road ➔ Koramangala
          </button>
          <button
            onClick={() => applyPreset(
              'Vidhyavardhaka College of Engineering, Mysuru', 12.3344, 76.6432,
              'Mysore Palace, Mysuru', 12.3052, 76.6552
            )}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-indigo-900/60 border border-slate-700/60 hover:border-indigo-500/40 rounded-xl text-slate-200 hover:text-white transition-all font-semibold"
          >
            VVCE ➔ Mysore Palace
          </button>
          <button
            onClick={() => applyPreset(
              'Kempegowda International Airport, Bengaluru', 13.1986, 77.7066,
              'Electronic City Phase 1, Bengaluru', 12.8452, 77.6602
            )}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-indigo-900/60 border border-slate-700/60 hover:border-indigo-500/40 rounded-xl text-slate-200 hover:text-white transition-all font-semibold"
          >
            Airport ➔ Electronic City
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ========== Left panel ========== */}
        <div className="space-y-5">

          {/* Search form card */}
          <div className="sr-surface p-5 space-y-4 border border-indigo-500/25 shadow-xl">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-indigo-400" />
              <span>Select Locations</span>
            </h2>

            <LocationSearchBox
              id="source-search"
              label="Source Location (Start)"
              placeholder="Type: VVCE Mysore, Bangalore Airport, MG Road Metro..."
              accent="emerald"
              confirmed={source}
              onConfirm={setSource}
              onClear={() => setSource(null)}
            />

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="w-full py-2.5 border border-emerald-500/35 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4 text-emerald-400" />}
              <span>{locating ? 'Finding your location...' : 'Use my current location as start'}</span>
            </button>

            <LocationSearchBox
              id="dest-search"
              label="Destination Location (End)"
              placeholder="Type: Mysore Palace, Devegowda Circle, Electronic City..."
              accent="rose"
              confirmed={destination}
              onConfirm={setDestination}
              onClear={() => setDestination(null)}
            />

            {/* Status indicators */}
            <div className="flex items-center justify-between text-[10px] font-bold">
              <div className={`flex items-center space-x-1.5 ${source ? 'text-emerald-400' : 'text-slate-500'}`}>
                <div className={`w-2 h-2 rounded-full ${source ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-700'}`} />
                <span>{source ? 'Source selected ✓' : 'Source not selected'}</span>
              </div>
              <div className={`flex items-center space-x-1.5 ${destination ? 'text-rose-400' : 'text-slate-500'}`}>
                <div className={`w-2 h-2 rounded-full ${destination ? 'bg-rose-400 shadow-sm shadow-rose-400' : 'bg-slate-700'}`} />
                <span>{destination ? 'Destination selected ✓' : 'Destination not selected'}</span>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loadingRoutes || !source || !destination}
              className={`w-full py-3.5 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg ${
                routeStale && source && destination
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/40 animate-pulse'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/40'
              } disabled:opacity-40`}
            >
              {loadingRoutes ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calculating safe routes...</span>
                </>
              ) : routeStale && source && destination ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Recalculate Routes</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 text-cyan-200" />
                  <span>Calculate Safe Routes</span>
                </>
              )}
            </button>

            {error && (
              <div className="bg-rose-950/80 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Route result cards */}
          <div className="space-y-3">
            {routes.length > 0 && (
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Route Options from {source?.label?.split(',')[0]} → {destination?.label?.split(',')[0]}
              </h3>
            )}

            {routes.map((rt, idx) => (
              <div
                key={rt.routeId}
                onClick={() => setSelectedIdx(idx)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  selectedIdx === idx
                    ? 'bg-slate-900/90 border-indigo-500/60 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900/60 border-indigo-500/15 hover:border-indigo-500/35'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {rt.routeType === 'SAFEST' ? (
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold tracking-wider">
                        SAFEST ROUTE
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-extrabold tracking-wider">
                        SHORTEST ROUTE
                      </span>
                    )}
                    {rt.isRecommended && (
                      <span className="text-[10px] text-cyan-400 font-bold">★ AI Pick</span>
                    )}
                  </div>

                  <span className={`text-lg font-black ${
                    rt.safetyScore >= 80 ? 'text-emerald-400' : rt.safetyScore >= 55 ? 'text-cyan-400' : 'text-rose-400'
                  }`}>
                    {rt.safetyScore}/100
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 mt-3 pt-3 border-t border-indigo-500/15">
                  <div className="flex items-center space-x-1">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{rt.distanceKm} km</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{rt.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-slate-200">{rt.riskLevel}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed italic line-clamp-2">
                  "{rt.explanation}"
                </p>
              </div>
            ))}

            {routes.length === 0 && !loadingRoutes && (
              <div className="sr-surface p-5 text-center text-xs text-slate-400 border border-indigo-500/15">
                Search locations above and click <strong>Calculate Safe Routes</strong> to see safety analysis.
              </div>
            )}
          </div>
        </div>

        {/* ========== Right panel: Leaflet Map ========== */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-[640px] relative shadow-2xl">

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Auto-fit bounds when markers or routes change */}
            {fitPoints.length >= 2 && <FitBounds points={fitPoints} />}
            <CenterOnLocation location={source} />

            {/* Source Marker */}
            {source && (
              <Marker position={[source.lat, source.lng]} icon={sourceIcon}>
                <Popup>
                  <div>
                    <strong style={{ color: '#10b981', display: 'block', marginBottom: 2 }}>📍 Start Point</strong>
                    <span style={{ fontSize: 11 }}>{source.label.split(',').slice(0, 2).join(',')}</span>
                    <br />
                    <span style={{ fontSize: 10, color: '#64748b' }}>({source.lat.toFixed(5)}, {source.lng.toFixed(5)})</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Destination Marker */}
            {destination && (
              <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
                <Popup>
                  <div>
                    <strong style={{ color: '#ec4899', display: 'block', marginBottom: 2 }}>🏁 Destination</strong>
                    <span style={{ fontSize: 11 }}>{destination.label.split(',').slice(0, 2).join(',')}</span>
                    <br />
                    <span style={{ fontSize: 10, color: '#64748b' }}>({destination.lat.toFixed(5)}, {destination.lng.toFixed(5)})</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route Polylines */}
            {routes.map((rt, idx) => (
              <Polyline
                key={rt.routeId}
                positions={rt.coordinates}
                pathOptions={{
                  color: rt.routeType === 'SAFEST' ? '#10b981' : '#06b6d4',
                  weight: selectedIdx === idx ? 6 : 3,
                  opacity: selectedIdx === idx ? 0.9 : 0.35,
                  dashArray: rt.routeType === 'SHORTEST' ? '10, 8' : undefined,
                }}
              />
            ))}
          </MapContainer>

          {/* Analytics overlay */}
          {activeRoute && (
            <div className="absolute top-4 right-4 z-[1000] bg-slate-950/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-2xl w-56 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Safety Analytics</span>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold tracking-wider ${
                  activeRoute.riskLevel === 'SAFE'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60'
                    : activeRoute.riskLevel === 'MODERATE'
                    ? 'bg-indigo-950/80 text-cyan-300 border border-indigo-700/60'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                }`}>
                  {activeRoute.riskLevel}
                </span>
              </div>

              <div className="flex items-baseline space-x-1.5">
                <span className={`text-3xl font-black ${
                    activeRoute.safetyScore >= 80 ? 'text-emerald-400' : activeRoute.safetyScore >= 55 ? 'text-cyan-400' : 'text-rose-400'
                }`}>{activeRoute.safetyScore}</span>
                <span className="text-xs text-slate-300 font-medium">/ 100 safety index</span>
              </div>

              {/* Safety bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    activeRoute.safetyScore >= 80 ? 'bg-emerald-400' : activeRoute.safetyScore >= 55 ? 'bg-brand-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${activeRoute.safetyScore}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Distance</span>
                  <span className="font-semibold text-white">{activeRoute.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Time</span>
                  <span className="font-semibold text-white">{activeRoute.durationMinutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Route Type</span>
                  <span className={`font-bold text-[10px] ${activeRoute.routeType === 'SAFEST' ? 'text-emerald-400' : 'text-brand-400'}`}>
                    {activeRoute.routeType}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800/60">
                  <span className="text-slate-500 text-[10px]">Src coords</span>
                  <span className="text-slate-500 text-[10px] font-mono">{source?.lat.toFixed(3)},{source?.lng.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[10px]">Dst coords</span>
                  <span className="text-slate-500 text-[10px] font-mono">{destination?.lat.toFixed(3)},{destination?.lng.toFixed(3)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading spinner overlay */}
          {loadingRoutes && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
              <span className="text-sm font-semibold text-white">Calculating safe routes via OSRM…</span>
              <span className="text-xs text-slate-400">Analysing crime density, safe zones & lighting…</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
