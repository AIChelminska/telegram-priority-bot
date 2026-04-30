const storage = require('../services/storage');
const { editPalletMessage } = require('../services/telegram');

const handleUnstacked = async (callbackQuery) => {
    const palletKey = callbackQuery.data.replace('unstack_', '');
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
    handleUnstacked
}