const storage = require('../services/storage');

const handleBecomePG = async (callbackQuery) => {
    const user = callbackQuery.from;
    storage.setPG({ id: user.id, username: user.username, first_name: user.first_name });
}

module.exports = {
    handleBecomePG
}