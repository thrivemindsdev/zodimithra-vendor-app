import { useEffect, useState } from "react";

import {
  useCreateAshramaLiveSessionMutation,
  useEndAshramaLiveSessionMutation,
  useGetAshramaLiveSessionsQuery,
  useStartAshramaLiveSessionMutation,
} from "../../redux/api/ashramamLiveApi";

import AshramaGoLiveCard from "./components/AshramaGoLiveCard";
import FeaturedSessions from "./components/FeaturedSessions";
import ScheduleSession from "./components/ScheduleSession";
import LiveBroadcastAshrama from "./LiveBroadcastAshrama";

const AshramaLive = () => {
  const [topic, setTopic] = useState("");
  const [activeSession, setActiveSession] = useState<any>(null);

  const isLive = Boolean(activeSession?.host_url);

  const [createSession, { isLoading: isCreating }] =
    useCreateAshramaLiveSessionMutation();

  const [endSession, { isLoading: isEnding }] =
    useEndAshramaLiveSessionMutation();

  const [startScheduledSession] = useStartAshramaLiveSessionMutation();

  const { data: liveSessionsData } = useGetAshramaLiveSessionsQuery(undefined, {
    pollingInterval: 15000,
  });

  useEffect(() => {
    const liveSession = liveSessionsData?.live?.[0] ?? null;
    setActiveSession(liveSession);
  }, [liveSessionsData]);

  const upcomingSessions = liveSessionsData?.upcoming ?? [];

  const startLiveSession = async (title: string) => {
    if (!title.trim()) {
      alert("Please enter a session topic before going live.");
      return;
    }

    try {
      const session = await createSession({
        mode: "live",
        title: title.trim(),
      }).unwrap();

      if (!session?.host_url) {
        throw new Error("Missing broadcast URL");
      }

      setActiveSession(session);
      setTopic("");
    } catch (error: any) {
      console.error("Start live session failed:", error);

      alert(
        error?.data?.message ??
          "Could not start live session. Please try again.",
      );
    }
  };

  const startScheduledLiveSession = async (sessionId: number) => {
    if (!sessionId) return;

    try {
      const session = await startScheduledSession(sessionId).unwrap();

      if (!session?.host_url) {
        throw new Error("Missing broadcast URL");
      }

      setActiveSession(session);
    } catch (error: any) {
      console.error("Start scheduled session failed:", error);

      alert(
        error?.data?.message ??
          "Could not start live session. Please try again.",
      );
    }
  };

  const stopLiveSession = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to end this live session?",
    );

    if (!confirmed) return;

    try {
      if (activeSession?.id) {
        await endSession(activeSession.id).unwrap();
      }
    } catch (error) {
      console.error("End live session failed:", error);
    } finally {
      setActiveSession(null);
      setTopic("");
    }
  };

  return (
    <section className="p-4 lg:flex lg:justify-center lg:items-center lg:h-screen pb-20 lg:pb-0">
      {isLive ? (
        <LiveBroadcastAshrama
          hostUrl={activeSession?.host_url}
          stopLiveSession={stopLiveSession}
          isEnding={isEnding}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <AshramaGoLiveCard
            topic={topic}
            setTopic={setTopic}
            handleStartLive={() => startLiveSession(topic)}
            isStarting={isCreating}
          />

          {upcomingSessions.length > 0 && (
            <FeaturedSessions
              handleStart={startScheduledLiveSession}
              sessions={upcomingSessions}
            />
          )}

          <ScheduleSession />
        </div>
      )}
    </section>
  );
};

export default AshramaLive;
