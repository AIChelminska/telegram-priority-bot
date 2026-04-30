let knownPallets = [];

let messageIds = new Map();

let palletStates = new Map();

let pg = null;

const getKnownPallets = () => knownPallets;

const setKnownPallets = (pallets) => knownPallets = pallets;

const getMessageId = (palletKey) => messageIds.get(palletKey);

const saveMessageId = (palletKey, messageId) => messageIds.set(palletKey, messageId);

const getPalletState = (palletKey) => palletStates.get(palletKey);

const setPalletState = (palletKey, state, claimer = null) => palletStates.set(palletKey, { state, claimer });

const getPG = () => pg;

const setPG = (user) => pg = user;

module.exports = {
  getKnownPallets,
  setKnownPallets,
  getMessageId,
  saveMessageId,
  getPalletState,
  setPalletState,
  getPG,
  setPG
};