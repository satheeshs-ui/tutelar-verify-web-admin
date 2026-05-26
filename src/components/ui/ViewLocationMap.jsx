// import { useState } from "react";
import { Map, MapPin, MapPinned, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapPinRippleIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
        {/* Ripple base */}
        <ellipse cx="12" cy="21" rx="8" ry="3" fill="#BAE6FD" /* sky-200 */ />

        {/* Pin */}
        <path
            d="M12 3c-3.3 0-6 2.7-6 6 0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6z"
            fill="#EF4444" /* red-500 */
        />
        <circle cx="12" cy="9" r="2" fill="#fff" />
    </svg>
);

export default function ViewLocationMap({ lat, lng }) {
    // const [open, setOpen] = useState(false);

    if (!lat || !lng) {
        return <span className="text-gray-400">-</span>;
    }

    return (
        <>
            {/* Map Icon */}

            {/* <button
                onClick={() => setOpen(true)}
                className="
                    inline-flex items-center gap-2
                    px-3 py-1.5
                    rounded-md
                    text-sky-500 text-sm font-medium
                    hover:bg-sky-50 hover:border-gray-400 hover:text-sky-600
                    transition
                    cursor-pointer
                "
            >
                
                <div className="relative flex items-center justify-center w-6 h-6">
                   
                    <span className="absolute w-10 h-10 rounded-full bg-[#18667C]/10"></span>

                  
                    <span className="absolute w-6 h-6 rounded-full bg-[#18667C]/20"></span>

                   
                    <span className="w-2 h-2 rounded-full bg-[#18667C]"></span>
                </div>
            </button> */}

            {/* Modal */}
            {/* {open && ( */}
            {/* <div className="w-full!"> */}
            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /> */}

            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-xl w-100vw! h-[260px]! overflow-hidden mt-3">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-800">Plotted GPS Location</h3>
                    {/* <button onClick={() => setOpen(false)}>
                                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button> */}
                </div>

                {/* Map */}
                <div className="h-[400px]">
                    <MapContainer
                        center={[lat, lng]}
                        zoom={15}
                        scrollWheelZoom={false}
                        className="h-full w-100vw!"
                    >
                        <TileLayer
                            attribution="© OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[lat, lng]}>
                            <Popup>
                                GPS Location
                                <br />
                                {lat.toFixed(5)}, {lng.toFixed(5)}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t bg-gray-50 text-xs text-gray-600">
                    Latitude: <b>{lat.toFixed(5)}</b>, Longitude: <b>{lng.toFixed(5)}</b>
                </div>
            </div>
            {/* </div> */}
            {/* // )} */}
        </>
    );
}
