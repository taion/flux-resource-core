import {methods} from './config';

export default function generateActions(
  {generateDispatch, api, methodNames}
) {
  const dispatches = {};
  methods.forEach(function generateMethodDispatches(method) {
    dispatches[method] = {
      starting: generateDispatch(method),
      done: generateDispatch(method, 'Done'),
      failed: generateDispatch(method, 'Failed')
    };
  });

  function doAction(method, argsObject, args) {
    const dispatch = dispatches[method];
    this::dispatch.starting(argsObject);

    return api[methodNames[method]](...args)
      .catch(error => this::dispatch.failed({error, ...argsObject}))
      .then(result => this::dispatch.done({result, ...argsObject}));
  }

  return {
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
