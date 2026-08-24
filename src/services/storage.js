let knownPallets = [];

let messageIds = new Map();

let palletStates = new Map();

let unblockedToday = 0;

let pg = null;

let groupMembers = new Map();

const getKnownPallets = () => knownPallets;

const setKnownPallets = (pallets) => knownPallets = pallets;

const getMessageId = (palletKey) => messageIds.get(palletKey);

const saveMessageId = (palletKey, messageId) => messageIds.set(palletKey, messageId);

const deleteMessageId = (palletKey) => messageIds.delete(palletKey);

const getPalletState = (palletKey) => palletStates.get(palletKey);

const setPalletState = (palletKey, state, claimer = null) => palletStates.set(palletKey, { state, claimer });

const deletePalletState = (palletKey) => palletStates.delete(palletKey);

const getPalletByKey = (palletKey) => knownPallets.find(pallet => pallet.key === palletKey);

const rememberUser = (user) => {
    if (!user) return;
    if (user.username) groupMembers.set(user.username.toLowerCase(), user);
    if (user.first_name) groupMembers.set(user.first_name.toLowerCase(), user);
};

const findUserByName = (name) => groupMembers.get(String(name).toLowerCase());

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
  rememberUser,
  findUserByName,
  getPG,
  setPG,
  getUnblockedToday,
  incrementUnblockedToday,
  resetUnblockedToday
};