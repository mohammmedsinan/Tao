 You are a prompt Engineer, Create a full file to provide this full context.

I'm building a project Called "Tao" which means "way in chinese"

Tech Stack : React - VIte - Electron - Tailwind - SahdcnUI.. etc

Description : This is a tool for the game development framework Love2D currently it has 2 modules but in the future maybe it will be more.


Things need to be addressed :

- The system is Charcater based which means the system depends on the charcter to drive the system

- it should be like a dashboard that i can navigate between the modules

- the theme of the Tool should be very retro-ish

- first thing after opening the app will tell me to initlize Tao inside a love2d project or should open a love2d project that already inilized


First Module - "Tao Talks" : so this module is a dailouge system very large very flexible and support localization easy to use and can build the entire game dialouge on top of it.


second Moudle - "Tao Motions" : so this module is an animation box that will display sprites and animation, i can control the hit box and collisions and other things (All these things should be implemented as a variables to do it, and use the system inside love2d to do it for example the box2d inside love2d should handle the physics).

Here is a comprehensive Project Context file designed to be used as a "System Prompt" or "Project Bible." You can paste this entire block into an LLM or keep it as a README_AI.md in your root directory to ensure any AI assistant understands the full scope of Tao.
Filename: TAO_PROJECT_CONTEXT.md
Markdown

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

How to use this file

    Save this as TAO_CONTEXT.md in the root of your project.

    When prompting me (or any AI):

        "Read the TAO_CONTEXT.md file. I need you to create the component for the 'Tao Talks' node editor..."

        "Based on the TAO_CONTEXT.md, how should we structure the JSON-to-Lua exporter?"

Would you like me to scaffold the directory structure for this Electron/React/Vite setup based on this context?

I have Tao_context and tao brand idnitity

is there any file missing ?

Yes, there is a critical "bridge" missing.

You have the Strategic Vision (TAO_CONTEXT) and the Visual Language (TAO_BRAND_IDENTITY), but you are missing the Technical Contract.

Since Tao is a tool that generates data for another engine (Love2D), you need to strictly define how that data looks and how the game reads it. Without this, you risk generating React state that doesn't translate cleanly to Lua tables.

I recommend adding these two specific files to complete your documentation suite:
1. TAO_DATA_SCHEMA.md (The "Protocol")

This file defines the "Source of Truth." It bridges the gap between your Typescript interfaces (in React) and the Lua tables (in Love2D).

    Why you need it: You stated the system is "Character-Based." Does a character file hold both dialogue and motion data? Is it JSON during editing and Lua on save? This file answers that.

    What it contains:

        The structure of a .tao (project) file.

        The structure of a character_manifest.json.

        The TypeScript Interfaces for DialogueNode and AnimationHitbox.

        The specific Lua table format that the exporter must produce.

2. TAO_RUNTIME_API.md (The "Engine Implementation")

You are building a tool, but that tool is useless without the corresponding Love2D library to run the data. This file describes the "Tao" library that lives inside the game.

    Why you need it: Your prompt mentions "Tao Talks" is a "very large" dialogue system. You need to define how the Love2D engine parses that.

    What it contains:

        Tao.init(): How the game loads the generated files.

        Tao.Talks.play(dialogueId): The public API for the game developer.

        Tao.Motions.getCollider(frameIndex): How the physics system retrieves the box data.

Suggested Action

Would you like me to draft the TAO_DATA_SCHEMA.md right now?

(I can structure it so it explicitly maps your "Character-Driven" requirement into a strict JSON/Lua format, ensuring your "Tao Talks" and "Tao Motions" modules share a single source of truth.)

can you please write me yes

Here is the TAO_DATA_SCHEMA.md.

This file acts as the contract between your TypeScript frontend and your Lua runtime. It ensures that when you build "Tao Motions" or "Tao Talks" components, you know exactly what data shape to output.
Filename: TAO_DATA_SCHEMA.md
Markdown

# TAO DATA SCHEMA & INTERCHANGE PROTOCOL

**Status:** Draft 1.0
**Context:** Defines the data structures used by the Electron App (Source of Truth) and the generated Lua files (Runtime Engine).

---

## 1. File Architecture Strategy
To maintain the "Character-Driven" philosophy, data is organized by Entity.

* **Development State (Electron):** Stored as `.json` files for easy parsing/stringify in JavaScript.
* **Runtime State (Love2D):** Exported as `.lua` scripts that return tables.

