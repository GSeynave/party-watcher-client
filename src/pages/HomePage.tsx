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
    <main className="h-full overflow-y-auto bg-[#FAF8F5] text-stone-800 font-sans antialiased">
      {/* Hero Banner Section */}
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl flex-col justify-center gap-10 px-4 py-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <div className="space-y-7">
          {/* Badge Pill: Swapped yellow for warm amber/orange linen hues */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-[#F4EFEA] px-3 py-1 text-sm font-semibold text-amber-800 shadow-2xs">
            <Radio
              className="h-4 w-4 text-amber-600 animate-pulse"
              aria-hidden="true"
            />
            Synchronized YouTube rooms
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Party Watcher
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
              A cozy virtual living room for creating watch channels, sharing
              your favorite YouTube videos, and catching up with your friends in
              real time.
            </p>
          </div>

          {/* Primary CTA Buttons matched to lounge styling primitives */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition-colors px-6"
            >
              <Link to={primaryTarget}>{primaryLabel}</Link>
            </Button>
            {!isAuthenticated && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-orange-100 hover:bg-[#F4EFEA]/40 text-stone-700 font-semibold rounded-xl shadow-2xs transition-all"
              >
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Live Interactive Room Preview Display */}
        <div className="rounded-2xl border border-orange-100/60 bg-white p-5 text-stone-800 shadow-md">
          <div className="mb-4 flex items-center justify-between border-b border-orange-100/40 pb-3">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Now watching
              </p>
              <h2 className="text-xl font-bold text-stone-900">
                Friday playlist lounge
              </h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 text-xs font-bold shadow-2xs uppercase tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </div>

          {/* Preview Player (Styled like the screen backdrop component) */}
          <div className="aspect-video rounded-xl border border-stone-800 bg-[#1C1A17] p-4 shadow-inner">
            <div className="flex h-full items-center justify-center rounded-lg bg-stone-950/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-700 hover:bg-amber-600 shadow-md transform transition hover:scale-105 cursor-pointer">
                <Play
                  className="ml-1 h-6 w-6 fill-white text-white"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Info Split Panel */}
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.8fr]">
            <div className="rounded-xl border border-orange-100/30 bg-[#F4EFEA]/40 p-3 shadow-2xs">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                Room chat
              </p>
              <div className="space-y-1.5 text-sm">
                <p className="text-stone-600">
                  <span className="font-bold text-stone-800">Alex:</span> This
                  part is perfect.
                </p>
                <p className="text-stone-600">
                  <span className="font-bold text-amber-700">Sam:</span> Joining
                  now! ☕
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-orange-100/30 bg-[#F4EFEA]/40 p-3 shadow-2xs flex flex-col justify-between">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Friends Inside
              </p>
              <p className="text-3xl font-extrabold text-stone-800">4</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Features Grid Section */}
      <section className="border-t border-b border-orange-100/40 bg-[#F4EFEA]/20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3 lg:px-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="rounded-2xl border border-orange-100/30 bg-white shadow-xs hover:shadow-sm transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EFEA] text-amber-800 border border-orange-100/20">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg font-bold text-stone-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-stone-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Bottom Callout Step Action Section */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="flex flex-col gap-6 rounded-2xl border border-orange-100/60 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              From account to room fast
            </h2>
            <div className="mt-4 flex flex-col flex-wrap gap-4 sm:flex-row">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-2.5 text-sm font-semibold text-stone-600"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-800 text-amber-50 text-xs font-bold shadow-2xs">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate("/rooms")}
            className="w-full sm:w-auto shrink-0 border-orange-100 hover:bg-[#FAF8F5] text-stone-700 font-semibold rounded-xl shadow-2xs transition-all"
          >
            Browse Lounges
          </Button>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
