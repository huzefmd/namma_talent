const paths: Record<string, React.ReactNode> = {
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.7 1.5-1.4 0-.6-.3-1-.3-1.6 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4c0-5-4.5-9.5-9-9.5Z" />
      <circle cx="7.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="8" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="11" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5Z" />
    </>
  ),
  music: (
    <>
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="17" cy="15.5" r="2.5" />
      <path d="M9 17.5V5.5l10-2v12" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10.5 21 7.5v9l-5-3Z" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20l1-4L16 5l3 3L8 19l-4 1Z" />
      <path d="M14 7l3 3" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M6 9v6M18 9v6" />
      <path d="M3 12h3M18 12h3" />
      <rect x="6" y="7" width="3" height="10" rx="1" />
      <rect x="15" y="7" width="3" height="10" rx="1" />
    </>
  ),
  toolbox: (
    <>
      <rect x="3" y="9" width="18" height="11" rx="2" />
      <path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 13.5h18" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4.3-4.3" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.3 2.3L16 9.5" />
    </>
  ),
  message: <path d="M4 5h16v11H9l-5 4V5Z" />,
  rocket: (
    <>
      <path d="M12 2c3 1 5.5 4 5.5 8.5 0 2-.6 3.7-1.5 5L12 19l-4-3.5c-.9-1.3-1.5-3-1.5-5C6.5 6 9 3 12 2Z" />
      <circle cx="12" cy="9.5" r="1.7" />
      <path d="M8.5 15.5 6 18M15.5 15.5 18 18" />
    </>
  ),
  arrowRight: <path d="M4 12h16M14 6l6 6-6 6" />,
};

export default function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: keyof typeof paths;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? paths.toolbox}
    </svg>
  );
}
