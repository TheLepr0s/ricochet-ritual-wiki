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

  // The published site's own repository. The game's repository is private, so
  // linking it from a public page would 404 for every visitor.
  repo: "https://github.com/TheLepr0s/ricochet-ritual-wiki",
  repoLabel: "This site on GitHub",
};

export const NAV = [
  { file: "index.html",        label: "Home",         icon: "◆" },
  { file: "guide.html",        label: "How to play",   icon: "▶" },
  { file: "bestiary.html",     label: "Bestiary",      icon: "☠" },
  { file: "bosses.html",       label: "Bosses",        icon: "♛" },
  { file: "cards.html",        label: "Upgrade cards", icon: "🂠" },
  { file: "families.html",     label: "Families",      icon: "❂" },
  { file: "builds.html",       label: "Builds & shop", icon: "✧" },
  { file: "abilities.html",    label: "Abilities",     icon: "✦" },
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
    note: "Only bound once you have bought one — abilities are sold only in the Essence Shop, one on every visit." },
  { key: "U",         act: "My Upgrades",
    note: "Lists every card you hold, coloured by rarity. Escape (or U again) closes it." },
  { key: "Escape",    act: "Pause",
    note: "Opens settings without leaving the run. Everything freezes and goes silent: sound effects are held and the music stops. The music also stops whenever the game window is in the background, and comes back when you return — unless the game is still paused." },
  { key: "F11",       act: "Fullscreen" },
  { key: "F3",        act: "Developer overlay",
    note: "Spawns anything, grants any card or ability, forces a wave modifier or special wave." },
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
    p: `Holding right click hauls the orb back, and a returning orb hits whatever it meets just
        as hard as a thrown one. It comes home round the scenery, not through it — a tree in the
        way stops it until you step aside. Releasing early keeps the speed it gathered, so
        a recall is also how you re-aim without picking the orb up. Walking into a moving orb
        catches it — you do not have to wait for it to come to rest.`,
  },
  {
    h: "A wave, then one card",
    p: `Clear the field and the upgrade screen deals three cards, and you take <b>one</b>.
        Utility abilities are not dealt here: they are sold only in the Essence Shop. Rerolls
        and banishes accumulate on a timer rather than being spent currency, so a bad screen
        late in a run is a smaller disaster than a bad screen early.`,
  },
  {
    h: "A build, not a pile",
    p: `Every card belongs to one of twelve <a href="families.html">families</a>, and every card you
        own in a family makes that family's other cards likelier to turn up — so an early lean
        compounds into an identity. Hold <b>3, 5 and 7</b> different cards of one family and its three
        <a href="families.html#traits">traits</a> switch on, tracked in a column on the right of the
        screen; a card that would complete one says so above it. A run starts with one card from
        the family you <a href="families.html#start">pick on the menu</a>. A
        legendary bought in the shop comes with a <b>curse</b>, printed on the card before you take it. The run ends
        with your build's name — the leading family's adjective and the runner-up's noun, a
        <i>Frost Juggernaut</i> — and each build name keeps its own records.`,
  },
  {
    h: "Every fifth wave, the Essence Shop",
    p: `Kills earn essence — one each, five for an elite, twenty-five for a boss — and after every
        fifth wave the free card is replaced by a <a href="builds.html#shop">shop</a>: an ability,
        a boost and a card pack for each of your two biggest families, a reroll, and <b>Transmute</b>, which sacrifices random cards you own for a choice
        of one a rarity higher. Unspent essence carries over, and your total sits in the top-right
        corner beside a purple orb.`,
  },
  {
    h: "Why you died",
    p: `The death screen has a recap down its left side: what killed you and how hard, which
        three enemies hurt you most, which three of your cards did the most damage, your biggest
        single hit, and how much you were healing per wave — averaged only since your healing
        last changed (a healing card, a curse, the drop rate halving), so it describes the build
        you died with rather than the one you had ten waves ago. <b>See Upgrades</b> opens every
        card you ended the run with, and the screen waits for <b>Continue</b> (or Space) rather
        than closing on the first click. Kills made through the F3 developer menu never count
        toward the recap.`,
  },
  {
    h: "It gets specific, not just bigger",
    p: `Waves ramp, but the interesting pressure comes from named events: a modifier that
        changes the rules of one wave, a designed wave built from one kind of enemy, and a
        fixed boss every tenth. None of them are simply "the same wave with more health".`,
  },
  {
    h: "The field is part of the fight",
    p: `Trees are cover, not just obstacles. A ranged enemy only fires with a clear line to
        you and its shots die on the first tree they cross (they fly over rocks and stumps), and
        a Siphon's beam
        snaps the moment something comes between you. Enemies arrive from just past the edge of
        the screen, walk round scenery rather than through it, and spread into a ring rather
        than a heap. When your orb is off screen a big outlined arrow at the edge points to it —
        one per orb if you have two — with how far away it is written beside it. A boss always has
        its own arrow: a large crimson one at the edge, labelled BOSS and with its name, whenever it
        is off screen, and a crimson marker bobbing over its head when it is on screen. Once a wave
        has nothing left to send and three or fewer enemies remain, arrows point to them too.
        <br><br>
        On easy and normal the map always leaves at least two orbs' width (96px) between any two
        solid obstacles, so there is room to throw between them and nothing to wedge in. Hard keeps
        its tight woods.`,
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
        that fires a fan hits for less with each bolt. <b>Trees are cover</b>: a shot dies on the
        first tree it crosses, and a shooter only opens fire with a clear line to you. Rocks and
        stumps are knee-high, and shots fly over them.
        Blind, it circles you at range looking for one, then closes in round whatever is in the
        way. So the answer is to close, to leave, or to put a tree between you — never to trade
        in the open.`,
  },
  BomberEnemy: {
    label: "Bomber", tone: "warn",
    p: `No attack at all: it sprints at you and detonates on contact, after a 0.45s flashing
        warning. Its health is deliberately low enough that a base-damage orb one-shots it, so
        popping it early is always a clean single hit. Frozen or stunned, even a lit fuse stops.`,
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
        <b>Backlash</b>, a 0.4s telegraphed blast and a hard shove. Between casts it holds a band
        inside its own range, giving ground if you press it and circling if you do not, so it
        never walks itself into Backlash range: you have to go in after it.`,
  },
  FrogEnemy: {
    label: "Leaper", tone: "warn",
    p: `CHASE → WINDUP → DASH → RECOVER. It closes in small hops (moving only while airborne),
        crouches at range, flashes a ground lane, then leaps.
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
        calling fresh bodies out of the ground. The Plague Priest has no cast at all: its ring is
        a standing aura that halves your healing while you are inside it, and it keeps close
        enough to hold you there. Each wears a role badge above the health bar, because at range
        the silhouette is identical.`,
  },
  SlugEnemy: {
    label: "Hazard", tone: "uncommon",
    p: `A melee body whose real attack is the floor. From 150 to 440px away it also plants and
        lobs a ball of poison every 3.4s: the ball arcs over anything in the way to the spot you
        stood on when it was thrown, marked on the ground for the whole flight, and bursts
        there into a big 90px pool, splashing you for its own damage if you are still on the mark.
        Every 35px it walks it also drops a small 40px pool of rot that blooms for a moment, then bites whatever stands in it on a slow pulse —
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
        exemption from a wave modifier's health multiplier — nothing else in the game has that.
        From range it cycles five bullet patterns in a fixed order per phase, each asking a
        different movement of you.`,
  },
  RevenantBoss: {
    label: "Boss", tone: "legendary",
    p: `The mobile boss. Dash combos, a leap, the Phantom Cross and the Reaper's Wheel, no
        projectile whatsoever, and every move a commitment you answer by moving. Nothing it does
        is stopped by trees or rocks.`,
  },
  CollectorBoss: {
    label: "Boss", tone: "legendary",
    p: `The thief. It takes your three best cards when it arrives and keeps its distance for the
        whole fight — coin fans that trees stop, a grab lane that yanks you in, chests that burst
        around you, a blink away. Killing it gives every card back.`,
  },
};

