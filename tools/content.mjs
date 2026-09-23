// Tools/wiki/content.mjs
//
// The half of the wiki that cannot be dumped.
//
// data.json carries every NUMBER in the game, straight off the working tree.
// What it cannot carry is what those numbers mean: an AI class's behaviour
// lives in a 200-line update function, not in a field, and "why is this card
// rare" is a design decision with no representation in source at all.
//
// So everything here is hand-written and should read as such. Anything that
// could have been derived belongs in dump_main.lua instead -- if a number
// appears in this file, that is a bug waiting to drift.

export const SITE = {
  title: "Ricochet Ritual",
  tagline: "A wave-survival game about one orb, thrown and recalled.",

  // The PUBLISHED site's own repository -- public, and what Pages serves from.
  //
  // This deliberately does not link the game's source. That repository is
  // private, so every "Source on GitHub" in the footer of a public page would
  // have been a 404 for everyone who clicked it. A link that only works for
  // the people who did not need it is worse than no link.
  repo: "https://github.com/TheLepr0s/ricochet-ritual-wiki",
  repoLabel: "This site on GitHub",
};

export const NAV = [
  { file: "index.html",        label: "Home",         icon: "◆" },
  { file: "guide.html",        label: "How to play",   icon: "▶" },
  { file: "bestiary.html",     label: "Bestiary",      icon: "☠" },
  { file: "bosses.html",       label: "Bosses",        icon: "♛" },
  { file: "cards.html",        label: "Upgrade cards", icon: "🂠" },
  { file: "abilities.html",    label: "Abilities",     icon: "✦" },
  { file: "classes.html",      label: "Classes",       icon: "⚑" },
  { file: "waves.html",        label: "Waves",         icon: "≋" },
  { file: "achievements.html", label: "Achievements",  icon: "★" },
  { file: "systems.html",      label: "Systems",       icon: "⚙" },
];

/* ── Controls ──────────────────────────────────────────────────────────────
   Read off Objects/Entities/Input/Playerinput.lua and main.lua's keypressed. */
export const CONTROLS = [
  { key: "W A S D",   act: "Move",
    note: "Diagonals are normalised, so cutting a corner is not faster than running straight." },
  { key: "Mouse",     act: "Aim",
    note: "The wizard faces the cursor whichever way it is walking." },
  { key: "Left click", act: "Throw / swing",
    note: "With the orb in hand, throws it. With the orb out, swings at whatever is next to you. Holding it does nothing unless you have taken Charged Shot, which moves the throw to the release and winds it up while held." },
  { key: "Right click (hold)", act: "Recall",
    note: "Drags the orb back to you. Let go early and it keeps the velocity it had built." },
  { key: "Space",     act: "Blink",
    note: "Instant, passes through walls and enemies, and cannot land you inside geometry." },
  { key: "F",         act: "Utility ability",
    note: "Only bound once you have taken one — an ability is offered as a fourth card once on every third wave." },
  { key: "Escape",    act: "Pause",
    note: "Opens settings without leaving the run." },
  { key: "F11",       act: "Fullscreen" },
  { key: "F3",        act: "Developer overlay",
    note: "Spawns anything, grants any card or ability, forces a wave modifier, class or designed wave." },
];

/* ── The run, in one page ───────────────────────────────────────────────── */
export const LOOP = [
  {
    h: "Throw it, then get it back",
    p: `You have one orb and it is both the weapon and the problem. Thrown, it flies until
        something stops it, bouncing off walls and enemies and losing speed the whole time.
        Held, you have a melee swing and nothing else. Nearly every card in the game is an
        answer to some version of the question "what happens between the throw and the catch".`,
  },
  {
    h: "Recall is a second weapon",
    p: `Holding right click hauls the orb back through everything in the way, and a returning
        orb hits just as hard as a thrown one. Releasing early keeps the speed it gathered, so
        a recall is also how you re-aim without picking the orb up. Walking into a moving orb
        catches it — you do not have to wait for it to come to rest.`,
  },
  {
    h: "A wave, then two cards",
    p: `Clear the field and the upgrade screen opens with two choices, a third of the time a
        third, and on every third WAVE a fourth card that is a utility ability rather than a
        passive. Rerolls and banishes accumulate on a timer rather than being spent currency,
        so a bad screen late in a run is a smaller disaster than a bad screen early.`,
  },
  {
    h: "It gets specific, not just bigger",
    p: `Waves ramp, but the interesting pressure comes from named events: a modifier that
        changes the rules of one wave, a designed wave built from one kind of enemy, and a
        fixed boss every tenth. None of them are simply "the same wave with more health".`,
  },
];

