"use client";

import { useState } from "react";

const hazardTypes = [
  {
    name: "RAW - Read After Write",
    abbrev: "True Dependency",
    description: "Instruction reads a register that a previous instruction writes to",
    color: "red",
    example: `add $t0, $t1, $t2  # writes $t0
sub $t3, $t0, $t4  # reads $t0 - STALL until add writes back`,
  },
  {
    name: "WAR - Write After Read",
    abbrev: "Anti-Dependency",
    description: "Instruction writes a register that a previous instruction reads from",
    color: "yellow",
    example: `lw $t0, 0($t1)    # reads $t1
add $t1, $t2, $t3  # writes $t1 - only in out-of-order execution`,
  },
  {
    name: "RAR - Read After Read",
    abbrev: "Output Dependency",
    description: "Two instructions write to the same register",
    color: "blue",
    example: `add $t0, $t1, $t2  # writes $t0
add $t0, $t3, $t4  # writes $t0 - must preserve order`,
  },
];

export default function LogicalHazardsPage() {
  const [selectedHazard, setSelectedHazard] = useState(0);
  const [cycle, setCycle] = useState(0);

  const hazard = hazardTypes[selectedHazard];
  const stages = ["IF", "ID", "EX", "MEM", "WB"];

  const instructions = [
    { name: "I1: add $t0, $t1, $t2", cycles: [0, 1, 2, 3, 4] },
    { name: "I2: sub $t3, $t0, $t4", cycles: [1, 2, 3, 4, 5] },
  ];

  const hazardCycle = selectedHazard === 0 ? 2 : selectedHazard === 1 ? 1 : 1;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Logical (Data) Hazards</h1>
      <p className="text-zinc-400 mb-8">
        Logical hazards occur when instructions depend on the results of previous
        instructions still in the pipeline. These are the most common type of hazard
        in modern processors.
      </p>

      <div className="flex gap-4 mb-8">
        {hazardTypes.map((h, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedHazard(i);
              setCycle(0);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedHazard === i
                ? i === 0
                  ? "bg-red-600"
                  : i === 1
                  ? "bg-yellow-600"
                  : "bg-blue-600"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {h.abbrev}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Pipeline with {hazard.abbrev}</h3>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex flex-col gap-2">
              {instructions.map((inst, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 text-xs font-mono text-zinc-400">{i + 1}</div>
                  <div className="w-32 text-xs font-mono truncate text-zinc-300">
                    {inst.name}
                  </div>
                  <div className="flex-1 flex gap-1">
                    {inst.cycles.map((c) => {
                      const isHazard = c === hazardCycle && i === 1 && selectedHazard === 0;
                      const isStalled = c < hazardCycle + i && i === 1 && selectedHazard === 0 && c < 4;
                      return (
                        <div
                          key={c}
                          className={`h-8 rounded flex items-center justify-center text-xs font-medium transition-all ${
                            isStalled
                              ? "bg-zinc-700"
                              : i === 0
                              ? "bg-green-500"
                              : isHazard
                              ? "hazard-pulse bg-red-500"
                              : "bg-purple-500"
                          }`}
                        >
                          {stages[c - i] || ""}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCycle(Math.max(0, cycle - 1))}
              className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCycle(cycle + 1)}
              className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"
            >
              Next Cycle →
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Example Code</h3>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 font-mono text-sm">
            <pre className="text-zinc-300 whitespace-pre-wrap">{hazard.example}</pre>
          </div>

          <div className="mt-6 p-4 rounded-lg border border-zinc-700 bg-zinc-900">
            <h4 className="font-medium mb-2 text-zinc-300">Why it happens:</h4>
            <p className="text-sm text-zinc-400">{hazard.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-xl font-semibold mb-4">Hazard Summary</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-red-900/20 border border-red-800">
            <div className="text-red-400 font-bold text-lg">RAW</div>
            <div className="text-sm text-zinc-400 mt-1">Most common - True dependency</div>
            <div className="text-xs text-zinc-500 mt-2">Must stall or forward</div>
          </div>
          <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-800">
            <div className="text-yellow-400 font-bold text-lg">WAR</div>
            <div className="text-sm text-zinc-400 mt-1">Anti-dependency</div>
            <div className="text-xs text-zinc-500 mt-2">Only in out-of-order</div>
          </div>
          <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-800">
            <div className="text-blue-400 font-bold text-lg">RAR</div>
            <div className="text-sm text-zinc-400 mt-1">Output dependency</div>
            <div className="text-xs text-zinc-500 mt-2">Register renaming fixes</div>
          </div>
        </div>
      </div>
    </div>
  );
}