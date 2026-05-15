import Link from "next/link";

const topics = [
  {
    title: "Data Hazards",
    description: "RAW, WAR, and RAR data dependencies",
    href: "/hazards/logical",
    color: "bg-yellow-500",
  },
  {
    title: "Structural Hazards",
    description: "Resource conflicts and hardware limitations",
    href: "/hazards/structural",
    color: "bg-orange-500",
  },
  {
    title: "Control Hazards",
    description: "Branch prediction, delay slots, and pipeline penalties",
    href: "/hazards/control",
    color: "bg-blue-500",
  },
  {
    title: "Dependencies",
    description: "Detailed view of data hazards and dependencies",
    href: "/dependencies",
    color: "bg-green-500",
  },
  {
    title: "Resolution Strategies",
    description: "Forwarding, stalling, scoreboarding, Tomasulo",
    href: "/resolution",
    color: "bg-purple-500",
  },
  {
    title: "Interactive Pipeline",
    description: "Time-space diagram and simulation",
    href: "/pipeline",
    color: "bg-indigo-500",
  },
];

export default function Home() {
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
        {topics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="group block p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all hover:scale-[1.02]"
          >
            <div
              className={`w-12 h-12 rounded-lg ${topic.color} mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}
            />
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
            <div className="text-3xl font-bold text-blue-400">Control</div>
            <div className="text-sm text-zinc-500 mt-1">Branch instructions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">Structural</div>
            <div className="text-sm text-zinc-500 mt-1">Resource conflicts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">Data</div>
            <div className="text-sm text-zinc-500 mt-1">RAW/WAR/RAR</div>
          </div>
        </div>
      </div>
    </div>
  );
}