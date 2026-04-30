const storage = require('../services/storage');
const { editPalletMessage } = require('../services/telegram');

const handleStacked = async (callbackQuery) => {
    const palletKey = callbackQuery.data.replace('stack_', '');
    storage.setPalletState(palletKey, 'stacked');
    const pallet = storage.getPalletByKey(palletKey);
    await editPalletMessage(palletKey, `⚠️ ${pallet.articleName} stacked, located at ${pallet.stock}`, 
    [
        [
            { text: '🔓 Unstack', callback_data: `unstack_${palletKey}` }
        ]
    ]);
}

module.exports = {
    handleStacked
}