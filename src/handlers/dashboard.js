const storage = require('../services/storage');
const { sendDashboardMessage, editDashboardMessage, pinDashboard } = require('../services/telegram');

let dashboardMessageId = null;

const buildDashboardText = () => {
    const pallets = storage.getKnownPallets();
    const states = pallets.map(p => storage.getPalletState(p.key));
    const claimed = states.filter(s => s?.state === 'claimed').length;
    const unclaimed = states.filter(s => !s || s.state === 'unclaimed').length;
    const stacked = states.filter(s => s?.state === 'stacked').length;
    const unblockedToday = storage.getUnblockedToday();
    const pg = storage.getPG();
    return `📊 DASHBOARD\n\n🚨 Active: ${pallets.length}\n✋ Claimed: ${claimed} / Unclaimed: ${unclaimed}\n⚠️ Stacked: ${stacked}\n✅ Unblocked today: ${unblockedToday}\n👑 PG: ${pg ? `@${pg.username || pg.first_name}` : 'none'}`;
};

const initDashboard = async () => {
    dashboardMessageId = await sendDashboardMessage(buildDashboardText());
    await pinDashboard(dashboardMessageId);
    return dashboardMessageId;
};

const updateDashboard = async () => {
    await editDashboardMessage(dashboardMessageId, buildDashboardText());
};

module.exports = {
    initDashboard,
    updateDashboard
}