/* ── One line each on what a type is FOR ────────────────────────────────── */
export const ENEMY_NOTE = {
  Mushroom:   "The baseline: two orb hits at base damage and one after two stacks of Striking Force, which is what makes early orb damage a breakpoint rather than a rounding error.",
  Toadstool:  "Half a Mushroom's health at nearly double the speed. The enemy that punishes standing still.",
  Brute:      "The opposite trade: slow enough to kite forever, and the first enemy an un-upgraded orb genuinely cannot one-shot.",
  Bat:        "Ranged, but no faster than a Mushroom — you can simply walk away from it, which is the point of a first ranged enemy.",
  Wisp:       "A Bat that keeps up with you, and outranges it. It glows because the bat sprite is near-black and a hue rotation preserves luma, so a recolour alone would be invisible on it.",
  Hivemind:   "A Bat that fires three bolts in a narrow fan. Individually weak, but it punishes the straight-line retreat that answers every other ranged enemy.",
  Bomber:     "The clock in a wave. It forces you to deal with it now rather than later, which is the only thing on the field that does.",
  Vampire:    "The first enemy that takes your movement away, and heals off you for doing it.",
  Nosferatu:  "More than twice a Vampire's health and faster. It roots for the same time, so the danger is purely how long it survives to keep doing it.",
  EvilWizard: "Casts from range and has no melee swing, but it is not safe to stand on — Backlash punishes anything inside 100px, including a player who walked into a cast.",
  Archmage:   "The late-game priority target. Longer range, far more health, every cast another root somewhere on the map, and the hardest Backlash in the game.",
  Frog:       "The first enemy you beat by reading it rather than out-damaging it. Low health, so the lane is the whole threat — and the time it spends winded afterwards is the damage window the fight pays you back with.",
  Sporeling:  "Health that becomes two Toadstools, which are faster than the thing that made them. Kill it with room around you, or inside an explosion big enough to catch what comes out.",
  Bulwark:    "The card check. An orb that only goes forwards bounces off it all day; anything that flanks, pierces, arcs or simply arrives fast walks through. Its health is a long time to spend doing the wrong thing.",
  Witchdoctor:"Heals the most wounded allies around it often enough to outpace chip damage across a crowd. Capped at two alive at once, because three means nothing dies.",
  Bonecaller: "Calls fresh bodies out of the ground on a timer, and what it calls OUTLIVES it — so killing it late buys you nothing. Violet and badged so it is not mistaken for the healer at range.",
  Slug:"Barely fights, but everything it does POISONS you: its bite, the ball it lobs from range (it lands where you stood and leaves a pool), and the small pool of rot it leaves every 35px it walks. Poison is a tick a second for three seconds, 3 damage each at every wave (armour does not reduce it, a shield soaks it), and a new dose refreshes it rather than stacking; your health bar turns green and a POISONED plate counts it down. The pools stay after it dies — kite in a circle around one for long enough and you have walled off your own escape route. The first enemy that makes WHERE the fight happens matter.",
  Siphon:     "Hangs at range and drains you through a beam, healing off what it takes. The beam needs line of sight, so a tree is a real answer to it.",
  Broodmother:"The Bonecaller inverted. She calls faster, and every Toadstool she makes is tethered to her: kill the mother and the whole swarm drops at once. The swarm is a decoy, and walking past it is the correct play.",
  PlaguePriest: "Halves your healing while you stand in its ring, and keeps close enough to hold you in it — walking away does not work for long, so the answer is to kill it. Frozen or stunned, the aura switches off. The HUD says HEALING HALVED beside your health bar while it does.",
  DreadSovereign: "A siege engine. It walks, and the fight is read from a distance.",
  PaleRevenant:   "The opposite fight: it runs, and you have to be moving already.",
  Collector:      "The third fight, and a test of the build rather than the footwork: it takes your three best cards for as long as it lives.",
};

