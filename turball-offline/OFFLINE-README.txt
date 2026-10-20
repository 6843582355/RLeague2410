Turball offline package

Requirements: Node.js 18 or newer. No npm packages are required.

Run from this directory:
  node serve.mjs

Then open http://127.0.0.1:4173 in a browser. To use a different port:
  PORT=8080 node serve.mjs

The package includes game modules, arena manifests, models, skyboxes, textures,
audio, and UI assets mirrored for local use. Internet access is not needed after
the package has been downloaded.

Private matches can be played locally against bots. If the optional trained bot
policies are missing, the game uses rank-scaled local bots with distinct
reaction, reachable ball-intercept forecasts, goal-oriented shot approaches,
defensive shadowing with brief fake recognition, active close-range challenges,
rank-gated wall carries, and guided air-dribble attempts from Diamond and above.
Grand Champion and SSL fallback bots vary their flicks, including musty flick
attempts; SSL also attempts chained multi-reset aerial plays and wall double taps.
Close-range attackers keep driving rather than braking at the target, defenders
hold a goal-side position when a carrier turns sharply, and grounded bots
attempt to recover if they become stuck. Aerial guidance biases touches toward
open goal lanes and away from nearby defenders. These are scripted
approximations, not consistent, human-level execution of every move.
The uploaded Rocket League footage informed the approach and recovery heuristics;
its vehicle physics and any mode-specific power-ups are not reproduced here.
LAN and online multiplayer, accounts, clips, and store inventory are not
included; the local server reports those API routes as unavailable.