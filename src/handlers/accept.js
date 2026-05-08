const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');

const handleAccept = async (callbackQuery) => {
    await sendAlert(callbackQuery, '');
    const accept = callbackQuery.data.replace('accept_', '');
    const separatorIndex = accept.indexOf('_');
    const member = accept.slice(0, separatorIndex);
    const palletKey = accept.slice(separatorIndex + 1);
    const pallet = storage.getPalletByKey(palletKey);
    const pg = storage.getPG();
    storage.setPalletState(palletKey, 'claimed', member);
    await editPalletMessage(palletKey, `✅ ${pallet.articleName} accepted by @${member}\n@${pg.username || pg.first_name} task assigned!`, [
        [
            { text: '⚠️ Stack', callback_data: `stack_${palletKey}` },
            { text: '🔙 Resign', callback_data: `resign_${palletKey}` }
        ]
    ]);
}

module.exports = {
    handleAccept
}

