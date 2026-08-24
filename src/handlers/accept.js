const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');
const { updateDashboard } = require('./dashboard');

const handleAccept = async (callbackQuery) => {
    const accept = callbackQuery.data.replace('accept_', '');
    const separatorIndex = accept.indexOf('_');
    const member = accept.slice(0, separatorIndex);
    const palletKey = accept.slice(separatorIndex + 1);
    const pg = storage.getPG();
    const userNames = [callbackQuery.from.username, callbackQuery.from.first_name]
        .filter(Boolean)
        .map(name => name.toLowerCase());
    const isAssignee = userNames.includes(member.toLowerCase());
    const isPG = pg && [pg.username, pg.first_name]
        .filter(Boolean)
        .some(name => userNames.includes(name.toLowerCase()));
    if (!isAssignee && !isPG) {
        await sendAlert(callbackQuery, 'This pallet is not assigned to you');
        return;
    }
    await sendAlert(callbackQuery, '');
    const pallet = storage.getPalletByKey(palletKey);
    storage.setPalletState(palletKey, 'claimed', member);
    await editPalletMessage(palletKey, `✅ ${pallet.articleName} accepted by @${member}\n\nZone: ${pallet.zone}\nLocated at: ${pallet.stock}\n\n@${pg.username || pg.first_name} task assigned!`, [
        [
            { text: '⚠️ Stack', callback_data: `stack_${palletKey}` },
            { text: '🔙 Resign', callback_data: `resign_${palletKey}` }
        ]
    ]);
    await updateDashboard();
}

module.exports = {
    handleAccept
}

