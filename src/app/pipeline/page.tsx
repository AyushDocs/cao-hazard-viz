"use client";

import { useState, useEffect } from "react";

const scenarios = [
  {
    name: "No Hazard",
    instructions: [
      { name: "add $t0, $t1, $t2", regs: [] },
      { name: "sub $t3, $t4, $t5", regs: [] },
      { name: "and $t6, $t7, $t8", regs: [] },
    ],
  },
  {
    name: "RAW Hazard (Stall needed)",
    instructions: [
      { name: "add $t0, $t1, $t2", regs: ["$t0"] },
      { name: "sub $t3, $t0, $t4", regs: ["$t0"] },
    ],
  },
  {
    name: "RAW with Forwarding",
    instructions: [
      { name: "add $t0, $t1, $t2", regs: ["$t0"] },
      { name: "sub $t3, $t0, $t4", regs: ["$t0"] },
    ],
  },
  {
    name: "Load-Use Hazard",
    instructions: [
      { name: "lw $t0, 0($t1)", regs: ["$t0"] },
      { name: "add $t3, $t0, $t4", regs: ["$t0"] },
    ],
  },
];

export default function PipelinePage() {
  const [scenario, setScenario] = useState(0);
  const [forwarding, setForwarding] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [instructions, setInstructions] = useState(scenarios[0].instructions);

  const stages = [
    { name: "IF", color: "bg-blue-500" },
    { name: "ID", color: "bg-green-500" },
    { name: "EX", color: "bg-yellow-500" },
    { name: "MEM", color: "bg-orange-500" },
    { name: "WB", color: "bg-purple-500" },
  ];

  const getInstructionPosition = (instIndex: number, cycleNum: number) => {
    const startCycle = instIndex;
    const instCycle = cycleNum - startCycle;
    if (instCycle < 0 || instCycle > 4) return null;

    const inst = instructions[instIndex];
    const hasHazard = inst.regs.length > 0 && instIndex === 1 && !forwarding;
    const isStalled = hasHazard && (instCycle === 1 || instCycle === 2);

    if (isStalled) return null;
    return stages[instCycle];
  };

  const totalCycles = instructions.length + 4 + (forwarding ? 0 : 2);

  useEffect(() => {
    setInstructions(scenarios[scenario].instructions);
    setCycle(0);
  }, [scenario, forwarding]);

  useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(() => {
        setCycle((c) => (c < totalCycles - 1 ? c + 1 : 0));
      }, 800);
      return () => clearInterval(timer);
    }
  }, [autoPlay, totalCycles]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Interactive Pipeline</h1>
      <p className="text-zinc-400 mb-8">
        Explore how instructions flow through the 5-stage MIPS pipeline. Toggle
        forwarding to see the difference in performance.
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {scenarios.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setScenario(i);
                setCycle(0);
              }}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                scenario === i
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setForwarding(!forwarding)}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            forwarding
              ? "bg-green-600 text-white"
              : "bg-zinc-800 text-zinc-400"
          }`}
        >
          Forwarding: {forwarding ? "ON" : "OFF"}
        </button>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              autoPlay
                ? "bg-red-600 hover:bg-red-500"
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            {autoPlay ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={() => setCycle(0)}
            className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600"
          >
            Reset
          </button>
          <div className="flex-1" />
          <div className="text-lg font-mono">
            Cycle: <span className="text-indigo-400">{cycle}</span>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="w-24 text-sm text-zinc-500">Instructions</div>
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-1">
              {[...Array(totalCycles)].map((_, c) => (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  className={`w-12 h-8 rounded text-xs font-medium transition-colors ${
                    c === cycle
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Time-Space Diagram</h3>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="flex mb-2">
                <div className="w-28 text-xs text-zinc-500">Cycle→</div>
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

              {instructions.map((inst, i) => (
                <div key={i} className="flex mb-1">
                  <div className="w-28 text-xs font-mono truncate pr-2 text-zinc-300 pt-1">
                    I{i + 1}: {inst.name}
                  </div>
                  <div className="flex-1 flex gap-1">
                    {[...Array(totalCycles)].map((_, c) => {
                      const stage = getInstructionPosition(i, c);
                      const hasHazard = inst.regs.length > 0 && i === 1 && !forwarding;
                      const isStall = hasHazard && !stage && c >= i + 1 && c <= i + 3;

                      return (
                        <div
                          key={c}
                          className={`h-8 rounded flex items-center justify-center text-xs border transition-all ${
                            stage
                              ? "bg-zinc-800 border-zinc-700"
                              : isStall
                              ? "bg-zinc-900 border-red-900"
                              : "bg-zinc-900 border-zinc-800"
                          }`}
                        >
                          <span className={stage ? "text-zinc-400" : isStall ? "text-red-400 text-[10px]" : "text-zinc-600"}>
                            {stage ? stage.name : isStall ? "STALL" : ""}
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

        <div>
          <h3 className="text-lg font-semibold mb-4">Pipeline Stage View</h3>
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex gap-2 justify-center">
              {stages.map((stage, i) => {
                const inStage = instructions.find((_, idx) => {
                  const pos = getInstructionPosition(idx, cycle);
                  return pos && pos.name === stage.name;
                });
                return (
                  <div key={stage.name} className="text-center">
                    <div
                      className={`w-16 h-24 ${stage.color} rounded-lg flex items-center justify-center font-bold text-white shadow-lg transition-all ${
                        inStage ? "scale-110 ring-2 ring-white" : "opacity-50"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xs">{stage.name}</div>
                        {inStage && (
                          <div className="text-[10px] mt-1">
                            {instructions.find(
                              (_, idx) => getInstructionPosition(idx, cycle)?.name === stage.name
                            )?.name.slice(0, 8)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-center text-sm text-zinc-400">
              Current cycle shows which instruction is in each pipeline stage
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-xl font-semibold mb-4">Statistics</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">{totalCycles}</div>
            <div className="text-sm text-zinc-500 mt-1">Total Cycles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {forwarding ? "5" : "7"}
            </div>
            <div className="text-sm text-zinc-500 mt-1">IPC (Instructions/Cycle)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {forwarding ? 0 : 2}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Stall Cycles</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
        <p className="text-sm text-blue-300">
          <strong>Try it:</strong> Select "RAW Hazard" and toggle forwarding ON/OFF to see
          how operand forwarding eliminates 2 stall cycles!
        </p>
      </div>
    </div>
  );
}