/* ── AI classes ─────────────────────────────────────────────────────────────
   Keyed by the MODULE NAME the dumper recovers from ENEMY_CLASS, so a class
   that gets renamed shows up as an unstyled row rather than silently keeping
   the old description. `label` is the friendly name for the badge. */
export const AI = {
  MeleeEnemy: {
    label: "Melee", tone: "common",
    p: `Walks straight at you and swings once in range. The first swing skips its wind-up —
        it starts on frame 5 and the damage lands on frame 6, a few hundredths of a second after
        you step into reach — so treat its reach as contact damage and keep out of it. A swing
        that keeps going while you stay in range plays the full wind-up each time.`,
  },
  RangedEnemy: {
    label: "Ranged", tone: "rare",
    p: `Closes to its attack range, stops, and throws fireballs at 450px/s that hit for its own
        damage stat — so they scale with the wave — and expire after four seconds. A shooter
        that fires a fan hits for less with each bolt. <b>Scenery is cover</b>: a shot dies on the
        first solid obstacle it crosses, and a shooter only opens fire with a clear line to you.
        Blind, it circles you at range looking for one, then closes in round whatever is in the
        way. So the answer is to close, to leave, or to put a tree between you — never to trade
        in the open.`,
  },
  BomberEnemy: {
    label: "Bomber", tone: "warn",
    p: `No attack at all: it sprints at you and detonates on contact, after a 0.45s flashing
        warning. Its health is deliberately low enough that a base-damage orb one-shots it, so
        popping it early is always a clean single hit.`,
  },
  VampireEnemy: {
    label: "Vampire", tone: "epic",
    p: `Bites for contact damage, heals itself, and <b>roots you</b> while it drinks. Killing it
        mid-bite frees you immediately, which makes it the one enemy where burst damage is
        worth more than its health bar suggests.`,
  },
  EvilWizardEnemy: {
    label: "Caster", tone: "legendary",
    p: `Stands still and drips a chain of grasping hands along the line to where you were when
        the cast began. A hand that closes roots you and deals the caster's damage. Taking a hit
        cancels the cast. Come within 100px and it discharges at its own feet instead —
        <b>Backlash</b>, a 0.4s telegraphed blast and a hard shove — so standing on top of a
        caster is no longer the free answer it once was. Between casts it holds a band inside
        its own range, giving ground if you press it and circling if you do not, so it never
        walks itself into Backlash range: you have to go in after it.`,
  },
  ChargerEnemy: {
    label: "Charger", tone: "warn",
    p: `CHASE → WINDUP → DASH → RECOVER. It plants at range, flashes a ground lane, then commits.
        The direction locks when the wind-up starts, so the telegraph is the entire fight: step
        out of the lane and it charges anyway, then stands winded and takes damage like anything
        else.`,
  },
  SplitterEnemy: {
    label: "Splitter", tone: "uncommon",
    p: `An ordinary melee enemy until it dies. Death spawns two children — of the type named in
        its own row — each at a fraction of the parent's max health, with a moment of
        invulnerability so a single explosion cannot wipe the litter it just created.`,
  },
  ShieldEnemy: {
    label: "Shield", tone: "rare",
    p: `Carries a shield across a wide arc, and the shield turns to face you — up, down or
        sideways. An orb arriving inside that arc is refused outright — <code>takeDamage</code>
        returns false, exactly as an iframe-swallowed hit does — and bounces off harder than it
        arrived. Make the orb arrive from somewhere you are not, arrive fast enough to punch
        straight through, or blink past it: the shield swings round quickly, but not instantly.`,
  },
  SupportEnemy: {
    label: "Support", tone: "uncommon",
    p: `Never closes. It kites to a mid-range band, strafing at reduced speed, and spends a short
        cast pose on the thing it is actually for: mending the most wounded allies in range, or
        calling fresh bodies out of the ground. Both wear a role badge above the health bar,
        because at range the silhouette is identical.`,
  },
  BlightsporeEnemy: {
    label: "Hazard", tone: "uncommon",
    p: `A slow melee body whose real attack is the floor. Every body length it walks it drops a
        pool of rot that blooms for a moment, then bites whatever stands in it on a slow pulse —
        an ordinary hit, so every defensive card applies to it. The pools outlast the thing that
        made them, so killing it stops the line from growing and does nothing about the line.`,
  },
  SiphonEnemy: {
    label: "Drain", tone: "epic",
    p: `No attack of its own. It holds a band at range, winds up for a moment, then latches a beam
        onto you and sends a bead of drain down it every second or so, healing itself on most of
        what it takes. The beam holds only while it can see you: put a tree or a rock between you
        and it snaps, and it has to wind up again.`,
  },
  BossEnemy: {
    label: "Boss", tone: "legendary",
    p: `Three phases with an enrage flash at each threshold, a screen-wide health bar, and
        exemption from a wave modifier's health multiplier — nothing else in the game has that.`,
  },
  RevenantBoss: {
    label: "Boss", tone: "legendary",
    p: `The mobile boss. Dash combos and a leap, no ranged attack whatsoever, and every move a
        commitment it has to cross the floor to land.`,
  },
};

