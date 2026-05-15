"use client";

import { useState } from "react";

const scenarios = [
  {
    name: "Single Memory port",
    description: "Both instruction fetch and data access need memory in same cycle",
    problem: "lw and IF both need memory in cycle 4",
  },
  {
    name: "Single ALU",
    description: "Two instructions need ALU in same cycle",
    problem: "add and sub both need ALU in EX stage",
  },
];

export default function StructuralHazardsPage() {
  const [scenario, setScenario] = useState(0);
  const [cycle, setCycle] = useState(0);

  const instructions = [
    { name: "lw $t0, 0($t1)", cycles: [0, 1, 2, 3, 4], hazard: 3 },
    { name: "add $t2, $t3, $t4", cycles: [1, 2, 3, 4, 5], hazard: 2 },
    { name: "sub $t5, $t6, $t7", cycles: [2, 3, 4, 5, 6], hazard: 2 },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Structural Hazards</h1>
      <p className="text-zinc-400 mb-8">
        Structural hazards occur when the processor lacks sufficient hardware
        resources to execute all instructions in a given cycle. This happens
        when different pipeline stages need the same physical resource.
      </p>

      <div className="flex gap-4 mb-8">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setScenario(i);
              setCycle(0);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              scenario === i
                ? "bg-orange-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Resource Conflict</h3>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium">Memory</div>
                <div className="flex-1 h-12 bg-zinc-800 rounded relative overflow-hidden">
                  <div
                    className="absolute inset-0 flex items-center justify-center text-xs"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, transparent ${(cycle / 8) * 100}%, #f9731650 ${(cycle / 8) * 100}%, #f9731650 100%)`,
                    }}
                  >
                    <span className="text-orange-400 font-medium">
                      {cycle >= 3 && cycle <= 4 ? "CONFLICT!" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium">ALU</div>
                <div className="flex-1 h-12 bg-zinc-800 rounded relative">
                  <div
                    className="absolute inset-0 flex items-center justify-center text-xs"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, transparent ${(cycle / 8) * 100}%, #eab30850 ${(cycle / 8) * 100}%, #eab30850 100%)`,
                    }}
                  >
                    <span className="text-yellow-400 font-medium">
                      {cycle >= 2 && cycle <= 3 ? "CONFLICT!" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium">Registers</div>
                <div className="flex-1 h-12 bg-zinc-800 rounded relative">
                  <div
                    className="absolute inset-0 flex items-center justify-center text-xs"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, transparent ${(cycle / 8) * 100}%, #a855f750 ${(cycle / 8) * 100}%, #a855f750 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Time-Space Diagram</h3>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 overflow-x-auto">
            <div className="min-w-[400px]">
              <div className="flex mb-2">
                <div className="w-32 text-xs text-zinc-500">Cycle→</div>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
                  <div key={c} className="flex-1 text-center text-xs text-zinc-500">
                    {c}
                  </div>
                ))}
              </div>
              {instructions.map((inst, i) => (
                <div key={i} className="flex mb-1">
                  <div className="w-32 text-xs font-mono truncate pr-2 text-zinc-300">
                    {inst.name}
                  </div>
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((c) => {
                      const inCycle = inst.cycles.includes(c);
                      const hasHazard = inst.hazard === c;
                      return (
                        <div
                          key={c}
                          className={`h-6 rounded flex items-center justify-center text-xs ${
                            inCycle
                              ? i === 0
                                ? "bg-orange-500"
                                : i === 1
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                              : "bg-zinc-800"
                          } ${
                            hasHazard && cycle >= c
                              ? "hazard-pulse border-2 border-red-500"
                              : ""
                          }`}
                        >
                          {hasHazard && cycle >= c ? "!" : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={() => setCycle(Math.max(0, cycle - 1))}
          className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"
        >
          ← Previous
        </button>
        <button
          onClick={() => setCycle(cycle + 1)}
          className="px-4 py-2 bg-orange-600 rounded-lg hover:bg-orange-500"
        >
          Next Cycle →
        </button>
      </div>

      <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-xl font-semibold mb-4">Solutions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-orange-400">Duplicate Resources</h4>
            <p className="text-sm text-zinc-400">
              Add separate instruction and data memory, or multiple ALU units.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-green-400">Pipeline Stalling</h4>
            <p className="text-sm text-zinc-400">
              Insert bubbles until resource is available. Simple but costs performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}