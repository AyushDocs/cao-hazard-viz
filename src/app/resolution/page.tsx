"use client";

import { useState } from "react";

const strategies = [
  {
    name: "Pipeline Interlock (Stalling)",
    description: "Hardware automatically inserts bubbles when hazard detected",
    cycles: 8,
    hasForwarding: false,
  },
  {
    name: "Operand Forwarding",
    description: "Forward result directly from EX/MEM to ID/EX stage",
    cycles: 5,
    hasForwarding: true,
  },
  {
    name: "Compiler Scheduling",
    description: "Insert NOPs or reorder instructions at compile time",
    cycles: 6,
    hasForwarding: false,
  },
];

export default function ResolutionPage() {
  const [strategy, setStrategy] = useState(0);
  const [cycle, setCycle] = useState(0);

  const currentStrategy = strategies[strategy];
  const stages = ["IF", "ID", "EX", "MEM", "WB"];

  const instructions = currentStrategy.hasForwarding
    ? [
        { name: "add $t0, $t1, $t2", cycles: [0, 1, 2, 3, 4] },
        { name: "sub $t3, $t0, $t4", cycles: [1, 2, 3, 4, 5] },
      ]
    : [
        { name: "add $t0, $t1, $t2", cycles: [0, 1, 2, 3, 4] },
        { name: "nop", cycles: [1, 2] },
        { name: "sub $t3, $t0, $t4", cycles: [3, 4, 5, 6, 7] },
      ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Resolution Strategies</h1>
      <p className="text-zinc-400 mb-8">
        Multiple techniques exist to resolve pipeline hazards. The choice depends
        on hardware complexity, performance goals, and code characteristics.
      </p>

      <div className="flex gap-4 mb-8 flex-wrap">
        {strategies.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setStrategy(i);
              setCycle(0);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              strategy === i
                ? "bg-indigo-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Pipeline Execution</h3>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            {instructions.map((inst, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="w-8 text-xs text-zinc-500">{i + 1}</div>
                <div className="w-28 text-xs font-mono text-zinc-300 truncate">
                  {inst.name}
                </div>
                <div className="flex-1 flex gap-1">
                  {Array.from({ length: currentStrategy.cycles }).map((_, c) => {
                    const inCycle = inst.cycles.includes(c);
                    const stageName = inCycle ? stages[c - inst.cycles[0]] : "";
                    return (
                      <div
                        key={c}
                        className={`h-8 rounded flex items-center justify-center text-xs border ${
                          inCycle
                            ? "bg-zinc-800 border-zinc-700"
                            : "bg-zinc-900 border-zinc-800"
                        } ${c === cycle && inCycle ? "ring-2 ring-white" : ""}`}
                      >
                        <span className={inCycle ? "text-zinc-400" : "text-zinc-600"}>
                          {stageName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCycle(Math.max(0, cycle - 1))}
              className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"
            >
              ←
            </button>
            <button
              onClick={() => setCycle(cycle + 1)}
              className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 flex-1"
            >
              Next Cycle →
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Forwarding Path</h3>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <svg viewBox="0 0 300 150" className="w-full">
              <rect x="10" y="20" width="60" height="20" rx="4" fill="#3b82f6" />
              <text x="40" y="34" textAnchor="middle" fontSize="10" fill="white">
                IF
              </text>

              <rect x="80" y="20" width="60" height="20" rx="4" fill="#22c55e" />
              <text x="110" y="34" textAnchor="middle" fontSize="10" fill="white">
                ID
              </text>

              <rect x="150" y="20" width="60" height="20" rx="4" fill="#eab308" />
              <text x="180" y="34" textAnchor="middle" fontSize="10" fill="white">
                EX
              </text>

              <rect x="220" y="20" width="60" height="20" rx="4" fill="#f97316" />
              <text x="250" y="34" textAnchor="middle" fontSize="10" fill="white">
                MEM
              </text>

              <path
                d="M 180 40 L 180 60 L 130 60 L 130 40"
                fill="none"
                stroke={currentStrategy.hasForwarding ? "#22c55e" : "#6b7280"}
                strokeWidth="2"
                strokeDasharray={currentStrategy.hasForwarding ? "" : "5,5"}
              />
              {currentStrategy.hasForwarding && (
                <text x="190" y="55" fontSize="8" fill="#22c55e">
                  Forward
                </text>
              )}
            </svg>
            <p className="text-sm text-zinc-400 mt-4">{currentStrategy.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-xl font-semibold mb-4">Advanced: Scoreboarding & Tomasulo</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-purple-400">Scoreboarding</h4>
            <p className="text-sm text-zinc-400 mb-2">
              Tracks register usage and instructions in flight. Ensures all data
              is ready before instruction issues.
            </p>
            <div className="text-xs text-zinc-500">
              Used in: CDC 6600, early SPARC
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-indigo-400">Tomasulo Algorithm</h4>
            <p className="text-sm text-zinc-400 mb-2">
              Reservation stations rename registers dynamically. Allows out-of-order
              execution while maintaining correctness.
            </p>
            <div className="text-xs text-zinc-500">
              Used in: Intel Pentium, modern CPUs
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
        <p className="text-sm text-green-300">
          <strong>Best Practice:</strong> Most modern processors use a combination -
          hardware forwarding for nearby dependencies and scoreboarding/Tomasulo for
          more complex out-of-order execution.
        </p>
      </div>
    </div>
  );
}