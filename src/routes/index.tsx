import { lazy, Suspense, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { EntryScreen, Settling } from "@/game/ui/EntryScreen";

const Play = lazy(() => import("@/game/Play"));

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [live, setLive] = useState(false);

  if (!live) return <EntryScreen onStart={() => setLive(true)} />;

  return (
    <Suspense fallback={<Settling />}>
      <Play onLeave={() => setLive(false)} />
    </Suspense>
  );
}
