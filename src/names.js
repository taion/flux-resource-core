import pascalCase from 'pascal-case';
import pluralize from 'pluralize';

export default function generateNames({name, plural}) {
  if (!name) {
    throw new Error('must specify name');
  }

  name = pascalCase(name);

  if (plural) {
    plural = pascalCase(plural);
  } else {
    plural = pluralize(name);
  }

  return {
    name,
    plural,
    getMany: `get${plural}`,
    getSingle: `get${name}`,
    postSingle: `post${name}`,
    putSingle: `put${name}`,
    patchSingle: `patch${name}`,
    deleteSingle: `delete${name}`
  };
}
