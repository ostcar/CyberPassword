// @flow
import {buildPassword} from './lib/buildPassword'
import {secondLevelDomain} from './lib/utils'
import {getMasterPassword, clearMasterPassword, hasMasterPassword} from './lib/masterPassword'
import {getConfig} from './lib/config'

// Build the password for a domain.
// Returns a promise with the password
const buildPasswordForDomain = (domain: string): Promise<string> => {
  let masterPassword: string = ''

  // Get the masterPassword, this returns a promise with the password
  return getMasterPassword()
  .then(mp => {
    // Remember the password and receive the config.
    if (mp === null) {
      throw new Error('Can not read Masterpassword')
    }
    masterPassword = mp
    return getConfig()
  })
  .then(config => {
    // Build the password for the domain.
    return Promise.resolve(buildPassword(
      masterPassword,
      domain,
      config.letters,
      config.length,
      config.iterations,
    ))
  })
}

//  Add a menu entry for password form fields.
browser.contextMenus.create({
  id: 'insertPassword',
  title: browser.i18n.getMessage('insertPassword'),
  contexts: ['password'],
})

// The following function in called, when the user clicks on the menu entry.
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'insertPassword':
      if (tab == null) {
        throw new Error('Missing tab argument on contextMenu listener')
      }
      if (tab.url == null) {
        throw new Error('Missing url property on tab argument on contextMenu listener')
      }
      if (tab.id == null) {
        throw new Error('Missing id property on tab argument on contextMenu listener')
      }
      const tabId = tab.id

      buildPasswordForDomain(secondLevelDomain(tab.url))
      .then(password => {
        // Inject some JS-Code inside the page to insert the password.
        browser.tabs.executeScript(
          tabId,
          {
            // TODO: Use frameID
            'code': `document.activeElement.value = "${password}"`,
          }
        )
      })
  }
})

// Listen for messages from the browser_action
browser.runtime.onMessage.addListener((message:?Object, sender) => {
  if (message == null) {
    return
  }
  switch (message.action) {
    case 'hasMasterPassword':
      if (sender.id !== browser.runtime.id) {
        throw new Error('getMasterPassword can only be called from CyberPassword')
      }
      return hasMasterPassword()
    case 'clearMasterPassword':
      return clearMasterPassword()

    case 'showPassword':
      return browser.tabs.query({active: true, currentWindow: true})
      .then(tabs => {
        const activeTab = tabs[0]
        if (activeTab == null) {
          throw new Error('Can not find the active tab')
        }
        if (activeTab.url == null) {
          throw new Error('Can not get url from active tab')
        }

        return Promise.resolve(buildPasswordForDomain(secondLevelDomain(activeTab.url)))
      })
  }
})
