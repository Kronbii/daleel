"use client";

import { useState, useEffect, useTransition } from "react";
import dynamic from "next/dynamic";
import { CustomSelect } from "@/components/ui/custom-select";
import { getLocalized } from "@daleel/shared";
import type { Locale } from "@daleel/shared";
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
  const [isPending, startTransition] = useTransition();
  const currentLocale = useLocale();

  // Filter centers based on selected district
  const filteredCenters = selectedDistrictId
    ? centers.filter((center) => center.district.id === selectedDistrictId)
    : centers;

  // Get user location - completely non-blocking approach
  const handleGetLocation = () => {
    // Prevent multiple simultaneous requests
    if (isLoadingLocation) {
      return;
    }

    // Check if we're in a browser environment
    if (typeof window === "undefined" || !navigator || !navigator.geolocation) {
      setLocationError(
        currentLocale === "ar"
          ? "الموقع الجغرافي غير مدعوم في متصفحك"
          : currentLocale === "fr"
            ? "La géolocalisation n'est pas prise en charge par votre navigateur"
            : "Geolocation is not supported by your browser"
      );
      return;
    }

    // Set loading state immediately - this is synchronous and fast
    setIsLoadingLocation(true);
    setLocationError(null);

    // Use MessageChannel to post the geolocation call to the next event loop
    // This ensures the UI is completely responsive
    const channel = new MessageChannel();

    channel.port1.onmessage = () => {
      // Now call geolocation - this happens after UI has updated
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Update state in a transition to prevent blocking
          startTransition(() => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setIsLoadingLocation(false);
            setLocationError(null);
          });
        },
        (error) => {
          setIsLoadingLocation(false);
          let errorMessage = "";
          try {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage =
                  currentLocale === "ar"
                    ? "تم رفض طلب الموقع. يرجى النقر على أيقونة القفل في شريط العنوان والسماح بالوصول إلى الموقع، ثم إعادة المحاولة."
                    : currentLocale === "fr"
                      ? "Accès à la position refusé. Veuillez cliquer sur l'icône de cadenas dans la barre d'adresse, autoriser l'accès à la position, puis réessayer."
                      : "Location access denied. Please click the lock icon in the address bar, allow location access, then try again.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage =
                  currentLocale === "ar"
                    ? "معلومات الموقع غير متاحة"
                    : currentLocale === "fr"
                      ? "Les informations de position ne sont pas disponibles"
                      : "Location information unavailable";
                break;
              case error.TIMEOUT:
                errorMessage =
                  currentLocale === "ar"
                    ? "انتهت مهلة طلب الموقع. يرجى المحاولة مرة أخرى."
                    : currentLocale === "fr"
                      ? "La demande de position a expiré. Veuillez réessayer."
                      : "Location request timed out. Please try again.";
                break;
              default:
                errorMessage =
                  currentLocale === "ar"
                    ? "فشل في الحصول على موقعك"
                    : currentLocale === "fr"
                      ? "Échec de l'obtention de votre position"
                      : "Failed to get your location";
                break;
            }
          } catch (err) {
            errorMessage =
              currentLocale === "ar"
                ? "حدث خطأ غير متوقع"
                : currentLocale === "fr"
                  ? "Une erreur inattendue s'est produite"
                  : "An unexpected error occurred";
          }
          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 60000,
        }
      );
    };

    // Post message to defer geolocation call
    channel.port2.postMessage(null);
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
      <div className="relative bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm" style={{ zIndex: 40 }}>
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
              disabled={isLoadingLocation || isPending}
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
              <div className="mt-2 flex items-center gap-2">
                <p className="text-sm text-emerald-600">
                  {getContent("Location found!", "تم العثور على الموقع!", "Position trouvée!")}
                </p>
                <button
                  onClick={() => {
                    setUserLocation(null);
                    setLocationError(null);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  {getContent("Clear", "مسح", "Effacer")}
                </button>
              </div>
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

