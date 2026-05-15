import Link from "next/link";

const hazards = [
  {
    title: "Control Hazards",
    href: "/hazards/control",
    description:
      "Occur when the pipeline must stall due to branch instructions. The processor doesn't know the next instruction until the branch is resolved.",
    stages: ["IF", "ID", "EX", "MEM", "WB"],
    example: "beq $t0, $t1, target",
    color: "blue",
  },
  {
    title: "Structural Hazards",
    href: "/hazards/structural",
    description:
      "Occur when hardware resources are insufficient to execute all instructions in a single cycle. Multiple instructions need the same resource.",
    stages: ["IF", "ID", "EX", "MEM", "WB"],
    example: "Memory conflict",
    color: "orange",
  },
  {
    title: "Logical (Data) Hazards",
    href: "/hazards/logical",
    description:
      "Occur when instructions depend on the results of previous instructions still in the pipeline. Includes RAW, WAR, and RAR hazards.",
    stages: ["IF", "ID", "EX", "MEM", "WB"],
    example: "add $t0, $t1, $t2",
    color: "yellow",
  },
];

export default function HazardsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Pipeline Hazards</h1>

      <div className="space-y-6">
        {hazards.map((hazard) => (
          <Link
            key={hazard.href}
            href={hazard.href}
            className="block group"
          >
            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-indigo-400 transition-colors">
                    {hazard.title}
                  </h2>
                  <p className="text-zinc-400">{hazard.description}</p>
                  <div className="mt-4 p-3 bg-zinc-950 rounded-lg font-mono text-sm text-zinc-300">
                    {hazard.example}
                  </div>
                </div>
                <div className="ml-6">
                  <div className="flex gap-1">
                    {hazard.stages.map((stage, i) => (
                      <div
                        key={stage}
                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
                          hazard.color === "blue"
                            ? "bg-blue-500"
                            : hazard.color === "orange"
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ opacity: 0.3 + (i + 1) * 0.15 }}
                      >
                        {stage}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h2 className="text-2xl font-semibold mb-4">5-Stage MIPS Pipeline</h2>
        <div className="flex gap-2 justify-center">
          {[
            { name: "IF", color: "bg-blue-500", desc: "Instruction Fetch" },
            { name: "ID", color: "bg-green-500", desc: "Instruction Decode" },
            { name: "EX", color: "bg-yellow-500", desc: "Execute" },
            { name: "MEM", color: "bg-orange-500", desc: "Memory Access" },
            { name: "WB", color: "bg-purple-500", desc: "Write Back" },
          ].map((stage, i) => (
            <div key={stage.name} className="text-center">
              <div className={`w-16 h-12 ${stage.color} rounded-lg flex items-center justify-center font-bold mb-2`}>
                {stage.name}
              </div>
              <div className="text-xs text-zinc-500">{stage.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}