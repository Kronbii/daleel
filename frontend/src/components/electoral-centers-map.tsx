"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { getLocalized } from "@daleel/shared";
import type { Locale } from "@daleel/shared";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface ElectoralCenter {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  latitude: number;
  longitude: number;
  addressAr?: string | null;
  addressEn?: string | null;
  addressFr?: string | null;
  district: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameFr: string;
  };
}

type MapStyle = 
  | "osm"
  | "cartodb-positron"
  | "cartodb-voyager"
  | "stamen-terrain"
  | "stamen-toner"
  | "cyclosm"
  | "esri-imagery"
  | "esri-street"
  | "hot";

interface ElectoralCentersMapProps {
  centers: ElectoralCenter[];
  locale: Locale;
  selectedDistrictId?: string;
  userLocation?: { lat: number; lng: number } | null;
  mapStyle?: MapStyle;
}

// Custom cluster icon function - creates colored circles based on count
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  
  // Determine color based on count
  let backgroundColor: string;
  let borderColor: string;
  let size: number;
  
  if (count < 10) {
    backgroundColor = "#4ade80"; // green-400
    borderColor = "#22c55e"; // green-500
    size = 36;
  } else if (count < 25) {
    backgroundColor = "#86efac"; // green-300
    borderColor = "#4ade80"; // green-400
    size = 40;
  } else if (count < 50) {
    backgroundColor = "#fde047"; // yellow-300
    borderColor = "#facc15"; // yellow-400
    size = 44;
  } else if (count < 100) {
    backgroundColor = "#fdba74"; // orange-300
    borderColor = "#fb923c"; // orange-400
    size = 50;
  } else {
    backgroundColor = "#fca5a5"; // red-300
    borderColor = "#f87171"; // red-400
    size = 56;
  }

  return L.divIcon({
    html: `
      <div class="cluster-icon-container" style="
        background-color: ${backgroundColor};
        border: 3px solid ${borderColor};
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: ${count >= 100 ? '14px' : '16px'};
        color: #1f2937;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${count}
      </div>
    `,
    className: "custom-cluster-icon",
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  });
};

