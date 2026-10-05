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
  { file: "builds.html",       label: "Builds & shop", icon: "✧" },
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
    note: "Only bound once you have bought one — abilities are sold only in the Essence Shop, one on every visit." },
  { key: "U",         act: "My Upgrades",
    note: "Lists every card you hold, coloured by rarity. Escape (or U again) closes it; it was on I until 24 September." },
  { key: "Escape",    act: "Pause",
    note: "Opens settings without leaving the run. Everything freezes and goes silent: sound effects are held and the music stops (it used to only get quieter). The music also stops whenever the game window is in the background, and comes back when you return — unless the game is still paused." },
  { key: "F11",       act: "Fullscreen" },
  { key: "F3",        act: "Developer overlay",
    note: "Spawns anything, grants any card or ability, forces a wave modifier, class or special wave." },
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
    p: `Clear the field and the upgrade screen deals three cards, and you take <b>one</b> (two a
        wave until 29 September, which by wave 20 meant owning nearly every good card — a pile,
        not a build). Utility abilities are not dealt here: they are sold only in the Essence
        Shop. Rerolls and banishes accumulate on a timer rather than being spent currency,
        so a bad screen late in a run is a smaller disaster than a bad screen early.`,
  },
  {
    h: "A build, not a pile",
    p: `Every card belongs to one of twelve <a href="builds.html">families</a>, and every card you
        own in a family makes that family's other cards likelier to turn up — so an early lean
        compounds into an identity. Hold <b>3, 5 and 7</b> different cards of one family and its three
        <a href="builds.html#traits">traits</a> switch on, tracked in a column on the right of the
        screen; a card that would complete one says so above it. Each class has a few cards only
        it is ever offered. A
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
        stumps are knee-high, and shots fly over them (since 25 September; before that anything
        solid stopped a shot).
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
        <b>Backlash</b>, a 0.4s telegraphed blast and a hard shove — so standing on top of a
        caster is no longer the free answer it once was. Between casts it holds a band inside
        its own range, giving ground if you press it and circling if you do not, so it never
        walks itself into Backlash range: you have to go in after it.`,
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
        calling fresh bodies out of the ground. The Plague Priest (29 September) has no cast at
        all: its ring is a standing aura that halves your healing while you are inside it, and it
        keeps close enough to hold you there. Each wears a role badge above the health bar,
        because at range the silhouette is identical.`,
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
  Wisp:       "A Bat that keeps up with you, and outranges it. It glows because the bat sprite is near-black, and a hue rotation preserves luma — recolouring alone was invisible on it.",
  Hivemind:   "A Bat that fires three bolts in a narrow fan. Individually weak, but it punishes the straight-line retreat that answers every other ranged enemy.",
  Bomber:     "The clock in a wave. It forces you to deal with it now rather than later, which is the only thing on the field that does.",
  Vampire:    "The first enemy that takes your movement away, and heals off you for doing it.",
  Nosferatu:  "More than twice a Vampire's health and faster. It roots for the same time, so the danger is purely how long it survives to keep doing it.",
  EvilWizard: "Casts from range and has no melee swing, but it is not safe to stand on any more — Backlash punishes anything inside 100px, including a player who walked into a cast.",
  Archmage:   "The late-game priority target. Longer range, far more health, every cast another root somewhere on the map, and the hardest Backlash in the game.",
  Frog:       "The first enemy you beat by reading it rather than out-damaging it. Low health, so the lane is the whole threat — and the time it spends winded afterwards is the damage window the fight pays you back with.",
  Sporeling:  "Health that becomes two Toadstools, which are faster than the thing that made them. Kill it with room around you, or inside an explosion big enough to catch what comes out.",
  Bulwark:    "The card check. An orb that only goes forwards bounces off it all day; anything that flanks, pierces, arcs or simply arrives fast walks through. Its health is a long time to spend doing the wrong thing.",
  Witchdoctor:"Heals the most wounded allies around it often enough to outpace chip damage across a crowd. Capped at two alive at once, because three means nothing dies.",
  Bonecaller: "Calls fresh bodies out of the ground on a timer, and what it calls OUTLIVES it — so killing it late buys you nothing. Violet and badged so it is not mistaken for the healer at range; an earlier olive hue made the two indistinguishable. It unlocked at wave 14 with one point of weight for its first few versions, which meant most players never met it at all.",
  Slug:"Barely fights, but everything it does POISONS you: its bite, the ball it lobs from range (it lands where you stood and leaves a pool), and the small pool of rot it leaves every 35px it walks. Poison is a tick a second for three seconds, each a fifth of its damage, and a new dose refreshes it rather than stacking; your health bar turns green and a POISONED plate counts it down. The pools stay after it dies — kite in a circle around one for long enough and you have walled off your own escape route. The first enemy that makes WHERE the fight happens matter.",
  Siphon:     "Hangs at range and drains you through a beam, healing off what it takes. The beam needs line of sight, so a tree is a real answer to it — the first time scenery has been anything but an obstacle.",
  Broodmother:"The Bonecaller inverted. She calls faster, and every Toadstool she makes is tethered to her: kill the mother and the whole swarm drops at once. The swarm is a decoy, and walking past it is the correct play.",
  PlaguePriest: "Halves your healing while you stand in its ring, and keeps close enough to hold you in it — walking away does not work for long, so the answer is to kill it. Frozen or stunned, the aura switches off. Healing had become the answer to everything, and nothing on the roster argued with it; the HUD says HEALING HALVED beside your health bar while it does.",
  DreadSovereign: "A siege engine. It walks, and the fight is read from a distance.",
  PaleRevenant:   "The opposite fight: it runs, and you have to be moving already.",
  Collector:      "The third fight, and a test of the build rather than the footwork: it takes your three best cards for as long as it lives.",
};

/* Facts about a type that live in its AI file rather than its data row, and so
   would otherwise be invisible. Only where there is something to say. */
export const ENEMY_EXTRA = {
  Frog:         "Was the skeletal Ravager until 2 October, when it became a frog. Its row's <code>attackRange</code> is dead data — FrogEnemy replaces the melee update entirely and uses its own trigger range, so the row value looks authoritative and governs nothing.",
  PaleRevenant: "No projectile at all — even the Phantom Cross is aimed at your feet, not fired. It goes straight through trees and rocks, so scenery is no cover from it. Its speed is capped below the wizard's own, on purpose, even at phase three.",
  Bomber:       "Shares the skeleton sheet with the Revenant (and with the Ravager, before it became the Frog), which is why they read as bone rather than flesh.",
  Siphon:       "Its row carries <code>damage = 0</code> and <code>attackRange = 0</code>: it has no attack at all. Everything it does is the beam, and the beam is refused the moment the grid says it cannot see you — frozen or stunned, it drops as well. Its self-heal never actually fired until 23 September: the drain waited for a result that a landed hit never returns, so a Siphon left alone was not getting any harder to kill.",
  Slug:  "Drops are keyed to DISTANCE WALKED (every 35px since 25 September, with 40px pools; before that 70px and 58px, and originally 130px and 86px on a body a third slower), not to a timer. The player halved it on 30 September: speed 46 to 26 and health 210 to 105, so it now lays its line slowly and dies quickly. The pool a THROWN ball leaves is the big one, 90px. One parked against a wall would otherwise stack a dozen pools on one spot, when the whole point is that it draws a line you have to route around.",
  Broodmother:  "Shares SupportEnemy with the Witchdoctor and the Bonecaller; <code>summon_bound</code> in her row is the single flag that makes her brood die with her. Her summons are killed rather than deleted, so each one still scores, drops loot and triggers every on-kill upgrade you own.",
  PlaguePriest: "The fourth SupportEnemy, told apart by <code>plague_range</code> in its row, and it carries <code>keep_min</code>/<code>keep_max</code> of its own so it stands inside its ring rather than at a healer's distance. It never attacks. The skeleton sheet is achromatic, so it is TINTED a bile yellow-green, clear of the Revenant's mint (and of the orange the Ravager wore before it became the Frog).",
  Collector:    "On the vampire sheet, TINTED gold: the cloak is too dark for a hue rotation to reach gold (a rotation keeps luminance, and the rendered sweep only ever found brown), while a multiply turns the face and hands gold and leaves the cloak a royal purple.",
};

/* ── Cards: facts that live in code rather than on the card ────────────────
   Keyed by card key. Only where the card text leaves out something a player
   would want to know, or where the card used to do something else. */
export const CARD_NOTE = {
  TwinOrbs:    "The second orb matches the first's size, Heavy Orb included, and drops Overload when it ends. Until 23 September it collided at its old size and kept Overload's boost forever.",
  Thunderclap: "Needs a real bounce: a wall touched slower than the orb's damage speed does nothing, as with Carom and Fracture. Until 23 September any touch set it off. Since 27 September it no longer shakes the screen or freezes the game: it fires on every fast wall bounce, which on a wooded map is constantly, and was the only thing that made hitting a tree jolt the camera.",
  VampireOrb:  "The card said +2 extra HP per stack until 23 September. The code has always given +1, so the text was corrected rather than the number.",
  BlackHoleCore: "Stackable since 24 September: 3 m at one card, 4.1 m at two, 5.2 m at three. It used to be a single card with a flat 4.8 m well. The pull and the grind are as strong at the centre at every size and fade to nothing at the rim, so a wider well also pulls harder at any given distance, not just further.",
  OwlCompanion:  "Its numbers above are read from the game. Rebuilt on 25 September to stand level with Black Hole: it had been a rare's worth of damage with a legendary's name, so it now strikes every second, each bolt leaps on through more enemies (never the same one twice), and its damage rides the enemy health curve rather than fading as the run goes on. Owl Swiftness became 25% more strikes a stack rather than a flat −0.6s. Measured against the damage benchmark on 25 September, the owl went from +46% to about +195%; Black Hole measures +170%. New art on 30 September. Made an EPIC on 3 October, when it still measured +129% (more than the Angel and the Demon): from 48 every second leaping through three to the numbers above, about +43% after, level with Aftershock; Owl Talons went from +16 to +11 to match.",
  DemonCompanion: "Its numbers above are read from the game. Rebuilt on 25 September to stand level with Black Hole: its damage rides the enemy health curve, every swipe rakes the enemies around its target as well, and the curse multiplies every source, including the orb (×1.6 for 5s before that day); Curse Potency tops out at ×2.15. It always goes for the nearest enemy that is NOT cursed yet, changing target the moment its swipe marks one; only when everything in reach is cursed does it renew the curse closest to running out. Benchmark on 25 September: from +81% to about +110–300% depending on how tightly packed the crowd is (Black Hole +42–170%). Since 3 October it walks round trees instead of through them.",
  OrbitMode:     "Until 24 September the ring could vanish for no visible reason. The shards orbit you but were drawn as part of the main orb, so flinging the orb more than a screen away culled them with it, and a Nuke hiding the orb hid them too. Each shard now draws on its own. Until 26 September every shard hit for a flat 8 all run, whatever you built. A hit now carries the orb's standing bonuses — Berserker, Blood Pact, Momentum, Adrenaline, Rampage, Last Stand — can crit through Critical Mass, and grows with the square root of the enemy health curve (about ×1.9 by wave 20). Per-throw bonuses like Charged Shot and Comet do not apply: the ring is not a throw.",
  Quickening:    "Nerfed on 28 September and made an epic: +9 move speed a stack, so ten stacks is +90 (+45%); it was +14 (+70%). A hit now costs 4 stacks (was 3). The chevrons at your feet point one way, as a fast-forward row; until 24 September they flipped whenever you turned.",
  Seeker:        "An epic to find, a rare to stack: once you own one, further copies are drawn at rare odds and in a rare frame. Nerfed on 28 September: a redirect relaunches the orb at no less than 8 m/s (was 10.4, most of a fresh throw, so a chain never lost pace) and looks 9.2 m for its next target (was 12.4, nearly anywhere on screen). The five-redirect cap is unchanged.",
  Backhand:      "Since 26 September a swing that meets the orb while it is still flying at you (faster than 1.2 m/s) counts too, judged per orb, so you can rally it: slap it back, it returns, slap it again. An orb already heading away does not count, so swinging twice cannot bank a second bonus. Before, only the second after a catch counted, and a catch stops the orb dead — so it only ever worked on a standing ball.",
  MagneticGrip:  "Pulls the orb home until it is within 0.8 m of you (inside swing reach), then brakes it to rest there. Until 25 September it never stopped pulling: the orb reached you, was caught, was nudged into you again and caught again, every frame — a loud buzz of catch sounds, and a Dead Stop blast each time if you held that card.",
  ReserveCharge: "Added 25 September. Your F ability holds two charges, and the cooldown refills one at a time whenever you are below two, so while one charge sits ready the other is already coming back. Spending the spare mid-refill does not restart the clock. Only offered once an ability is in the slot, and a newly swapped-in ability arrives with both charges. The ability bar shows the count after its name. A legendary until 29 September: one extra cast banked does not raise how often you can cast, so it is an epic now.",
  SecondWind:    "It puts you back on 30 HP (since 25 September; it used to leave you at 1) and makes you invulnerable for 3 seconds (since 29 September; 5 seconds from the 25th, and 1.6s of ordinary iframes before that): no damage and no roots, shown as a golden shell that flickers in its last second. The window is its own timer, so the Evil Wizard's hand, which wipes your ordinary iframes when it grabs you, cannot cut it short.",
  LifeSteal:     "Since 29 September it heals on the KILL — 2 HP for every enemy the orb kills — rather than on every hit. On a crowd it used to heal more than anything could hurt you, and a run with it was very hard to lose.",
  Overflow:      "Since 29 September only half of any overheal becomes shield (it was all of it). Shields are also capped at 30% of your max health and drain once you go 8 seconds without being hit (3 until the player's retune) — see Staying alive on How to play.",
  Ward:          "Rebuilds 25 seconds after it breaks since 29 September (it was 14).",
  IronSkin:      "+0.06s of invulnerability a stack since 29 September, when the base window halved from 0.6s to 0.3s — three stacks of the old +0.12s would have more than doubled it.",
  SafeHands:     "0.6s of invulnerability since 29 September, to sit above the halved 0.3s base.",
  GoatCompanion: "Its numbers above are read from the game. It was a spirit Wolf that hurled enemies into your orb's path until the player asked for something that kept them off instead: it rams whatever comes near you — always whatever is closest to you, switching mid-charge if something else gets nearer — and shoves the target and everything beside it hard, straight away from you. Between rams it never stands still, ambling from spot to spot around you and trotting to catch up if you outrun it. The player retuned it on 1–2 October to ram less often for less, with a smaller splash and a much slower charge; on 29 September it rammed for 44 every 1.2s, splashed 1.8 m for 70% and charged at 12.4 m/s. The daze is Concussion's alone, and the shove plays under a daze rather than after it. The benchmark figures from 29 September (+124% damage, +175% time survived) predate the retune: measured again on 3 October it added +7% damage and no survival at all, below a typical rare, so it was made a RARE without cutting its numbers further. Since the same day it walks round trees instead of through them, like the Demon.",
  AngelCompanion: "Its numbers above are read from the game. Hovers over your right shoulder whichever way you face; it used to sit behind you and swap sides every time you turned. Its lance hit for 26 until the new art on 1 October. Until 29 September its judgement was the Demon's curse in gold (judged enemies took 60% more damage), and the player asked for the Angel to have something of its own. Judgement now HUMBLES — a judged enemy hits you softer, its shots included — and SMITES: when a judged enemy dies, a pillar of light hits everything around it and judges them too, so a kill in a judged crowd carries on through it. Measured on 29 September, before the lance came down: +158% damage against an immortal crowd (lance only — nothing dies there to smite), +160% against one that dies, +216% time survived. The Demon is the damage pick of the pair and the Angel the one that keeps you alive.",
  AngelPotency:  "Grows the smite since 29 September. It used to add +10% to the damage judged enemies took, back when judgement was a multiplier.",
  GoatDamage:    "One of the three cards the Goat gained on 29 September, when it was brought up to the other companions. +9 is a wave-1 figure and rides the wave like the ram itself.",
  GoatFrequency: "x0.8 on the time between rams a stack, down to a 0.4s floor.",
  GoatDaze:      "Since 29 September the goat's ONLY daze — it had 0.6s of its own until the player found it too strong early. Everything a ram reaches is dazed, the target and the splash, 0.5s a stack up to 1.5s; bosses stay capped at 0.2s.",
  Boomerang:     "Every throw comes back by itself, so recalling by hand costs 30 seconds of cooldown (it switched the button off entirely until 3 October). Until the player's report on 29 September a right-click while the orb was flying home cancelled the return, and a return blocked by scenery for five seconds gave up — either way the orb lay stranded until you walked over and hit it. The return can no longer be cancelled, and a throw that has not come home sets off again by itself. The return IS a recall — Static Charge lets go when it starts, Tether and Gravity Snap work on the way, Volatile Core goes off on its first hit — and since the second list of 29 September it no longer spends the recall cooldown.",
  RaiseDead:     "A risen enemy with nothing to fight within 6.4 m walks back to you rather than standing where it rose.",
  WreckingBall:  "The slow was 40% when the card arrived, which made the orb feel stuck in mud, and the recall ignored it altogether: the heavy orb came home at full speed. It is now 20%, on the throw and the recall alike (a recall tops out at 6.1 m/s instead of 7.6).",
  Shatter:       "Triple damage until 29 September; +30% since. A freeze is not the rare state it sounds: Freezing Shot re-freezes on every second hit, so a body you keep hitting stays frozen, and Shatter measured +191% on a pinned target where Kindling, the Fire equivalent, adds about +21%.",
  Momentum:      "It always stopped at 40 combo (+120%) but never said so; the player read it as uncapped. Since 29 September it stops at 20 (+60%) and the card says so — an epic's ceiling, not a legendary's.",
  Bowling:       "Wall Crush was folded into it on 29 September (the player: only enemy-against-scenery differed) and it became an epic. What a thrown body strikes takes the full hit (it was half), and the thrown body hurts itself once: the hit again off scenery, the hit and half again off another enemy.",
  DeathNova:     "18 is a wave-1 figure: since 29 September it grows with the waves like enemy health, as the companions and abilities do. A flat 18 was a fifth as much at wave 20.",
  VolatileCore:  "20 is a wave-1 figure, grown with the waves since 29 September. Since 3 October it goes off on the first enemy the returning orb hits, once a recall; it used to go off when the orb landed in your hand, and a recall that hits nothing now does nothing. A Boomerang return sets it off too.",
  StaticCharge:  "Since 3 October a recall spends only the charges it actually fires — one per enemy within 6.4 m of the orb — and keeps the rest; it used to empty the bank even with nothing in reach.",
  ChainLightning: "Stackable since 4 October: Lightning Rod (+2 jumps, +3 m) and Arc Damage (+5 a jump) were folded into it, so each copy after the first is one jump, 1.5 m and 5 damage more.",
  Backhand:      "Kinetic until 4 October; a Combo card since (it is about timing).",
  Fracture:      "Kinetic until 4 October; an Arcane card since (shards are Arcane's).",
  SplitShot:     "Kinetic until 4 October; an Arcane card since (copies are Arcane's).",
  WizardSpeed:   "Kinetic until 4 October; a Wild card since (walk speed is not the orb).",
  EssenceNova:   "Arcane until 4 October; a Wild card since (it is about essence).",
  Kindling:      "Needed Ignition until 4 October, when every Fire card started igniting.",
  Cremation:     "Needed Ignition until 4 October, when every Fire card started igniting.",
  Permafrost:    "The name came back on 4 October as a different card. The Permafrost removed on 30 September made frozen deaths shatter into shards.",
  CursedGlass:   "8 a shard is a wave-1 figure, grown with the waves since 29 September.",
  RiftStep:      "25 is a wave-1 figure, grown with the waves since 29 September.",
  Executioner:   "Since 3 October it is judged on what a direct hit LEAVES: a hit that would drop an enemy under 10% of its max health kills it instead, after curses and every other multiplier. It used to need the enemy under 15% before the hit, which made it a finisher for enemies already nearly dead rather than a threshold your hits cross.",
  Rupture:       "30 is a wave-1 figure, grown with the waves since 29 September.",
  Thornmail:     "22 is a wave-1 figure, grown with the waves since 29 September.",
  EventHorizon:  "A legendary until 29 September. It adds to Black Hole what Aegis already does at rare, so it is an epic now.",
  Resonance:     "A legendary until 29 September, when it became an epic: it needs Twin Orbs, another legendary, before it can do anything.",
  Deadeye:       "Kinetic until 29 September; it is a Precision card now.",
  PhaseShot:     "Cannot be held with Juggernaut since 29 September: Juggernaut already lets every enemy through, so Phase Shot did nothing beside it.",
  ColdSnap:      "Offered only once you own something that chills or freezes (Freezing Shot, Frozen Court, Hoarfrost, Absolute Zero, Temporal Rift or Tether). Until 29 September it had no prerequisite and could be taken to no effect.",
  Tether:        "Nerfed on 28 September and made an epic (it was an uncommon): 24 damage every 0.36s to everything on the cord, 67 a second (it was 34 every 0.28s, 121 a second, several times the orb's own rate across a whole crowd), and the slow is ×0.70 for 0.8s (was ×0.55 for 1.2s). Until 25 September the cord went invisible once the orb was more than a screen away, while still cutting everything it crossed; it now draws on its own.",
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
                       own trigger range you can clear the circle on foot, without blink. The
                       wind-up is 0.9s since 27 September (was 1.15s); 0.8s was tried and failed
                       that rule, so 0.9 is as fast as it goes.` },
      { n: "Bolt ring", d: `A full ring of oversized bolts, one aimed at you — 8, 11 then 15 as
                            phases fall. Big enough to walk between: a movement puzzle, not a
                            damage check. Since 24 September the bolts fly at 495px/s (was 360),
                            fast enough that a ring has to be read rather than strolled through.` },
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
            phase starts its rotation from the top. Until 24 September it had a single ranged
            attack and a summon, and from range the whole fight was one ring and a wait.`,
  },
  PaleRevenant: {
    sub: "Wave 20, and every 30th after",
    lead: `The opposite fight, and the reason there are two. Nearly three times the Sovereign's
           speed, not one projectile, and every move a commitment you beat by moving rather than
           by standing somewhere clever.`,
    moves: [
      { n: "Dash combo", d: `Three, four, then five dashes in a row as phases fall, each with its
                             own short wind-up and a gap between. The direction locks at the
                             wind-up, so a combo is a sequence of dodges rather than one. Since
                             24 September every dash runs its full length straight through trees
                             and rocks (it used to stop dead on them and get stuck), and the lane
                             is drawn full length to match.` },
      { n: "Leap", d: `Goes airborne and comes down in a wide circle. The hitbox stays on the
                       ground for the whole flight — only the sprite is lifted — so what you see
                       and what hurts never disagree.` },
      { n: "Forced leap", d: `After two dash combos it must leap. Without that it would simply
                              never do it at close range, which is exactly what the first build
                              did until a state-coverage assertion caught it.` },
      { n: "Phantom Cross", d: `Added 24 September; every third attack. It plants and marks two,
                                three, then four lanes that all cross at your feet, a thousand
                                pixels long. After the wind-up it slashes down the lanes itself,
                                one after another: it vanishes, reappears at the end of a lane and
                                streaks through in a tenth of a second, so the whole X lands in
                                about half a second. It goes through scenery. One hit however many
                                lanes you stand in. Step out of the X between two lanes: the
                                wind-up is long enough that walking between them clears the nearest
                                lane even in phase three. Since 28 September the lanes are drawn as
                                one shape with a thick border (they used to be separate strips whose
                                edges and ends overlapped), and the boss and its lanes are drawn over
                                the scenery for the whole attack — it always cut through trees, but
                                trees in front of it used to cover the lanes and hide it.` },
      { n: "Reaper's Wheel", d: `Added 24 September. When you are close it plants, and a
                                  spectral scythe appears pointing just past you, with arrows round
                                  a 300 / 330 / 350px circle showing which way it will turn. Then
                                  it swings one full turn. The blade starts past you, so it
                                  reaches you last: running straight out of the circle always
                                  works, even from point blank. Running the way it turns carries
                                  you across the blade.` },
    ],
    close: `Its speed is capped below the wizard's own, even at phase three, on purpose: kiting
            has to stay an answer, or the fight stops being about reading it and becomes a
            question about whether blink is up.`,
  },
  Collector: {
    sub: "Wave 30, and every 30th after",
    lead: `Added 29 September, and the one that tests your build rather than your footwork. It
           arrives and <b>takes your three best cards</b> — highest rarity first, then whichever
           has done the most damage this run — and holds them, circling its head and named under
           its health bar, until it dies. Then every one comes back.`,
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

export const BOSS_SHARED = `Which boss arrives is <b>fixed rather than rolled</b>. A coin flip
  would take away the one thing about a boss wave worth knowing in advance, and fixing the order
  also guarantees that the first three bosses anyone meets are one of each. All three pay the
  same on death: a large flat heal on the spot, plus one extra card banked for the next time the
  upgrade screen opens — banked rather than granted, because that screen is not showing mid-wave.
  On <b>Nightmare</b> a boss comes every seventh wave instead of every tenth.
  <br><br>
  <b>All three shrug off most knockback</b> — 85% for the Sovereign and the Collector, 88% for the
  Revenant. Until 23 September they only claimed to: the resistance was applied inside the boss's
  own damage handler, before the orb wrote its shove, so it never took effect, and every other push
  in the game bypassed it entirely. It now sits where every push goes through. A boss is also never
  pulled back toward you as a straggler, and no boss counts toward Full Bestiary — they have
  achievements of their own.
  <br><br>
  <b>Every boss is tougher than the last.</b> Since 27 September the Nth boss of a run carries
  ×1.75<sup>N</sup> health and ×1.15<sup>N</sup> damage on top of the ordinary wave ramp — see
  <a href="waves.html#shape">how enemies scale</a>. A wave-40 Sovereign (its second visit, since
  the rotation is three long) is far past the 10,500 health a wave-30 one had before the change.
  Their speed deliberately stays on a gentler ramp than everything else, so the Revenant can
  always be outrun.`;

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
  the button does its stated thing at all.
  <br><br>
  <b>Fixed on 23 September.</b> Firing <b>Nuke</b> and then taking a different ability before the
  orb had reformed left it invisible and unable to deal damage for the rest of the run: the
  five-second hide only counted down inside the Nuke's own update, which stops running once the
  slot holds something else. It was a likely thing to do, too — a Nuke often ends the wave, and
  every third upgrade screen offers an ability. <b>Rewind</b> with nothing to rewind to no longer
  spends its cooldown. <b>Cryostasis</b>'s “cannot detonate” is now true of a Bomber whose fuse
  was already lit. And <b>Nuke</b>, <b>Meteor</b>, <b>Forcefield</b> and <b>Singularity</b> move
  enemies through the same collision as everything else, so none of them throws a body into a
  tree any more.`;

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
    d: "Since 29 September. By then a build is strong enough that a steady trickle of hearts made it unkillable. The recap's healing average restarts here." },
  { n: "Elite kill",       rate: "×2",     per: "capped at 85%",
    d: "A fight you chose to take should pay for itself — ×5 until 29 September, which was nearly a heart per crown." },
  { n: "Boss kill",        rate: "2 drops", per: "guaranteed",
    d: "Four until 29 September." },
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
  <b>The 29 September survivability pass</b> made dying possible again. Invulnerability after a
  hit is <b>0.3s</b> (was 0.6s), so a crowd can land a second hit. Shields are capped at
  <b>30% of max health</b> and <b>drain after 8 seconds</b> without being hit. Life Steal heals on
  kills rather than hits, Overflow converts half, Second Wind is 3 seconds, Ward rebuilds in 25,
  and every difficulty heals a third of your max health between waves (Easy 40%). Every heal now runs through one function, so a
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
        enemy. A status applied by a card that is never ticked there is a dead upgrade — which has
        happened, and is why they all live together.` },
  { h: "Telegraphs match their hitboxes",
    p: `Ground circles are drawn flattened for perspective, but damage is tested in plain
        Euclidean distance. For a long time the two disagreed, so a boss slam and a meteor both
        hit outside the circle they had drawn. Every ground telegraph now announces the radius it
        actually uses.` },
  { h: "Enemies go round trees by how much room there is",
    p: `Everything rests on one number, <b>clearance</b>: how far a point is from the nearest solid
        box. The navigation this replaced only ever asked yes or no — does the body fit here? — and
        a body that fits by one pixel slides along the trunk it is touching, with its sprite drawn
        half inside the tree. Players saw exactly that: enemies sliding on trees, walking into
        them, and stuck between one obstacle and the next.
        <br><br>
        <b>Routes are planned for each body size.</b> One distance-to-you map per size of body on
        the field, over a 32px grid round you, where a cell is open only if a body that size fits
        there and costs more the tighter it is. So a Brute is never sent at a gap only a Mushroom
        fits through: it goes round. If you are somewhere it cannot reach at all, it waits in open
        ground until you come out, rather than wedging itself in the mouth of the gap and corking
        it for everything behind. And a step between two cells only counts if the straight line
        between them has room all the way along — a route that promised a step steering would not
        take left the front body backing in and out of the gap while the queue behind it stood
        still, which was two thirds of all the jams in a dense forest.
        <br><br>
        <b>Steering keeps its distance.</b> Every frame the body scores the headings round the one
        it wants by how well they point and how much room they leave, so it swings wide of a trunk
        early instead of meeting it and sliding.
        <br><br>
        Measured on the navigation harness, eight seeds, a ring of enemies round a still wizard:
        enemy-frames touching scenery fell from 2.29% to 0.02%, frames within 12px of it — where a
        sprite visibly sinks into a tree — from 7.29% to 0.72%, time spent going nowhere from 0.63%
        to zero, and every enemy arrived. In a forest three times denser than any real map,
        touching fell from 13.7% to 0.05% and going nowhere from 29.7% to 0.6%; most of the enemies
        that still do not arrive there are big bodies with no way in, waiting in the open.
        <br><br>
        Bodies are tested at their <b>feet</b> against the real obstacle boxes, not at the sprite
        origin (which sits on the creature's head), and a body inside a trunk is down to under
        one enemy-frame in ten thousand.
        Knockback and the drag of a Black Hole, Singularity or Gravity Snap go through the same
        collision, so nothing is thrown through a tree either.
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
        at the damage value it always had. (The player removed the card on 29 September; the flag
        stays for any fire drawn for show.)
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
        nothing damps a wall bounce enough to end it. So the orb frees itself: if it has not
        travelled more than a short distance for about a second and a half, it checks whether it is
        in a <em>pocket</em>, and phases out through the scenery if it is.
        <br><br>
        <b>Recall does not phase.</b> For one day in September 2026 a recalled orb passed through
        everything on its way home, which made holding right click a guarantee — and looked like a
        bug, an orb flying through trees. It collides again: it comes home round the scenery,
        bouncing and sliding off it, and if a tree catches it you can step aside, since the pull
        comes from wherever you stand. A pull that cannot arrive gives up after five seconds and
        the orb flies on at the speed the pull gave it (until 27 September it braked to a dead
        stop wherever the pull gave up). The escape above stands down while the orb is being recalled.
        <br><br>
        <b>Confinement is what marks a trap, not speed.</b> The first version also required the orb
        to still be moving, on the reasoning that a stationary orb is one waiting to be collected --
        and that let exactly the worst case through, because a wall bounce bleeds speed and a slow
        trapped orb comes to rest <em>inside</em> the gap. Measured: an orb entering at 260px/s
        stopped three pixels from the centre and stayed there forever. So it samples a ring
        instead. A flat wall the orb has rolled up against blocks at most half of it and is
        reachable on foot; a gap or an inside corner blocks more. An orb already at rest is nudged
        toward you as well, since phasing alone does nothing for something with no momentum.` },
  { h: "October 5: traits retuned",
    p: `<b>Only different cards count</b> toward a trait now; a second copy of a card adds nothing.
        Kinetic's tiers come at 2, 4 and 6 cards, and Frost's and Void's second at 4.
        <br><br>
        <b>Changed tiers.</b> Kinetic I: throws 20% faster (was 10%). Precision II, Exit Wound: a crit
        sprays into everything in a 3 m cone behind the target for half the hit (a crit used to pass
        through). Precision III: marked hits deal 2.5× (was 3×). Fire I, Long Burn: every burn lasts
        2 s longer (burning enemies used to be slowed). Fire II, Flashpoint: an orb hit on a burning
        enemy sets off the rest of its burn and lights it again (it used to be the recalled orb, in
        a blast). Frost I: chills 2 s longer (was 1 s). Storm I reaches Capacitor's chain too.
        Storm III also kills anything an arc leaves under 10% health. Blood II spreads to the 4
        nearest only. Guardian I, Small Shield: a 15-point shield that comes back after 4 s unhit
        (it used to slow attackers). Combo III, Encore: the lost half now flies as a combo bomb at
        the biggest crowd on screen, and bosses take a quarter of it.
        <br><br>
        <b>Beast III, Apex Pack</b>, replaces choosing one companion to empower: every companion
        gains a power. The Owl's bolts hit everything within 1.5 m for half, and every 4th bolt
        stuns. An enemy dying within 4 s of the Demon's claws bursts into flame and sets everything
        within 2 m alight. The Angel heals you 1 HP every 3 s. The Goat stampedes: rams 30% harder
        and 30% more often, shove 50% further, and carry on in a 2.5 m cone behind the target for
        half.` },
  { h: "October 4: family traits",
    p: `<b>Traits.</b> Every family has three tiers, switched on by owning 3, 5 and 7 of its cards —
        see <a href="builds.html#traits">Traits</a>. The player picked Beast III (empower a
        companion of your choosing), Storm III (chains go for the weakest within 6 m), Fire III
        (Wildfire) and Arcane III (a ghost orb replaying the orb's path 5 seconds behind); the rest are
        first drafts to be changed. A column on the right of the screen tracks them.
        <br><br>
        <b>Cards moved.</b> Backhand to Combo; Fracture and Split Shot to Arcane; Swift Steps and
        Essence Nova to Wild. <b>Folded or cut:</b> Ignition (every Fire card ignites now),
        Wildfire (Fire's third tier), Lightning Rod and Arc Damage (Chain Lightning's repeat picks),
        Blink Strike (the Phase Step boost already did it). Resonant Field and Gravity Snap became
        boosts, replacing Overcharge and Event Pull.
        <br><br>
        <b>Nineteen new cards</b>, and every family now has at least two uncommons: Running Throw,
        Trick Shot, Pin, Pyre, Firewalk, Permafrost, Whiteout, Capacitor, Thunderhead, Pocket,
        Wormhole, Imprint, Glint, Whistle, Bonded, Cash Out, On the Beat, Stage Fright and Multiplier.
        Event Horizon is offered after a Black Hole again: a stacked prerequisite was never seen.` },
  { h: "September 30 to October 3",
    p: `<b>The Frog.</b> The skeletal Ravager is now the <a href="bestiary.html#frog">Frog</a>, with new
        art: it closes in small hops (longer ones since 3 October), crouches, shows its lane and
        leaps. The <b>Slug</b> was halved (speed 46 to 26, health 210 to 105). The Owl, the Goat and
        the Angel have new sprites; the <a href="cards.html#goatcompanion">Goat</a> was retuned to ram
        less often for less, wander around you between rams and always go for whatever is closest to
        you; the <a href="cards.html#angelcompanion">Angel</a>'s lance hits for 20 (26). Health drops
        last 20 seconds (13). The <a href="cards.html#owlcompanion">Owl</a> is now an epic and the
        Goat a rare; the Goat and the Demon walk round trees, and the flying pets are drawn above them.
        <br><br>
        <b>Cards.</b> <a href="cards.html#staticcharge">Static Charge</a> spends only the charges it
        fires and keeps the rest when nothing is in reach. Arc Range is gone and
        Lightning Rod reaches 3 m further (1.2 m) — it was folded into
        <a href="cards.html#chainlightning">Chain Lightning</a> the next day.
        <a href="cards.html#volatilecore">Volatile Core</a> goes off on the first enemy a recalled orb
        hits, not when it lands in your hand. <a href="cards.html#boomerang">Boomerang</a> gives the
        recall button back on a 30-second cooldown.
        <br><br>
        <b>The shop</b> sells no loose cards: an ability down the left, a boost and a pack for each
        of your two biggest families, Transmute, then Reroll and Leave. Packs cost 4 units (2.6).
        The card screen and the shop are mouse only — R, D and Enter do nothing there now. See
        <a href="builds.html#shop">Builds &amp; shop</a>.` },
  { h: "The September 29 overhaul",
    p: `The biggest pass yet, aimed at two complaints: runs where you ended up owning every good
        card, and late runs where healing and shields meant you could not die.
        <br><br>
        <b>Builds.</b> One card a wave (was two). Every card now belongs to one of twelve
        <a href="builds.html">families</a> that pull their own cards up the draw; each class has
        three exclusive cards; a legendary bought in the shop carries a curse; and the run ends with a build name
        that keeps its own records. <b>38 new cards</b> — Boomerang, Split Shot, Deadeye, Wrecking
        Ball, a burn status (Ignition, Kindling, Wildfire, Cremation), Permafrost, Cold Snap,
        Absolute Zero, Static Charge, Storm Front, Blood Price, Hemorrhage, Event Horizon, Pack
        Leader, Raise Dead, a Goat and an Angel companion (the Angel excludes the Demon), Combo
        Breaker, Showboat, Contract, and the twelve class cards.
        <br><br>
        <b>The Essence Shop</b> replaces the free card every fifth wave: essence from kills, a priced
        shelf, restocks, and Transmute. See <a href="builds.html#shop">Builds &amp; shop</a>.
        <br><br>
        <b>Survival.</b> Invulnerability 0.3s, shields capped and draining, Life Steal on kills,
        fewer hearts after wave 15, and the rest — see <a href="guide.html#drops">Staying alive</a>.
        <b>Nightmare</b> is a fourth difficulty: harder enemies, worse odds
        on rare cards, fewer hearts, and a boss every seventh wave.
        <br><br>
        <b>New enemies.</b> The <a href="bestiary.html#plaguepriest">Plague Priest</a> halves your
        healing near it, and <a href="bosses.html#collector">The Collector</a>, the third boss,
        steals your three best cards for the fight. The Sovereign's pattern bolts now fly through
        scenery and draw above everything; its aimed volley still dies on trees.
        <br><br>
        <b>The death screen</b> explains the death: killer, biggest hit, who hurt you, what did your
        damage, and healing per wave since your healing last changed. Enemy shots now name their
        shooter there ("Bat's shot") rather than "Enemy shot".
        <br><br>
        <b>Later the same day.</b> Enemies speed up more gently: <b>+8%</b> from wave 1 (was +15%),
        <b>+1.4%</b> a wave (was +2%), capped at <b>×1.8</b> (was ×2). Wave 20 is now ×1.37 on
        Medium (was ×1.59) and ×1.77 on Nightmare (was ×2.13). And every difficulty heals
        <b>a third of your max health</b> after each wave — Easy 40% — where it used to heal a
        share of what you were missing, and Nightmare healed nothing.
        <br><br>
        The Blightspore is now simply the <a href="bestiary.html#slug">Slug</a>, in name as well as art.
        <br><br>
        <b>Family icons and family items.</b> Every card carries its family's icon, and the
        <a href="builds.html#shop">Essence Shop</a> now sells three cards and two family items: a
        <b>Family Boon</b> (a themed bonus, levels I to III), a <b>Family Pack</b> (a random card of
        that family), or <b>the Recombobulator</b>, which swaps every card of one family for the same
        rarities of another. Curses now come only with legendaries bought in the shop; a
        legendary in an ordinary hand is clean.
        <br><br>
        <b>The shop, reworked again.</b> Abilities are sold <b>only</b> in the shop now — one on
        every visit, on a card of their own design, and a restock deals a new one. The family items
        became a panel for each of your two biggest families, each with <b>three boosts</b> (distinct
        bonuses, bought once each), a <b>pack</b> that shows three of that family's cards and lets
        you keep one, and sometimes the Recombobulator.
        <br><br>
        <b>Essence by strength.</b> A kill no longer pays a flat one: every enemy has a range, rolled
        when it dies — 0–2 for a Mushroom, 1–3 for a Vampire, up to 3–6 for a Brute (listed in the
        <a href="bestiary.html">bestiary</a>) — an elite rolls three times and a boss pays 30–45.
        Small purple motes fly from the body to the counter as you are paid. Six new cards deal in it:
        Deep Pockets, Bounty Hunter, Jackpot, Tip Jar, Interest and Blood Money. Shop prices follow
        the new drops, so a visit buys what it did before.
        <br><br>
        <b>Later still.</b> The <a href="builds.html#shop">shop</a> pops in piece by piece, and the
        pick screen more slowly; the top-right essence counter stays lit over the shop instead of a
        second small one under its title. Each family panel shows <b>one</b> of its three boosts,
        drawn from those you do not own, and one visit in ten the Recombobulator stands in for one of
        them. Card text that ran off the bottom of a card (a cursed Angel Companion, Rewind) now
        fits. Three essence cards above rare: <a href="cards.html#dragonshoard">Dragon's Hoard</a>
        (legendary, damage from the essence you hold, weighed against prices so it cannot run away),
        <a href="cards.html#spendthrift">Spendthrift</a> and
        <a href="cards.html#essencenova">Essence Nova</a>. The Goat is weaker early — slower, and
        its daze is now only Concussion's — and a shove plays under a stun instead of after it. A
        stunned Bomber's fuse no longer pauses. Swift Steps is Kinetic. The achievements' scrollbar
        can be dragged.
        <br><br>
        <b>The second list.</b> Every family's three boosts were replaced with the player's own —
        Blood pools that slow, Precision's snap-back, a Frost shatter below 15%, Storm's fork and
        stunning bolt, Void's slow, Arcane echoes, Combo's second chance, Guardian's spinning
        shield and the rest (see <a href="builds.html#families">Builds &amp; shop</a>); the shop only
        offers one that could do something for you. Permafrost, Ball Lightning, Afterimage,
        Explosive Touch and Ambush are gone, and Wall Crush was folded into
        <a href="cards.html#bowling">Bowling</a>. Shatter is +30% (was triple), Momentum stops at
        +60% and says so, and Death Nova, Volatile Core, Cursed Glass, Rift Step, Rupture and
        Thornmail grow with the waves. Event Horizon, Resonance and Reserve Charge are epics;
        Deadeye is Precision; Phase Shot and Juggernaut exclude each other; Cold Snap needs a
        chill. A Boomerang return counts as a recall, and card text gives distances in metres.
        The cards page can be grouped by family.
        <br><br>
        <b>Companions.</b> The <a href="cards.html#goatcompanion">Goat</a> watches further (460px),
        rams harder, and its ram now splashes, shoves the whole group away from you and dazes it — it
        was far behind the other three — and it has three cards of its own like they do. The
        <a href="cards.html#angelcompanion">Angel</a>'s judgement is no longer the Demon's curse in
        gold: judged enemies hit you 20% softer, and when one dies a pillar of light smites everything
        around it.` },
  { h: "The September 28 pass",
    p: `<b>Nerfs.</b> <a href="cards.html#tether">Tether</a>, <a href="cards.html#quickening">Quickening</a>
        and <a href="cards.html#seeker">Seeker</a> are weaker and now epic. Seeker is the first card
        with a separate rarity for further stacks: an epic to find, a rare to stack. See their notes.
        <br><br>
        <b>Faster enemies.</b> Everything walks 15% faster from wave 1, and speed now ramps +2% a
        wave (was +1%), up to ×2. The fast events are much faster: <b>Blood Moon</b> ×1.7 (was ×1.3),
        <b>Frenzy</b> ×1.5 (was ×1.1), and <b>The Hunt</b>, whose description always promised
        "faster than you", has a real ×1.6 for the first time. Bosses keep the old gentle speed
        ramp. See <a href="waves.html#shape">how enemies scale</a>.
        <br><br>
        <b>Screen shake</b> now fades under rapid hits the way the hit freeze already did (below),
        so a crowd being carved up no longer rattles the camera nonstop. An
        <b>Overloaded</b> orb is drawn above every tree, enemy and blast, so the thing you are
        steering never disappears behind the scenery. The Revenant's
        <a href="bosses.html">Phantom Cross</a> is drawn as one clean shape, over the scenery.` },
  { h: "The September 27 pass",
    p: `<b>Hitstop no longer stutters.</b> Each hit on an enemy freezes the game for a few
        hundredths of a second so it lands with weight. Late in a run the orb hits several things a
        second, and the freezes, each up to 0.12s, piled into what looked exactly like lag. Every
        freeze now adds heat that drains over time and scales the next one down: a lone hit, or hits
        a second or more apart, get the full freeze; a rally goes 0.12, 0.06, 0.03, 0.01s and then
        nothing, and the punch comes back after a short breather. Hitting a tree freezes and shakes
        nothing at all (Thunderclap was the one card that did).
        <br><br>
        <b>Bosses compound</b> (×1.75 health and ×1.15 damage per boss reached) and enemy damage
        ramps +8% a wave (was +5%). The <b>combo ladder</b> has ten tiers, with GODLIKE at a 500
        combo (was 60) and BRUTAL, UNREAL and LEGENDARY in between; the score multiplier still tops
        out at ×3, spread over the ten. The <b>Sovereign's slam</b> winds up in 0.9s (was 1.15s).
        <br><br>
        <b>Fixes.</b> An orb shoved out of an enemy and into a tree used to stop dead at full speed
        — the code that freed it from the trunk zeroed its velocity — and that was the "ball just
        stops in a crowd" report; it now keeps its speed. A recall that times out leaves the orb
        moving instead of braking it to a halt. An <b>Overloaded</b> orb can be swung from its rim:
        swing reach grows with how much bigger the orb is than normal (Heavy Orb and Rampage
        extend it a little too). The <b>My Upgrades</b> panel scrolls one row per wheel notch; it
        moved about 7px.` },
  { h: "The September 26 changes",
    p: `<b>Ability bar.</b> Pressing F now drains the ability's bar over the effect's duration, so
        you can see how long it lasts, and the cooldown only starts once the effect has ended (it
        used to run underneath the effect). With Reserve Charge, a refill in progress waits too.
        <br><br>
        <b>Recall spam fixed.</b> Holding recall, swinging the orb out of the pull and releasing
        used to skip the recall cooldown entirely, so you could recall again at once. Ending a
        recall with a swing now spends the cooldown like any other ending.
        <br><br>
        <a href="cards.html#backhand">Backhand</a> works on a moving orb, and
        <a href="cards.html#orbitmode">Mirror Ball</a> shards finally scale; see their notes.` },
  { h: "The September 25 fixes",
    p: `<b>Later the same day.</b> A big crimson <b>boss arrow</b> is always showing: at the screen
        edge, labelled with the boss's name, while it is off screen, and bobbing over its head while
        it is on screen. The <b>orb arrow</b> is bigger, sits on a dark badge so it reads on any
        ground, and says how far away the orb is. <b>Pausing</b> now stops the music outright
        (sound effects were already held), and the music also stops while the game window is in
        the background. On <b>easy and normal</b> the map leaves at least 96px — two orbs — between
        any two solid obstacles. <b>Fireballs</b> are drawn over the rocks and stumps they fly
        over; they used to be drawn underneath them. <b>Glass Cannon</b> has been removed, and its
        achievement, Butterfingers, with it. <b>Slug</b> pools: thrown ones are bigger
        (90px), and the trail it walks is smaller pools (40px) dropped twice as often (every 35px).
        <br><br>
        <b>Fireballs</b> fly over rocks and stumps and only stop on trees. <b>Both bosses</b>
        have twice the health (Sovereign 2,200 and Revenant 1,720 before wave scaling).
        <b>Second Wind</b> saves you on 30 HP with 5 seconds of invulnerability, not 1 HP.
        <br><br>
        <b>Companions.</b> The <a href="cards.html">Owl and Demon</a> were rebuilt to stand level
        with Black Hole, the legendary they are measured against, and their damage now rides the
        enemy health curve instead of staying flat. See their card notes.
        <br><br>
        <b>Damage numbers</b> are bigger and climb a colour ladder with the size of the hit:
        white under 20, yellow 20+, orange 50+, red 100+, magenta 200+, purple 350+, cyan 500+,
        blue 700+, gold 1,000+, white-hot with a red glow from 1,500, and cycling through the
        rainbow from 2,000. Each step is also drawn a little larger. Crits add a "!". Burn
        ticks, heals and damage you take keep their own fixed colours.
        <br><br>
        <b>Slugs</b> lob poison balls that land as pools, and <b>Reserve Charge</b>
        (legendary, offered once you hold an F ability) gives the ability a second charge.
        <br><br>
        <b>Nuke</b>: while the orb is blown apart and reforming, a swing no longer "throws" it.
        The hidden orb sits in your hand, so every swing launched an invisible, harmless orb that
        snapped straight back, with the full swing sound: pushing nothing.
        <br><br>
        <b>Catching</b> an orb that is barely moving (under 40px/s) stops it silently. It no
        longer plays the catch sound or triggers Backhand, Dead Stop or the catch achievement,
        which is what let <b>Magnetic Grip</b> fire all of them every frame. The
        <b>Tether</b> cord no longer disappears at long range. See those cards' notes.` },
  { h: "The September 24 pass",
    p: `<b>Bosses.</b> The <a href="bosses.html">Dread Sovereign</a> fires faster bolts and gained
        four patterns: alternating rings, an aimed wall with a hole, a re-aimed volley and a spiral.
        The <a href="bosses.html">Pale Revenant</a> gained the Phantom Cross, then (later the
        same day) the Reaper's Wheel. The Cross became a quick run of slashes by the boss itself
        rather than a single simultaneous strike, and its dashes now go through trees and rocks.
        <br><br>
        <b>Buffs.</b> The Owl and the Demon hit harder and more often, and each now spreads to a
        second target; see their card notes for the numbers. <b>Rewind</b> is on a 25s
        cooldown (was 40), always heals at least 15% on top of the health it restores, and leaves a
        time-quake where you were that stuns for 1.5s. The
        <a href="bestiary.html#slug">Slug</a> is half again as fast and drops smaller
        pools twice as often, so its rot is a trail rather than a scatter of puddles.
        <br><br>
        <b>Black Hole</b> is a stackable card now, capped at three: a smaller well at one card
        (150px, from 240) that grows to 260px at three.
        <br><br>
        <b>Fixes.</b> The Mirror Ball ring could vanish whenever the main orb was far off screen or
        hidden by a Nuke, and the Quickening chevrons flipped when you turned.` },
  { h: "The September 23 sweep",
    p: `A pass over the whole game for bugs, most of them the quiet kind: nothing crashed, the
        game simply did less than it said. In one place, so the list is findable:
        <br><br>
        <b>Sound.</b> Card sounds were placed so that most of them were near-silent at ordinary
        range, several cards had no sound or someone else's, and effects kept playing under the
        pause menu — see <a href="#sound">Sound</a> below. The combo tier-ups became a
        <a href="#combo">streak ladder</a> that climbs, and its top rung finally plays.
        <br><br>
        <b>Enemies.</b> Navigation was rebuilt around how much room there is (above): routes per
        body size, steering that keeps clear of trunks, and big bodies that wait in the open rather
        than wedge in a gap. Bodies collide at their feet, the crowd spreads into a ring, spawns
        come from outside the real view,
        stragglers are brought back, and arrows point to the last few. Trees block enemy shots,
        and shooters need a line to you. Casters hold their distance between casts, the
        <a href="bestiary.html#bulwark">Bulwark</a>'s shield turns to face you in any direction, and
        the <a href="bestiary.html#siphon">Siphon</a>'s heal works.
        <br><br>
        <b>Cards and abilities.</b> Glass Cannon (removed on 25 September) re-shattered on every wall. The Twin Orbs twin
        collided at the wrong size and kept Overload forever. Thunderclap fired on any touch.
        Vampire Orb's card said +2. Nuke could leave the orb gone for the rest of the run, Rewind
        spent its cooldown on nothing, Cryostasis let a lit fuse go off, and boss knockback
        resistance never applied. The off-screen orb arrow pointed the wrong way, and a recalled
        orb passed through trees; it collides again. And the orb's direct hit was aimed at every
        enemy's head: it measured from the sprite's anchor, which sits on the head, instead of
        the body — so on a Mushroom it struck the air above the cap and passed through the
        stalk. It now hits the body where it is drawn.
        <br><br>
        <b>Achievements.</b> <a href="achievements.html#ach-bestiary">Full Bestiary</a> unlocked
        without the three newest enemies, which had no kill counter; it now counts every ordinary
        type on a line of its own — the Witchdoctor and the Bonecaller separately — and neither
        boss.` },
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
  There are six rungs and, since 27 September, ten tiers: the first five promotions climb the
  first five rungs, BRUTAL, UNREAL and LEGENDARY replay the fifth pitched up to G6, A6 and B6 so
  the climb keeps rising, and GODLIKE keeps the last rung to itself. (The set before these had
  seven sounds for six promotions, and its top one could never play.)
  <br><br>
  <b>Fixed on 23 September.</b> Crescendo asked for a sound that was never loaded, and was
  silent. Aegis played Glass Cannon's shatter on every deflect. Twin Orbs doubled the throw, and
  Charged Shot with Backhand fired two full-volume swings at once. Chain Lightning zapped on
  every hit whether or not there was anything to arc to. Slingshot's arming borrowed the
  “ability ready” cue, and the Owl whooshed when it appeared rather than when it struck. Soul
  Harvest chimed on full health with nothing healed. Death Nova, Explosive Touch, Volatile Core,
  Rupture, Void Pulse and Thunderclap made no sound at all. Evil Wizards and Archmages groaned
  twice per hit, each wizard's hand chain fired about eleven full-volume digs per cast, the
  Bomber had no hurt sound, and effects kept playing under the pause menu. A test now fails on
  any sound name in the code that does not exist.
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

// Ten tiers since 27 September 2026 (GODLIKE was at 60, now 500).
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

/* ── Builds & shop (Sept 29 2026) ──────────────────────────────────────────
   The numbers on that page come from data.json (families, curses,
   consts.family, consts.shop); this is only what they mean. */
export const BUILDS_NOTE = `A run used to end with nearly every good card in the pool, so every
  run ended the same way. Now you take one card a wave, and <b>families</b> are what turn those
  picks into a build: every card belongs to exactly one, and every card you own in a family makes
  that family's other cards likelier to be dealt. An early lean compounds into an identity instead
  of being washed out by the shuffler — but nothing is ever locked out, so an off-family card is
  still a real decision.`;

export const BUILD_NAME_NOTE = `The game-over screen names your build from its two leading
  families: the top family's adjective and the runner-up's noun, so three Frost cards and two
  Kinetic ones is a <i>Frost Juggernaut</i>. A single family is an <i>Adept</i>; no cards at all is
  an <i>Empty Hand</i>. A tie goes to the family listed first below. Each build name keeps its
  own furthest wave, best score and number of runs, so "my best Blazing Pyromancer" is a record
  you can chase.`;

export const CURSE_NOTE = `<b>A legendary from the Essence Shop comes with a curse</b> — out of a
  Family Pack or from Transmute. A legendary in an ordinary wave's hand is clean
  (every legendary was cursed until the player asked for shops only). The curse is rolled when the
  card is dealt and printed on its face in red, so buying one is a trade you can read before you
  make it.
  The curse lasts the rest of the run, and two of the same kind compound. Each is a multiplier on
  something the game already reads — sized to sting, never to make a legendary not worth taking.`;

export const CLASS_CARD_NOTE = `Each class has cards only it is ever offered, marked with the
  class's name on the card (three for the Warden, two for the Breaker, one each for the Stalker
  and the Stormcaller: Ball Lightning, Ambush and Afterimage were removed and Wall Crush folded
  into Bowling on 29 September, and the Stormcaller's Resonant Field became a Storm boost on
  4 October). They are strong on purpose — a reason to pick the class — but sized
  against the ordinary cards of their rarity rather than above them.`;

export const SHOP_NOTE = `After every fifth wave the free card is replaced by the <b>Essence
  Shop</b>. Essence comes from every death, whoever or whatever landed it: pets, burns and a
  bomber's own blast all pay — and since 29 September how much depends on how strong the enemy
  was. Unspent essence carries over, so saving through one shop for a
  legendary at the next is a real plan. Extra cards the wave owes you — Tithe, a boss kill's bonus
  — are still dealt as ordinary hands once you leave.`;

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
  { t: "Class", d: "Picked once at the start of a run. Biases which cards you are offered, and opens with one signature card." },
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
