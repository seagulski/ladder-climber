# Ladder Climber - Phased Build Plan

## Evaluation

The design doc (`initial_idea.md`, ~11K lines) is a comprehensive game bible covering every system: core mechanics, 200+ obstacles, 100+ power-ups, 200-level title ladder, sprite evolution, Phaser scaffolds, pattern-driven obstacle spawning, difficulty director with rubber-banding, achievement/leaderboard systems, zone-based building progression, floor generation, and tuning sheets. It's ready to build from.

**Core identity:**
- Demotion instead of death (the hook)
- Corporate satire that escalates from relatable to surreal
- Player literally transforms from person -> role -> institution
- "Climb the building, not just the ladder" — spatial progression through zones
- Lane-snapped movement (arcade cabinet feel, not physics sim)

**MVP test question:** After 3 runs, does the player say "I want another shot"?

---

## Infrastructure Strategy: ladderclimber.io

**Guiding principle:** Do not pay complexity tax.

### Launch Architecture (Phases 1-7): $0/month
- **Hosting:** Cloudflare Pages (free tier — unlimited static requests/bandwidth, 500 builds/month, custom domains)
- **Domain:** ladderclimber.io on Cloudflare (apex domain → Pages project)
- **Build:** Vite + Phaser 3 → static bundle
- **Data:** localStorage only
- **Backend:** None

**localStorage stores:** best score, run history, achievements (permanently unlocked), settings, local leaderboard (top 10)

**What to avoid:** No VPS, no managed DB, no Supabase/Firebase, no Next.js, no Docker, no accounts/auth, no analytics at launch.

### Leaderboard Architecture (Phase 9, only when needed): Still ~$0
- 1 small Cloudflare Worker (free tier: 100K requests/day)
- Cloudflare D1 (free tier: 10 databases, 500MB)
- Submit only on game over (one request per qualifying run)
- Schema: name, score, highest_title, time_survived, demotions, created_at, build_version

---

## Key Design Decisions (Locked)

### Movement: Lane-Snapped
- Left/right shifts player to next ladder lane (4 lanes)
- Lane swap time: 120-160ms
- Jump: instant, short readable arc
- Coyote time: 80-120ms, jump buffer: 80-120ms
- Controls should never fight the player; satire is the punishment, not input lag

### Scoring Model
- **Score** = distance climbed + bonuses (dodge: +25, coffee: +10, combo survival: +50, promotion: +100)
- **Visibility** = separate bar, promotion currency (fills from climbing/dodging/collecting)
- **Multiplier** = no-hit streak (+0.1 per dodge, cap 2.5-3.0x), resets on hit/demotion
- **Demotion** = breaks multiplier + drops visibility, does NOT annihilate score

### HUD (Minimal)
- Top-left: Current title
- Top-right: Score
- Under title: Visibility bar (promotion meter)
- Bottom edge: Demotion warning (only when in danger)
- Occasional toast: promotions, demotions, achievements, floor labels

### Zone/Floor Building Progression
The climb is through a mythological corporate skyscraper:

| Zone | Floors | Fantasy | Hazard Type |
|------|--------|---------|-------------|
| Basement | 1-50 | Forgotten, survival | Physical/structural |
| Cubicle | 51-125 | Normalized corporate grind | Communication chaos |
| Lower Management | 126-175 | "Why is this worse?" | Gatekeeping |
| Middle Management | 176-225 | "Everything is my fault" | Overlapping systems |
| Upper Management | 226-275 | "Looks calm, isn't calm" | Controlled pressure |
| Executive | 276-350 | Sterile, hollow power | Intentional disruption |
| Corporate Void | 350+ | "You became the system" | Abstract pattern/rhythm |

Each zone uses 6-10 floor templates remixed via chunk rotation, tint shifts, lighting variation, prop density, and hazard scaling. Player-facing: 50+ floors per zone. Dev-facing: 8 authored templates + a generator.