/* ── One line each on what a type is FOR ────────────────────────────────── */
export const ENEMY_NOTE = {
  Mushroom:   "The baseline: two orb hits at base damage and one after two stacks of Striking Force, which is what makes early orb damage a breakpoint rather than a rounding error.",
  Toadstool:  "Half a Mushroom's health at nearly double the speed. The enemy that punishes standing still.",
  Brute:      "The opposite trade: slow enough to kite forever, and the first enemy an un-upgraded orb genuinely cannot one-shot.",
  Bat:        "Ranged, but no faster than a Mushroom — you can simply walk away from it, which is the point of a first ranged enemy.",
  Wisp:       "A Bat that keeps up with you, and outranges it. It glows because the bat sprite is near-black, and a hue rotation preserves luma — recolouring alone was invisible on it.",
  Hivemind:   "A Bat that fires three bolts in a narrow fan. Individually weak, but it punishes the straight-line retreat that answers every other ranged enemy.",
  Bomber:     "The clock in a wave. It forces you to deal with it now rather than later, which is the only thing on the field that does.",
  Vampire:    "The first enemy that takes your movement away, and heals off you for doing it.",
  Nosferatu:  "More than twice a Vampire's health and faster. It roots for the same time, so the danger is purely how long it survives to keep doing it.",
  EvilWizard: "Casts from range and has no melee swing, but it is not safe to stand on any more — Backlash punishes anything inside 100px, including a player who walked into a cast.",
  Archmage:   "The late-game priority target. Longer range, far more health, every cast another root somewhere on the map, and the hardest Backlash in the game.",
  Ravager:    "The first enemy you beat by reading it rather than out-damaging it. Low health, so the lane is the whole threat — and the time it spends winded afterwards is the damage window the fight pays you back with.",
  Sporeling:  "Health that becomes two Toadstools, which are faster than the thing that made them. Kill it with room around you, or inside an explosion big enough to catch what comes out.",
  Bulwark:    "The card check. An orb that only goes forwards bounces off it all day; anything that flanks, pierces, arcs or simply arrives fast walks through. Its health is a long time to spend doing the wrong thing.",
  Witchdoctor:"Heals the most wounded allies around it often enough to outpace chip damage across a crowd. Capped at two alive at once, because three means nothing dies.",
  Bonecaller: "Calls fresh bodies out of the ground on a timer, and what it calls OUTLIVES it — so killing it late buys you nothing. Violet and badged so it is not mistaken for the healer at range; an earlier olive hue made the two indistinguishable. It unlocked at wave 14 with one point of weight for its first few versions, which meant most players never met it at all.",
  Blightspore:"Barely fights. It leaves a pool of rot every time it walks a body length, and the pools stay after it dies — kite in a circle around one for long enough and you have walled off your own escape route. The first enemy that makes WHERE the fight happens matter.",
  Siphon:     "Hangs at range and drains you through a beam, healing off what it takes. The beam needs line of sight, so a tree is a real answer to it — the first time scenery has been anything but an obstacle.",
  Broodmother:"The Bonecaller inverted. She calls faster, and every Toadstool she makes is tethered to her: kill the mother and the whole swarm drops at once. The swarm is a decoy, and walking past it is the correct play.",
  DreadSovereign: "A siege engine. It walks, and the fight is read from a distance.",
  PaleRevenant:   "The opposite fight, and the reason there are two.",
};

/* Facts about a type that live in its AI file rather than its data row, and so
   would otherwise be invisible. Only where there is something to say. */
