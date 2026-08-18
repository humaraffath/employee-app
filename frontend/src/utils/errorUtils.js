export function getErrorMessage(error, fallbackMessage) {
  const message =
    error.response?.data?.message ??
    error.response?.data?.error ??
    error.message ??
    fallbackMessage
  return message
}
