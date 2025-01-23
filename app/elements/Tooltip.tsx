// components/Tooltip.tsx
import React from 'react';
import '../../styles/tooltip.css'; // Ensure this file contains the necessary styles

interface TooltipProps {
    children: React.ReactNode; // The element that triggers the tooltip
    text: string; // HTML content as a string
  }
  
  const Tooltip: React.FC<TooltipProps> = ({ children, text }) => (
    <div className="tooltip-wrapper">
      {children}
      <div
        className="tooltip-content"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );

export default Tooltip;
