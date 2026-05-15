"use client";

import { useState } from "react";

const dependencies = [
  {
    name: "RAW - Read After Write",
    type: "True Dependency",
    code: [
      "add $t0, $t1, $t2   # I1: writes $t0",
      "lw $t3, 0($t0)      # I2: reads $t0",
    ],
    registers: [
      { name: "$t0", role: "written by I1", color: "green", inst: 0 },
      { name: "$t0", role: "read by I2", color: "red", inst: 1 },
    ],
    solution: "Forwarding or stalling",
  },
  {
    name: "WAR - Write After Read",
    type: "Anti-Dependency",
    code: [
      "lw $t0, 0($t1)      # I1: reads $t1",
      "add $t1, $t2, $t3   # I2: writes $t1",
    ],
    registers: [
      { name: "$t1", role: "read by I1", color: "red", inst: 0 },
      { name: "$t1", role: "written by I2", color: "green", inst: 1 },
    ],
    solution: "Out-of-order execution or register renaming",
  },
  {
    name: "RAR - Read After Read",
    type: "Output Dependency",
    code: [
      "add $t0, $t1, $t2   # I1: writes $t0",
      "add $t0, $t3, $t4   # I2: writes $t0",
    ],
    registers: [
      { name: "$t0", role: "written by I1", color: "green", inst: 0 },
      { name: "$t0", role: "written by I2", color: "blue", inst: 1 },
    ],
    solution: "Register renaming",
  },
];

export default function DependenciesPage() {
  const [selected, setSelected] = useState(0);
  const [animated, setAnimated] = useState(false);

  const dep = dependencies[selected];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Data Dependencies</h1>
      <p className="text-zinc-400 mb-8">
        Understanding data dependencies is crucial for pipeline design. These
        dependencies determine when stalls or forwarding is needed.
      </p>

      <div className="flex gap-4 mb-8">
        {dependencies.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              setSelected(i);
              setAnimated(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === i
                ? "bg-indigo-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {d.type}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Code Example</h3>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 font-mono">
            {dep.code.map((line, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 py-2 px-3 rounded ${
                  animated ? "bg-zinc-800" : ""
                }`}
              >
                <span className="text-zinc-500">I{i + 1}:</span>
                <span className="text-zinc-300">{line}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setAnimated(!animated)}
            className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"
          >
            {animated ? "Reset Animation" : "Animate Dependency"}
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Register Flow</h3>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <div className="flex flex-col gap-4">
              {dep.registers.map((reg, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                    animated
                      ? "animate-[slideIn_0.3s_ease-out]"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${
                      reg.color === "green"
                        ? "bg-green-500/20 text-green-400"
                        : reg.color === "red"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {reg.name}
                  </div>
                  <div>
                    <div className="font-medium">{reg.role}</div>
                    <div className="text-xs text-zinc-500">Instruction {reg.inst + 1}</div>
                  </div>
                </div>
              ))}
              {animated && (
                <div className="flex items-center justify-center py-4">
                  <svg
                    className="w-8 h-8 text-green-400 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
        <h3 className="text-xl font-semibold mb-4">
          Resolution Strategy: {dep.solution}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-green-400">Hardware Solutions</h4>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Pipeline interlock (automatic stall)</li>
              <li>• Operand forwarding from EX/MEM</li>
              <li>• Register renaming</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-blue-400">Software Solutions</h4>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Compiler insert NOPs (pipeline scheduling)</li>
              <li>• Reorder instructions</li>
              <li>• Loop unrolling</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-800 rounded-lg">
        <p className="text-sm text-indigo-300">
          <strong>Note:</strong> RAW hazards are the most critical as they represent
          true data dependencies. WAR and RAR hazards are primarily concerns in
          out-of-order execution engines.
        </p>
      </div>
    </div>
  );
}