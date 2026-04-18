export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-orange-400 rounded-full animate-spin" />
      <p className="text-zinc-500 text-sm">{text}</p>
    </div>
  );
}
