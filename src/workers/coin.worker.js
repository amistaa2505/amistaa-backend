const { Worker } = require("bullmq");
const walletService = require("../services/wallet.service");

const worker = new Worker("coinQueue", async (job) => {

    const { userId, amount } = job.data;

    await walletService.deductCoins(userId, amount, "call_charge");

});

