const Command = require('./command');
const statuses = require('./commandStatuses');

module.exports = class CommandsQueue {

  constructor () {
    this.__queue = new Map();
  }

  get(uuid) {
    return this.__queue.get(uuid);
  }

  all (status = null, limit = 0) {
    const all = [];
    for (const [key, command] of this.__queue) {
      if (!status || command.status === status) {
        all.push(command.render());
      }
      if ((all.length - limit) === 0) {
        return all;
      }
    }
    return all;
  }

  clear () {
    this.__queue.clear();
    return this.all();
  }

  add (data) {
    const command = new Command(data);
    this.__queue.set(command.uuid, command);
    return command.render();
  }

  inQueue (uuid) {
    this.__queue.get(uuid).status = statuses.STATUS_IN_QUEUE;
  }

  process (uuid) {
    this.__queue.get(uuid).status = statuses.STATUS_PROCESSING;
  }

  processed (uuid, result) {
    this.__queue.get(uuid).result = result;
    this.__queue.get(uuid).status = statuses.STATUS_FINISHED;
  }

  getAllowedStatuses () {
    return {...statuses};
  }

};