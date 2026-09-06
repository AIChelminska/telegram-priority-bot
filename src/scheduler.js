const cron = require('node-cron');
const { initDashboard, updateDashboard } = require('./handlers/dashboard');
const storage = require('./services/storage');

const cronOptions = { timezone: 'Europe/Warsaw' };

cron.schedule('0 4 * * *', async () => {
    try {
        storage.resetUnblockedToday();
        storage.setPG(null);
        await initDashboard();
    } catch (err) {
        console.error('[scheduler] daily dashboard error:', err.message);
    }
}, cronOptions);

cron.schedule('* * * * *', async () => {
    try {
        await updateDashboard();
    } catch (err) {
        console.error('[scheduler] updateDashboard error:', err.message);
    }
}, cronOptions);