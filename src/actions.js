import {METHODS} from './config';

export default function generateActions() {
  const {methodNames} = this;

  const dispatches = {};
  METHODS.forEach(method => {
    dispatches[method] = {
      starting: this.generateDispatch(method, 'starting'),
      done: this.generateDispatch(method, 'done'),
      failed: this.generateDispatch(method, 'failed')
    };
  });

  function doAction(method, argsObject, args) {
    const dispatch = dispatches[method];
    this::dispatch.starting(argsObject);

    return this.getApi()[methodNames[method]](...args)
      .then(
        result => {
          this::dispatch.done({result, ...argsObject});
          return result;
        },
        error => {
          this::dispatch.failed({error, ...argsObject});
          throw error;
        }
      );
  }

  return {
    getApi() {
      throw new Error('not implemented');
    },

    [methodNames.getMany](options) {
      return this::doAction('getMany', {options}, arguments);
    },

    [methodNames.getSingle](id, options) {
      return this::doAction('getSingle', {id, options}, arguments);
    },

    [methodNames.postSingle](data, options) {
      return this::doAction('postSingle', {data, options}, arguments);
    },

    [methodNames.putSingle](id, data, options) {
      return this::doAction('putSingle', {id, data, options}, arguments);
    },

    [methodNames.patchSingle](id, data, options) {
      return this::doAction('patchSingle', {id, data, options}, arguments);
    },

    [methodNames.deleteSingle](id, options) {
      return this::doAction('deleteSingle', {id, options}, arguments);
    }
  };
}
