const cron = require('node-cron');
const { updateDashboard } = require('./handlers/dashboard');
const storage = require('./services/storage');

cron.schedule('0 1 * * *', () => {
    storage.resetUnblockedToday();
    updateDashboard();
});

cron.schedule('* * * * *', () => {
    updateDashboard();
}); 