### Hazard Behavior Families (not just names)
1. **Static blocker** — blocks passage, switch ladders (Meeting Block, Approval Bottleneck)
2. **Timed pulse** — alternates active/inactive, adds rhythm (Micromanagement Beam)
3. **Moving vertical** — drifts into play space, read trajectory (Slack Storm, Reply-All)
4. **Wide barrier** — blocks multiple lanes, find the opening (All-Hands, Budget Cut)
5. **Delayed trigger** — telegraphs then activates, don't panic (Executive Veto, Reorg Wave)
6. **Ladder-affecting** — changes the ladder itself (Glass Ceiling, Fragile, Collapsing, Dead-End)
7. **Fake-safe** — looks safe, becomes dangerous; use sparingly (Invisible Barrier)

### Power-Up Behavior Families
1. **Instant recovery** — Coffee (speed burst), PTO Stamp
2. **Temporary shield** — Headphones (immune to comm hazards 8s), HR Protection
3. **Environment control** — Focus Block (clears lane), Calendar Hold (reduces spawn rate)
4. **Mobility boost** — Double Espresso (faster switching), Ladder Magnet
5. **Score/progression** — Executive Visibility (2x visibility 10s), Recognition Award

### Glass Ceiling as Signature Mechanic
- Forces lateral movement (core route-forcing barrier)
- Frequency increases at management+ tiers
- Cracked variant: breakable only with certain buffs
- Invisible variant: late-game satire (heavily telegraphed)
- Tiered: occasional in analyst, frequent at manager, expected at VP

### Tone Guardrails
- Satirical, not bitter
- Absurd, not nihilistic
- Office-pain funny, not cruel
- Readable, not chaotic
- Retro arcade first, corporate parody second

---

## Phased Build Plan

### Phase 1: Core Loop & Movement Feel
**Goal:** Prove the climbing feels good. Lane-snapped movement, ladders, camera scroll.

- [ ] Initialize project (Vite + Phaser 3)
- [ ] Set up project structure per scaffold spec
- [ ] Implement `constants.js` (GAME_WIDTH: 432, GAME_HEIGHT: 768, 4 LANES, FLOOR_HEIGHT: 640)
- [ ] Build `BootScene` with placeholder asset loading
- [ ] Build `TitleScene` (LADDER CLIMBER / START CLIMB / QUIT PROFESSIONALLY)
- [ ] Build `Player` entity with lane-snapped movement (not free velocity)
- [ ] Jump with coyote time + jump buffer
- [ ] Auto-climb scroll pressure
- [ ] Build `LadderManager` with procedural 4-lane ladder generation
- [ ] Build `GameScene` with camera follow and basic collision
- [ ] Placeholder art (colored rectangles)
- [ ] Falling below fold = restart (placeholder for demotion)

**Feel targets:** Lane swap 120-160ms, instant jump, slightly generous timing. Movement should feel arcade-snappy, never floaty.

**Deliverable:** Player moves between 4 ladder lanes, jumps, camera scrolls up. Feels responsive and readable.

---

### Phase 2: Floor System, First Hazards, Visibility Meter
**Goal:** The world has structure and the first real gameplay challenge exists.

- [ ] Implement floor generation system (floorNumber from distance climbed)
- [ ] Zone system: basement (1-50), cubicle (51-125)
- [ ] `getZoneForFloor()`, `buildFloorData()` helpers
- [ ] Background manager with zone-specific wall tiles + decorative chunks
- [ ] `ObstacleManager` with pattern-based spawning
- [ ] First 3 hazards only:
  - Meeting Block (static blocker)
  - Slack Storm (moving hazard)
  - Glass Ceiling (ladder-affecting barrier)
- [ ] Safe lane logic (at least 1 lane always safe)
- [ ] First power-up: Coffee (speed/visibility boost)
- [ ] Visibility meter (fills from climbing/dodging/collecting)
- [ ] Simple promotion display (Intern → Associate → Analyst)
- [ ] Floor number in HUD

**Deliverable:** Basement feels easier than cubicle. Glass ceiling forces ladder switching. Coffee feels noticeable. World has visible zone identity.

---

### Phase 3: Career System, Demotion, Scoring
**Goal:** The core identity mechanic — promotions, demotions, the emotional hook.