/* Facts about a type that live in its AI file rather than its data row, and so
   would otherwise be invisible. Only where there is something to say. */
export const ENEMY_EXTRA = {
  Frog:         "Its row's <code>attackRange</code> is unused — FrogEnemy replaces the melee update entirely and uses its own trigger range.",
  PaleRevenant: "No projectile at all — even the Phantom Cross is aimed at your feet, not fired. It goes straight through trees and rocks, so scenery is no cover from it. Its speed is capped below the wizard's own, on purpose, even at phase three.",
  Bomber:       "Shares the skeleton sheet with the Revenant, which is why they read as bone rather than flesh.",
  Siphon:       "Its row carries <code>damage = 0</code> and <code>attackRange = 0</code>: it has no attack at all. Everything it does is the beam, and the beam is refused the moment the grid says it cannot see you — frozen or stunned, it drops as well.",
  Slug:         "Drops are keyed to DISTANCE WALKED, not to a timer — a 40px pool every 35px — so one parked against a wall does not stack pools on one spot: it draws a line you have to route around. The pool a THROWN ball leaves is the big one, 90px.",
  Broodmother:  "Shares SupportEnemy with the Witchdoctor and the Bonecaller; <code>summon_bound</code> in her row is the single flag that makes her brood die with her. Her summons are killed rather than deleted, so each one still scores, drops loot and triggers every on-kill upgrade you own.",
  PlaguePriest: "The fourth SupportEnemy, told apart by <code>plague_range</code> in its row, and it carries <code>keep_min</code>/<code>keep_max</code> of its own so it stands inside its ring rather than at a healer's distance. It never attacks. The skeleton sheet is achromatic, so it is TINTED a bile yellow-green, clear of the Revenant's mint.",
  Collector:    "On the vampire sheet, TINTED gold: the cloak is too dark for a hue rotation to reach gold (a rotation keeps luminance), while a multiply turns the face and hands gold and leaves the cloak a royal purple.",
};

/* ── Cards: facts that live in code rather than on the card ────────────────
   Keyed by card key. Only where the card text leaves out something a player
   would want to know. */
export const CARD_NOTE = {
  TwinOrbs:    "The second orb matches the first's size, Heavy Orb included, and drops Overload when it ends.",
  Thunderclap: "Needs a real bounce: a wall touched slower than the orb's damage speed does nothing, as with Carom and Fracture.",
  BlackHoleCore: "Stacks up to three: 3 m at one card, 4.1 m at two, 5.2 m at three. The pull and the grind are as strong at the centre at every size and fade to nothing at the rim, so a wider well also pulls harder at any given distance, not just further.",
  OwlCompanion:  "Its numbers above are read from the game. A bolt strikes its target only; Owl Thunder makes it leap on, never to the same enemy twice. Its damage rides the enemy health curve. Owl Swiftness gives 25% more strikes a stack.",
  DemonCompanion: "Its numbers above are read from the game. Its damage rides the enemy health curve, every swipe rakes the enemies around its target as well, and the curse multiplies damage from every source, the orb included; Curse Potency tops out at ×2.15. It goes for the nearest enemy that is NOT cursed yet, changing target the moment its swipe marks one; only when everything in reach is cursed does it renew the curse closest to running out. It walks round trees, not through them.",
  OrbitMode:     "A shard's hit carries the orb's standing bonuses — Berserker, Blood Pact, Momentum, Adrenaline, Rampage, Last Stand — can crit through Critical Mass, and grows with the square root of the enemy health curve (about ×1.9 by wave 20). Per-throw bonuses like Charged Shot and Comet do not apply: the ring is not a throw.",
  Quickening:    "+9 move speed a stack, so ten stacks is +90 (+45%). A hit costs 4 stacks.",
  Seeker:        "An epic to find, a rare to stack: once you own one, further copies are drawn at rare odds and in a rare frame. A redirect relaunches the orb at no less than 8 m/s and looks 9.2 m for its next target, up to five redirects a throw.",
  Backhand:      "A swing that meets the orb while it is still flying at you (faster than 1.2 m/s) counts too, judged per orb, so you can rally it: slap it back, it returns, slap it again. An orb already heading away does not count, so swinging twice cannot bank a second bonus.",
  MagneticGrip:  "Pulls the orb home until it is within 0.8 m of you (inside swing reach), then brakes it to rest there.",
  ReserveCharge: "Your F ability holds two charges, and the cooldown refills one at a time whenever you are below two, so while one charge sits ready the other is already coming back. Spending the spare mid-refill does not restart the clock. Only offered once an ability is in the slot, and a newly swapped-in ability arrives with both charges. The ability bar shows the count after its name.",
  SecondWind:    "It puts you back on 30 HP and makes you invulnerable for 3 seconds: no damage and no roots, shown as a golden shell that flickers in its last second. The window is its own timer, so the Evil Wizard's hand, which wipes your ordinary iframes when it grabs you, cannot cut it short.",
  LifeSteal:     "Heals on the KILL — 2 HP for every enemy the orb kills — not on every hit.",
  Overflow:      "Only half of any overheal becomes shield. Shields are capped at 30% of your max health and drain once you go 8 seconds without being hit — see Staying alive on How to play.",
  IronSkin:      "+0.06s of invulnerability a stack, on top of the 0.3s base.",
  SafeHands:     "0.6s of invulnerability, against the 0.3s base.",
  GoatCompanion: "Its numbers above are read from the game. It rams whatever comes near you — always whatever is closest to you, switching mid-charge if something else gets nearer — and shoves the target hard, straight away from you; everything beside it is shoved the same way by the same share it takes of the damage. Between rams it never stands still, ambling from spot to spot around you and trotting to catch up if you outrun it. It has no daze of its own: Concussion adds one, and the shove plays under the daze rather than after it. It walks round trees, not through them.",
  AngelCompanion: "Its numbers above are read from the game. Hovers over your right shoulder whichever way you face. Judgement HUMBLES — a judged enemy hits you softer, its shots included — and SMITES: when a judged enemy dies, a pillar of light hits everything around it and judges them too, so a kill in a judged crowd carries on through it. The Demon is the damage pick of the pair and the Angel the one that keeps you alive.",
  GoatDamage:    "+9 is a wave-1 figure and rides the wave like the ram itself.",
  GoatFrequency: "x0.8 on the time between rams a stack, down to a 0.4s floor.",
  GoatDaze:      "The goat's only daze. Everything a ram reaches is dazed, the target and the splash, 0.5s a stack up to 1.5s; bosses stay capped at 0.2s.",
  Boomerang:     "The return cannot be cancelled, and a throw that has not come home sets off again by itself. The return counts as a recall — Static Charge lets go when it starts, Tether and Gravity Snap work on the way, Volatile Core goes off on its first hit — but it does not spend the recall cooldown.",
  RaiseDead:     "A risen enemy with nothing to fight within 6.4 m walks back to you rather than standing where it rose.",
  WreckingBall:  "The 20% slow applies to the throw and the recall alike (a recall tops out at 6.1 m/s instead of 7.6).",
  Shatter:       "A freeze is not the rare state it sounds: Freezing Shot re-freezes on every second hit, so a body you keep hitting stays frozen.",
  Bowling:       "What a thrown body strikes takes the full hit, and the thrown body hurts itself once: the hit again off scenery, the hit and half again off another enemy.",
  DeathNova:     "18 is a wave-1 figure: it grows with the waves like enemy health, as the companions and abilities do.",
  VolatileCore:  "20 is a wave-1 figure that grows with the waves. It goes off on the first enemy the returning orb hits, once a recall; a recall that hits nothing does nothing. A Boomerang return sets it off too.",
  StaticCharge:  "A recall spends only the charges it actually fires — one per enemy within 6.4 m of the orb — and keeps the rest.",
  ChainLightning: "Stackable: each copy after the first adds one jump, 1.5 m of reach and 5 damage a jump.",
  CursedGlass:   "8 a shard is a wave-1 figure that grows with the waves.",
  RiftStep:      "25 is a wave-1 figure that grows with the waves.",
  Executioner:   "Judged on what a direct hit LEAVES: a hit that would drop an enemy under 10% of its max health kills it instead, after curses and every other multiplier.",
  Rupture:       "30 is a wave-1 figure that grows with the waves.",
  Thornmail:     "22 is a wave-1 figure that grows with the waves.",
  PhaseShot:     "Cannot be held with Juggernaut: Juggernaut already lets every enemy through.",
  ColdSnap:      "Offered only once you own something that chills or freezes (Freezing Shot, Frozen Court, Hoarfrost, Absolute Zero, Temporal Rift or Tether).",
  Tether:        "24 damage every 0.36s to everything on the cord, 67 a second, and the slow is ×0.70 for 0.8s.",
};

