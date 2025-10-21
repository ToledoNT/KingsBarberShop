// components/LoadingSpinner.tsx
const LoadingSpinner = () => (
  <div className="flex min-h-screen bg-[#0D0D0D] text-[#E5E5E5] items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
  </div>
);

export default LoadingSpinner;