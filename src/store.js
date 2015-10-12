import stableStringify from 'json-stable-stringify';

function defaultGetId(item) {
  return item.id;
}

function defaultCollectionKey(options = {}) {
  return stableStringify(options);
}

function defaultItemKey(id) {
  return id;
}

export default function generateStore({
  getId = defaultGetId,
  collectionKey = defaultCollectionKey,
  itemKey = defaultItemKey
}) {
  const {methodNames} = this;

  return {
    getInitialState() {
      return {
        collections: {},
        items: {}
      };
    },

    getId,
    collectionKey,
    itemKey,

    [methodNames.getMany](options) {
      const collection =
        this.state.collections[this.collectionKey(options)];
      if (!collection) {
        return collection;
      }

      return collection.map(
        id => this.state.items[this.itemKey(id, options)]
      );
    },

    [methodNames.getSingle](id, options) {
      return this.state.items[this.itemKey(id, options)];
    },

    getManyDone(payload) {
      this.receiveMany(payload);
    },

    receiveMany({options, result}) {
      const resultIds = [];
      result.forEach(item => {
        const id = this.getId(item);
        resultIds.push(id);

        this.receiveSingle({id, options, result: item});
      });

      this.state.collections[this.collectionKey(options)] = resultIds;
    },

    getSingleDone(payload) {
      this.receiveSingle(payload);
    },

    receiveSingle({id, options, result}) {
      if (id === undefined) {
        id = this.getId(result);
      }

      this.state.items[this.itemKey(id, options)] = result;
    }
  };
}