/* ── Bosses ─────────────────────────────────────────────────────────────── */
export const BOSSES = {
  DreadSovereign: {
    sub: "Wave 10, and every 30th after",
    lead: `A siege engine. It moves at a walking pace and the whole fight is read from a
           distance — every attack announces itself long before it lands, and every one of them
           is survivable by moving.`,
    moves: [
      { n: "Slam", d: `A wide ground telegraph, then a shockwave. The radius and the wind-up are
                       tuned together against one rule: running must work. From the edge of its
                       own trigger range you can clear the circle on foot, without blink, in its
                       0.9s wind-up.` },
      { n: "Bolt ring", d: `A full ring of oversized bolts, one aimed at you — 8, 11 then 15 as
                            phases fall. Big enough to walk between: a movement puzzle, not a
                            damage check. The bolts fly at 495px/s, fast enough that a ring has to
                            be read rather than strolled through.` },
      { n: "Alternating rings", d: `Three to five rings in quick succession, each turned half a
                                    gap from the one before, so the lane you stood in for one ring
                                    is a bolt for the next. You step sideways every ring.` },
      { n: "Wall", d: `A line of bolts fifteen wide, aimed at you, with a two-bolt hole in
                       it. The line and its hole are drawn on the ground first and it fires exactly
                       as drawn. The hole is never where you stand and never further than you can
                       walk before it arrives, even from slam range. Two walls back to back in
                       phase three.` },
      { n: "Volley", d: `A fast stream of five to nine single bolts, each re-aimed at you as it
                         fires. Standing still eats every one; a steady sideways walk makes each
                         miss behind you.` },
      { n: "Spiral", d: `Phase two onwards. Two arms of bolts wound out over a second and a half.
                         The space between shots widens as they fly, so the way through is a little
                         way out, not up close.` },
      { n: "Summon", d: `Calls bodies out of the ground, more each phase. Everything shares one
                         cooldown, and a pattern's own length is added to it, so it never does two
                         things at once.` },
    ],
    close: `The telegraph lengths are the design. At nearly a second of wind-up, the Sovereign is
            asking you to read it. Compare the Revenant, which asks you to already be moving.
            The ranged patterns come in a <b>fixed order per phase</b> — ring, wall, volley,
            summon, alternating rings in phase one — so the fight can be learned, and each new
            phase starts its rotation from the top.`,
  },
  PaleRevenant: {
    sub: "Wave 20, and every 30th after",
    lead: `The opposite fight, and the reason there are two. Nearly three times the Sovereign's
           speed, not one projectile, and every move a commitment you beat by moving rather than
           by standing somewhere clever.`,
    moves: [
      { n: "Dash combo", d: `Three, four, then five dashes in a row as phases fall, each with its
                             own short wind-up and a gap between. The direction locks at the
                             wind-up, so a combo is a sequence of dodges rather than one. Every dash
                             runs its full length straight through trees and rocks, and the lane is
                             drawn full length to match.` },
      { n: "Leap", d: `Goes airborne and comes down in a wide circle. The hitbox stays on the
                       ground for the whole flight — only the sprite is lifted — so what you see
                       and what hurts never disagree.` },
      { n: "Forced leap", d: `After two dash combos it must leap, even at close range.` },
      { n: "Phantom Cross", d: `Every third attack. It plants and marks two, three, then four
                                lanes that all cross at your feet, a thousand pixels long. After the
                                wind-up it slashes down the lanes itself, one after another: it
                                vanishes, reappears at the end of a lane and streaks through in a
                                tenth of a second, so the whole X lands in about half a second. It
                                goes through scenery, and the boss and its lanes are drawn over the
                                scenery for the whole attack. One hit however many lanes you stand
                                in. Step out of the X between two lanes: the wind-up is long enough
                                that walking between them clears the nearest lane even in phase
                                three.` },
      { n: "Reaper's Wheel", d: `When you are close it plants, and a spectral scythe appears
                                  pointing just past you, with arrows round a 300 / 330 / 350px
                                  circle showing which way it will turn. Then it swings one full
                                  turn. The blade starts past you, so it reaches you last: running
                                  straight out of the circle always works, even from point blank.
                                  Running the way it turns carries you across the blade.` },
    ],
    close: `Its speed is capped below the wizard's own, even at phase three, on purpose: kiting
            has to stay an answer, or the fight stops being about reading it and becomes a
            question about whether blink is up.`,
  },
  Collector: {
    sub: "Wave 30, and every 30th after",
    lead: `The one that tests your build rather than your footwork. It arrives and <b>takes your
           three best cards</b> — highest rarity first, then whichever has done the most damage
           this run — and holds them, circling its head and named under its health bar, until it
           dies. Then every one comes back.`,
    moves: [
      { n: "The theft", d: `On arrival. It takes anything the shop's Transmute could take back
                            exactly, and companions, which it holds rather than kills (the pet
                            simply stops until it is returned). Never Twin Orbs or a Contract, and
                            never a card that something else you own depends on. A stackable card
                            goes with all its stacks.
                            <br><br>
                            You are shown what it took: a <b>THE COLLECTOR TAKES</b> banner deals
                            the three cards face up and chains them, each card circling its head
                            wears a padlock, the health bar names them in their rarity colours,
                            and your <b>[U] upgrade list</b> keeps them, dimmed and chained, marked
                            <em>held by the Collector</em>, until it dies.` },
      { n: "Coin fan", d: `Aimed fans of gold coins — 5, 7 then 9 wide, two or three rounds, each
                           round shifted half a gap. Unlike the Sovereign's patterns these die on
                           trees: cover is a real answer here.` },
      { n: "Snatch", d: `A grab lane locked on you, drawn for 0.7s. Still inside it when it closes
                         and you are hit and yanked across the floor to its feet. Measured from the
                         same point and at the same width the lane is drawn.` },
      { n: "Vault", d: `Three, four then five chests dropped around you — one always on you —
                        each bursting in a drawn circle after about a second.` },
      { n: "Hoard", d: `If you are within 200px when its next attack comes up, a ring of coins
                        outward instead. It does not want you near.` },
      { n: "Blink", d: `It steps away to somewhere at range and clear of scenery, and the next
                        attack follows quickly. It also blinks out if it is stuck against
                        something.` },
      { n: "Summon", d: `Hired help, more each phase.` },
    ],
    close: `It keeps its distance and strafes, like a merchant behind a counter: the Sovereign
            walks at you and the Revenant runs at you, so the third one makes you do the chasing.
            A gold-faced noble in a royal purple cloak, so it cannot be mistaken for either.`,
  },
};

