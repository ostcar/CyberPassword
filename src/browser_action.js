// @flow

import {translateHTML} from './lib/utils'

// Translate the document and update the status of the forget button, when the
// dom is loaded.
document.addEventListener('DOMContentLoaded', () => {
  translateHTML()
  updateForgetButton()
})

// Make sure the required html elements are present.
const forgetButton = document.getElementById('forget')
if (!(forgetButton instanceof HTMLButtonElement)) {
  throw new Error('Can not find forget button in html.')
}
const showButton = document.getElementById('show')
if (!(showButton instanceof HTMLButtonElement)) {
  throw new Error('Can not find show button in html.')
}
const passwordElement = document.getElementById('password')
if (!(passwordElement instanceof HTMLInputElement)) {
  throw new Error('Can not find password element in html.')
}

// Ask the background_script if the MasterPassword is in store.
const hasMasterPassword = (): Promise<bool> => {
  return browser.runtime.sendMessage({
    action: 'hasMasterPassword',
  })
}

// Update the disabled status of the forget button.
// The button is disabled, when the master passwort is not in storage
const updateForgetButton = () => {
  hasMasterPassword()
  .then(hasPassword => {
    if (hasPassword) {
      forgetButton.disabled = false
    } else {
      forgetButton.disabled = true
    }
  })
}

// Click event for the forget button to clear the MasterPassword
forgetButton.addEventListener('click', () => {
  browser.runtime.sendMessage({
    action: 'clearMasterPassword',
  })
  .then(() => {
    updateForgetButton()
  })
})

// Click event for the show button to show the password of the active Tab.
// The button has three diffrent states. The clickCount desides which is active.
let clickCount = 0
showButton.addEventListener('click', () => {
  clickCount++
  if (clickCount === 1) {
    // Ask the user if he is sure on the first click
    showButton.textContent = 'Are you sure?'
  } else if (clickCount === 2) {
    // Show the Password on the second click
    browser.runtime.sendMessage({
      action: 'showPassword',
    }).then((password: string) => {
      passwordElement.value = password
      passwordElement.style.display = 'block'
      showButton.textContent = 'clear'
    })
  } else {
    // Clear the shown password on the third click
    passwordElement.value = ''
    passwordElement.style.display = 'none'
    showButton.textContent = 'start...'
    clickCount = 0
  }
})
