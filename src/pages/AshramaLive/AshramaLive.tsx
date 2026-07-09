import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  useCreateAshramaLiveSessionMutation,
  useEndAshramaLiveSessionMutation,
} from "../../redux/api/ashramamLiveApi";
import LiveBroadcastAshrama from "./LiveBroadcastAshrama";
import AshramaGoLiveCard from "./components/AshramaGoLiveCard";
import ScheduleSession from "./components/ScheduleSession";
import SessionButton from "./components/SessionButton";

const AshramaLive = () => {
  const location = useLocation();

  const [topic, setTopic] = useState("");
  // The live session created on the backend (carries id + host broadcast url).
  const [activeSession, setActiveSession] = useState<any>(null);
  const [isLive, setIsLive] = useState(false);

  const [createLiveSession, { isLoading: isCreating }] =
    useCreateAshramaLiveSessionMutation();
  const [endLiveSession, { isLoading: isEnding }] =
    useEndAshramaLiveSessionMutation();

  // Listen for scheduled sessions launched from other tabs (like Bookings)
  useEffect(() => {
    if (location.state?.activeSession) {
      const session = location.state.activeSession;
      setActiveSession(session);
      setTopic(session.title || "");
      setIsLive(true);

      // Clear navigation state to prevent re-entering live mode on reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleStartLive = async () => {
    const title = topic.trim();
    if (!title) {
      alert("Please enter a session topic before going live.");
      return;
    }

    try {
      const session = await createLiveSession({
        mode: "live",
        title,
      }).unwrap();
      if (!session?.host_url) {
        alert(
          "Live room was created but no broadcast link was returned. Please try again.",
        );
        return;
      }
      setIsLive(true);
      setActiveSession(session);
    } catch (err: any) {
      console.error("Failed to start live session", err);
      alert(
        err?.data?.message ||
          "Could not start the live session. Please try again.",
      );
    } finally {
      setTopic("");
    }
  };

  const handleEndLive = async () => {
    if (!confirm("Are you sure you want to end this live session?")) return;

    try {
      if (activeSession?.id) {
        await endLiveSession(activeSession.id).unwrap();
      }
    } catch (err) {
      console.error("Failed to end live session", err);
    } finally {
      setIsLive(false);
      setTopic("");
      setActiveSession(null);
    }
  };

  return (
    <section className="p-4">
      {isLive && activeSession?.host_url ? (
        <>
          <LiveBroadcastAshrama
            hostUrl={activeSession?.host_url}
          />
          <SessionButton
            title={"End Session"}
            handleClick={handleEndLive}
            disabled={isEnding}
          />
        </>
      ) : (
        <>
          <AshramaGoLiveCard
            topic={topic}
            setTopic={setTopic}
            handleStartLive={handleStartLive}
            isStarting={isCreating}
          />
          <ScheduleSession />
        </>
      )}
    </section>
  );
};

export default AshramaLive;
