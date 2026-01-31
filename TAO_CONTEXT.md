# PROJECT CONTEXT: TAO

## 1. Project Identity & Philosophy
* **Project Name:** Tao (Chinese: 道, meaning "The Way")
* **Target Framework:** LÖVE (Love2D)
* **Core Concept:** A comprehensive, modular toolchain for Love2D game development.
* **Design Philosophy:** "Character-Driven." The system architecture implies that the game's entities (Characters) drive the logic and system interactions, rather than a global stateless manager.
* **Visual Identity:** "Retro-Futuristic Dashboard." The UI should feel tactile, reminiscent of 90s/early 00s development tools or sci-fi interfaces, but built with modern UX principles.

## 2. Technical Stack
* **Core:** Electron (Cross-platform desktop wrapper)
* **Frontend:** React + Vite
* **Styling:** Tailwind CSS
* **Component Library:** shadcn/ui (customized for retro aesthetics)
* **State Management:** (Implied: React Context or Zustand/Redux as needed)
* **File System:** Node.js `fs` (via Electron IPC) to read/write Lua files directly to the user's Love2D project folder.

## 3. User Experience (UX) Flow
### Phase 1: Onboarding (The Gatekeeper)
Upon launching the application, the user must encounter a decision gate before accessing the dashboard:
1.  **Initialize Tao:** Select a clean folder to scaffold a new Love2D project structure compatible with Tao.
2.  **Open Existing:** Select a folder where Tao has already been initialized.
* *Constraint:* The Dashboard and Modules are inaccessible until a valid project path is established.

### Phase 2: The Dashboard
* Acts as the central hub.
* Allows navigation between modules (currently "Talks" and "Motions").
* Displays project metadata (Love2D version, active character count, recent files).

## 4. Module Specifications

### Module A: "Tao Talks" (Dialogue System)
**Purpose:** A high-flexibility dialogue and narrative engine.
* **Key Features:**
    * **Node-Based or Script-Based:** (To be defined, but implies complex branching).
    * **Localization First:** Built-in support for multi-language keys.
    * **Scale:** Must handle "entire game dialogue."
    * **Output:** Generates Lua tables/data structures that the runtime game engine reads.

### Module B: "Tao Motions" (Animation & Physics)
**Purpose:** An animation sequencer and hitbox editor.
* **Data Handling:**
    * Imports Sprite Sheets.
    * Defines Animation frames (start, end, loop, timing).
* **Physics Abstraction:**
    * **NO Physics Simulation in Tool:** The tool does *not* simulate physics.
    * **Variable Definition:** The user defines collision rects/polygons and hitboxes as *data variables* (x, y, w, h, offset).
    * **Runtime Execution:** The exported data is meant to be consumed by Love2D's internal physics (Box2D). The tool simply provides the data definition layer.

## 5. Coding & Generation Guidelines for AI
When generating code for **Tao**, adhere to these rules:

1.  **Style Enforcement:**
    * Use Tailwind classes to achieve the "Retro" look (e.g., rigid borders, monospace fonts, high contrast, CRT scanline effects optional but welcomed).
    * Use `shadcn/ui` components but override their default "clean" look to fit the theme.

2.  **Architecture Pattern:**
    * **Electron IPC:** Strictly separate Frontend (React) from Backend (Node/Electron). Use `preload.js` for safe IPC communication.
    * **Data Serialization:** All tools must export to valid **Lua** tables. The system must generate `.lua` files that can be `require`'d directly by the Love2D engine.

3.  **Character-Centric Data Structure:**
    * Data should be grouped by Character ID.
    * *Example:* `player_hero.lua` contains both the Dialogue trees and Animation data for that specific entity.

## 6. Future Scalability
* The architecture must allow for easy addition of "Module C" or "Module D" in the future without refactoring the core navigation or file handling systems.