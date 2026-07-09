export default function LiveBroadcastAshrama({
  hostUrl,
}: any) {

  if (!hostUrl) return;

  return (
    <div className="w-full aspect-4/3 rounded-3xl bg-[#120403] relative overflow-hidden border-2 border-[#FFC227]/40 shadow-2xl">
      <iframe
        src={hostUrl}
        title="Live broadcast"
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}
