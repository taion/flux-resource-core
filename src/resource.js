import generateActions from './actions';
import generateApi from './api';
import generateNames from './names';
import generateStore from './store';

/**
 * Base Flux resource class
 *
 * This isn't very useful by itself. Use the bindings for an actual Flux
 * framework.
 */
export default class FluxResource {
  constructor(options) {
    Object.assign(this, this.generateNames(options));

    this.fetch = this.getFetch(options);

    this.api = this.generateApi(options);
    this.actions = this.generateActions(options);
    this.store = this.generateStore(options);

    this.assignObject('Api', this.api);
    this.assignObject('Actions', this.actions);
    this.assignObject('Store', this.store);
  }

  generateNames(options) {
    return this::generateNames(options);
  }

  getFetch() {
    throw new Error('not implemented');
  }

  generateApi(options) {
    return this::generateApi(options);
  }

  generateDispatch() {
    throw new Error('not implemented');
  }

  generateActions(options) {
    return this::generateActions(options);
  }

  generateStore(options) {
    return this::generateStore(options);
  }

  assignObject(suffix, object) {
    const objectName = `${this.name}${suffix}`;

    object.displayName = objectName;
    this[objectName] = object;
  }
}
