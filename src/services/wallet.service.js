const UserWallet = require("../models/user.wallet.model");
const CoinTransaction = require("../models/coin-transaction.model");


async function deductCoins(userId, amount, reason) {

    const wallet = await UserWallet.findOne({ userId });

    if (!wallet || wallet.coins < amount) {
        throw new Error("Insufficient coins");
    }

    wallet.coins -= amount;

    await wallet.save();

    await CoinTransaction.create({
        userId,
        amount: -amount,
        type: reason,
        balanceAfter: wallet.coins
    });

    return wallet.coins;

}


async function addCoins(userId, amount, reason) {

    const wallet = await UserWallet.findOne({ userId });

    wallet.coins += amount;

    await wallet.save();

    await CoinTransaction.create({
        userId,
        amount,
        type: reason,
        balanceAfter: wallet.coins
    });

}


module.exports = {
    deductCoins,
    addCoins
}



