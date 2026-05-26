import { Camera, Check } from "lucide-react";

export default function VerificationCheckList() {
    return (
        <div className="w-[440px] h-screen bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 overflow-y-auto p-6 flex flex-col">
            <div className="mb-8">
                <h1 className="text-white text-3xl font-bold mb-2">Verification Checklist</h1>
                <p className="text-gray-400 text-sm">Live document capture and verification.</p>
            </div>

            <div className="space-y-6 mb-5 flex-1">
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/20 p-2 rounded-lg">
                                <Check className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="text-white text-lg font-semibold">Face Match</h3>
                        </div>
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
                            Verified
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="bg-slate-700 rounded-lg overflow-hidden aspect-4/3 mb-2">
                                <img
                                    src="/api/placeholder/150/120"
                                    alt="Live capture"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-gray-400 text-xs text-center">Live Capture</p>
                        </div>
                        <div>
                            <div className="bg-slate-700 rounded-lg overflow-hidden aspect-4/3 mb-2">
                                <img
                                    src="/api/placeholder/150/120"
                                    alt="ID photo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-gray-400 text-xs text-center">ID Photo</p>
                        </div>
                    </div>

                    <p className="text-center text-emerald-400 text-sm font-medium mt-3">
                        Match Confidence: 98.7%
                    </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/20 p-2 rounded-lg">
                                <svg
                                    className="w-5 h-5 text-emerald-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <rect
                                        x="2"
                                        y="5"
                                        width="20"
                                        height="14"
                                        rx="2"
                                        strokeWidth="2"
                                    />
                                    <path strokeWidth="2" d="M2 10h20" />
                                </svg>
                            </div>
                            <h3 className="text-white text-lg font-semibold">Aadhaar Card</h3>
                        </div>
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
                            Verified
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="bg-slate-700 rounded-lg overflow-hidden aspect-4/3 border-2 border-emerald-500/50 p-2">
                                <img
                                    src="/api/placeholder/150/120"
                                    alt="Aadhaar front"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-gray-400 text-xs text-center mt-2">Front Side</p>
                        </div>
                        <div>
                            <div className="bg-slate-700 rounded-lg overflow-hidden aspect-4/3 border-2 border-emerald-500/50 p-2">
                                <img
                                    src="/api/placeholder/150/120"
                                    alt="Aadhaar back"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-gray-400 text-xs text-center mt-2">Back Side</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-500/20 p-2 rounded-lg">
                                <svg
                                    className="w-5 h-5 text-amber-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <rect
                                        x="2"
                                        y="5"
                                        width="20"
                                        height="14"
                                        rx="2"
                                        strokeWidth="2"
                                    />
                                    <path strokeWidth="2" d="M2 10h20" />
                                </svg>
                            </div>
                            <h3 className="text-white text-lg font-semibold">PAN Card</h3>
                        </div>
                        <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
                            Pending
                        </span>
                    </div>

                    <div className="border-2 border-dashed border-slate-600 rounded-lg py-12 px-6 bg-slate-800/30">
                        <div className="flex flex-col items-center justify-center text-center">
                            <Camera className="w-12 h-12 text-gray-500 mb-3" />
                            <p className="text-gray-300 font-medium mb-1">Awaiting Document</p>
                            <p className="text-gray-500 text-sm">Ask customer to show PAN card</p>
                        </div>
                    </div>
                </div>
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl mt-8 transition-colors duration-200 shadow-lg shadow-emerald-500/20">
                Complete KYC
            </button>
        </div>
    );
}
