// @flow

import {buildPassword} from './buildPassword'
import {getConfig} from './config'
import {translateHTML} from './utils'

// Get the required html-elements and make sure, they are there.
const passwordForm = document.getElementsByTagName('form')[0]
const passwordInput = document.getElementsByName('password')[0]
if (!(passwordInput instanceof HTMLInputElement)) {
  throw new Error('Can not find password element in html.')
}
const controlCode = document.getElementById('controlCode')
if (!(controlCode instanceof HTMLElement)) {
  throw new Error('Can not find controlCode element in html.')
}
const saveInfoElement = document.getElementById('saveInfo')
if (!(saveInfoElement instanceof HTMLElement)) {
  throw new Error('Can not find saveInfo element in html.')
}
const openOptionPage = document.getElementById('openOptionPage')
if (!(openOptionPage instanceof HTMLElement)) {
  throw new Error('Can not find openOptionPage element in html.')
}

// Values to generate the control value
const controlDomain = 'test'
const controlAlphabet = 'abcdefghijklmnopqrstuvwxyz'
const controlLength = 3
const controlInterations = 20000
const controlMinPasswordLength = 8

// Varialbe for the password typed in by the user.
let password: string = ''

// Send the password to the background_script, wehen the form is submitted
passwordForm.addEventListener('submit', (event) => {
  event.preventDefault()
  browser.runtime.sendMessage({
    'action': 'submit',
    'password': password,
  })
})

// Saves the password the user is typing to the variable password and generates
// the control code.
passwordInput.addEventListener('input', (event: Event) => {
  password = passwordInput.value
  if (password.length >= controlMinPasswordLength) {
    controlCode.textContent = buildPassword(password, controlDomain, controlAlphabet, controlLength, controlInterations)
  } else {
    controlCode.textContent = ''
  }
})

// Open the option Page when the user clicks on the link to change the way how the
// password is stored
openOptionPage.addEventListener('click', (event: Event) => {
  browser.runtime.openOptionsPage()
  window.close()
})

// Load the config and and inform the user who the password will be stored.
document.addEventListener('DOMContentLoaded', () => {
  translateHTML()
  getConfig()
  .then(config => {
    const infoText = {
      'no': browser.i18n.getMessage('informPasswordNotStored'),
      'session': browser.i18n.getMessage('informPasswordMemoryStored'),
      'store': browser.i18n.getMessage('informPasswordDiskStored'),
    }
    saveInfoElement.textContent = infoText[config.save].toString()
  })
})
