import SessionButton from "./SessionButton";

interface AshramaGoLiveCardProps {
  topic: string;
  setTopic: (topic: string) => void;
  handleStartLive: () => void;
  isStarting: boolean;
}

const AshramaGoLiveCard = ({
  topic,
  setTopic,
  handleStartLive,
  isStarting,
}: AshramaGoLiveCardProps) => {
  const inputClass =
    " mt-5 h-10 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-white  placeholder:text-white/70 placeholder:text-sm outline-none focus:border-white/40";

  return (
    <div className="rounded-2xl bg-linear-to-b from-[#7d2f30] to-[#9b3832] p-6 text-white shadow-lg">
      <div className="flex items-center justify-center gap-3">
        <span className="h-3.5 w-3.5 rounded-full bg-red-500"></span>
        <h2 className="text-[22px] font-semibold tracking-wide">GO LIVE</h2>
      </div>

      <p className="mt-5 text-center text-[16px] text-white/90">
        Start your live asramam session
      </p>

      <div className="mt-5 grid grid-cols-2 text-center">
        <div>
          <h3 className="text-[17px] font-bold">1.2K</h3>
          <p className="mt-1 text-sm text-white/80">Followers</p>
        </div>

        <div>
          <h3 className="text-[17px] font-bold">47</h3>
          <p className="mt-1 text-sm text-white/80">Sessions done</p>
        </div>
      </div>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Session Topic (e.g. Daily Horoscope 2025)"
        className={inputClass}
      />

      <SessionButton
        title={"Start Live Now"}
        handleClick={handleStartLive}
        disabled={isStarting}
      />
    </div>
  );
};

export default AshramaGoLiveCard;
