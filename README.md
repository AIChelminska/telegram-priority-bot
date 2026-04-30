# 🚨 Telegram Priority Bot v2

> A major upgrade to the original Google Apps Script bot — now powered by a Node.js server with real-time interactions, inline buttons, role system and a live dashboard.

## What's new in v2

- **Inline buttons** — claim, stack or assign pallets directly from the chat
- **Real-time interactions** — bot responds instantly to button clicks via webhook
- **Priority Guy role** — one person coordinates and assigns tasks to the team
- **Live dashboard** — pinned message with live stats updated every minute
- **Pallet states** — track whether a pallet is unclaimed, claimed or stacked

## How it works

1. Google Apps Script (running on Picnic Google Workspace) reads the spreadsheet every minute
2. Apps Script pushes the data to the Node.js server via HTTP POST
3. Node.js server compares incoming data with known state
4. Detects new or resolved pallets and sends Telegram notifications
5. Team interacts with inline buttons — bot updates messages in real time via webhook

## Pallet states

| State | Description |
|---|---|
| 🚨 New | Pallet just appeared — available to claim |
| ✋ Claimed | Someone is handling this pallet |
| ⚠️ Stacked | Pallet is physically inaccessible |
| ✅ Unblocked | Pallet has been resolved |

## Roles

**Priority Guy (👑)** — coordinates the team, assigns pallets to specific controllers. Any team member can become PG at any time.

**Controller** — receives assignments, can claim pallets voluntarily.

## Features

- 🚨 Instant push notification when a new blocked pallet appears
- ✋ Claim button — take ownership of a pallet
- 🔙 Resign button — release a pallet back to the team
- ⚠️ Stacked button — mark a pallet as physically inaccessible
- 🔓 Unstacked button — mark a pallet as accessible again
- 👑 Assign button — Priority Guy assigns a pallet to a specific team member
- 📊 Pinned dashboard with live stats

## Tech stack

- Node.js
- Express
- Google Apps Script (data source — runs on Picnic Workspace)
- Telegram Bot API
- node-cron (dashboard updates)
- Jest (unit tests)
- GitHub Actions (CI)
- Render.com (hosting)

## Setup

> Coming soon

## License

MIT
