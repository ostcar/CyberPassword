// @flow
import {buildPassword} from './lib/buildPassword'
import {secondLevelDomain} from './lib/utils'
import {getMasterPassword} from './lib/masterPassword'
import {getConfig} from './lib/config'

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
      let masterPassword: string = ''

      // Get the masterPassword, this returns a promise with the password
      getMasterPassword()
      .then(mp => {
        // Remember the password and receive the config.
        masterPassword = mp
        return getConfig()
      })
      .then(config => {
        if (tab == null) {
          throw new Error('Missing tab argument on contextMenu listener')
        }
        if (tab.url == null) {
          throw new Error('Missing url property on tab argument on contextMenu listener')
        }

        // Build the password for the page from the master password the
        // second level domain and the config.
        let password = buildPassword(
          masterPassword,
          secondLevelDomain(tab.url),
          config.letters,
          config.length,
          config.iterations,
        )

        if (tab.id == null) {
          throw new Error('Missing id property on tab argument on contextMenu listener')
        }

        // Inject some JS-Code inside the page to insert the password.
        browser.tabs.executeScript(
          tab.id,
          {
            // TODO: Use frameID
            'code': `document.activeElement.value = "${password}"`,
          }
        )
      })
  }
})
