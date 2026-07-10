import SessionButton from "./SessionButton";

const FeaturedSessions = ({ sessions, handleStart }: any) => {
  const getDateInfo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    const isLive = new Date() >= date;

    return {
      badge: isLive
        ? "Live"
        : isTomorrow || isToday
          ? "Soon"
          : date.toLocaleDateString("en-US", {
              weekday: "short",
            }),
      day: isToday
        ? "Today"
        : isTomorrow
          ? "Tomorrow"
          : date.toLocaleDateString("en-US", {
              weekday: "long",
            }),
      time: date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  };

  const hasSessionStarted = (startTime: string) => {
    return new Date() >= new Date(startTime);
  };

  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">
          Featured Sessions
        </h2>
        {/* <button className="text-xs font-medium text-[#7B2D2D]">See All</button> */}
      </div>

      <div className="h-[50vh] lg:h-[55vh] overflow-y-auto">
        {sessions?.length > 0 &&
          sessions?.map((session: any) => {
            const info = getDateInfo(session.start_time);

            return (
              <div key={session.id} className="shadow-sm p-4 rounded-2xl mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    {/* Date Badge */}
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 w-20 py-1.5 ${
                        info.badge === "Live"
                          ? "bg-red-50 border-red-200 text-red-600"
                          : info.badge === "Soon"
                            ? "bg-amber-50 border-amber-200 text-amber-600"
                            : "bg-blue-50 border-blue-200 text-blue-600"
                      }`}
                    >
                      {info.badge === "Live" && (
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 animate-ping opacity-60"></span>
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                        </span>
                      )}

                      {info.badge !== "Live" && (
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            info.badge === "Soon"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        ></span>
                      )}

                      <span className="text-xs font-semibold tracking-wide uppercase">
                        {info.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-[15px] font-semibold">
                        {session.title}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {session.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="text-right">
                    <p className="text-[11px] font-medium">{info.day}</p>

                    <p className="text-[11px] text-gray-500">{info.time}</p>
                  </div>
                </div>
                {hasSessionStarted(session.start_time) && (
                  <SessionButton
                    title={"Go Live Now"}
                    handleClick={() => handleStart(session.id)}
                    disabled={false}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FeaturedSessions;
