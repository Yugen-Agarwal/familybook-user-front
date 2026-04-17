export default function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4 border-[1.5px]', md: 'w-5 h-5 border-2', lg: 'w-9 h-9 border-[3px]' }[size];
  return (
    <div className={`${s} border-brand-200 border-t-brand rounded-full animate-spin`} />
  );
}