export const ENEMY_EXTRA = {
  Ravager:      "Its row's <code>attackRange</code> is dead data — ChargerEnemy replaces the melee update entirely and uses its own trigger range, so the row value looks authoritative and governs nothing.",
  PaleRevenant: "No ranged attack at all. Its speed is capped below the wizard's own, on purpose, even at phase three.",
  Bomber:       "Shares the skeleton sheet with the Ravager and the Revenant, which is why all three read as bone rather than flesh.",
  Siphon:       "Its row carries <code>damage = 0</code> and <code>attackRange = 0</code>: it has no attack at all. Everything it does is the beam, and the beam is refused the moment the grid says it cannot see you — frozen or stunned, it drops as well.",
  Blightspore:  "Drops are keyed to DISTANCE WALKED, not to a timer. One parked against a wall would otherwise stack a dozen pools on one spot, when the whole point is that it draws a line you have to route around.",
  Broodmother:  "Shares SupportEnemy with the Witchdoctor and the Bonecaller; <code>summon_bound</code> in her row is the single flag that makes her brood die with her. Her summons are killed rather than deleted, so each one still scores, drops loot and triggers every on-kill upgrade you own.",
};

/* ── Bosses ─────────────────────────────────────────────────────────────── */
export const BOSSES = {
  DreadSovereign: {
    sub: "Wave 10, and every 20th after",
    lead: `A siege engine. It moves at a walking pace and the whole fight is read from a
           distance — every attack announces itself long before it lands, and every one of them
           is survivable by moving.`,
    moves: [
      { n: "Slam", d: `A wide ground telegraph, then a shockwave. The radius and the wind-up are
                       tuned together against one rule: running must work. From the edge of its
                       own trigger range you can clear the circle on foot, without blink.` },
      { n: "Bolt fan", d: `A spread of oversized, slowed projectiles — more of them each phase.
                           They are big and slow enough to walk between, which is the point: a
                           fan is a movement puzzle, not a damage check.` },
      { n: "Summon", d: `Calls bodies out of the ground, more each phase. Shares one cooldown
                         with the other two, so it never does two things at once.` },
    ],
    close: `The telegraph lengths are the design. At over a second of wind-up, the Sovereign is
            asking you to read it. Compare the Revenant, which asks you to already be moving.`,
  },
  PaleRevenant: {
    sub: "Wave 20, and every 20th after",
    lead: `The opposite fight, and the reason there are two. Nearly three times the Sovereign's
           speed, no ranged attack whatsoever, and every move a commitment it has to cross the
           floor to land.`,
    moves: [
      { n: "Dash combo", d: `Three, four, then five dashes in a row as phases fall, each with its
                             own short wind-up and a gap between. The direction locks at the
                             wind-up, so a combo is a sequence of dodges rather than one.` },
      { n: "Leap", d: `Goes airborne and comes down in a wide circle. The hitbox stays on the
                       ground for the whole flight — only the sprite is lifted — so what you see
                       and what hurts never disagree.` },
      { n: "Forced leap", d: `After two dash combos it must leap. Without that it would simply
                              never do it at close range, which is exactly what the first build
                              did until a state-coverage assertion caught it.` },
    ],
    close: `Its speed is capped below the wizard's own, even at phase three, on purpose: kiting
            has to stay an answer, or the fight stops being about reading it and becomes a
            question about whether blink is up.`,
  },
};

export const BOSS_SHARED = `Which boss arrives is <b>fixed rather than rolled</b>. A coin flip
  would take away the one thing about a boss wave worth knowing in advance, and fixing the order
  also guarantees that the first two bosses anyone meets are one of each. Both pay the same on
  death: a large flat heal on the spot, plus one extra card banked for the next time the upgrade
  screen opens — banked rather than granted, because that screen is not showing mid-wave.`;

/* ── Classes ────────────────────────────────────────────────────────────────
   Measured, not asserted. bench_main.lua with ARCHETYPE_ONLY=1, ten trials,
   paired against the same seeds. */
export const ARCH_MEASURED = {
  warden:      { dmg: "+0.0%",  live: "+33.0%" },
  stormcaller: { dmg: "+36.5%", live: "+13.1%" },
  stalker:     { dmg: "+8.8%",  live: "+5.4%", blind: true },
  breaker:     { dmg: "+37.5%", live: "+21.6%" },
};

export const ARCH_NOTE = `<b>These were measured, because “balanced” is not something you can
  assert.</b> Each class was run against a classless baseline on the same seeds, ten trials,
  offence as damage dealt and defence as frames survived. <b>Breaker and Stormcaller came out
  statistically identical</b> — well inside each other's error bars — and the Warden trades all
  of its offence for the best survival of the four.
  <br><br>
  It did not do that at first. It opened with less health, measured +0.0% damage <em>and</em>
  tied survival with the damage classes, and was simply the worse pick: killing faster also keeps
  you alive, so giving up offence bought it nothing. The extra health is the correction.
  <br><br>
  <b>The fixture is blind to the Stalker</b>, and that is worth saying plainly rather than tuning
  around. Both fixtures use a <b>stationary</b> wizard, so extra move speed and a shorter blink —
  the whole of what the class is — contribute exactly nothing, and it duly reads as noise on both
  axes. What could be judged was its opening card, which was genuinely the thinnest of the four,
  so that is what was doubled. The bias lists are all 12–13 cards by design: a class steering
  toward twenty would find its pieces far more reliably than one steering toward eight, which is
  a power difference wearing an identity's clothes.`;

