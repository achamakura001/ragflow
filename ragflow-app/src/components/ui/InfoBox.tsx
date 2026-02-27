import React from "react";

interface InfoBoxProps { icon?: string; children: React.ReactNode; }

export const InfoBox: React.FC<InfoBoxProps> = ({ icon = "i", children }) => (
  <div className="info-box">
    <span className="info-box-icon">{icon}</span>
    <span>{children}</span>
  </div>
);