- [ ] `CareerManager` with 20-30 title progression tied to visibility thresholds
- [ ] Player visual form swapping (5 forms: intern → analyst → manager → executive → entity)
- [ ] Score system: distance + bonuses + no-hit multiplier
- [ ] Demotion system: 3 demotions before game over, breaks multiplier, drops visibility
- [ ] `DemotionScene` ("CAREER REALIGNMENT" / "RE-ENTER WORKFORCE")
- [ ] `GameOverScene` with career summary (score, title, time, demotions)
- [ ] Post-demotion grace period (softer difficulty 4-6 seconds)
- [ ] Zone title cards ("FLOOR 54 — TEAM PRODUCTIVITY")
- [ ] HUD: title, score, visibility bar, demotion warning at bottom edge

**Deliverable:** Promotions feel hollow-triumphant. Demotions feel embarrassingly corporate and funny. Score multiplier makes clean play matter.

---

### Phase 4: Pattern System & Difficulty Director
**Goal:** Encounters feel authored. Difficulty has rhythm, not just escalation.

- [ ] `DifficultyManager` with 5 bands based on score thresholds
- [ ] Pattern library with symbolic lane refs (safeA/unsafeA → resolved positions)
- [ ] Implement 9 starter patterns:
  - single_annoyance, mirror_annoyance, split_decision, vertical_stagger
  - glass_ceiling_handoff, soft_wall, coffee_corridor, promotion_runway, all_hands_panic
- [ ] Weighted pattern selection (band-aware, tag-biased, no repeats)
- [ ] Chunk type weighting per band (calm/standard/pressure/combo/reward/event)
- [ ] Struggle/rubber-banding: after hit/demotion, reduce spawn rate 20%, guarantee safe lanes, boost power-ups
- [ ] Anti-frustration rules: no unreadable spawns on player, always one safe route, grace after demotion
- [ ] Add remaining 5 hazards: Buzzword Cloud, Reply-All Chain, Budget Cut, Reorg Wave, Executive Veto
- [ ] Add remaining 4 power-ups: Headphones (shield), Focus Block (clear lane), Promotion Letter (rank up), PTO Shield
- [ ] Hazard behavior types implemented (static, moving, wide barrier, delayed trigger, ladder-affecting)
- [ ] Playtest tuning (target: survive 60-90s, first demotion 45-75s, manager tier sometimes, exec rarely)

**Pacing target:** 20s build → 8s pressure → 4s relief → repeat. Event spikes every few cycles.

**Deliverable:** Game has musical rhythm. Difficulty feels fair but escalating. Each run tells a tiny story of survival.

---

### Phase 5: Achievements, Leaderboard, Personnel File
**Goal:** Give players reasons to replay and brag.

- [ ] `LeaderboardManager` — localStorage, top 10, sorted by score
- [ ] Name entry on qualifying score ("ENTER EMPLOYEE NAME" / "FILE PERFORMANCE" / "SKIP FILING")
- [ ] `LeaderboardScene` ("PERFORMANCE RANKING")
- [ ] `AchievementManager` — tracks run stats, unlocks achievements, persists globally
- [ ] Achievement toast during gameplay ("ACHIEVEMENT UNLOCKED — Career Realignment")
- [ ] 15 starter achievements:
  - Progress: First Day, Spreadsheet Blooded, People Manager, Strategic Asset, Executive Presence
  - Survival: Still Employed (30s), Quarter Closed (60s)
  - Failure: Career Realignment (demoted once), Needs Improvement (3 demotions), Below Expectations (lose <20s)
  - Skill: Lateral Thinker (15 lane changes), Agile Workforce (30s no-hit)
  - Power-up: Caffeinated (5 coffees)
  - Secret: Circle Back, Thought Leader
- [ ] `PersonnelFileScene` — scrollable achievement browser, locked secrets show "CLASSIFIED RECORD"
- [ ] Run summary on game over: score, title, time, demotions, achievements unlocked this run
- [ ] Updated `TitleScene` menu: START CLIMB / PERFORMANCE RANKING / PERSONNEL FILE / QUIT PROFESSIONALLY