/* ── Abilities ──────────────────────────────────────────────────────────── */
export const ABI_MEASURED = {
  nuke:        { kills: "20.0", per: "0.40+", note: "ceiling — it clears the screen" },
  singularity: { kills: "18.9", per: "0.34" },
  storm:       { kills: "15.0", per: "0.33", was: "6.0" },
  meteor:      { kills: "14.8", per: "0.33" },
  sentry:      { kills: "12.1", per: "0.30", note: "capped by shot count, not by targets" },
};

export const ABI_NOTE = `<b>The five damaging abilities were measured against each other</b>,
  because “the Nuke is stronger than Thunderstorm” turned out to be exactly right and nothing in
  the card benchmark could see it. An ability is a button, not a passive, so the fixture leaves
  the wizard completely idle — no swinging, no moving, orb pinned in hand — fires the ability the
  moment it is off cooldown, and counts <b>kills</b> rather than damage.
  <br><br>
  Kills, because damage clamps at the target's remaining health and therefore cannot see
  <em>overkill</em>. A Nuke does several times a trash enemy's health, four fifths of it
  uncounted, and the damage table duly ranked the game's screen-clear mid-table while the player
  reporting the problem was looking at an empty field.
  <br><br>
  Thunderstorm sat at less than half of anything else before this pass, which is exactly what was
  reported. It picked one random target per bolt, so most of a storm landed on things already
  dying; bolts now splash to a neighbour and it spends that overkill instead. <b>The Nuke stays
  above the band on purpose</b> — it is the only ability that takes your weapon away for five
  seconds to do what it does.
  <br><br>
  <b>Six of the twelve do no damage at all</b> and come back as a row of zeros. That is the
  fixture admitting what it cannot see, not a verdict. <b>Overload</b> is in the same position for
  a different reason: it amplifies an orb this fixture deliberately never throws. All seven are
  covered instead by behavioural assertions that check the one thing that matters — that pressing
  the button does its stated thing at all.`;

/* ── Designed waves ─────────────────────────────────────────────────────── */
export const COMP_ANSWER = {
  siege:        "Anything that flanks, pierces or ignores a guard. Four of them is a wave.",
  murmuration:  "Close the distance, or swat the shots out of the air.",
  thehunt:      "Footwork. Nothing here can be out-damaged from a standstill.",
  congregation: "Target priority. Kill the supports or the wave refills faster than it empties.",
  demolition:   "Spacing. Everything on the field punishes killing it up close.",
  coven:        "Do not get chained. Every one of them is a root somewhere on the map.",
};

export const COMP_NOTE = `<b>Every entry pays for its roster.</b> A wave of nothing but Bulwarks
  and Brutes at the normal count is not a themed wave, it is a wall — so THE SIEGE runs at a
  fraction of the usual number with a tighter concurrent cap, while MURMURATION, built from things
  that die to a glance, runs above it. A composition is a different <b>shape</b> of wave, not a
  harder one, and the score multiplier is what it pays you for the trouble.
  <br><br>
  <b>The same two safety rails as an ordinary wave still apply</b>: members are filtered against
  their own unlock waves, and the concurrent caps hold — so THE CONGREGATION cannot put four
  healers on the field however its weights fall. If every member of a rolled composition turns out
  to be locked or capped, the spawn table falls back to the normal one, because a wave that spawns
  nothing never ends.
  <br><br>
  They are <b>events</b>, not a per-wave roll: never two waves running, and never on a wave that
  already carries a modifier. Two banners at once is two things to read and no time to read
  either.`;

/* ── Drops ──────────────────────────────────────────────────────────────── */
export const DROPS = [
  { n: "Above 85% health", rate: "1.2%",   per: "per body",
    d: "You are fine, so the field stays clean. A heart here would only be walked over and wasted." },
  { n: "60 – 85%",         rate: "4.5%",   per: "per body",
    d: "Chipped. Just often enough to notice that bodies are worth walking to." },
  { n: "35 – 60%",         rate: "10%",    per: "per body",
    d: "In trouble. The wave starts paying you back for clearing it." },
  { n: "Below 35%",        rate: "20%",    per: "per body",
    d: "One in five. The band is deliberately steep at the bottom, because this is where a run is decided." },
  { n: "Elite kill",       rate: "×5",     per: "capped at 85%",
    d: "A fight you chose to take should pay for itself." },
  { n: "Boss kill",        rate: "4 drops", per: "guaranteed",
    d: "One heart for two minutes of work would read as an insult." },
];

