const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');

const handleClaim = async (callbackQuery) => {
    await sendAlert(callbackQuery, '');
    const claimer = callbackQuery.from.username || callbackQuery.from.first_name;
    const palletKey = callbackQuery.data.replace('claim_', '');
    storage.setPalletState(palletKey, 'claimed', claimer);
    const pallet = storage.getPalletByKey(palletKey);
    await editPalletMessage(palletKey, `✋ ${pallet.articleName} claimed by ${claimer}`, 
    [
        [
            { text: '⚠️ Stack', callback_data: `stack_${palletKey}` },
            { text: '🔙 Resign', callback_data: `resign_${palletKey}` }
        ]
    ]);
}

module.exports = {
    handleClaim
}