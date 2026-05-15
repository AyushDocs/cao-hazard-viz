# CAO Hazard Visualization - Specification

## Project Overview
- **Name**: CAO Hazard Visualization
- **Type**: Interactive educational webapp
- **Core Functionality**: Visualize computer architecture hazards (control, structural, logical) with pipeline diagrams, dependency animations, and resolution strategies
- **Target Users**: Computer architecture students, educators

## Tech Stack
- Next.js 16 with App Router
- Tailwind CSS 4
- Custom SVG + CSS animations for visualizations
- Deployment: Vercel

## Design System

### Colors
- **Background**: `bg-zinc-950` (dark) / `bg-zinc-50` (light)
- **Primary**: Indigo `#6366f1`
- **Pipeline Stages**:
  - IF: `#3b82f6` (blue)
  - ID: `#22c55e` (green)
  - EX: `#eab308` (yellow)
  - MEM: `#f97316` (orange)
  - WB: `#a855f7` (purple)
- **Hazard**: `#ef4444` (red) with pulse animation
- **Resolved**: `#22c55e` (green)
- **Pending**: `#eab308` (yellow)

### Typography
- **Headings**: sans-serif (Inter)
- **Code/Instructions**: `font-mono`

## Pages & Routes

### `/` - Landing
- Hero with title and brief description
- Navigation cards to each topic section

### `/hazards` - Hazards Overview
- Grid of hazard types with brief descriptions

### `/hazards/control` - Control Hazards
- Branch instruction explanation
- Pipeline showing branch delay penalty
- Static vs dynamic prediction visualization
- Pre-built scenarios: branch taken, not taken, prediction success/failure

### `/hazards/structural` - Structural Hazards
- Resource conflict visualization (single memory, limited ALUs)
- Stall animation
- Solution: duplicate resources

### `/hazards/logical` - Logical/Data Hazards
- RAW (true dependency)
- WAR (anti-dependency)
- RAR (output dependency)
- Animated dependency arrows

### `/dependencies` - Dependency Details
- Interactive dependency visualizer
- RAW/WAR/RAR with register highlighting
- Pre-built examples

### `/resolution` - Resolution Strategies
- Hardware stall (pipeline interlock)
- Operand forwarding (EX/MEM to ID/EX)
- Compiler scheduling (insert NOPs)
- Scoreboarding visualization
- Tomasulo algorithm demo

### `/pipeline` - Interactive Pipeline
- Time-space diagram
- Step-through controls (play, pause, step forward/back)
- Pre-built hazard scenarios
- Toggle forwarding on/off

## Components Needed

1. **Navigation** - Sidebar or top nav with sections
2. **PipelineDiagram** - Animated pipeline with stages
3. **TimeSpaceDiagram** - Grid showing instruction positions
4. **DependencyArrow** - Animated arrows connecting instructions
5. **HazardBadge** - Highlight showing hazard type
6. **InstructionCard** - Shows MIPS instruction details
7. **ScenarioSelector** - Dropdown for pre-built examples
8. **PlaybackControls** - Play/pause/step buttons

## Animations
- Pipeline stages: slide left animation
- Hazard detection: red pulse glow
- Dependency arrows: fade in and slide
- Resolution: green checkmark fade in
- Stalls: bubble propagation animation

## Acceptance Criteria
- [x] All pages render without errors
- [x] Pipeline animations are smooth (60fps)
- [x] Pre-built scenarios demonstrate each hazard type
- [x] Toggle between forwarding/stalling works
- [x] Time-space diagram updates correctly
- [x] Mobile responsive
- [x] Build succeeds without errors