// Component to handle map view updates
function MapViewUpdater({
  centers,
  selectedDistrictId,
  userLocation,
}: {
  centers: ElectoralCenter[];
  selectedDistrictId?: string;
  userLocation?: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    // Set max bounds to Lebanon (this prevents panning outside)
    const lebanonBounds = L.latLngBounds(
      [33.05, 35.10], // Southwest
      [34.69, 36.61]  // Northeast
    );
    map.setMaxBounds(lebanonBounds);

    // Debounce map updates to prevent blocking during rapid changes
    let timeoutId: NodeJS.Timeout;
    
    const updateMap = () => {
      if (centers.length === 0) {
        // Default to Lebanon center if no centers
        map.setView([33.8547, 35.8623], 8);
        return;
      }

      if (userLocation) {
        // Prioritize user location - center on it if within Lebanon bounds
        const userLatLng = L.latLng(userLocation.lat, userLocation.lng);
        if (lebanonBounds.contains(userLatLng)) {
          map.setView([userLocation.lat, userLocation.lng], 12, {
            animate: true,
          });
        } else {
          // If user location is outside Lebanon, just show Lebanon
          map.fitBounds(lebanonBounds, { padding: [50, 50], animate: true });
        }
      } else if (selectedDistrictId && centers.length > 0) {
        // Fit bounds to selected district centers
        const bounds = L.latLngBounds(
          centers.map((center) => [center.latitude, center.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
      } else {
        // Fit bounds to all centers
        const bounds = L.latLngBounds(
          centers.map((center) => [center.latitude, center.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
      }
    };

    // Debounce map updates - wait 100ms before updating
    // This prevents blocking when location changes rapidly
    timeoutId = setTimeout(() => {
      requestAnimationFrame(updateMap);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [map, centers, selectedDistrictId, userLocation]);

  return null;
}

// Function to get the TileLayer based on map style
function getTileLayer(style: MapStyle = "osm") {
  const tileLayers: Record<MapStyle, { url: string; attribution: string }> = {
    "osm": {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    "cartodb-positron": {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    "cartodb-voyager": {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    "stamen-terrain": {
      url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    "stamen-toner": {
      url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png",
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    "cyclosm": {
      url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://github.com/cyclosm/cyclosm-cartocss-style">CyclOSM</a>',
    },
    "esri-imagery": {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
    "esri-street": {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    },
    "hot": {
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/updates/2013-03-12-a-new-style-for-openstreetmap">Humanitarian OpenStreetMap Team</a>',
    },
  };

  return tileLayers[style];
}

export function ElectoralCentersMap({
  centers,
  locale,
  selectedDistrictId,
  userLocation,
  mapStyle = "hot",
}: ElectoralCentersMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default center: Beirut, Lebanon
  const defaultCenter: [number, number] = [33.8547, 35.8623];
  const defaultZoom = 8;

  // Lebanon bounds: restrict map to Lebanon only
  // North: 34.69°N, South: 33.05°N, East: 36.61°E, West: 35.10°E
  const lebanonBounds: L.LatLngBoundsExpression = [
    [33.05, 35.10], // Southwest corner
    [34.69, 36.61], // Northeast corner
  ];

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Create custom marker icon for individual markers
  const markerIcon = L.divIcon({
    html: `
      <div class="marker-icon-container" style="
        background-color: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </div>
    `,
    className: "custom-marker-icon",
    iconSize: L.point(24, 24),
    iconAnchor: L.point(12, 12),
    popupAnchor: L.point(0, -12),
  });

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ zIndex: 1 }}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        minZoom={8}
        maxZoom={18}
        maxBounds={lebanonBounds}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={getTileLayer(mapStyle).attribution}
          url={getTileLayer(mapStyle).url}
        />
        <MapViewUpdater
          centers={centers}
          selectedDistrictId={selectedDistrictId}
          userLocation={userLocation}
        />
        
        {/* Marker Cluster Group */}
        <MarkerClusterGroup
          chunkedLoading={true}
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom={false}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          disableClusteringAtZoom={15}
          removeOutsideVisibleBounds={true}
          animate={true}
          animateAddingMarkers={true}
        >
          {centers.map((center) => (
            <Marker
              key={center.id}
              position={[center.latitude, center.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {getLocalized(
                      {
                        ar: center.nameAr,
                        en: center.nameEn,
                        fr: center.nameFr,
                      },
                      locale
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">
                      {locale === "ar"
                        ? "الدائرة:"
                        : locale === "fr"
                          ? "Circonscription:"
                          : "District:"}
                    </span>{" "}
                    {getLocalized(
                      {
                        ar: center.district.nameAr,
                        en: center.district.nameEn,
                        fr: center.district.nameFr,
                      },
                      locale
                    )}
                  </p>
                  {(center.addressAr || center.addressEn || center.addressFr) && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">
                        {locale === "ar"
                          ? "العنوان:"
                          : locale === "fr"
                            ? "Adresse:"
                            : "Address:"}
                      </span>{" "}
                      {getLocalized(
                        {
                          ar: center.addressAr || "",
                          en: center.addressEn || "",
                          fr: center.addressFr || "",
                        },
                        locale
                      )}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {/* User location marker (outside cluster group) */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              html: `
                <div class="user-location-container" style="
                  background-color: #10b981;
                  border: 3px solid white;
                  border-radius: 50%;
                  width: 20px;
                  height: 20px;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                "></div>
              `,
              className: "user-location-icon",
              iconSize: L.point(20, 20),
              iconAnchor: L.point(10, 10),
            })}
          >
            <Popup>
              <div className="p-2">
                <p className="text-sm font-medium text-emerald-700">
                  {locale === "ar"
                    ? "موقعك"
                    : locale === "fr"
                      ? "Votre position"
                      : "Your location"}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
