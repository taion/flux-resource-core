import pluralize from 'pluralize';
import upperCaseFirst from 'upper-case-first';

export default function generateNames({name, plural}) {
  if (!name) {
    throw new Error('must specify name');
  }

  const properName = upperCaseFirst(name);
  const properPlural = upperCaseFirst(plural || pluralize(name));

  if (properPlural === properName) {
    throw new Error('plural and singular names must be different');
  }

  return {
    name: properName,
    plural: properPlural,

    methodNames: {
      getMany: `get${properPlural}`,
      getSingle: `get${properName}`,
      postSingle: `post${properName}`,
      putSingle: `put${properName}`,
      patchSingle: `patch${properName}`,
      deleteSingle: `delete${properName}`
    }
  };
}
