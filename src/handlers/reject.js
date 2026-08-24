const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');
const { updateDashboard } = require('./dashboard');

const handleReject = async (callbackQuery) => {
    const reject = callbackQuery.data.replace('reject_', '');
    const separatorIndex = reject.indexOf('_');
    const member = reject.slice(0, separatorIndex);
    const palletKey = reject.slice(separatorIndex + 1);
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
    storage.setPalletState(palletKey, 'unclaimed');
    await editPalletMessage(palletKey, `❌ ${pallet.articleName} rejected\n\nZone: ${pallet.zone}\nLocated at: ${pallet.stock}\n\n@${pg.username || pg.first_name} task available!`,
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