export const DROP_NOTE = `The drop rate reads your health <b>fraction</b>, so it is a rubber band
  rather than a constant. Shield drops only roll for a build that can actually hold them — without
  Overflow or Kinetic Plating there is nowhere to put the points, and a pickup that does nothing is
  worse than no pickup at all.
  <br><br>
  <b>Healing goes somewhere.</b> <code>Player:heal</code> banks the excess so Overflow can turn it
  into shield instead of letting it evaporate at the cap. Shield absorbs before health, and draws
  as plates over the bar. Mitigation — Stoneskin, Last Stand — runs through a single
  <code>mitigate()</code> funnel, so two sources cannot silently multiply into immunity.`;

/* ── Combat model ───────────────────────────────────────────────────────── */
export const COMBAT = [
  { h: "Two damage entry points",
    p: `<code>takeDamage</code> is the one every weapon uses: it respects invulnerability frames,
        shields, mitigation and the shield enemy's guard arc, and it <b>returns whether the hit
        landed</b>. <code>takeDamageRaw</code> skips all of it and is for damage-over-time ticks
        that have already been gated elsewhere. Anything that rewards you for hitting — life
        steal, combo, on-hit procs — has to check the return value, or it pays out on hits that
        were refused.` },
  { h: "Invulnerability frames are shared",
    p: `An enemy that has just been hit ignores further hits for a moment. This is what stops a
        multi-hit effect from deleting a boss in one frame, and it is also why an orb passing
        through a crowd does not double-dip on the enemy it is touching.` },
  { h: "Every status ticks in one place",
    p: `Burn, bleed, freeze, chill, stun, curse and root all tick in a single function on the base
        enemy. A status applied by a card that is never ticked there is a dead upgrade — which has
        happened, and is why they all live together.` },
  { h: "Telegraphs match their hitboxes",
    p: `Ground circles are drawn flattened for perspective, but damage is tested in plain
        Euclidean distance. For a long time the two disagreed, so a boss slam and a meteor both
        hit outside the circle they had drawn. Every ground telegraph now announces the radius it
        actually uses.` },
  { h: "Enemies share one map of the way to you",
    p: `An enemy that can see you walks straight at you. One that cannot follows a single
        <b>flow field</b> — one distance-to-you map over the arena, rebuilt when you cross into a
        new cell and shared by every enemy — instead of each running its own path search. Nothing
        has to be rationed, and nothing gives up on a long detour: an enemy in a pocket whose only
        way out is away from you now walks out of it, where the old per-enemy search threw the
        long route away and left it pressing on the back wall.
        <br><br>
        Bodies are tested at their <b>feet</b> against the real obstacle boxes, not at the sprite
        origin (which sits on the creature's head) against the coarse planning grid. Measured on
        the navigation harness: enemy-frames spent inside a trunk went from 11.5% to 0.05%, and
        enemies reaching their fighting range from 91.7% to 99.5% — with the crowd spacing
        below switched off, since a ring holds late arrivals back by design. Knockback and the
        drag of a Black Hole, Singularity or Gravity Snap go through the same collision, so
        nothing is thrown through a tree any more.
        <br><br>
        <b>The horde keeps its shape.</b> Bodies ease apart rather than stacking, bigger ones
        shouldering smaller ones aside, so a crowd forms a ring round you instead of a single pile
        an orb could clear in one strike. Anything dashing is exempt, anything frozen or holding
        you stands firm, and whatever a crowd-control card is dragging is left to be piled up.
        Enemies arrive from just outside the camera's view — the real view, which stops at the
        map's edge — and one left far out of sight for a few seconds is brought back to just off
        screen ahead of you. Bosses are never moved. Once the wave has nothing left to send and
        three or fewer remain, arrows at the screen edge point to them.` },
  { h: "A card is worth what it measures, not what it says",
    p: `Every card in the pool is benchmarked against a no-card baseline on the same seed, so
        the map cancels out and what is left is the card. The September 2026 pass ran all 105
        of them and the interesting results were not the numbers, they were the things the
        numbers exposed.
        <br><br>
        <b>Explosive Touch was cheating.</b> It measured +157.6%, the highest figure in the
        catalogue and nearly five times the median epic — and it barely responded to its own
        damage number. At 1 damage per blast it still measured +123.7%, which meant almost none
        of its output was the blast. Its explosion spawns eight fire particles for the look, into
        the same list the Blazing Trail damage loop walks, and that loop charged full trail damage
        for them without asking where they came from. The card was handing out a free Blazing
        Trail on every landed hit to players who had never taken Blazing Trail. Particles now carry
        a cosmetic flag; the card is linear again and sits at +37.0%, almost exactly the epic median,
        at the damage value it always had.
        <br><br>
        <b>Twin Orbs did nothing.</b> A legendary measuring +2.7%, because a swing threw only the
        NEAREST orb — so a second orb bought no extra throughput and simply waited its turn. One
        swing now throws every orb in reach, which is what the card always claimed.
        <br><br>
        <b>Pushback made you worse.</b> Knocking a body away from you is knocking it out of the
        orb's path, and the card measured −17.2% damage while being sold as brute force. The shove
        is smaller now and carries damage with it.` },
  { h: "Two thirds of a fixture is knowing what it cannot see",
    p: `The same pass found three faults in the measuring equipment, each of which made working
        cards look dead. Thirteen dependent cards were measured with no base card underneath them
        and all reported an identical, impossible zero — Arc Damage without Chain Lightning is not
        a weak card, it is not a card. The fixture could not see a second orb at all, so Resonance,
        which needs both orbs to strike one target, could not register. And the defence fixture was
        measuring its own ceiling: the baseline survived 1463 frames of a 1500-frame window, so
        forty-two unrelated cards returned the same number.
        <br><br>
        A zero with a zero error bar is never "this card is weak". It means nothing happened, and
        the first thing to suspect is the fixture.` },
  { h: "An orb that gets stuck lets itself out",
    p: `Two obstacles with a narrow gap between them can hold a thrown orb indefinitely, because
        nothing damps a wall bounce enough to end it. There are two answers.
        <b>Recall passes through scenery</b>, so holding right click is a guarantee rather than a
        suggestion -- it used to fight the wall resolver and lose, which left the player with no
        move at all. And the orb frees itself: if it has not travelled more than a short distance
        for about a second and a half, it checks whether it is in a <em>pocket</em>, and phases out
        through the scenery if it is.
        <br><br>
        <b>Confinement is what marks a trap, not speed.</b> The first version also required the orb
        to still be moving, on the reasoning that a stationary orb is one waiting to be collected --
        and that let exactly the worst case through, because a wall bounce bleeds speed and a slow
        trapped orb comes to rest <em>inside</em> the gap. Measured: an orb entering at 260px/s
        stopped three pixels from the centre and stayed there forever. So it samples a ring
        instead. A flat wall the orb has rolled up against blocks at most half of it and is
        reachable on foot; a gap or an inside corner blocks more. An orb already at rest is nudged
        toward you as well, since phasing alone does nothing for something with no momentum.` },
];

