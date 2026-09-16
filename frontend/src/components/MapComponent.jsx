import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export const MapComponent = ({
  complaints = [],
  selectedLocation = null,
  onSelectLocation = null,
  center = [28.6139, 77.2090],
  zoom = 12,
  interactive = true,
  height = "400px"
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current).setView(
      selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : center,
      zoom
    );

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Location selection click listener
    if (onSelectLocation) {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onSelectLocation({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when complaints or selectedLocation change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Single selected pin (for issue reporting)
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      const pinIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: #0d9488; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; font-weight: bold;">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: pinIcon })
        .addTo(map)
        .bindPopup(`<b>Selected Location</b><br/>Lat: ${selectedLocation.lat}<br/>Lng: ${selectedLocation.lng}`)
        .openPopup();

      markersRef.current.push(marker);
      map.setView([selectedLocation.lat, selectedLocation.lng], 14);
      return;
    }

    // Multiple complaint markers
    if (complaints && complaints.length > 0) {
      complaints.forEach((c) => {
        if (!c.latitude || !c.longitude) return;

        let pinColor = '#3b82f6'; // Blue
        if (c.priority === 'High') pinColor = '#ef4444'; // Red
        else if (c.status === 'Resolved') pinColor = '#10b981'; // Green
        else if (c.priority === 'Medium') pinColor = '#f59e0b'; // Amber

        const markerIcon = L.divIcon({
          className: 'complaint-pin',
          html: `<div style="background-color: ${pinColor}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; font-size: 13px;">⚠️</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28]
        });

        const popupContent = `
          <div style="min-width: 180px; font-family: sans-serif;">
            <div style="font-size: 11px; color: #64748b; font-weight: bold;">${c.complaintId}</div>
            <div style="font-size: 13px; font-weight: bold; margin: 2px 0 4px 0; color: #0f172a;">${c.category}</div>
            <div style="font-size: 11px; margin-bottom: 4px; color: #475569;">${c.title}</div>
            <div style="display: flex; gap: 4px; margin-top: 6px;">
              <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 9999px; background: ${c.priority === 'High' ? '#fee2e2' : '#fef3c7'}; color: ${c.priority === 'High' ? '#991b1b' : '#92400e'};">${c.priority}</span>
              <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 9999px; background: ${c.status === 'Resolved' ? '#dcfce7' : '#dbeafe'}; color: ${c.status === 'Resolved' ? '#166534' : '#1e40af'};">${c.status}</span>
            </div>
          </div>
        `;

        const marker = L.marker([c.latitude, c.longitude], { icon: markerIcon })
          .addTo(map)
          .bindPopup(popupContent);

        markersRef.current.push(marker);
      });

      // Adjust map bounds if multiple markers
      if (complaints.length > 1) {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.15));
      }
    }
  }, [complaints, selectedLocation]);

  return (
    <div className="relative w-full overflow-hidden border border-slate-200 rounded-xl shadow-inner" style={{ height }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {onSelectLocation && (
        <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm pointer-events-none">
          Click anywhere on map to pin location
        </div>
      )}
    </div>
  );
};
