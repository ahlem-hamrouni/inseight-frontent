import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import RecommendationDropdown from "./RecommendationDropdown";
import * as service from "../../services/recommendationService";

export default function RecommendationBell({ studentId }) {
    const [open, setOpen] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const containerRef = useRef(null);

    const load = () => {
        if (!studentId) return;
        setLoading(true);
        setError(false);
        service
            .getRecommendations(studentId)
            .then((result) => {
                const items = Array.isArray(result?.data?.data) 
                    ? result.data.data 
                    : Array.isArray(result?.data) 
                        ? result.data 
                        : [];
                setRecommendations(items);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, [studentId]);

    useEffect(() => {
        const close = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];

    const unreadCount = safeRecommendations.filter(
        (recommendation) => recommendation.status === "unread"
    ).length;

    const read = (recommendation) => {
        if (recommendation.status === "unread") {
            service
                .markRecommendationAsRead(recommendation._id)
                .then(() => {
                    setRecommendations((items) =>
                        (Array.isArray(items) ? items : []).map((item) =>
                            item._id === recommendation._id
                                ? { ...item, status: "read" }
                                : item
                        )
                    );
                });
        }
    };

    const readAll = () => {
        service
            .markAllRecommendationsAsRead(studentId)
            .then(() => {
                setRecommendations((items) =>
                    (Array.isArray(items) ? items : []).map((item) => ({ ...item, status: "read" }))
                );
            });
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                className="relative grid h-10 w-10 place-items-center rounded-full text-ink/65 transition hover:bg-black/5"
                title="Course recommendations"
                aria-label="Ouvrir les recommandations"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
            >
                <Bell size={19} />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <RecommendationDropdown
                    recommendations={safeRecommendations}
                    loading={loading}
                    error={error}
                    onReload={load}
                    onRead={read}
                    onReadAll={readAll}
                />
            )}
        </div>
    );
}