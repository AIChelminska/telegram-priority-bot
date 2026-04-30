const telegramToken = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const storage = require('./storage');

const bot = new TelegramBot(telegramToken);
const groupId = process.env.TELEGRAM_GROUP_ID;

const sendNewPalletNotification = async (pallet) => {
    const msg = `🚨 NEW BLOCKED PALLET\n\n${pallet.articleName}\nZone: ${pallet.zone}\nLocated at: ${pallet.stock}`;
    
    const message = await bot.sendMessage(groupId, msg, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '✋ Claim', callback_data: `claim_${pallet.key}` },
                    { text: '⚠️ Stack', callback_data: `stack_${pallet.key}` },
                    { text: '👑 Assign', callback_data: `assign_${pallet.key}` }
                ]
            ]
        }
    });

    storage.saveMessageId(pallet.key, message.message_id);
}

const sendPalletUnblockedNotification = async (pallet) => {
    const messageId = storage.getMessageId(pallet.key);
    if (!messageId) return;

    await bot.editMessageText(
        `✅ PALLET UNBLOCKED\n\n${pallet.articleName}\nLocated at: ${pallet.stock}`,
        {
            chat_id: groupId,
            message_id: messageId,
            reply_markup: { inline_keyboard: [] }
        }
    );
}

const editPalletMessage = async (palletKey, text, buttons) => {
    const messageId = storage.getMessageId(palletKey);
    if (!messageId) return;

    await bot.editMessageText(text, {
        chat_id: groupId,
        message_id: messageId,
        reply_markup: { inline_keyboard: buttons }
    });
}


module.exports = {
    sendNewPalletNotification,
    sendPalletUnblockedNotification,
    editPalletMessage
}