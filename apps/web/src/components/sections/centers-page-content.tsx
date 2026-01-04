"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { CustomSelect } from "@/components/ui/custom-select";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import { useLocale } from "next-intl";

// Dynamically import the map component with SSR disabled
const ElectoralCentersMap = dynamic(
  () => import("@/components/electoral-centers-map").then((mod) => ({ default: mod.ElectoralCentersMap })),
  { ssr: false }
);

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

interface District {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

interface CentersPageContentProps {
  centers: ElectoralCenter[];
  districts: District[];
  locale: Locale;
}

export function CentersPageContent({
  centers,
  districts,
  locale,
}: CentersPageContentProps) {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const currentLocale = useLocale();

  // Filter centers based on selected district
  const filteredCenters = selectedDistrictId
    ? centers.filter((center) => center.district.id === selectedDistrictId)
    : centers;

  // Get user location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        currentLocale === "ar"
          ? "الموقع الجغرافي غير مدعوم في متصفحك"
          : currentLocale === "fr"
            ? "La géolocalisation n'est pas prise en charge par votre navigateur"
            : "Geolocation is not supported by your browser"
      );
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        setLocationError(
          currentLocale === "ar"
            ? "فشل في الحصول على موقعك"
            : currentLocale === "fr"
              ? "Échec de l'obtention de votre position"
              : "Failed to get your location"
        );
      }
    );
  };

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  // Prepare district options
  const districtOptions = [
    { value: "", label: getContent("All Districts", "جميع الدوائر", "Toutes les circonscriptions") },
    ...districts.map((district) => ({
      value: district.id,
      label: getLocalized(
        {
          ar: district.nameAr,
          en: district.nameEn,
          fr: district.nameFr,
        },
        locale
      ),
    })),
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <div className="relative bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm" style={{ zIndex: 1000 }}>
        <div className="space-y-4">
          {/* District Filter */}
          <div>
            <label
              htmlFor="district-filter"
              className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2"
            >
              {getContent("District", "الدائرة", "Circonscription")}
            </label>
            <CustomSelect
              id="district-filter"
              options={districtOptions}
              value={selectedDistrictId}
              onChange={setSelectedDistrictId}
              placeholder={getContent("Select district", "اختر الدائرة", "Sélectionner")}
            />
          </div>

          {/* Location Button */}
          <div>
            <button
              onClick={handleGetLocation}
              disabled={isLoadingLocation}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
            >
              {isLoadingLocation ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {getContent("Getting location...", "جاري الحصول على الموقع...", "Obtention de la position...")}
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {getContent("Use my location", "استخدم موقعي", "Utiliser ma position")}
                </>
              )}
            </button>
            {locationError && (
              <p className="mt-2 text-sm text-red-600">{locationError}</p>
            )}
            {userLocation && (
              <p className="mt-2 text-sm text-emerald-600">
                {getContent("Location found!", "تم العثور على الموقع!", "Position trouvée!")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <ElectoralCentersMap
        centers={filteredCenters}
        locale={locale}
        selectedDistrictId={selectedDistrictId || undefined}
        userLocation={userLocation}
        mapStyle="hot"
      />

      {/* Centers count */}
      <div className="text-sm text-gray-600 text-center">
        {getContent(
          `Showing ${filteredCenters.length} center${filteredCenters.length !== 1 ? "s" : ""}`,
          `عرض ${filteredCenters.length} مركز${filteredCenters.length !== 1 ? "" : ""}`,
          `Affichage de ${filteredCenters.length} centre${filteredCenters.length !== 1 ? "s" : ""}`
        )}
      </div>
    </div>
  );
}