export const BOSS_SHARED = `Which boss arrives is <b>fixed rather than rolled</b>, so a boss wave is
  something you can know in advance, and the first three bosses anyone meets are one of each. All
  three pay the same on death: a large flat heal on the spot, plus one extra card banked for the
  next time the upgrade screen opens — banked rather than granted, because that screen is not
  showing mid-wave. On <b>Nightmare</b> a boss comes every seventh wave instead of every tenth.
  <br><br>
  <b>All three shrug off most knockback</b> — 85% for the Sovereign and the Collector, 88% for the
  Revenant — applied where every push in the game goes through. A boss is also never pulled back
  toward you as a straggler, and no boss counts toward Full Bestiary — they have achievements of
  their own.
  <br><br>
  <b>Every boss is tougher than the last.</b> The Nth boss of a run carries ×1.75<sup>N</sup>
  health and ×1.15<sup>N</sup> damage on top of the ordinary wave ramp — see
  <a href="waves.html#shape">how enemies scale</a>. Their speed stays on a gentler ramp than
  everything else, so the Revenant can always be outrun.`;

/* ── Abilities ──────────────────────────────────────────────────────────── */
export const ABI_MEASURED = {
  nuke:        { kills: "20.0", per: "0.40+", note: "ceiling — it clears the screen" },
  singularity: { kills: "18.9", per: "0.34" },
  storm:       { kills: "15.0", per: "0.33" },
  meteor:      { kills: "14.8", per: "0.33" },
  sentry:      { kills: "12.1", per: "0.30", note: "capped by shot count, not by targets" },
};

