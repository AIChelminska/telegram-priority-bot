const storage = require('../services/storage');
const { sendDashboardMessage, editDashboardMessage, pinDashboard } = require('../services/telegram');

let dashboardMessageId = null;

const initDashboard = async () => {
    dashboardMessageId = await sendDashboardMessage(`📊 DASHBOARD\n\n🚨 Active: 0\n✋ Claimed: 0 / Unclaimed: 0\n⚠️ Stacked: 0\n✅ Unblocked today: 0\n👑 PG: none`);
    await pinDashboard(dashboardMessageId);
    return dashboardMessageId;
}

const updateDashboard = async () => {
    const pallets = storage.getKnownPallets();
    const states = pallets.map(p => storage.getPalletState(p.key));
    const claimed = states.filter(s => s?.state === 'claimed').length;
    const unclaimed = states.filter(s => !s || s.state === 'unclaimed').length;
    const stacked = states.filter(s => s?.state === 'stacked').length;
    const unblockedToday = storage.getUnblockedToday();
    const pg = storage.getPG();
    await editDashboardMessage(dashboardMessageId, `📊 DASHBOARD\n\n🚨 Active: ${pallets.length}\n✋ Claimed: ${claimed} / Unclaimed: ${unclaimed}\n⚠️ Stacked: ${stacked}\n✅ Unblocked today: ${unblockedToday}\n👑 PG: ${pg ? `@${pg.username}` : 'none'}`);
}

module.exports = {
    initDashboard,
    updateDashboard
}