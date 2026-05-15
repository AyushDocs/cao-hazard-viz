"use client";

import { useState } from "react";

interface PipelineInstruction {
  name: string;
  pc: number;
  stalled?: boolean;
  flushed?: boolean;
}

interface Scenario {
  name: string;
  description: string;
  instructions: PipelineInstruction[];
  showPenalty: boolean;
}

const scenarios: Scenario[] = [
  {
    name: "Branch Not Taken (No Delay)",
    description: "Branch condition is false, continue sequentially",
    instructions: [
      { name: "add $t0, $t1, $t2", pc: 0 },
      { name: "beq $t3, $t4, label", pc: 1 },
      { name: "sub $t5, $t6, $t7", pc: 2 },
      { name: "and $t8, $t9, $t10", pc: 3 },
    ],
    showPenalty: false,
  },
  {
    name: "Branch Taken (2-cycle penalty)",
    description: "Branch is taken, PC changed after EX stage",
    instructions: [
      { name: "add $t0, $t1, $t2", pc: 0 },
      { name: "beq $t3, $t4, label", pc: 1 },
      { name: "SUB (stalled)", pc: -1, stalled: true },
      { name: "SUB (stalled)", pc: -1, stalled: true },
      { name: "j target", pc: 2 },
      { name: "and $t8, $t9, $t10", pc: 3 },
    ],
    showPenalty: true,
  },
  {
    name: "Branch Prediction (Static)",
    description: "Predict not taken, actually taken",
    instructions: [
      { name: "add $t0, $t1, $t2", pc: 0 },
      { name: "beq $t3, $t4, label", pc: 1 },
      { name: "sub $t5, $t6, $t7", pc: 2 },
      { name: "sub (flushed)", pc: 2, flushed: true },
      { name: "j target", pc: 3 },
      { name: "and $t8, $t9, $t10", pc: 4 },
    ],
    showPenalty: true,
  },
];

export default function ControlHazardsPage() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [cycle, setCycle] = useState(0);
  const scenario = scenarios[selectedScenario];

  const stages = ["IF", "ID", "EX", "MEM", "WB"];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Control Hazards</h1>
      <p className="text-zinc-400 mb-8">
        Control hazards occur when branch instructions alter the program counter.
        The processor doesn't know the next instruction until the branch is resolved
        in the EX stage, causing pipeline stalls.
      </p>

      <div className="flex gap-4 mb-8">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedScenario(i);
              setCycle(0);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedScenario === i
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Pipeline Visualization</h3>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex flex-col gap-3">
              {stages.map((stage, si) => (
                <div key={stage} className="flex items-center gap-2">
                  <div className={`w-12 h-8 rounded flex items-center justify-center text-xs font-bold ${
                    si === 0 ? "bg-blue-500" :
                    si === 1 ? "bg-green-500" :
                    si === 2 ? "bg-yellow-500" :
                    si === 3 ? "bg-orange-500" : "bg-purple-500"
                  }`}>
                    {stage}
                  </div>
                  <div className="flex gap-1 flex-1">
                    {[0, 1, 2, 3, 4].map((ci) => (
                      <div
                        key={ci}
                        className={`h-10 flex-1 rounded border transition-all ${
                          ci === cycle - si && ci >= 0
                            ? "bg-indigo-600 border-indigo-400"
                            : "bg-zinc-800 border-zinc-700"
                        }`}
                      />
                    ))}
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
          <h3 className="text-lg font-semibold mb-4">Time-Space Diagram</h3>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="flex mb-2">
                <div className="w-32 flex-shrink-0 text-xs text-zinc-500 text-right pr-2">Cycle→</div>
                <div className="flex flex-1">
                  {[0, 1, 2, 3, 4, 5, 6].map((c) => (
                    <div key={c} className="flex-1 text-center text-xs text-zinc-500">
                      {c}
                    </div>
                  ))}
                </div>
              </div>
              {scenario.instructions.map((inst, i) => (
                <div key={i} className="flex mb-1">
                  <div className={`w-32 flex-shrink-0 text-xs font-mono truncate pr-2 text-right ${
                    inst.stalled ? "text-red-400" :
                    inst.flushed ? "text-orange-400" : "text-zinc-300"
                  }`}>
                    {inst.stalled ? "STALL" : inst.flushed ? "FLUSH" : inst.name}
                  </div>
                  <div className="flex flex-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((c) => {
                      const stage = c - i;
                      const active = stage >= 0 && stage < 5 && !inst.stalled && !inst.flushed;
                      const stageNames = ["IF", "ID", "EX", "MEM", "WB"];
                      const stageName = active ? stageNames[stage] : "";
                      return (
                        <div
                          key={c}
                          className={`flex-1 h-6 rounded flex items-center justify-center text-xs border ${
                            active
                              ? "bg-zinc-800 border-zinc-700"
                              : inst.stalled
                              ? "bg-zinc-900 border-red-900"
                              : "bg-zinc-900 border-zinc-800"
                          }`}
                        >
                          <span className={active ? "text-zinc-400" : "text-zinc-600"}>
                            {stageName}
                          </span>
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

      <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-xl font-semibold mb-4">Branch Resolution</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-blue-400">Prediction (1-bit)</h4>
            <p className="text-sm text-zinc-400">
              Track branch history. On misprediction, flip prediction.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-green-400">Delay Slot</h4>
            <p className="text-sm text-zinc-400">
              Execute instruction after branch regardless of outcome.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-purple-400">Branch Target Buffer</h4>
            <p className="text-sm text-zinc-400">
              Cache branch addresses and predictions in hardware.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}