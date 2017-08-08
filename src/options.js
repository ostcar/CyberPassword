// @flow

import {getConfig, setConfig, resetConfig} from './lib/config'
import {translateHTML} from './lib/utils'

// Get the required html-elements and make sure, they are there.
const optionForm = document.getElementsByTagName('form')[0]
const saveMethodElement = document.getElementById('saveMethod')
if (!(saveMethodElement instanceof HTMLSelectElement)) {
  throw new Error('Can not find saveMethod element in html.')
}
const lettersElement = document.getElementById('letters')
if (!(lettersElement instanceof HTMLInputElement)) {
  throw new Error('Can not find letters element in html.')
}
const lengthElement = document.getElementById('length')
if (!(lengthElement instanceof HTMLInputElement)) {
  throw new Error('Can not find length element in html.')
}
const resetButton = document.getElementById('reset')
if (!(resetButton instanceof HTMLButtonElement)) {
  throw new Error('Can not find resetButton element in html.')
}

// Function to set the form elements to the values from the settings.
const restoreOptions = () => {
  getConfig().then(keys => {
    saveMethodElement.value = keys.save
    lettersElement.value = keys.letters
    lengthElement.value = keys.length.toString()
  })
}

// When someone clicks the reset button, => reset the config.
resetButton.addEventListener('click', (event: MouseEvent) => {
  event.preventDefault()
  resetConfig().then(restoreOptions())
})

// when someone submits the form, then same the values.
optionForm.addEventListener('submit', (event) => {
  event.preventDefault()
  setConfig({
    save: saveMethodElement.value,
    letters: lettersElement.value,
    length: parseInt(lengthElement.value),
  })
})

// Set the form elements and translat the page when the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  restoreOptions()
  translateHTML()
})
