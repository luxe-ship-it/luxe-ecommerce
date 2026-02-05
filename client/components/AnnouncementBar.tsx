import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export const AnnouncementBar: React.FC = () => {
  const { data: announcement } = useQuery({
    queryKey: ["announcement"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/settings/announcement");
      return res.message;
    }
  });

  const text = announcement || "🎉 Happy New Year 2026. Welcome to LUXÉ.";

  // Create an array to repeat the text for the marquee effect
  const announcements = [text, text, text];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground overflow-hidden h-10 flex items-center">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }

        .marquee span {
          white-space: nowrap;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          margin-right: 3rem;
        }
      `}</style>

      <div className="w-full overflow-hidden">
        <div className="marquee">
          {[...announcements, ...announcements].map((t, idx) => (
            <span key={idx}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