**On-theme labels:**
- Leaderboard → PERFORMANCE RANKING
- Achievements → PERSONNEL FILE
- Game Over → SERVICES NO LONGER REQUIRED
- Run Summary → CAREER SUMMARY

**Deliverable:** Full arcade loop — play, earn, file performance, compare, try again.

---

### Phase 6: Pixel Art & Visual Identity
**Goal:** Replace placeholders. Player evolution and world progression are visible.

- [ ] Color palette: corporate beige/taupe/gray world + cyan/magenta/amber neon feedback
- [ ] 5 player forms (32x32, 19 frames each: idle/climb/jump/fall/hit):
  - Intern (nervous, cheap officewear, expressive)
  - Analyst (formal, badge, less expressive)
  - Manager (broad suit, coffee/phone, stiffer, tired)
  - Executive (immaculate, unreadable, controlled movement, possible glow)
  - Abstract Entity (minimal face, geometric suit, glitch aura)
- [ ] 8 hazard sprites + 5 power-up sprites
- [ ] Ladder variants: normal, fragile, executive, collapsing
- [ ] Zone background assets (MVP: 3 zones):
  - Basement: concrete walls, boxes, pipes, flickering lights, copier graveyard
  - Cubicle: partitions, desks, monitors, conference glass, break area, whiteboards
  - Executive: dark glass, skyline, accent lighting, empty space
- [ ] Floor template chunk art (5-7 chunks per zone)
- [ ] HUD panel assets
- [ ] Sprite swapping on promotion/demotion with transition effects
- [ ] CRT scanline overlay

**Deliverable:** Retro pixel arcade game. Player visibly transforms. Building zones tell the story of the climb.

---

### Phase 7: Juice, Sound & Polish
**Goal:** Every action has feedback. The game feels alive and funny.

- [ ] Promotion juice: scale pop, suit snap-on, subtle glow, "Congratulations" tone
- [ ] Demotion juice: papers scatter, tie flies off, character shrinks, screen stutter
- [ ] Screen shake on hits
- [ ] Particle effects (obstacle hit, power-up collect)
- [ ] Corporate message ticker ("Leadership has updated priorities.")
- [ ] Sound effects:
  - Slack Storm: notification ping swarm
  - Meeting Block: dull thud / conference room slam
  - Glass Ceiling: sharp glass tap
  - Reorg Wave: low whoosh / paperwork blast
  - Coffee: upward chirp
  - Promotion Letter: stamp + sparkle
  - Achievement: arcade badge sting
  - Leaderboard entry: typewriter / HR filing click
- [ ] Music: 80s synth arcade, slightly sterile corporate, builds tension mid-run
  - Title: polished synth anthem
  - Gameplay: light bouncy → adds percussion → aggressive arpeggios
  - Demotion: sad corporate hold music
  - Promotion: triumphant but hollow
- [ ] Fake applause sting every few promotions
- [ ] Onboarding: first 20 seconds = curated safe opening, subtle callouts (MOVE / JUMP / PROMOTION TRACK)

**Deliverable:** Game feels satisfying, authored, and funny. Sound and visual feedback make every moment land.

---

### Phase 8: Content Expansion & Zone Depth
**Goal:** Fill out the building. Every run feels different.

- [ ] Expand title ladder to 100+ titles (10 tiers from Intern to You Are The Company)
- [ ] Expand to full zone progression:
  - Basement: 8 templates (clean storage → overflow collapse → service access)
  - Cubicle: 8 templates (cube row → conference glass → management threshold)
  - Management: 3 sub-zones × 8 templates each (lower/middle/upper)
  - Executive: 8 templates (skyline office → void lite → apex floor)
  - Corporate Void: 8 templates (grid space → recursive office echo → final loop)
