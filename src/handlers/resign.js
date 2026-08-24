const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');
const { updateDashboard } = require('./dashboard');

const handleResign = async (callbackQuery) => {
    const palletKey = callbackQuery.data.replace('resign_', '');
    const palletState = storage.getPalletState(palletKey);
    const claimer = palletState?.claimer?.toLowerCase();
    const userNames = [callbackQuery.from.username, callbackQuery.from.first_name]
        .filter(Boolean)
        .map(name => name.toLowerCase());
    const pg = storage.getPG();
    const isPG = pg && [pg.username, pg.first_name]
        .filter(Boolean)
        .some(name => userNames.includes(name.toLowerCase()));
    const isClaimer = claimer && userNames.includes(claimer);
    if (!isClaimer && !isPG) {
        await sendAlert(callbackQuery, 'You are not the claimant of this pallet');
        return;
    }
    await sendAlert(callbackQuery, '');
    storage.setPalletState(palletKey, 'unclaimed');
    const pallet = storage.getPalletByKey(palletKey);

    await editPalletMessage(palletKey, 
        `🚨 NEW BLOCKED PALLET\n\n${pallet.articleName}\nZone: ${pallet.zone}\nLocated at: ${pallet.stock}`,
        [[
            { text: '✋ Claim', callback_data: `claim_${palletKey}` },
            { text: '⚠️ Stack', callback_data: `stack_${palletKey}` },
            { text: '👑 Assign', callback_data: `assign_${palletKey}` }
        ]]
    );
    await updateDashboard();
}

module.exports = {
    handleResign
}