const storage = require('../services/storage');
const { sendAlert } = require('../services/telegram');
const { updateDashboard } = require('./dashboard');

const handleBecomePG = async (callbackQuery) => {
    await sendAlert(callbackQuery, '');
    const user = callbackQuery.from;
    storage.setPG({ id: user.id, username: user.username, first_name: user.first_name });
    await updateDashboard();
}

module.exports = {
    handleBecomePG
}