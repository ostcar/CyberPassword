// @flow

// The argument is a full url. The function returns the last two elements of the
// domain.
export const secondLevelDomain = (url:string): string => {
  let u = new URL(url)
  if (u.protocol === 'file:') {
    return 'file'
  }
  return u.hostname.split('.').slice(-2).join('.')
}

export const translateHTML = (): void => {
  const elements = document.querySelectorAll('[data-i18n]')
  for (const element of elements) {
    const message = element.getAttribute('data-i18n')
    if (message == null) {
      throw new Error('invalid attribute data-i18n on element ' + element.nodeName)
    }
    element.textContent = browser.i18n.getMessage(message)
  }
}
