const storage = require('../services/storage');
const { editPalletMessage, sendAlert } = require('../services/telegram');

const handleAssign = async (callbackQuery) => {
    const palletKey = callbackQuery.data.replace('assign_', '');
    const pg = storage.getPG();
    if (!pg || (pg.username || pg.first_name) !== (callbackQuery.from.username || callbackQuery.from.first_name)) {
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

const handleAssignUser = async (callbackQuery) => {
    const rest = callbackQuery.data.replace('assign_user_', '');
    const separatorIndex = rest.indexOf('_');
    const member = rest.slice(0, separatorIndex);
    const palletKey = rest.slice(separatorIndex + 1);
    const pallet = storage.getPalletByKey(palletKey);
    await editPalletMessage(palletKey, `👑 ${pallet.articleName} assigned to @${member}`, [
        [
            { text: '✅ Accept', callback_data: `accept_${member}_${palletKey}` },
            { text: '❌ Reject', callback_data: `reject_${member}_${palletKey}` }
        ]]);
}


module.exports = {
    handleAssign,
    handleAssignUser
}