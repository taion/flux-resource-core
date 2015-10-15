function defaultFormatQueryString(options) {
  if (!options) {
    return null;
  }

  const queryStringParts = Object.keys(options).map(
    key => `${encodeURI(key)}=${encodeURI(options[key])}`
  );
  return queryStringParts.join('&');
}

export default function generateApi(
  {
    urlFunc,
    formatQueryString = defaultFormatQueryString,
    preprocessors = [],
    postprocessors = []
  }
) {
  const {fetch, methodNames} = this;

  return {
    formatQueryString,

    execute(method, {url, id, data, options}) {
      const urlBase = url || urlFunc(id || '');
      const queryString = this.formatQueryString(options);
      const urlFull = queryString ? `${urlBase}?${queryString}` : urlBase;

      const processorOptions = {id, ...options};

      let request = {method, body: data};
      preprocessors.forEach(preprocessor => {
        const newRequest = this::preprocessor(request, processorOptions);
        if (newRequest !== undefined) {
          request = newRequest;
        }
      });

      let result = this::fetch(urlFull, request);
      postprocessors.forEach(postprocessor => {
        result = result.then(response => {
          const newResponse = this::postprocessor(response, processorOptions);
          return newResponse !== undefined ? newResponse : response;
        });
      });

      return result;
    },

    [methodNames.getMany](options) {
      return this.execute('GET', {options});
    },

    [methodNames.getSingle](id, options) {
      return this.execute('GET', {id, options});
    },

    [methodNames.postSingle](data, options) {
      return this.execute('POST', {data, options});
    },

    [methodNames.putSingle](id, data, options) {
      return this.execute('PUT', {id, data, options});
    },

    [methodNames.patchSingle](id, data, options) {
      return this.execute('PATCH', {id, data, options});
    },

    [methodNames.deleteSingle](id, options) {
      return this.execute('DELETE', {id, options});
    }
  };
}
