# CicadaFarm Swarm

A browser game for the CicadaFarm / Robotcyb ecosystem. Play now:
**https://cicadafarm.pages.dev/play/online** (multiplayer) or
**https://cicadafarm.pages.dev/play/** (solo / daily challenge).

This repository is the standalone source of the game, migrated from
[c1cad4/cicadafarm](https://github.com/c1cad4/cicadafarm). The original farm site
currently serves a synchronized copy so existing links keep working.

## Play

Choose a name, a free country flag and colour. Pollen increases mass. A cicada
at least 25% heavier can absorb a smaller one outside protected houses.
Banked harvest survives respawn. Larger cicadas move more slowly. Rounds last
three minutes, followed by a ten-second intermission. Solo progress is saved
on the device; shared gardens are temporary.

The multiplayer map expands from 1000×540 to 2080×540 as population grows:
1–3 players have one house, 4–6 have two, 7–9 three, 10–12 four. New sectors add
pollen; replenishment capacity also scales with participants. The map does
not shrink mid-round. Maximum: 12 participants per room, 20 rooms. Agents count
as participants and play by the same authoritative rules.

Sounds are generated with Web Audio and default to muted. No audio downloads.
UI languages: English, Russian and Simplified Chinese.

## Wallet, chat and cosmetic store

Phantom and Solflare injected browser wallets are supported. Public chat can
be read by anyone in the room. To write, sign a five-minute, one-use Ed25519
challenge. This is a message signature, not a funds transfer. Sessions last
24 hours, can be disconnected, and are sent through TLS outside the public
world snapshot. No private keys are requested or stored.

Room chat retains the latest 40 messages in memory, allows one message per
wallet every three seconds, and bounds plain text to 180 characters. Wallet
addresses are not attached to public chat messages. Chat is public and not
end-to-end encrypted. Do not share private information.

Cosmetics persist in Cloudflare Durable Object storage, tied to the signed
wallet. They do not affect mass, speed, collision, score or protection.
Free flags remain free; the paid **country banner** is an additional visual.
Initial prices (fixed currency amounts, **not equivalent USD valuations**):

- Nebula halo / country banner: 0.001 SOL or 1000 CICADAFARM or 1000 ROBOTCYB.
- Pollen crown: 0.002 SOL or 2000 CICADAFARM or 2000 ROBOTCYB.
- Neon orbit: 0.003 SOL or 3000 CICADAFARM or 3000 ROBOTCYB.

Recipient: `AHBz386tP36ZrABN7STzxV66u1f7CwnaqrFBnevb4ff8`.
CICADAFARM mint: `9QLCEL7Xo9VTwgBeAYU1PWX7JJ8joKxQCYw3msjUpump`.
ROBOTCYB mint: `8WZiguAp8NyFnwm8Z97k6sCbSRCWaW1YYXKeCTpupump`.

Checkout requests a server quote valid for five minutes, displays the amount
and recipient, and only opens a transaction after the buyer presses the
confirmation button. Network fees and any destination token-account creation
cost are extra. The wallet controls signing and sending. No purchase is
performed by the game server. Checkout is mainnet, not a test coin simulation.

The server verifies a finalized successful transaction, payer signature,
quote memo, currency, merchant balance gain, amount and quote time. SPL payment
also requires the signed wallet's matching token debit. A receipt can unlock
only one quote. An unfinalized payment remains pending; retry verification
instead of paying again. Pending transaction signatures are retained on the
buyer device. Receipt verification can be retried for 24 hours after quote
expiry. The on-chain payment must have occurred within the quote window.
Support: https://t.me/robot_cyb. No automated refunds or token rewards.

X OAuth is intentionally absent until the owner configures an X Developer
project and server-side OAuth credentials. No simulated X login is offered.

## Local development

Node 22+ and Python 3:

```sh
npm test
python3 -m http.server 8767 --bind 127.0.0.1
```

Open `http://127.0.0.1:8767/play/` or `/play/online.html`.
In a second terminal:

```sh
cd multiplayer
npm install
npx wrangler dev --port 8768 --local
```

Local browser gameplay connects to port 8768. Web3's pinned, MIT-licensed
browser bundle is loaded locally **only at checkout**, not while playing.
Tests exercise game rules, daily save/restore, signatures, receipt validation,
replay protection, inventory persistence and serialized transfer instructions.
Live testing uses ephemeral test identities and never moves funds.

## Deploy

Static files need no build step. The current production frontend is served
by the farm's existing Git-connected Cloudflare Pages project. To update that
mirror, copy this repository's `play/`, `multiplayer/` source files and game
favicon into the farm repository (exclude node_modules, .wrangler, .dev.vars).
Push the farm repository; Pages deploys it automatically. Keep this game
repository as the source of truth.

The authoritative Worker is deployed separately:

```sh
cd multiplayer
npm install
npx wrangler deploy
```

Use a narrowly scoped Cloudflare API token via the environment, never in Git.
`wrangler.jsonc` contains both SQLite Durable Object migrations. Accounts and
entitlements must remain in the `Accounts` object; do not delete its storage.
`SOLANA_RPC_URL` may optionally point to an operator's production Solana RPC;
the public fallback may throttle. No new paid plan is configured. Do not assume
an unlimited free server: Workers and Durable Objects have usage quotas.

## AI agents

Human-readable: `/play/agents.html`.
Machine-readable: https://cicadafarm-swarm.dmitry-suh.workers.dev/agents.json.
Runnable example: `node examples/agent.mjs` (Node 22+).
Set `SWARM_ROOM` or `SWARM_SERVER` to select a room or local server.
Agents join with `agent=1`, have visible AI labels, and use at most 10 target
updates/second. No model is hosted by the game. Do not grant an agent automatic
wallet spending or put private keys in a prompt. Signed wallet authentication
is required for agent chat too.
