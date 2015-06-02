import stableStringify from 'json-stable-stringify';

function defaultGetId(item) {
  return item.id;
}

function defaultCollectionCacheKey(options) {
  return stableStringify(options);
}

function defaultItemCacheKey(id) {
  return id;
}

export default function generateStore(
  {methodNames},
  {
    getId = defaultGetId,
    collectionCacheKey = defaultCollectionCacheKey,
    itemCacheKey = defaultItemCacheKey
  }
) {
  return {
    initStorage() {
      this.collections = {};
      this.items = {};
    },

    [methodNames.getMany](options) {
      const collection = this.collections[collectionCacheKey(options)];
      if (!collection) {
        return collection;
      }

      return collection.map(id => this.items[itemCacheKey(id, options)]);
    },

    [methodNames.getSingle](id, options) {
      return this.items[itemCacheKey(id, options)];
    },

    clearCache() {
      this.initStorage();
    },

    receiveMany({options, result}) {
      const resultIds = [];
      this.collections[collectionCacheKey(options)] = resultIds;

      result.forEach(item => {
        const id = getId(item);

        resultIds.push(id);
        this.items[itemCacheKey(id, options)] = item;
      });
    },

    receiveSingle({id, options, result}) {
      this.items[itemCacheKey(id, options)] = result;
    }
  };
}
