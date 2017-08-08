// @flow

import {getConfig, getPassword, storePassword} from './config'
import type {configType} from './config'

// Global variable that contains the password after it was given by the user
let masterPassword: string | null = null

// Returns a Promise that returns the master password.
// If the global varialbe masterPassword already contains the password, then
// the promise it resolved at once. If not, a pop up is opend for
// the user to type the password.
export const getMasterPassword = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (masterPassword === null) {
      // The masterPassword in not set.
      getPassword()
      .then((password: string|null) => {
        if (password !== null) {
          masterPassword = password
          resolve(masterPassword)
        } else {
          openPasswordInput()
          .then((password: string) => {
            masterPassword = password
            resolve(password)
          })
        }
      })
    } else {
      resolve(masterPassword)
    }
  })
}

// Type for the communication between the background_script and the password_input-popup.
// Currently the only message-type is "submit".
type passwordReceiverMessage = {
  action: 'submit',
  password: ?string,
}

// Opens a popup where the user can type the masterpassword.
// It returns a Promise that is resolved to the password
// When the user closes the window, it should reject the promise. Currently
// this does not work.
const openPasswordInput = (): Promise<string> => {
  const popupURL: string = browser.extension.getURL('ui/password_input.html')

  let config: configType

  // Open the popup
  return getConfig()
  .then(c => {
    config = c
    return browser.windows.create({
      url: popupURL,
      type: 'popup',
      height: 150,
      width: 400,
    })
  })
  .then(windowInfo => {
    // When the window is opend, check the windowInfo, that it has the right properties
    if (windowInfo.tabs == null) {
      throw new Error('windowInfo has no attribute tabs')
    }
    if (windowInfo.tabs[0].id == null) {
      throw new Error('windowInfo.tabs[0] has no attribute id')
    }

    // Get the tab id of the new window. It is the first tab in the new window
    const tabID: number = windowInfo.tabs[0].id

    // Return a promise that waits for the password.
    return new Promise((resolve) => {
      const passwordReceiver = (message: ?passwordReceiverMessage, sender) => {
        if (sender.tab == null) {
          throw new Error('Can not get the tab from the message receiver')
        }
        if (message == null) {
          throw new Error('Can not get the message from the receiver')
        }

        if (sender.tab.id === tabID) {
          // There was a message from the right tab.
          if (message.password == null) {
            throw new Error('Received a submit message without a password')
          }

          const password = message.password

          if (message.action === 'submit') {
            // We got the password, remove the listener
            browser.runtime.onMessage.removeListener(passwordReceiver)

            // Close the password window
            browser.tabs.remove(tabID)

            // Save the master password
            savePassword(config.save, password)

            // Resolve the Promise by "returning" the password
            resolve(password)
          }
        }
      }
      browser.runtime.onMessage.addListener(passwordReceiver)
    })
  })
}

// Saves the password acordingly to the settings.
const savePassword = (method: string, password: string) => {
  if (method === 'store') {
    storePassword(password)
    masterPassword = password
  } else if (method === 'session') {
    masterPassword = password
  }
}
