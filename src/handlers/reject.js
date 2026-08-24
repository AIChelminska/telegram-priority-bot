const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');
const { updateDashboard } = require('./dashboard');

const handleReject = async (callbackQuery) => {
    await sendAlert(callbackQuery, '');
    const reject = callbackQuery.data.replace('reject_', '');
    const separatorIndex = reject.indexOf('_');
    const member = reject.slice(0, separatorIndex);
    const palletKey = reject.slice(separatorIndex + 1);
    const pallet = storage.getPalletByKey(palletKey);
    const pg = storage.getPG();
    storage.setPalletState(palletKey, 'unclaimed');
    await editPalletMessage(palletKey, `❌ ${pallet.articleName} rejected\n@${pg.username || pg.first_name} task available!`,
        [[
            { text: '✋ Claim', callback_data: `claim_${palletKey}` },
            { text: '⚠️ Stack', callback_data: `stack_${palletKey}` },
            { text: '👑 Assign', callback_data: `assign_${palletKey}` }
        ]]
    );
    await updateDashboard();
}

module.exports = {
    handleReject
}