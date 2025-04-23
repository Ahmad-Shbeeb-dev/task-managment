export const TaskManagmentLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="65"
      height="53"
      viewBox="0 0 65 53"
      fill="none"
    >
      <defs>
        <linearGradient
          id="primaryGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
        </filter>
      </defs>
      <g clipPath="url(#clip0_123_456)" filter="url(#shadow)">
        <rect
          x="15"
          y="6.625"
          width="35"
          height="39.75"
          rx="4"
          fill="url(#primaryGradient)"
          opacity="0.1"
        />
        <path
          d="M47.125 6.625H17.875C16.2872 6.625 15 7.91219 15 9.5V43.5C15 45.0878 16.2872 46.375 17.875 46.375H47.125C48.7128 46.375 50 45.0878 50 43.5V9.5C50 7.91219 48.7128 6.625 47.125 6.625Z"
          stroke="url(#primaryGradient)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M24.375 25.25L30 30.875L42.5 18.375"
          stroke="url(#primaryGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.375 35.25L28.125 39L30.625 36.5"
          stroke="url(#primaryGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_123_456">
          <rect width="65" height="53" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
