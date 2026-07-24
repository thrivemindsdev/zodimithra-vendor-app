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

// AshramaLive.tsx (Snippet)

import { Camera } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

const requestBroadcastingPermissions = async (): Promise<boolean> => {
  // 1. Native Mobile (Android/iOS)
  if (Capacitor.isNativePlatform()) {
    try {
      // Request camera native permission (Capacitor Camera plugin)
      const permissions = await Camera.requestPermissions({
        permissions: ["camera"],
      });

      if (
        permissions.camera !== "granted" &&
        permissions.camera !== "limited"
      ) {
        alert(
          "Camera permission is required to go live. Please enable it in system settings.",
        );
        return false;
      }

      // Return true to allow WebView to initiate microphone & broadcast iframe
      return true;
    } catch (error) {
      console.warn("Native camera permission check skipped or failed:", error);
      return true;
    }
  }

  // 2. Web / Browser
  // If running over local HTTP dev server (10.x.x.x), navigator.mediaDevices is undefined.
  // We bypass the pre-check instead of blocking the app with an alert.
  if (!navigator?.mediaDevices?.getUserMedia) {
    console.warn(
      "navigator.mediaDevices is unavailable in this environment (likely HTTP context). Skipping pre-check.",
    );
    return true;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // Release camera & mic hardware handles so the broadcast iframe can use them
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    console.error("Camera/Microphone access denied:", error);
    alert(
      "Camera and Microphone permissions are required to start a live session.",
    );
    return false;
  }
};

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

    // 🔴 1. Request device permissions first
    const hasPermissions = await requestBroadcastingPermissions();
    if (!hasPermissions) return; // Stop if user denied access

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
