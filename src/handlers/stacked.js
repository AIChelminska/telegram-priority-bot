const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');
const { updateDashboard } = require('./dashboard');

const handleStacked = async (callbackQuery) => {
    await sendAlert(callbackQuery, '');
    const palletKey = callbackQuery.data.replace('stack_', '');
    storage.setPalletState(palletKey, 'stacked');
    const pallet = storage.getPalletByKey(palletKey);
    await editPalletMessage(palletKey, `⚠️ ${pallet.articleName} stacked, located at ${pallet.stock}`, 
    [
        [
            { text: '🔓 Unstack', callback_data: `unstack_${palletKey}` }
        ]
    ]);
    await updateDashboard();
}

module.exports = {
    handleStacked
}