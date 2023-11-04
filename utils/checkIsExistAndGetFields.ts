export const checkIsExistAndGetFields = async (
  fieldName: string,
  fn: Function,
  existPayload: Record<string, unknown>
) => {
  if (fieldName) {
    const isExist = await fn(fieldName);
    if (!isExist) {
      throw new Error(`Invalid ${[fieldName]} name ${fieldName}!`);
    } else {
      existPayload.store = {
        [fieldName]: fieldName,
        storePhotoURL: isExist.storePhotoURL,
        moreAboutStore: isExist._id,
      };
    }
  }
};
