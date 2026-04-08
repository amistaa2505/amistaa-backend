const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const User = require("../models/user.model");
const UserProfile = require("../models/user.profile.model");
const UserWallet = require("../models/user.wallet.model");
const UserLoginLog = require("../models/user.login-log.model");
const UserDevice = require("../models/user.device.model");
const UserBlock = require("../models/block.model");


const admin = new AdminJS({
  resources: [
    { resource: User },
    { resource: UserProfile },
    { resource: UserWallet },
    { resource: UserLoginLog },
    { resource: UserDevice },
    { resource: UserBlock },
  ],
  rootPath: "/admin",
});

const router = AdminJSExpress.buildRouter(admin);

module.exports = { admin, router };