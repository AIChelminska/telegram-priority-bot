const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');

const handleResign = async (callbackQuery) => {
    const palletKey = callbackQuery.data.replace('resign_', '');
    const user = callbackQuery.from.username;
    const palletState = storage.getPalletState(palletKey);
    if(palletState?.claimer !== user) {
        await sendAlert(callbackQuery, 'You are not the claimant of this pallet');
        return;
    }
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
}

module.exports = {
    handleResign
}