/* ── Score ──────────────────────────────────────────────────────────────── */
export const SCORE = `Score comes from kills, weighted by what died and multiplied by the wave's
  modifier and composition, plus a survival term. An elite is worth more than the trash it spawned
  among; a boss is worth more again. Records persist between runs, and the difficulty a run was
  played on is recorded with it — a HARD score and an EASY score are not the same number and are
  not stored as though they were.`;

/* ── Audio ─────────────────────────────────────────────────────────────── */
export const AUDIO_NOTE = `<b>What a kill sounds like.</b> Every orb kill fires a short confirm
  pitched to your current combo tier, several voices deep and rate-limited — short enough that a
  double kill is two sounds, long enough that an effect wiping eight bodies on one frame is not
  eight. Dropping the combo fires the only sound in the set that falls in pitch.
  <br><br>
  <b>Crossing a tier fires the next rung of the streak ladder</b>, built the way a Valorant kill
  streak is: one instrument, and every rung a clear step higher and a little bigger than the one
  before. Each is a quick run up to its note, from C5 at the first tier to C7 at the last, and the
  last one is an event of its own, with a chord that blooms underneath and sparkle off the top.
  There are six rungs because seven tiers give six promotions; the set they replaced had seven
  sounds, and its top one could never play.
  <br><br>
  <b>Voices and rate limits are central, not per-caller.</b> A pool of sources per sound key lets
  one overlap itself where that overlap <em>is</em> the feedback, and pins announcements to exactly
  one, since two wave-clears at once is always a mistake. Minimum spacing is enforced in one place,
  because the callers that get this wrong are exactly the ones that never think about audio — a
  per-frame branch in an enemy update, a damage tick in a crowd.
  <br><br>
  <b>Sounds are placed where they happen</b> — against the middle of the camera's view, with a
  gentle fade: full volume anywhere on screen, easing to about a third a screen or so beyond it,
  and a soft pan that never puts a sound hard in one ear. Your own orb's sounds keep a floor, so
  your weapon connecting is always audible. Every effect is made mono when it loads so this
  applies to all of them. (The old falloff was so steep that a crit or a freeze a few hundred
  pixels away, in plain view, came out close to silent — while stereo samples, which could not
  be placed at all, played at full volume from anywhere on the map.)
  <br><br>
  Nearly every sound in the game is <b>synthesised by a Lua script in the repo</b> rather than
  licensed, which is why they sit together tonally — including a voice of its own for every card
  that fires an effect: Void Pulse, Crescendo, Death Nova, Explosive Touch, Thunderclap, Volatile
  Core, Rupture, Aegis's parry, the Owl's strike and Slingshot's arming click. One bought sound
  was kept: the orb recall.`;