export const ABI_NOTE = `<b>The five damaging abilities are measured against each other.</b> An
  ability is a button, not a passive, so the fixture leaves the wizard completely idle — no
  swinging, no moving, orb pinned in hand — fires the ability the moment it is off cooldown, and
  counts <b>kills</b> rather than damage. Kills, because damage clamps at the target's remaining
  health and so cannot see <em>overkill</em>: a Nuke does several times a trash enemy's health.
  <br><br>
  Thunderstorm's bolts splash to a neighbour, so a bolt that lands on something already dying is
  not wasted. <b>The Nuke stays above the band on purpose</b> — it is the only ability that takes
  your weapon away for five seconds to do what it does.
  <br><br>
  <b>Six of the twelve do no damage at all</b> and come back as a row of zeros: the fixture cannot
  see them, which is not a verdict. <b>Overload</b> is in the same position for a different
  reason: it amplifies an orb this fixture never throws. All seven are covered instead by
  behavioural tests that check that pressing the button does its stated thing.
  <br><br>
  <b>Rewind</b> with nothing to rewind to does not spend its cooldown. <b>Cryostasis</b> stops a
  Bomber even once its fuse is lit. <b>Nuke</b>, <b>Meteor</b>, <b>Forcefield</b> and
  <b>Singularity</b> move enemies through the same collision as everything else, so none of them
  throws a body into a tree.`;

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
  { n: "After wave 15",    rate: "×½",     per: "every band above",
    d: "By then a build is strong enough that a steady trickle of hearts would make it unkillable. The recap's healing average restarts here." },
  { n: "Elite kill",       rate: "×2",     per: "capped at 85%",
    d: "A fight you chose to take should pay for itself." },
  { n: "Boss kill",        rate: "2 drops", per: "guaranteed",
    d: "On top of the boss's own large heal." },
  { n: "Nightmare",        rate: "×0.7",   per: "on top of everything",
    d: "Fewer hearts, but the same third-of-max heal between waves as every difficulty." },
];