- [ ] Floor generation system: zone lookup → template picking → depth-based variation
- [ ] Zone-specific hazard pools (basement=structural, cubicle=communication, management=gatekeeping/conflict, exec=precision)
- [ ] Expand pattern library to 15+ authored encounters
- [ ] Ladder types: standard, fragile, fast-track, dead-end, collapsing, executive
- [ ] World events (Reorg Event, Quiet Week, Layoff Wave, etc.)
- [ ] Obstacle variant spawning ("Slack Storm (After Hours)")
- [ ] Special floors (IT Closet, Breakroom, HR Floor, Audit Floor, Holiday Party)
- [ ] Expand achievements to 30 (add 15 more across all categories)

**Deliverable:** 350+ floors of procedural building. Each zone has distinct identity. Runs feel varied and narratively rich.

---

### Phase 9: Deploy & Share
**Goal:** Ship it. Get it in front of people.

- [ ] localStorage persistence (best score, run history, achievements, settings)
- [ ] Shareable end-of-run cards ("I made it to VP before burnout")
- [ ] Mobile/touch controls
- [ ] PWA support
- [ ] Deploy to Cloudflare Pages with ladderclimber.io domain
- [ ] Performance optimization (small bundle, compressed assets, sprite atlases)

**Deliverable:** Live at ladderclimber.io. Playable, shareable, zero monthly cost.

---

### Phase 10: Global Leaderboard (Only When Needed)
**Goal:** Social competition. Only build when local-only feels limiting.

- [ ] Cloudflare Worker API (score submission + leaderboard fetch)
- [ ] D1 database (name, score, highest_title, time_survived, demotions, created_at, build_version)
- [ ] Name entry on qualifying score (no accounts, no auth)
- [ ] Global leaderboard display in-game
- [ ] Optional: daily challenge seed via Workers KV
- [ ] Multiple leaderboard views later: highest title, longest survival, least demotions

**Deliverable:** Global leaderboard at ~$0 on Cloudflare free tier.

---

### Future (Post-Launch)
- Challenge modes: No Coffee Run, Meeting Hell, Reorg Week, Executive Mode, Quiet Quitting Mode
- Daily modifiers / seeded runs
- Unlockable cosmetic themes
- Full burnout meter system
- Anti-cheese tuning (camping, edge hopping, passive farming)
- Controller support
- Run replay / career timeline sharing

---

## MVP Cut Line

The MVP is **Phases 1-5 + deployment**. Everything needed to validate the core loop:

| Category | MVP Scope |
|----------|-----------|
| Mode | One endless mode |
| Lanes | 4 lane-snapped ladders |
| Movement | Lane switch + jump |
| Player forms | 5 (placeholder art OK for first playtest) |
| Hazards | 8 types with distinct behaviors |
| Power-ups | 5 types |
| Titles | 20-30 (not 200) |
| Difficulty | 5 bands + pattern spawning + rubber-banding |
| Achievements | 15 |
| Leaderboard | Local only (top 10) |
| Scenes | Title, Game, UI, Demotion, GameOver, Leaderboard, PersonnelFile |
| Zones | 3 (basement, cubicle, executive) — placeholder art OK |
| Sound | Basic SFX + 1 music loop |
| HUD | Title, score, visibility bar, demotion warning |

**What to explicitly cut from MVP:**
Online leaderboard, daily challenges, multiple game modes, 100+ achievements, 200 titles, full zone art progression, advanced hazard AI, unlockable themes, controller support, accounts, narrative framing.

---

## Tech Stack

- **Engine:** Phaser 3 (HTML5/Canvas)
- **Build:** Vite (static output)
- **Language:** JavaScript (ES modules)
- **Art:** Aseprite or Piskel (32x32 pixel art, 16-color palette)
- **Audio:** jsfxr for SFX, chiptune/retro synth for music
- **Hosting:** Cloudflare Pages (free tier, ladderclimber.io)
- **Data:** localStorage (client-side only through Phase 9)
- **Backend (Phase 10 only):** Cloudflare Worker + D1

## Immediate Next Step

**Phase 1** — scaffold the Vite + Phaser project. Get lane-snapped movement working with 4 ladders and camera scroll. Prove the feel is right before anything else. Placeholder rectangles. No content, no menus, no art.