export const KILL_TIERS = [
  { t: 1, at: 1,   name: "COMBO" },
  { t: 2, at: 5,   name: "NICE" },
  { t: 3, at: 10,  name: "SLICK" },
  { t: 4, at: 18,  name: "WICKED" },
  { t: 5, at: 28,  name: "SAVAGE" },
  { t: 6, at: 40,  name: "RUTHLESS" },
  { t: 7, at: 60,  name: "GODLIKE" },
];

/* ── Modifier field labels ─────────────────────────────────────────────── */
export const FIELD_LABEL = {
  healthMult: "enemy health", damageMult: "enemy damage", speedMult: "enemy speed",
  countMult: "wave size", spawnIntervalMult: "spawn interval", maxAliveMult: "concurrent cap",
  scoreMult: "score per kill", allElite: "every spawn is elite", volatile: "corpses explode",
  splitAll: "everything splits on death", rampMult: "scaling rate",
  healFrac: "between-wave heal", healFlat: "between-wave heal (flat)",
  rerolls: "starting rerolls", banishes: "starting banishes",
};

export const ELITES = `Any ordinary spawn can arrive <b>crowned</b>: more health, more damage,
  a visible crown and a wider health bar, and a much better drop. They are a fight you can choose
  to take or leave, and the reward is scaled so that taking one is usually correct but never
  free. Bosses are never elite — they are already the exception to the health multipliers.
  <br><br>
  <b>The health bonus is not one number.</b> It was — a flat ×2.6 — and that reads fair while
  being nothing of the kind, because base health across the roster spans twelve-fold. A flat
  multiplier charges the same percentage and a completely different <em>absolute</em> price: at
  wave 10 it added 155 HP to a Mushroom and 900 to a Brute. Measured, an elite Brute took
  <b>12 seconds</b> against a boss's 19 — two thirds of a boss fight, from a piece of trash.
  <br><br>
  So the bonus now falls off with the type's <b>base</b> health on a square root: quadruple the
  base and the bonus halves, with a floor so a tank is still meaningfully tankier. It is read off
  the row rather than off the scaled figure, so the shape is identical on every wave and elites do
  not quietly weaken as a run goes on. Anything at or below the reference keeps the full
  multiplier, which means <b>elite trash is untouched</b> — that was the case that was already
  working.`;

/* ── Glossary ──────────────────────────────────────────────────────────── */
export const GLOSSARY = [
  { t: "Direct hit", d: "The orb striking an enemy body, as opposed to an explosion, arc or aura. Most on-hit cards read direct hits only." },
  { t: "Recall", d: "Holding right click to drag the orb back. A returning orb does full damage." },
  { t: "Combo", d: "Consecutive hits inside a time window. Drops to zero if the window lapses; several cards scale off it." },
  { t: "Elite", d: "A crowned ordinary enemy with boosted stats and a far better drop." },
  { t: "Modifier", d: "A named rule change applied to a single wave, announced by a banner." },
  { t: "Designed wave", d: "A wave built from a hand-picked roster instead of the usual weighted table." },
  { t: "Class", d: "Picked once at the start of a run. Biases which cards you are offered, and opens with one signature card." },
  { t: "Utility", d: "The F-key ability. Offered as a fourth card on every third upgrade screen; you hold one at a time." },
  { t: "Stack cap", d: "How many times a repeatable card can be taken. At the cap it stops being offered." },
  { t: "Banish", d: "Removing a card from the pool for the rest of the run, rather than rerolling the screen." },
];
