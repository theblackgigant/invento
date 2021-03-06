const Entry = require("./entrySchema")();
const User = require("./userSchema")();
const Category = require("./categorySchema")();
const Action = require("./actionSchema")();
const Device = require("./deviceSchema")();
const Role = require("./roleSchema")();
const Queue = require("./queueSchema")();
const Room = require("./roomSchema")();

const dbTypes = {
  entry: Entry,
  user: User,
  category: Category,
  action: Action,
  device: Device,
  role: Role,
  queue: Queue,
  room: Room,
};

module.exports = dbTypes;
