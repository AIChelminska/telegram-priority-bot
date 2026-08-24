let knownPallets = [];

let messageIds = new Map();

let palletStates = new Map();

let unblockedToday = 0;

let pg = null;

const getKnownPallets = () => knownPallets;

const setKnownPallets = (pallets) => knownPallets = pallets;

const getMessageId = (palletKey) => messageIds.get(palletKey);

const saveMessageId = (palletKey, messageId) => messageIds.set(palletKey, messageId);

const deleteMessageId = (palletKey) => messageIds.delete(palletKey);

const getPalletState = (palletKey) => palletStates.get(palletKey);

const setPalletState = (palletKey, state, claimer = null) => palletStates.set(palletKey, { state, claimer });

const deletePalletState = (palletKey) => palletStates.delete(palletKey);

const getPalletByKey = (palletKey) => knownPallets.find(pallet => pallet.key === palletKey);

const getPG = () => pg;

const setPG = (user) => pg = user;

const getUnblockedToday = () => unblockedToday;

const incrementUnblockedToday = () => unblockedToday++;

const resetUnblockedToday = () => unblockedToday = 0;

module.exports = {
  getKnownPallets,
  setKnownPallets,
  getMessageId,
  saveMessageId,
  deleteMessageId,
  getPalletState,
  setPalletState,
  deletePalletState,
  getPalletByKey,
  getPG,
  setPG,
  getUnblockedToday,
  incrementUnblockedToday,
  resetUnblockedToday
};