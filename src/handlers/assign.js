const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');

const handleAssign = async (callbackQuery) => {
    const palletKey = callbackQuery.data.replace('assign_', '');
    const pg = storage.getPG();
    if (!pg || pg.username !== callbackQuery.from.username) {
        await sendAlert(callbackQuery, 'You are not the Priority Guy');
        return;
    }
    const groupMembers = process.env.GROUP_MEMBERS.split(',');
    const buttons = groupMembers.map(member => ([
        { 
            text: member, 
            callback_data: `assign_user_${member}_${palletKey}` },
    ]));
    const pallet = storage.getPalletByKey(palletKey);
    await editPalletMessage(palletKey, `👑 Assign ${pallet.articleName} to`, buttons);
}

module.exports = {
    handleAssign
}