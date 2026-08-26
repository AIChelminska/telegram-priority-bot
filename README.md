# Telegram Priority Bot

A Telegram bot that helps a warehouse quality control team deal with blocked pallets. It watches a spreadsheet fed by the warehouse system, announces every newly blocked pallet in the team's Telegram group and lets people coordinate the work with inline buttons instead of shouting across the floor.

I built it for my own team. The first version was a plain Google Apps Script that only sent notifications; this version adds a Node.js server, so the bot can react to button presses, track who is handling what and keep a live dashboard pinned in the group.

## How it works

```
Google Sheets ──> Google Apps Script ──> POST /receive ──> Node.js server ──> Telegram group
                  (runs every minute)                        │
                                          Telegram webhook ──┘  (button callbacks, POST /webhook)
```

1. An Apps Script (running on the company Workspace) reads the spreadsheet every minute and pushes the current list of blocked pallets to the server.
2. The server diffs the incoming list against what it already knows. New pallets are announced in the group with action buttons; pallets that disappeared from the sheet are marked as unblocked.
3. Team members interact through the buttons. Telegram delivers every press to the webhook endpoint and the bot edits the message to reflect the new state.

## What the team sees

Every blocked pallet gets its own message with the article name, zone and dock location. The buttons change with the pallet's state:

| State | Meaning |
|---|---|
| 🚨 New | Just appeared, up for grabs (Claim / Stack / Assign) |
| ✋ Claimed | Someone took it (Stack / Resign) |
| ⚠️ Stacked | Physically unreachable for now (Unstack) |
| ✅ Unblocked | Gone from the sheet, nothing left to do |

There is also a **Priority Guy** role: whoever presses "Become PG" on the dashboard coordinates the shift. The PG can assign pallets to specific people — the assignee gets a personal mention (works even without a Telegram username, the bot tracks user ids) and accepts or rejects the task. Only the assignee or the PG can act on an assignment, and only the claimer or the PG can resign a claimed pallet.

The pinned dashboard shows active, claimed, unclaimed and stacked counts, how many pallets were unblocked today and who the current PG is. It refreshes after every action and once a minute as a fallback. A fresh dashboard is posted and pinned every day at 04:00 (Europe/Warsaw), which also resets the daily counter.

## Stack

- Node.js + Express — HTTP server for both endpoints
- node-telegram-bot-api — Telegram Bot API client
- node-cron — dashboard refresh and the daily 04:00 reset
- Google Apps Script — data source on the spreadsheet side
- Render — hosting

State is kept in memory on purpose: the data is short-lived (a pallet exists for minutes to hours) and the sheet remains the source of truth, so a restart costs at most re-announcing the currently blocked pallets.

## Project structure

```
index.js                  entry point, Express app, webhook routing
src/
  scheduler.js            cron jobs (dashboard refresh, daily reset)
  services/
    receiver.js           validates and diffs data coming from Apps Script
    storage.js            in-memory state (pallets, message ids, claims, PG)
    telegram.js           all Telegram API calls
  handlers/
    claim.js  resign.js  stacked.js  unstacked.js
    assign.js accept.js  reject.js   become-pg.js
    dashboard.js
```

## Running it yourself

You need Node.js 18+, a Telegram bot (create one with [@BotFather](https://t.me/BotFather)) and a group where the bot is an admin (it has to pin messages).

```bash
git clone https://github.com/achelminska/telegram-priority-bot.git
cd telegram-priority-bot
npm install
cp .env.example .env   # fill in the values
node index.js
```

Environment variables:

| Variable | Description |
|---|---|
| `TELEGRAM_TOKEN` | Bot token from BotFather |
| `TELEGRAM_GROUP_ID` | Chat id of the target group (negative number) |
| `GROUP_MEMBERS` | Comma-separated first names shown in the assign picker |
| `RECEIVER_SECRET` | Shared secret; Apps Script sends it in the `x-secret` header |
| `PORT` | HTTP port, defaults to 3000 |

Point the Telegram webhook at your server:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_TOKEN>/setWebhook?url=https://<your-host>/webhook"
```

The data source is expected to POST to `/receive` with the secret header and a body like:

```json
{
  "rows": [
    { "articleId": "HE11288011-12", "articleName": "Zespri Bio Kiwi", "zone": "GH", "stock": "Dock 14" }
  ]
}
```

Anything currently in `rows` is treated as blocked; anything the server knew about that is missing from `rows` is treated as unblocked.

## License

MIT
