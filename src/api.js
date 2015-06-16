function defaultFormatQueryString({params} = {}) {
  if (!params) {
    return null;
  }

  const queryStringParts = Object.keys(params).map(
    key => `${encodeURI(key)}=${encodeURI(params[key])}`
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
    const queryString = formatQueryString(options);
    const url = queryString ? `${urlBase}?${queryString}` : urlBase;

    let request = {method, data};
    preprocessors.forEach(function applyPreprocessor(preprocessor) {
      request = preprocessor(request, options) || request;
    });

    let result = this::fetch(url, request);
    postprocessors.forEach(function applyPostprocessor(postprocessor) {
      result = result.then(
        response => postprocessor(response, options) || response
      );
    });

    return result;
  }

  return {
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
