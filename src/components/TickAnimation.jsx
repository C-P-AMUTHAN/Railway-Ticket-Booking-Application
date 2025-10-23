import React from 'react';

const TickAnimation = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <svg
        width="100"
        height="100"
        viewBox="0 0 70 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="35"
          cy="35"
          r="33"
          stroke="#4CAF50"
          strokeWidth="4"
          fill="none"
          strokeDasharray="207"
          strokeDashoffset="207"
          style={{ animation: 'dash 1s forwards ease-in-out' }}
        />
        <path
          d="M20 37 L30 47 L50 27"
          stroke="#4CAF50"
          strokeWidth="4"
          fill="none"
          strokeDasharray="60"
          strokeDashoffset="60"
          style={{ animation: 'dashCheck 0.5s 1s forwards ease-in-out' }}
        />
        <style>
          {`
            @keyframes dash {
              to {
                stroke-dashoffset: 0;
              }
            }
            @keyframes dashCheck {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default TickAnimation;