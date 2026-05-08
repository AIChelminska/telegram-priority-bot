const cron = require('node-cron');
const { updateDashboard } = require('./handlers/dashboard');
const storage = require('./services/storage');

cron.schedule('0 1 * * *', async () => {
    try {
        storage.resetUnblockedToday();
        await updateDashboard();
    } catch (err) {
        console.error('[scheduler] daily reset error:', err.message);
    }
});

cron.schedule('* * * * *', async () => {
    try {
        await updateDashboard();
    } catch (err) {
        console.error('[scheduler] updateDashboard error:', err.message);
    }
});