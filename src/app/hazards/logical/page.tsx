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
    instructions: [
      { name: "I1: add $t0, $t1, $t2", start: 0 },
      { name: "I2: sub $t3, $t0, $t4", start: 1, hasHazard: true },
    ],
    stallCycles: 2,
  },
  {
    name: "WAR - Write After Read",
    abbrev: "Anti-Dependency",
    description: "Instruction writes a register that a previous instruction reads from",
    color: "yellow",
    example: `lw $t0, 0($t1)    # reads $t1
add $t1, $t2, $t3  # writes $t1 - only in out-of-order execution`,
    instructions: [
      { name: "I1: lw $t0, 0($t1)", start: 0 },
      { name: "I2: add $t1, $t2, $t3", start: 1, hasHazard: true },
    ],
    stallCycles: 0,
  },
  {
    name: "RAR - Read After Read",
    abbrev: "Output Dependency",
    description: "Two instructions write to the same register",
    color: "blue",
    example: `add $t0, $t1, $t2  # writes $t0
add $t0, $t3, $t4  # writes $t0 - must preserve order`,
    instructions: [
      { name: "I1: add $t0, $t1, $t2", start: 0 },
      { name: "I2: add $t0, $t3, $t4", start: 1, hasHazard: true },
    ],
    stallCycles: 0,
  },
];

export default function LogicalHazardsPage() {
  const [selectedHazard, setSelectedHazard] = useState(0);
  const [cycle, setCycle] = useState(0);

  const hazard = hazardTypes[selectedHazard];
  const stages = ["IF", "ID", "EX", "MEM", "WB"];
  
  const totalCycles = hazard.instructions.length + 4 + hazard.stallCycles;

  const getCellContent = (instIndex: number, cycleNum: number) => {
    const inst = hazard.instructions[instIndex];
    const startCycle = inst.start;
    
    if (cycleNum < startCycle) return "";
    
    const offset = cycleNum - startCycle;
    if (offset > 4) return "";
    
    const stageIndex = offset;
    if (inst.hasHazard && hazard.stallCycles > 0) {
      if ((instIndex === 1) && (cycleNum === startCycle + 1 || cycleNum === startCycle + 2)) {
        return "STALL";
      }
    }
    
    return stages[stageIndex];
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Data Hazards</h1>
      <p className="text-zinc-400 mb-8">
        Data hazards occur when instructions depend on the results of previous
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
          <h3 className="text-lg font-semibold mb-4">Time-Space Diagram</h3>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="w-full">
              <div className="flex mb-2">
                <div className="w-28 flex-shrink-0 text-xs text-zinc-500 text-right pr-2">Cycle→</div>
                <div className="flex flex-1">
                  {[...Array(totalCycles)].map((_, c) => (
                    <div
                      key={c}
                      className={`flex-1 text-center text-xs ${
                        c === cycle ? "text-indigo-400 font-bold" : "text-zinc-500"
                      }`}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {hazard.instructions.map((inst, i) => (
                <div key={i} className="flex mb-1">
                  <div className="w-28 flex-shrink-0 text-xs font-mono truncate pr-2 text-zinc-300 text-right">
                    {inst.name}
                  </div>
                  <div className="flex flex-1">
                    {[...Array(totalCycles)].map((_, c) => {
                      const content = getCellContent(i, c);
                      const isCurrentCycle = c === cycle;
                      const isStall = content === "STALL";
                      const isExecuting = content !== "" && content !== "STALL";
                      
                      return (
                        <div
                          key={c}
                          className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium border ${
                            isStall
                              ? "bg-zinc-800 border-red-500 text-red-400"
                              : isExecuting
                              ? "bg-zinc-800 border-zinc-700 text-zinc-400"
                              : "bg-zinc-900 border-zinc-800"
                          } ${isCurrentCycle ? "ring-2 ring-indigo-500" : ""}`}
                        >
                          {content}
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
              disabled={cycle === 0}
              className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCycle(Math.min(totalCycles - 1, cycle + 1))}
              disabled={cycle >= totalCycles - 1}
              className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Cycle →
            </button>
            <div className="ml-auto px-3 py-2 bg-zinc-800 rounded-lg text-sm">
              Cycle: <span className="font-bold text-indigo-400">{cycle}</span>
            </div>
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
            <div className="text-sm text-zinc-400 mt-1">True dependency</div>
            <div className="text-xs text-zinc-500 mt-2">Most common - needs stall/forward</div>
          </div>
          <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-800">
            <div className="text-yellow-400 font-bold text-lg">WAR</div>
            <div className="text-sm text-zinc-400 mt-1">Anti-dependency</div>
            <div className="text-xs text-zinc-500 mt-2">Only in out-of-order execution</div>
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