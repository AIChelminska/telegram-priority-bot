# 🚨 Telegram Priority Bot v2

> A major upgrade to the original Google Apps Script bot — now powered by a Node.js server with real-time interactions, inline buttons, role system and a live dashboard.

## What's new in v2

- **Inline buttons** — claim, stack or assign pallets directly from the chat
- **Real-time interactions** — bot responds instantly to button clicks via webhook
- **Priority Guy role** — one person coordinates and assigns tasks to the team
- **Live dashboard** — pinned message with live stats updated every minute
- **Pallet states** — track whether a pallet is unclaimed, claimed or stacked

## How it works

When a pallet is blocked in the warehouse system, the bot instantly notifies the QC team on Telegram. Each notification shows the pallet details and interactive buttons — no more manually checking spreadsheets.

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
- Telegram Bot API
- Google Sheets API
- node-cron
- Jest (unit tests)
- GitHub Actions (CI)
- Render.com (hosting)

## Setup

> Coming soon

## License

MIT