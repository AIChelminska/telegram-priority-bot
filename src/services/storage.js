let knownPallets = [];
let messageIds = new Map();
let palletStates = new Map();

const getKnownPallets = () => knownPallets;

const setKnownPallets = (pallets) => knownPallets = pallets;

const getMessageId = (palletKey) => messageIds.get(palletKey);

const saveMessageId = (palletKey, messageId) => messageIds.set(palletKey, messageId);

const getPalletState = (palletKey) => palletStates.get(palletKey);