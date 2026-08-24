const telegramToken = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const storage = require('./storage');

const bot = new TelegramBot(telegramToken);
const groupId = process.env.TELEGRAM_GROUP_ID;

const sendNewPalletNotification = async (pallet) => {
    const msg = `🚨 NEW BLOCKED PALLET\n\n${pallet.articleName}\nZone: ${pallet.zone}\nLocated at: ${pallet.stock}`;

    try {
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
    } catch (err) {
        console.error('[telegram] sendNewPalletNotification error:', err.message);
    }
}

const sendPalletUnblockedNotification = async (pallet) => {
    const messageId = storage.getMessageId(pallet.key);
    if (!messageId) return;

    try {
        await bot.editMessageText(
            `✅ PALLET UNBLOCKED\n\n${pallet.articleName}\nLocated at: ${pallet.stock}`,
            {
                chat_id: groupId,
                message_id: messageId,
                reply_markup: { inline_keyboard: [] }
            }
        );
    } catch (err) {
        console.error('[telegram] sendPalletUnblockedNotification error:', err.message);
    }
}

const editPalletMessage = async (palletKey, text, buttons) => {
    const messageId = storage.getMessageId(palletKey);
    if (!messageId) return;

    try {
        await bot.editMessageText(text, {
            chat_id: groupId,
            message_id: messageId,
            reply_markup: { inline_keyboard: buttons }
        });
    } catch (err) {
        console.error('[telegram] editPalletMessage error:', err.message);
    }
}

const sendAlert = async (callbackQuery, text) => {
    try {
        await bot.answerCallbackQuery(callbackQuery.id, { text, show_alert: Boolean(text) });
    } catch (err) {
        console.error('[telegram] sendAlert error:', err.message);
    }
}

const pinDashboard = async (messageId) => {
    try {
        await bot.pinChatMessage(groupId, messageId);
    } catch (err) {
        console.error('[telegram] pinDashboard error:', err.message);
    }
}

const sendDashboardMessage = async (text) => {
    try {
        const message = await bot.sendMessage(groupId, text, {
            reply_markup: {
                inline_keyboard: [[
                    { text: '👑 Become PG', callback_data: 'become_pg' }
                ]]
            }
        });
        return message.message_id;
    } catch (err) {
        console.error('[telegram] sendDashboardMessage error:', err.message);
        return null;
    }
}

const editDashboardMessage = async (messageId, text) => {
    if (!messageId) return;
    try {
        await bot.editMessageText(text, {
            chat_id: groupId,
            message_id: messageId,
            reply_markup: { inline_keyboard: [[{ text: '👑 Become PG', callback_data: 'become_pg' }]] }
        });
    } catch (err) {
        if (!err.message.includes('message is not modified')) {
            console.error('[telegram] editDashboardMessage error:', err.message);
        }
    }
}

module.exports = {
    sendNewPalletNotification,
    sendPalletUnblockedNotification,
    editPalletMessage,
    sendAlert,
    pinDashboard,
    sendDashboardMessage,
    editDashboardMessage
}