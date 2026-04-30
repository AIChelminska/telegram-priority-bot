const storage = require('../services/storage');
const { editPalletMessage } = require('../services/telegram');

const handleClaim = async (callbackQuery) => {
    const claimer = callbackQuery.from.username;
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