### Directory Structure (Inside a Love2D Project)
```text
my-game/
├── main.lua
├── tao/                  <-- Managed by Tao Tool
│   ├── tao_config.json   <-- Project settings
│   ├── localization/     <-- Shared locale strings
│   │   ├── en.json
│   │   └── jp.json
│   └── characters/
│       ├── hero/
│       │   ├── data.json <-- The Source (React State)
│       │   └── init.lua  <-- The Export (Love2D Read)
│       └── enemy_slime/
│           ├── data.json
│           └── init.lua

2. TypeScript Interfaces (The React State)

These interfaces define how the data looks inside your React Context/State management.
A. The Character Root

The "Character" is the driving entity.
TypeScript

interface TaoCharacter {
  id: string;          // distinct slug (e.g., "hero_sword")
  name: string;        // Display name
  modules: {
    talks: TalksModule;
    motions: MotionsModule;
  }
}

B. Module: Tao Talks (Dialogue)

Feature Set: Localization, Branching, Node-based.
TypeScript

type DialogueNodeID = string;

interface TalksModule {
  graphs: DialogueGraph[]; 
}

interface DialogueGraph {
  id: string;          // e.g., "intro_conversation"
  startNodeId: DialogueNodeID;
  nodes: Record<DialogueNodeID, DialogueNode>;
}

interface DialogueNode {
  id: DialogueNodeID;
  speakerId: string;   // Who is talking?
  textKey: string;     // Localization Key (e.g., "hero.intro.greeting")
  choices: Choice[];   // If empty, simple "Next" is implied
  events?: string[];   // Events to trigger in engine (e.g., "camera_shake")
}

interface Choice {
  textKey: string;     // Label for the button
  nextNodeId: DialogueNodeID;
  condition?: string;  // Lua code string or variable name (e.g., "has_key")
}

C. Module: Tao Motions (Animation & Physics)

Feature Set: Sprite sheets, Hitboxes (Variables), Animation loops.
TypeScript

interface MotionsModule {
  spriteSheetPath: string; // Relative to project root
  gridSize: { w: number; h: number }; // Size of one cell
  animations: AnimationClip[];
}

interface AnimationClip {
  name: string;        // e.g., "idle", "run", "attack_1"
  loop: boolean;
  fps: number;
  frames: AnimationFrame[];
}

interface AnimationFrame {
  index: number;       // The sprite sheet index (1-based for Lua affinity)
  duration?: number;   // Override specific frame duration
  
  // The "Variables" for Physics (Box2D logic)
  collisionBox: Rect;  // The physical body
  hitBox?: Rect;       // The offensive area (optional)
  hurtBox?: Rect;      // The vulnerable area (optional)
  
  // Anchors
  origin: { x: number; y: number }; // Pivot point
}

interface Rect {
  x: number; // Offset from origin
  y: number; // Offset from origin
  w: number;
  h: number;
}

3. The Lua Export Format (The Runtime)

When the user clicks "Save" or "Export" in Electron, the tool translates the JSON above into this Lua format.

Target File: tao/characters/hero/init.lua
Lua

-- GENERATED BY TAO. DO NOT EDIT MANUALLY.
-- Character: Hero

local data = {
    identity = {
        id = "hero",
        name = "Hero"
    },

    -- MODULE: TAO TALKS
    talks = {
        ["intro_conversation"] = {
            start = "node_1",
            nodes = {
                ["node_1"] = {
                    text = "hero.intro.greeting", -- Resolves via Localization system
                    speaker = "hero",
                    choices = {
                        { label = "hero.opt.yes", next = "node_2" },
                        { label = "hero.opt.no", next = "node_exit" }
                    }
                }
            }
        }
    },

    -- MODULE: TAO MOTIONS
    motions = {
        sheet = "assets/hero_sheet.png",
        grid = { w = 32, h = 32 },
        anims = {
            ["run"] = {
                loop = true,
                fps = 12,
                frames = {
                    { 
                        idx = 1, 
                        -- Physics Variables intended for Box2D consumption
                        body = { x = -10, y = -16, w = 20, h = 32 },
                        hurt = { x = -10, y = -16, w = 20, h = 32 }
                    },
                    { 
                        idx = 2, 
                        body = { x = -10, y = -15, w = 20, h = 31 } 
                    }
                }
            }
        }
    }
}

return data

4. Localization File Structure

Target File: tao/localization/en.json
JSON

{
  "hero.intro.greeting": "Hello! Have you seen the Tao?",
  "hero.opt.yes": "Yes, I have.",
  "hero.opt.no": "No, leave me alone."
}

5. Development Rules

    Coordinate Systems:

        Motions: Store hitbox data as Offsets from the Sprite Origin (usually bottom-center for top-down/platformers).

        Y-Axis: Love2D is Y-Down. Ensure the React canvas matches this coordinate space.

    Ids: All IDs (Characters, Nodes, Animations) must be snake_case strings to ensure maximum compatibility as Lua table keys.


---

### **Next Step**

Now that you have the **Concept** (`TAO_CONTEXT`), the **Look** (`TAO_BRAND`), and the **Data Structure** (`TAO_DATA_SCHEMA`), you are ready to start coding.

Would you like me to create the **Project Directory Tree** command (bash/powershell) to instantly generate the folders and empty files for this Electron/React structure?

can you make TAO_DATA_SCHEMA.md

more deteled

This detailed version expands the schema to include Editor UI State (so your node graph remembers where nodes are positioned), Box2D specific flags (categories/masks), and Event Triggers.

Save this as your definitive TAO_DATA_SCHEMA.md.
TAO DATA SCHEMA & INTERCHANGE PROTOCOL v2.0

Project: Tao (Game Dev Toolchain) Target Engine: Love2D (Lua) Format: JSON (Source) → Lua Table (Runtime)
1. Global Concepts & Primitives

To ensure consistency across modules, we define strict primitive types.
Coordinate Space

    Electron/React: 0,0 is Top-Left.

    Love2D: 0,0 is Top-Left.

    PPU (Pixels Per Unit): 1:1 (Pixel Perfect).

Primitive Types (TypeScript)
TypeScript

type UUID = string; // Generated via crypto.randomUUID()
type LuaCode = string; // Raw string to be executed or parsed by engine
type FilePath = string; // Relative path from project root (e.g., "assets/sprites/hero.png")

interface Vector2 {
  x: number;
  y: number;
}

interface Rect {
  x: number; // Offset relative to origin
  y: number; // Offset relative to origin
  w: number;
  h: number;
}

2. Project Configuration (tao.config.json)

Located at the root of the Love2D project. This tells Tao how to behave.
TypeScript

interface TaoProjectConfig {
  version: string;        // Tao version used to create this file
  projectName: string;
  
  paths: {
    assets: string;       // default: "assets"
    output: string;       // default: "src/generated"
    localization: string; // default: "locales"
  };

  modules: {
    talks: {
      defaultLanguage: "en";
      supportedLanguages: string[]; // ["en", "jp", "es"]
    };
    motions: {
      useAseprite: boolean; // Future proofing
    };
  };
}

3. Character Data Structure (*.json)

Each character has a "Source" JSON file used by the Electron editor.

File: tao/characters/{character_id}.json
TypeScript

interface CharacterManifest {
  meta: {
    id: string;          // e.g., "cyber_monk"
    name: string;        // Human readable: "Cyber Monk"
    created: string;     // ISO Date
    updated: string;     // ISO Date
  };
  
  // Modules are optional but defined here
  talks?: TalksModuleData;
  motions?: MotionsModuleData;
}

4. Module A: Tao Talks (Detailed)

This schema supports a visual node editor. It separates the Logic (what happens) from the Visuals (where the node is on screen).
TypeScript

interface TalksModuleData {
  variables: Record<string, any>; // Default local variables (e.g., { trust_level: 0 })
  graphs: Record<UUID, DialogueGraph>;
}

interface DialogueGraph {
  id: UUID;
  name: string;           // e.g., "First Meeting"
  rootNodeId: UUID;       // Entry point
  nodes: Record<UUID, FlowNode>;
}

// Union type for different node behaviors
type FlowNode = NodeText | NodeChoice | NodeSetVar | NodeEvent;

interface BaseNode {
  id: UUID;
  type: "text" | "choice" | "set_var" | "event";
  
  // EDITOR ONLY DATA (Do not export to Lua runtime if optimization is needed)
  editor: {
    position: Vector2;
    color?: string;
    notes?: string;
  };
}

// 1. A Standard Dialogue Bubble
interface NodeText extends BaseNode {
  type: "text";
  speakerId: string;      // "hero", "npc", "narrator"
  emotion?: string;       // "angry", "happy" (maps to sprite in Motions)
  locKey: string;         // "dialogue.cyber_monk.intro.1"
  next: UUID | null;      // ID of the next node (linear flow)
}

// 2. A Branching Choice
interface NodeChoice extends BaseNode {
  type: "choice";
  textKey: string;        // The prompt text
  options: {
    labelKey: string;     // Button text
    targetNodeId: UUID;   // Where this choice leads
    condition?: LuaCode;  // e.g., "return Tao.vars.gold > 50"
  }[];
}

// 3. Logic: Set Variable
interface NodeSetVar extends BaseNode {
  type: "set_var";
  variable: string;       // "has_met_monk"
  value: string | number | boolean;
  next: UUID;
}

5. Module B: Tao Motions (Detailed)

This handles the "Physics Variables" requirement. It maps animation frames to Box2D-compatible data structures.
TypeScript

interface MotionsModuleData {
  sourceImage: FilePath;  // "assets/chars/monk_sheet.png"
  grid: { w: number; h: number, margin: number, spacing: number }; 
  
  // Physics Configuration (Box2D defaults)
  physicsDefaults: {
    friction: number;
    restitution: number;
    categoryBits: number; // Collision Category (1-16)
    maskBits: number;     // Collision Mask
  };

  animations: Record<string, AnimationClip>;
}

interface AnimationClip {
  name: string;       // "idle", "attack_heavy"
  fps: number;
  loop: boolean;
  
  // Timeline: Array of Frames
  frames: KeyFrame[];
}

interface KeyFrame {
  index: number;      // Sprite sheet index (0-based in JSON, 1-based in Lua)
  durationMult: number; // 1.0 = normal, 2.0 = hold twice as long
  
  // The Anchor Point (Pivot)
  origin: Vector2;    // e.g., {x: 16, y: 32} (Bottom Center)

  // COLLISION LAYERS
  // 1. The Physical Body (Solid)
  bodyBox?: {
    rect: Rect;
    isSensor: boolean; // If true, no physical response, just detection
  };

  // 2. Gameplay Boxes (Logic)
  hitBox?: Rect;      // Area that deals damage
  hurtBox?: Rect;     // Area that receives damage
  
  // EVENT TRIGGERS (Frame specific)
  triggers?: {
    sfx?: string;     // "audio/sfx/step_grass.wav"
    vfx?: string;     // "spawn_dust_particle"
    method?: string;  // "start_combo_window" (Calls a function in Lua)
  }[];
}

6. Export Protocol: The Generated Lua

This is exactly what your Love2D engine will consume. The exporter must flatten the TypeScript structures above into this efficient table.

Output File: src/generated/chars/cyber_monk.lua
Lua

--[[ 
    TAO GENERATED FILE - DO NOT EDIT 
    Character: Cyber Monk
    Timestamp: 2026-01-26 14:00:00
]]

local character = {}

-- 1. MOTIONS DATA
character.motions = {
    sheet = "assets/chars/monk_sheet.png",
    w = 32, h = 32,
    
    anims = {
        ["attack_heavy"] = {
            fps = 12,
            loop = false,
            frames = {
                -- Frame 1
                [1] = {
                    quad = 4, -- Calculated Quad Index
                    ox = 16, oy = 32, -- Origin
                    
                    -- Physics Data (Box2D Ready)
                    body = { x = -8, y = -20, w = 16, h = 20, sensor = false },
                    
                    -- Gameplay Data
                    hurt = { x = -8, y = -20, w = 16, h = 20 },
                    
                    -- Triggers
                    sfx = "sfx_woosh_heavy"
                },
                -- Frame 2 (The Hit)
                [2] = {
                    quad = 5,
                    ox = 16, oy = 32,
                    body = { x = -8, y = -20, w = 16, h = 20 },
                    hit = { x = 12, y = -10, w = 24, h = 10, dmg = 5 } -- Custom Props
                }
            }
        }
    }
}

-- 2. TALKS DATA
character.talks = {
    ["meeting_1"] = {
        start = "node_abc123",
        nodes = {
            ["node_abc123"] = {
                type = "text",
                text = "loc.monk.meet.1",
                spk = "cyber_monk",
                mood = "neutral",
                next = "node_choice_1"
            },
            ["node_choice_1"] = {
                type = "choice",
                opts = {
                    { txt = "loc.opts.hello", next = "node_nice" },
                    { txt = "loc.opts.fight", next = "node_fight", cond = "p.lvl > 5" }
                }
            }
        }
    }
}

return character
