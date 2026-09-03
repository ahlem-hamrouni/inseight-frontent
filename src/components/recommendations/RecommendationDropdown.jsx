import React from 'react';
import { RefreshCw, Check, Star } from 'lucide-react';

export default function RecommendationDropdown({
    recommendations,
    loading,
    error,
    onReload,
    onRead,
    onReadAll
}) {
    return (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-100 bg-white p-4 shadow-xl z-50 text-gray-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">Course recommendations</h3>
                <button
                    onClick={onReload}
                    disabled={loading}
                    className="p-1 rounded hover:bg-gray-100 text-gray-500 transition disabled:opacity-50"
                    title="Refresh"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 py-1 pr-1">
                {loading && (
                    <div className="py-6 text-center text-xs text-gray-400">
                        Chargement des recommandations...
                    </div>
                )}

                {error && !loading && (
                    <div className="py-6 text-center text-xs text-red-500">
                        Erreur lors de la récupération.
                    </div>
                )}

                {!loading && !error && recommendations?.length === 0 && (
                    <div className="py-6 text-center text-xs text-gray-400">
                        Aucune recommandation disponible.
                    </div>
                )}

                {!loading && !error && recommendations?.map((item) => {
                    const isUnread = item.status === "unread";
                    return (
                        <div
                            key={item._id}
                            onClick={() => onRead(item)}
                            className={`p-3 rounded-lg border transition cursor-pointer ${
                                isUnread
                                    ? "bg-blue-50/40 border-blue-100 hover:bg-blue-50"
                                    : "bg-gray-50/50 border-gray-100 hover:bg-gray-100/60"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                               < div className="flex items-start gap-3">
                                   <Star size={17} className="mt-0.5 shrink-0 text-teal" />
                                    <h4 className="font-bold text-sm text-gray-900">
                                        {item.course?.title || "Cours"}
                                    </h4>
                                </div>
                                {item.score !== undefined && (
                                    <span className="text-xs font-semibold text-gray-600">
                                        {item.score}%
                                    </span>
                                )}
                            </div>

                            {item.reason && (
                                <p className="text-xs text-gray-500 mt-1 pl-6 leading-relaxed">
                                    {item.reason}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {recommendations?.some((r) => r.status === "unread") && (
                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-center">
                    <button
                        onClick={onReadAll}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 uppercase tracking-wider transition"
                    >
                        <Check size={14} className="text-gray-700" />
                        Tout marquer comme lu
                    </button>
                </div>
            )}
        </div>
    );
}