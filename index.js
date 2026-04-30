const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const receiver = require('./src/services/receiver');
const telegram = require('./src/services/telegram');
const claimHandler = require('./src/handlers/claim');
const resignHandler = require('./src/handlers/resign');
const stackedHandler = require('./src/handlers/stacked');
const unstackedHandler = require('./src/handlers/unstacked');

const app = express();

app.use(express.json());

const onData = ({ newPallets, resolvedPallets }) => {
    newPallets.forEach(pallet => telegram.sendNewPalletNotification(pallet));
    resolvedPallets.forEach(pallet => telegram.sendPalletUnblockedNotification(pallet));
};

app.use('/receive', receiver.createRouter(onData));

app.post('/webhook', (req, res) => {
    const { callback_query } = req.body;
    if (!callback_query) return res.sendStatus(200);

    const data = callback_query.data;

    if (data.startsWith('claim_')) claimHandler.handleClaim(callback_query);
    else if (data.startsWith('resign_')) resignHandler.handleResign(callback_query);
    else if (data.startsWith('stack_')) stackedHandler.handleStacked(callback_query);
    else if (data.startsWith('unstack_')) unstackedHandler.handleUnstacked(callback_query);

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



