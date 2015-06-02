import stableStringify from 'json-stable-stringify';

function defaultGetId(item) {
  return item.id;
}

function defaultCollectionCacheKey({params = {}} = {}) {
  return stableStringify(params);
}

function defaultItemCacheKey(id) {
  return id;
}

export default function generateStore(
  {
    getId = defaultGetId,
    collectionCacheKey = defaultCollectionCacheKey,
    itemCacheKey = defaultItemCacheKey
  }
) {
  const {methodNames} = this;

  return {
    resetCache() {
      this.collections = {};
      this.items = {};
    },

    getId,
    collectionCacheKey,
    itemCacheKey,

    [methodNames.getMany](options) {
      const collection = this.collections[this.collectionCacheKey(options)];
      if (!collection) {
        return collection;
      }

      return collection.map(id => this.items[this.itemCacheKey(id, options)]);
    },

    [methodNames.getSingle](id, options) {
      return this.items[this.itemCacheKey(id, options)];
    },

    receiveMany({options, result}) {
      const resultIds = [];
      this.collections[this.collectionCacheKey(options)] = resultIds;

      result.forEach(item => {
        const id = this.getId(item);

        resultIds.push(id);
        this.items[this.itemCacheKey(id, options)] = item;
      });
    },

    receiveSingle({id, options, result}) {
      this.items[this.itemCacheKey(id, options)] = result;
    }
  };
}
