// @flow

export type configType = {
  save: "no" | "session" | "store",
  letters: string,
  length: number,
  iterations: number,
}

// Default config. This is used when the Addon is installed or when the user clicks
// on reset.
const defaults: configType = {
  save: 'session',
  letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  length: 16,
  iterations: 250000,
}

// Gets the config.
export const getConfig = (): Promise<configType> => {
  return browser.storage.local.get(defaults)
}

// Set the config.
export const setConfig = (config:Object): Promise<null> => {
  if (config.save !== 'store') {
    clearPassword()
  }
  return browser.storage.local.set(config)
}

// Set the config the the default values.
export const resetConfig = (): Promise<null> => {
  return setConfig(defaults)
}

// Stores the password into the local storage
export const storePassword = (password:string): Promise<null> => {
  return browser.storage.local.set({password})
}

// Gets the password from the local storage.
export const getPassword = (): Promise<string|null> => {
  return browser.storage.local.get({password: null})
  .then((keys: {password: string|null}) => {
    return Promise.resolve(keys.password)
  })
}

export const clearPassword = (): Promise<null> => {
  return browser.storage.local.remove('password')
}
