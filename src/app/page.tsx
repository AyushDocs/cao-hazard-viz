import Link from "next/link";

const topics = [
  {
    title: "Data Hazards",
    description: "RAW, WAR, and RAR data dependencies",
    href: "/hazards/logical",
    icon: "data",
  },
  {
    title: "Structural Hazards",
    description: "Resource conflicts and hardware limitations",
    href: "/hazards/structural",
    icon: "structural",
  },
  {
    title: "Control Hazards",
    description: "Branch prediction, delay slots, and pipeline penalties",
    href: "/hazards/control",
    icon: "control",
  },
  {
    title: "Dependencies",
    description: "Detailed view of data hazards and dependencies",
    href: "/dependencies",
    icon: "deps",
  },
  {
    title: "Resolution Strategies",
    description: "Forwarding, stalling, scoreboarding, Tomasulo",
    href: "/resolution",
    icon: "resolution",
  },
  {
    title: "Interactive Pipeline",
    description: "Time-space diagram and simulation",
    href: "/pipeline",
    icon: "pipeline",
  },
];

function Icon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    data: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    structural: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m11.9 3.664A2.251 2.251 0 0018 22.5h-1.5a2.251 2.251 0 01-2.15-1.586m-11.9-3.664A2.251 2.251 0 005.25 7.5H8.25" />
      </svg>
    ),
    control: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.5M12 16.5h7.5a2.25 2.25 0 002.25-2.25V6m-9 0h9m-9 0a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v-1.5m0 1.5l-3 3m3-3l3-3M4.5 9h15m0 6h-15" />
      </svg>
    ),
    deps: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    resolution: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    pipeline: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        <path strokeLinecap="round" d="M12 3v3m0-3v3M3 12h3m3 0h3M3 3l3 3m0 0l3-3M21 12l-3 3m0 0l-3-3" />
      </svg>
    ),
  };

  return icons[type] || null;
}

export default function Home() {
  const colors = [
    "text-yellow-400",
    "text-orange-400",
    "text-blue-400",
    "text-green-400",
    "text-purple-400",
    "text-indigo-400",
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Computer Architecture
          <br />
          Hazard Visualization
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Interactive visualizations for understanding pipeline hazards,
          dependencies, and resolution strategies in modern processors.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, i) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="group block p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all hover:scale-[1.02]"
          >
            <div className={`w-12 h-12 rounded-lg bg-zinc-800 mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <span className={colors[i]}>
                <Icon type={topic.icon} />
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-400 transition-colors">
              {topic.title}
            </h3>
            <p className="text-sm text-zinc-400">{topic.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-16 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h2 className="text-2xl font-bold mb-4">What are Pipeline Hazards?</h2>
        <p className="text-zinc-400 mb-4">
          Pipeline hazards are situations where the next instruction in a
          pipeline cannot execute in the expected clock cycle due to
          dependencies between instructions.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">Data</div>
            <div className="text-sm text-zinc-500 mt-1">RAW/WAR/RAR</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">Structural</div>
            <div className="text-sm text-zinc-500 mt-1">Resource conflicts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">Control</div>
            <div className="text-sm text-zinc-500 mt-1">Branch instructions</div>
          </div>
        </div>
      </div>
    </div>
  );
}