export const checkIsExistAndAddFields = async (
  dbName: string,
  fieldName: Record<string, string>,
  fn: Function,
  existPayload: Record<string, unknown>
) => {
  const key = Object.keys(fieldName)[0];
  const value = fieldName[key];

  if (value) {
    const isExist = await fn(value);

    if (!isExist) {
      throw new Error(`Invalid ${key} name ${value}!`);
    } else {
      const photoURL = `${dbName}PhotoURL`;
      const moreAbout = `moreAbout${dbName
        .slice(0, 1)
        .toLocaleUpperCase()
        .concat(dbName.slice(1))}`;

      existPayload[dbName] = {
        [key]: value,
        [photoURL]: isExist[photoURL],
        [moreAbout]: isExist._id,
      };
    }
  }
};
