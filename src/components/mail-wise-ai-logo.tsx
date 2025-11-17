export function MailWiseAiLogo() {
  return (
    <div className="flex items-center gap-2" aria-label="MailWise AI">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M22 13V9C22 7.89543 21.1046 7 20 7H4C2.89543 7 2 7.89543 2 9V17C2 18.1046 2.89543 19 4 19H12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 9L12 14L22 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 15.5L19 17.5L21 18.5L19 19.5L18 21.5L17 19.5L15 18.5L17 17.5L18 15.5Z"
          fill="hsl(var(--primary))"
          stroke="hsl(var(--card))"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="text-lg font-bold">MailWise AI</span>
    </div>
  );
}
