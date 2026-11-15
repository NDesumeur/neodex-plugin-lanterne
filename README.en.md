# Lanterne (Lantern)

An endless flying game in the dark: a small traveller crosses a cave with her lantern. The flame keeps dimming; collect oil flasks to revive it, and avoid rock, stalactites and bats. Go as far as you can.

*Version française : [README.md](README.md)*

## Controls

- Hold **Space**, **click** or **↑** to rise; release to come back down.
- **X** or **right-click**: **burst of light**. It costs oil but scares away nearby bats.
- **P**: pause.

- **Full screen**: the button of the same name; Escape to leave it. Otherwise the game takes all the room the window leaves.
- **Music: on / off**: the ambient music, different in each zone.

## Rules

- The traveller moves forward on her own; you only control her height, between the cave's ceiling and floor.
- The **flame** dims by itself, and the lantern only lights the area around her. **Oil flasks** revive it; they twinkle a little in the dark so you can spot them.
- A **campfire** every 1000 m fills the lantern completely.
- Also collect the **crystals**, which glow in the shadows.
- The game ends if the flame goes out, or if you touch rock, a falling stalactite or a bat.

## The zones

Every 500 m, the cave changes: **the cave**, **the crystal mine**, **the underground lake** then **the lava heart**, each with its own dangers (falling stalactites, drips that weaken the flame, more bats…).

## Zone creatures and music

- **The crystal mine**: **spiders** come down from the ceiling on their thread and swing on it.
- **The underground lake**: **fish** leap out of the water as you come near (ripples announce them).
- **The lava heart**: **will-o'-the-wisps** float towards you, slowly, through the rock.
- Touching them ends the game; the **light flash** scares them off like the bats. Their eyes and the wisps show in the dark.
- Each zone has its **music**: a held low note and random notes in its scale, slow in the cave, crystal-like with an echo in the mine, long at the lake, hurried in the lava. It stops when paused.

## Lanterns

The **crystals** picked up over your games unlock new lanterns, to choose before you set off:

| Lantern | Crystals | What it changes |
| --- | --- | --- |
| Copper | — | The starting one. |
| Glass | 120 | More oil (108) and it burns 10 % slower. |
| Beacon | 350 | A much wider flash (140 px), and cheaper (13 oil). |
| Golden | 800 | The most oil (122), burns 20 % slower, big flash. |

The traveller holds her lantern at arm's length; it swings as you go up or down, and its frame takes the colour of the chosen lantern.

## Statistics

After each game: the distance, flasks and crystals collected. The Records panel keeps your **longest distance**, the number of **games**, the total **flasks**, **crystals** and **total distance**.

## Data and sync

Your record and totals are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Lanterne → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
