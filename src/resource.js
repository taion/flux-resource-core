import generateActions from 'actions';
import generateApi from 'api';
import generateNames from 'names';
import generateStore from 'store';

/**
 * Base Flux resource class
 *
 * This isn't very useful by itself. Use the bindings for an actual Flux
 * framework.
 */
export default class FluxResource {
  constructor(options) {
    const {name, methodNames} = this.generateNames(options);
    this.name = name;
    this.methodNames = methodNames;

    const fetch = this.getFetch();
    const generateDispatch = this.getGenerateDispatch();

    const api = this.generateApi(
      {fetch, methodNames}, options
    );
    const actions = this.generateActions(
      {generateDispatch, api, methodNames}, options
    );
    const store = this.generateStore(
      {methodNames}, options
    );

    this.assignObject('Api', api);
    this.assignObject('Actions', actions);
    this.assignObject('Store', store);
  }

  getFetch() {
    throw new Error('not implemented');
  }

  getGenerateDispatch() {
    throw new Error('not implemented');
  }

  assignObject(suffix, object) {
    const objectName = `${this.name}${suffix}`;

    Object.defineProperty(object, 'name', {value: objectName});
    this[objectName] = object;
  }
}

Object.assign(
  FluxResource.prototype,
  {generateActions, generateApi, generateNames, generateStore}
);
