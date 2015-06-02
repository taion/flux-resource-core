function formatParams(params) {
  if (!params) {
    return '';
  }

  const paramParts = Object.keys(params).map(
    key => `${encodeURI(key)}=${encodeURI(params[key])}`
  );
  return `?${paramParts.join('&')}`;
}

export default function generateApi(
  {fetch, methodNames},
  {
    urlTemplate,
    preprocessors = [],
    postprocessors = []
  }
) {
  function doFetch(method, {id, data, options = {}}) {
    const {params, requestOptions} = options;
    const url = urlTemplate(id) + formatParams(params);

    let request = {method, data};
    preprocessors.forEach(function applyPreprocessor(preprocessor) {
      request = preprocessor(request, requestOptions) || request;
    });

    let result = this::fetch(url, request);
    postprocessors.forEach(function applyPostprocessor(postprocessor) {
      result = result.then(response => postprocessor(response) || response);
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
