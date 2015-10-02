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

  function doFetch(method, {id, data, options}) {
    const urlBase = urlFunc(id || '');
    const queryString = this.formatQueryString(options);
    const url = queryString ? `${urlBase}?${queryString}` : urlBase;

    const processorOptions = {id, ...options};

    let request = {method, body: data};
    preprocessors.forEach(preprocessor => {
      const newRequest = this::preprocessor(request, processorOptions);
      if (newRequest !== undefined) {
        request = newRequest;
      }
    });

    let result = this::fetch(url, request);
    postprocessors.forEach(postprocessor => {
      result = result.then(response => {
        const newResponse = this::postprocessor(response, processorOptions);
        return newResponse !== undefined ? newResponse : response;
      });
    });

    return result;
  }

  return {
    formatQueryString,

    [methodNames.getMany](options) {
      return this::doFetch('GET', {options});
    },

    [methodNames.getSingle](id, options) {
      return this::doFetch('GET', {id, options});
    },

    [methodNames.postSingle](data, options) {
      return this::doFetch('POST', {data, options});
    },

    [methodNames.putSingle](id, data, options) {
      return this::doFetch('PUT', {id, data, options});
    },

    [methodNames.patchSingle](id, data, options) {
      return this::doFetch('PATCH', {id, data, options});
    },

    [methodNames.deleteSingle](id, options) {
      return this::doFetch('DELETE', {id, options});
    }
  };
}
