const express = require('express');
const storage = require('./storage');

const mapRow = (row) => ({
    key: String(row.articleId),
    articleName: String(row.articleName),
    zone: String(row.zone),
    stock: String(row.stock),
});

const isValidRow = (row) => {
    return row.articleId && row.articleName && row.zone && row.stock;
};

const processData = (rows) => {
    const validRows = rows.filter(isValidRow);
    const currentPallets = validRows.map(mapRow);
    
    const previousPallets = storage.getKnownPallets();
    const previousKeys = previousPallets.map(p => p.key);
    const currentKeys = currentPallets.map(p => p.key);

    const newPallets = currentPallets.filter(p => !previousKeys.includes(p.key));
    const resolvedPallets = previousPallets.filter(p => !currentKeys.includes(p.key));

    storage.setKnownPallets(currentPallets);

    return {
        newPallets,
        resolvedPallets
    };
}

const createRouter = (onData) => {
    const router = express.Router();

    router.post('/', (req, res) => {
        const rows = req.body.rows;
        const { newPallets, resolvedPallets } = processData(rows);
        onData(newPallets, resolvedPallets);
        res.json({
            received: rows.length,
            new: newPallets.length,
            resolved: resolvedPallets.length
        });
    });

    return router;
}

module.exports = {
    processData,
    createRouter
};