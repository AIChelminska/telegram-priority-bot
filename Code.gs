// ─── CONFIGURATION ───────────────────────────────────────
// Fill in your own values before running the script
const TELEGRAM_TOKEN = "YOUR_BOT_TOKEN";
const RECIPIENTS = ["YOUR_CHAT_ID"]; // e.g. ["123456789"] or ["123456789", "-987654321"]
const SOURCE_SHEET_ID = "YOUR_GOOGLE_SHEET_ID"; // from the spreadsheet URL
const SHEET_NAME = "YOUR_SHEET_TAB_NAME"; // name of the tab in your spreadsheet
// ─────────────────────────────────────────────────────────

const STORAGE_KEY = "tracked_items"; // internal cache key — no need to change this

/**
 * Checks the spreadsheet for new or resolved blocked pallets.
 * Expects the following columns in the sheet:
 *   A (0) - Reach zone
 *   D (3) - Article ID       → used as unique identifier
 *   E (4) - Article name
 *   G (6) - Stock location (dock)
 *   H (7) - Pick location
 */
function checkForNewPicks() {
  const sheet = SpreadsheetApp.openById(SOURCE_SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1); // skip header row

  const currentPicks = rows
    .filter(row => row[0] !== "")
    .map(row => ({
      key: `${row[3]}`,
      zone: row[0],
      articleId: row[3],
      articleName: row[4],
      stock: row[6],
      pickLocation: row[7]
    }));

  const props = PropertiesService.getScriptProperties();
  const stored = props.getProperty(STORAGE_KEY);
  const knownPicks = stored ? JSON.parse(stored) : [];
  const knownKeys = knownPicks.map(p => p.key);
  const currentKeys = currentPicks.map(p => p.key);

  // New blocked pallets
  const newPicks = currentPicks.filter(p => !knownKeys.includes(p.key));
  newPicks.forEach(pick => {
    const msg =
      `🚨 NEW BLOCKED PALLET\n\n` +
      `${pick.articleName}\n` +
      `Zone: ${pick.zone}\n` +
      `Location: ${pick.pickLocation}\n` +
      `Article ID: ${pick.articleId}\n` +
      `Located at: ${pick.stock}`;
    sendTelegram(msg);
  });

  // Resolved pallets
  const resolvedPicks = knownPicks.filter(p => !currentKeys.includes(p.key));
  resolvedPicks.forEach(pick => {
    const msg =
      `✅ PALLET UNBLOCKED\n\n` +
      `${pick.articleName}\n` +
      `Located at: ${pick.stock}`;
    sendTelegram(msg);
  });

  // Persist current state for next run
  props.setProperty(STORAGE_KEY, JSON.stringify(currentPicks));
}

function sendTelegram(message) {
  RECIPIENTS.forEach(chatId => {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });
  });
}

function testSend() {
  sendTelegram("✅ Bot is running and active!");
}
