import SessionButton from "./components/SessionButton";

export default function LiveBroadcastAshrama({
  hostUrl,
  stopLiveSession,
  isEnding,
}: any) {
  if (!hostUrl) return;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-white p-4 rounded-2xl">
        <div className="w-full aspect-4/3 lg:h-[75vh] rounded-2xl bg-[#120403] overflow-hidden">
          <iframe
            src={hostUrl}
            title="Live broadcast"
            allow="camera; microphone; fullscreen; display-capture; autoplay;"
            className="w-full h-full border-0"
          />
        </div>

        <SessionButton
          title="End Session"
          handleClick={stopLiveSession}
          disabled={isEnding}
        />
      </div>
      {/* <div className="bg-white p-4 rounded-2xl">
        <h2>Comments</h2>
      </div> */}
    </div>
  );
}
