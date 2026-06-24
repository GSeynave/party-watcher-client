import { Link, useNavigate } from "react-router";
import { MessageCircle, Play, Radio, UsersRound } from "lucide-react";

import "../App.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";

const features = [
  {
    title: "Shared rooms",
    description:
      "Create a room around a YouTube embed link, then let friends join from the room list.",
    icon: UsersRound,
  },
  {
    title: "Watch together",
    description:
      "Keep the video at the center of the room so everyone has the same place to gather.",
    icon: Play,
  },
  {
    title: "Live conversation",
    description:
      "Chat, presence, joins, and leaves update through Socket.IO while people watch.",
    icon: MessageCircle,
  },
];

const steps = ["Create an account", "Open or create a room", "Watch and chat"];

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const primaryTarget = isAuthenticated ? "/rooms" : "/register";
  const primaryLabel = isAuthenticated ? "Browse rooms" : "Get started";

  return (
    <main className="h-full overflow-y-auto bg-white text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl flex-col justify-center gap-10 px-4 py-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-900">
            <Radio className="h-4 w-4" aria-hidden="true" />
            Synchronized YouTube rooms
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Party Watcher
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              A small portfolio app for creating watch rooms, sharing a YouTube
              video, and chatting with everyone in the room in real time.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to={primaryTarget}>{primaryLabel}</Link>
            </Button>
            {!isAuthenticated && (
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white shadow-xl">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <p className="text-sm text-yellow-200">Now watching</p>
              <h2 className="text-xl font-semibold">Friday playlist room</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Live
            </div>
          </div>

          <div className="aspect-video rounded-md border border-white/10 bg-slate-800 p-4">
            <div className="flex h-full items-center justify-center rounded bg-slate-900">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
                <Play className="ml-1 h-8 w-8 fill-white" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.8fr]">
            <div className="rounded-md bg-white/10 p-3">
              <p className="text-sm text-slate-300">Room chat</p>
              <div className="mt-3 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-yellow-200">Alex:</span>{" "}
                  This part is perfect.
                </p>
                <p>
                  <span className="font-semibold text-cyan-200">Sam:</span>{" "}
                  Joining now.
                </p>
              </div>
            </div>
            <div className="rounded-md bg-white/10 p-3">
              <p className="text-sm text-slate-300">People inside</p>
              <p className="mt-3 text-3xl font-bold">4</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-3 lg:px-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title} className="rounded-lg">
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-yellow-100 text-yellow-900">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-4 rounded-lg border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              From account to room fast
            </h2>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={() => navigate("/rooms")}>
            Rooms
          </Button>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