export const DROP_NOTE = `The drop rate reads your health <b>fraction</b>, so it is a rubber band
  rather than a constant. Shield drops only roll for a build that can actually hold them — without
  Overflow or Kinetic Plating there is nowhere to put the points, and a pickup that does nothing is
  worse than no pickup at all.
  <br><br>
  <b>Healing goes somewhere.</b> <code>Player:heal</code> banks the excess so Overflow can turn it
  into shield instead of letting it evaporate at the cap. Shield absorbs before health, and draws
  as plates over the bar. Mitigation — Stoneskin, Last Stand — runs through a single
  <code>mitigate()</code> funnel, so two sources cannot silently multiply into immunity.
  <br><br>
  <b>Dying stays possible late in a run.</b> Invulnerability after a hit is <b>0.3s</b>, so a
  crowd can land a second hit. Shields are capped at <b>30% of max health</b> and <b>drain after
  8 seconds</b> without being hit. Life Steal heals on kills rather than hits, Overflow converts
  half, Second Wind is 3 seconds, Ward rebuilds in 25, and every difficulty heals a third of your
  max health between waves (Easy 40%). Every heal runs through one function, so a
  <a href="bestiary.html#plaguepriest">Plague Priest</a>'s aura, the Withered curse and Blood
  Price all scale it the same way — and the death recap can count it.`;

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
        enemy, so every status a card applies is guaranteed to run.` },
  { h: "Telegraphs match their hitboxes",
    p: `Ground circles are drawn flattened for perspective, and every one is drawn at the radius
        its damage actually uses, so a boss slam or a meteor never hits outside the circle it
        drew.` },
  { h: "Enemies go round trees by how much room there is",
    p: `Everything rests on one number, <b>clearance</b>: how far a point is from the nearest solid
        box.
        <br><br>
        <b>Routes are planned for each body size.</b> One distance-to-you map per size of body on
        the field, over a 32px grid round you, where a cell is open only if a body that size fits
        there and costs more the tighter it is. So a Brute is never sent at a gap only a Mushroom
        fits through: it goes round. If you are somewhere it cannot reach at all, it waits in open
        ground until you come out, rather than wedging itself in the mouth of the gap and corking
        it for everything behind. A step between two cells only counts if the straight line
        between them has room all the way along, so the front of a queue never backs in and out
        of a gap it cannot take.
        <br><br>
        <b>Steering keeps its distance.</b> Every frame the body scores the headings round the one
        it wants by how well they point and how much room they leave, so it swings wide of a trunk
        early instead of meeting it and sliding.
        <br><br>
        Bodies are tested at their <b>feet</b> against the real obstacle boxes, not at the sprite
        origin (which sits on the creature's head). Knockback and the drag of a Black Hole,
        Singularity or Gravity Snap go through the same collision, so nothing is thrown through a
        tree either.
        <br><br>
        <b>The horde keeps its shape.</b> Bodies ease apart rather than stacking, bigger ones
        shouldering smaller ones aside, so a crowd forms a ring round you instead of a single pile
        an orb could clear in one strike. Anything dashing is exempt, anything frozen or holding
        you stands firm, and whatever a crowd-control card is dragging is left to be piled up.
        Enemies arrive from just outside the camera's view — the real view, which stops at the
        map's edge — and one left far out of sight for a few seconds is brought back to just off
        screen ahead of you. Bosses are never moved. Once the wave has nothing left to send and
        three or fewer remain, arrows at the screen edge point to them.` },
  { h: "An orb that gets stuck lets itself out",
    p: `Two obstacles with a narrow gap between them can hold a thrown orb indefinitely, because
        nothing damps a wall bounce enough to end it. So the orb frees itself: if it has not
        travelled more than a short distance for about a second and a half, it checks whether it is
        in a <em>pocket</em>, and phases out through the scenery if it is.
        <br><br>
        <b>Confinement is what marks a pocket, not speed</b>, since a slow trapped orb comes to rest
        <em>inside</em> the gap. It samples a ring round the orb: a flat wall the orb has rolled up
        against blocks at most half of it and is reachable on foot; a gap or an inside corner blocks
        more. An orb already at rest is nudged toward you as well, since phasing alone does nothing
        for something with no momentum.
        <br><br>
        <b>Recall does not phase.</b> A recalled orb comes home round the scenery, bouncing and
        sliding off it, and if a tree catches it you can step aside, since the pull comes from
        wherever you stand. A pull that cannot arrive gives up after five seconds and the orb flies
        on at the speed the pull gave it. The escape above stands down while the orb is being
        recalled.` },
  { h: "Hits land with weight, not lag",
    p: `Each hit on an enemy freezes the game for a few hundredths of a second. Every freeze adds
        heat that drains over time and scales the next one down: a lone hit, or hits a second or
        more apart, get the full freeze; a rally goes 0.12, 0.06, 0.03, 0.01s and then nothing, and
        the punch comes back after a short breather. Screen shake fades the same way under rapid
        hits. Hitting a tree freezes and shakes nothing.` },
  { h: "Damage numbers",
    p: `Bigger hits climb a colour ladder: white under 20, yellow 20+, orange 50+, red 100+,
        magenta 200+, purple 350+, cyan 500+, blue 700+, gold 1,000+, white-hot with a red glow from
        1,500, and cycling through the rainbow from 2,000. Each step is also drawn a little larger.
        Crits add a "!". Burn ticks, heals and damage you take keep their own fixed colours.` },
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
  There are six rungs and ten tiers: the first five promotions climb the first five rungs, BRUTAL,
  UNREAL and LEGENDARY replay the fifth pitched up to G6, A6 and B6 so the climb keeps rising, and
  GODLIKE keeps the last rung to itself.
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
  applies to all of them.
  <br><br>
  Nearly every sound in the game is <b>synthesised by a Lua script in the repo</b> rather than
  licensed, which is why they sit together tonally — including a voice of its own for every card
  that fires an effect: Void Pulse, Crescendo, Death Nova, Thunderclap, Volatile Core, Rupture,
  Aegis's parry, the Owl's strike and Slingshot's arming click. One bought sound was kept: the orb
  recall.`;

// The combo ladder: tier, the combo it starts at, and its banner.
export const KILL_TIERS = [
  { t: 1,  at: 1,   name: "COMBO" },
  { t: 2,  at: 5,   name: "NICE" },
  { t: 3,  at: 12,  name: "SLICK" },
  { t: 4,  at: 25,  name: "WICKED" },
  { t: 5,  at: 45,  name: "SAVAGE" },
  { t: 6,  at: 75,  name: "RUTHLESS" },
  { t: 7,  at: 120, name: "BRUTAL" },
  { t: 8,  at: 190, name: "UNREAL" },
  { t: 9,  at: 300, name: "LEGENDARY" },
  { t: 10, at: 500, name: "GODLIKE" },
];

/* ── Modifier field labels ─────────────────────────────────────────────── */
export const FIELD_LABEL = {
  healthMult: "enemy health", damageMult: "enemy damage", speedMult: "enemy speed",
  countMult: "wave size", spawnIntervalMult: "spawn interval", maxAliveMult: "concurrent cap",
  scoreMult: "score per kill", essenceMult: "essence per kill", allElite: "every spawn is elite", volatile: "corpses explode",
  splitAll: "everything splits on death", rampMult: "scaling rate",
  healFrac: "between-wave heal", healFlat: "between-wave heal (flat)",
  rerolls: "starting rerolls", banishes: "starting banishes",
};

export const ELITES = `Any ordinary spawn can arrive <b>crowned</b>: more health, more damage,
  a visible crown and a wider health bar, and a much better drop. They are a fight you can choose
  to take or leave, and the reward is scaled so that taking one is usually correct but never
  free. Bosses are never elite — they are already the exception to the health multipliers.
  <br><br>
  <b>The health bonus is not one number.</b> Base health across the roster spans twelve-fold, so
  a flat multiplier would charge every type the same percentage and a wildly different
  <em>absolute</em> price: an elite Brute would take most of a boss fight to kill. So the bonus
  falls off with the type's <b>base</b> health on a square root: quadruple the base and the bonus
  halves, with a floor so a tank is still meaningfully tankier. It is read off the row rather
  than off the scaled figure, so the shape is identical on every wave and elites do not weaken as
  a run goes on. Anything at or below the reference keeps the full multiplier, so elite trash
  gets the whole bonus.`;

/* ── Builds & shop ─────────────────────────────────────────────────────────
   The numbers on that page come from data.json (families, curses,
   consts.family, consts.shop); this is only what they mean. */
export const BUILDS_NOTE = `You take one card a wave, and <a href="families.html"><b>families</b></a> are what turn those picks
  into a build: every card belongs to exactly one, and every card you own in a family makes that
  family's other cards likelier to be dealt. An early lean compounds into an identity instead of
  being washed out by the shuffler — but nothing is ever locked out, so an off-family card is
  still a real decision.`;

export const BUILD_NAME_NOTE = `The game-over screen names your build from its two leading
  families: the top family's adjective and the runner-up's noun, so three Frost cards and two
  Kinetic ones is a <i>Frost Juggernaut</i>. A single family is an <i>Adept</i>; no cards at all is
  an <i>Empty Hand</i>. A tie goes to the family listed first below. Each build name keeps its
  own furthest wave, best score and number of runs, so "my best Blazing Pyromancer" is a record
  you can chase.`;

export const CURSE_NOTE = `<b>A legendary from the Essence Shop comes with a curse</b> — out of a
  Family Pack or from Transmute. A legendary in an ordinary wave's hand is clean. The curse is
  rolled when the card is dealt and printed on its face in red, so buying one is a trade you can
  read before you make it.
  The curse lasts the rest of the run, and two of the same kind compound. Each is a multiplier on
  something the game already reads — sized to sting, never to make a legendary not worth taking.`;

export const START_NOTE = `The last step before a run is a circle of the twelve families, like the one below. The
  run starts with one card from the family you pick — one of its weakest: the lowest rarity it has
  among the cards a fresh run can be dealt, so nothing that needs another card, a companion or an
  ability first. Where several share that rarity, one of them is picked at random.`;

export const SHOP_NOTE = `After every fifth wave the free card is replaced by the <b>Essence
  Shop</b>. Essence comes from every death, whoever or whatever landed it: pets, burns and a
  bomber's own blast all pay, and how much depends on how strong the enemy was. Unspent essence
  carries over, so saving through one shop for a legendary at the next is a real plan. Extra
  cards the wave owes you — Tithe, a boss kill's bonus — are still dealt as ordinary hands once
  you leave.`;

export const FAMILY_SHOP_NOTE = `Beside the ability, the shop shows a row for each of your <b>two
  most prominent families</b> — the two you own the most cards in (a fresh run with fewer than two
  is shown a random one). Each panel is sold under its family's icon, the same icon every card of
  that family carries in its header, and holds two things: a boost (or, now and then, the
  Recombobulator in its place) and a pack.`;

// The epic and legendary essence cards: what the damage ones are measured in.
export const ESSENCE_POWER_NOTE = (c) => `Above rare, essence becomes power, and none of these cards
  counts raw essence — a late run holds thousands, and anything paid per essence would run away with
  it. <b>Dragon's Hoard</b> weighs what you hold against shop prices, in <b>price units</b> (an
  ability costs 2.6 of them): +${Math.round((c.HOARD_MAX || 0) * 100)}% × (1 − e<sup>−units/${c.HOARD_K}</sup>),
  so holding four units is +25% and forty is the full +${Math.round((c.HOARD_MAX || 0) * 100)}%, at wave 5 or
  wave 50 alike. <b>Spendthrift</b> is the opposite build — +${Math.round((c.SPEND_PER || 0) * 100)}% a
  purchase, up to +${Math.round((c.SPEND_CAP || 0) * 100)}% — and the two cannot be held together.
  <b>Essence Nova</b> bursts every ${c.NOVA_KILLS} kills' worth of essence you collect (at that
  wave's average payout), for ${c.NOVA_DAMAGE} damage (wave-scaled) within ${c.NOVA_RADIUS / 50} m; an arc
  round the counter shows the charge. The damage bonus shows under the counter while you hold
  either damage card.`;

export const RECOMB_NOTE = `every card you own in one family is given up, one copy at a time, and
  replaced by a random card of the <b>same rarity</b> from one other random family (the nearest
  rarity it has, if it has none left at that one). The boosts you bought for the old family move to
  the new one, first to first, second to second. A card nothing can take back — Twin Orbs, a Contract, or one something else depends
  on — stays. A legendary swapped in comes without a new curse: the one the old legendary brought
  stays with you. What it gave is shown before you go back to the shelf.`;

export const TRANSMUTE_NOTE = `<b>Transmute</b> sacrifices <b>random</b> cards you own of one
  rarity for a choice of one card a rarity higher. Random on purpose: the cost is not knowing which
  ones go — and it takes two clicks, so it is never an accident. It never takes Twin Orbs or a
  Contract, or a card something else you own depends on (Freezing Shot while you hold Shatter); a
  stack goes one copy at a time. The same undo is what lets The Collector hold your cards and give
  them back.`;

/* ── Glossary ──────────────────────────────────────────────────────────── */
export const GLOSSARY = [
  { t: "Direct hit", d: "The orb striking an enemy body, as opposed to an explosion, arc or aura. Most on-hit cards read direct hits only." },
  { t: "Recall", d: "Holding right click to drag the orb back. A returning orb does full damage." },
  { t: "Combo", d: "Consecutive hits inside a time window. Drops to zero if the window lapses (to half, once a streak, with Combo's third trait); several cards scale off it." },
  { t: "Elite", d: "A crowned ordinary enemy with boosted stats and a far better drop." },
  { t: "Modifier", d: "A named rule change applied to a single wave, announced by a banner." },
  { t: "Special wave", d: "A wave built from a hand-picked roster instead of the usual weighted table." },
  { t: "Starting family", d: "Picked on the circle before a run. The run starts with one of that family's weakest cards." },
  { t: "Utility", d: "The F-key ability. Sold only in the Essence Shop, one a visit; you hold one at a time." },
  { t: "Stack cap", d: "How many times a repeatable card can be taken. At the cap it stops being offered." },
  { t: "Banish", d: "Removing a card from the pool for the rest of the run, rather than rerolling the screen." },
  { t: "Cover", d: "A tree between you and a ranged enemy. Its shots die on the first tree they cross (rocks and stumps they fly over), and it will not fire without a clear line." },
  { t: "Family", d: "One of twelve groups every card belongs to. Owning a family's cards makes its other cards likelier, and your two leading families name the build." },
  { t: "Trait", d: "A family's tiers, I, II and III, switched on by owning 3, 5 and 7 different cards of it (2, 4 and 6 for Kinetic; 3, 4 and 7 for Frost and Void). Never bought or picked; a card given up takes its tier with it. Shown in a column on the right of the screen." },
  { t: "Curse", d: "The downside a legendary bought in the Essence Shop comes with, printed on the card. It lasts the rest of the run." },
  { t: "Essence", d: "The Essence Shop's currency, shown top-right with a purple orb: one a kill, five an elite, twenty-five a boss. Carried over between shops." },
  { t: "Transmute", d: "Sacrificing random cards you own of one rarity, in the Essence Shop, for a choice of one card a rarity higher." },
];
