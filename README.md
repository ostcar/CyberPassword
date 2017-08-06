# CyberPassword

CyberPassword is a password manager for Firefox. It does not save your passwords
at all. It calculates a password for each domain using a given masterpassword
and the secend leven domain of the current page.


## Build from the source

The source of the addon is hosted on
[github.com](https://github.com/ostcar/cyberpassword). It can be build from the
sources with the following steps.

First, clone the git repository from GitHub

    git clone https://github.com/ostcar/CyberPassword.git

Next, install all dependencies:

    yarn install

Then, you can build the extension with

    yarn build-zip

You can load the Addon temporary on the page: [about:debugging](about:debugging)


## Permissions

The Addon needs currently three permissions:


### storage

The permission is needed to save the config values into the local storage. In it
also needed for the optional feature to save the MasterPassword into the local
storage.


### contextMenus

The permission is needed to add an menu element to the context of
password-input-elements. This is the main part of this addon.


### activeTab

The permission is needed to get the url of tiffhe activeTab to get the second level
domain which is used to create the password for the page.

It is also needed to insert the password into the password form field.


## Motivation

Currently I use [PasswordMaker](http://passwordmaker.org/) to manage my
passwords. But this is a SDK-Addon and therefore won't work with Firefox 57.
Therefore I needed an alternative. There are a lot of replacements out there.
You can find a long list and why you should not use most of them on [this
article](https://palant.de/2016/04/20/security-considerations-for-password-generators).

One good alternative would be [Easy
Password](https://addons.mozilla.org/de/firefox/addon/easy-passwords/), but it
was to "diffrent" then PasswordMaker.


## Migrate from PasswordMaker

PasswordMaker and CyberPasswords are using diffrent hash algorithm. Therefore
you can not use a password generated with PasswordMaker when you switch to
CyberPassword. What you can do is install both extensions at the same time. Then
you can loggin to your accouts with PasswordMaker and fill out the change
password forms with CyberPassword.

I have no intention to support the hash algorithm from PasswordMaker. They are
not save. See https://palant.de/2016/04/20/security-considerations-for-password-generators.


## Future plan

I would like to add a interface to CyberPassword to connect it to a local
running password manager like [pass](https://www.passwordstore.org/). If there
is a password in the manager, then it can be used, and only if not, then a
password is generated.
