/* global browser */

export default class ContentOptions {
  constructor () {
    this.items = ContentOptions.initItems()
  }

  static get defaults () {
    return {
      locale: {
        defaultValue: 'en-US',
        labelText: 'UI Locale:',
        values: [
          {value: 'en-US', text: 'English (US)'},
          {value: 'en-GB', text: 'English (GB)'}
        ]
      },
      panelPosition: {
        defaultValue: 'left',
        labelText: 'Panel position:',
        values: [
          {value: 'left', text: 'Left'},
          {value: 'right', text: 'Right'}
        ]
      },
      uiType: {
        defaultValue: 'popup',
        labelText: 'UI type:',
        values: [
          {value: 'popup', text: 'Pop-up'},
          {value: 'panel', text: 'Panel'}
        ]
      },
      preferredLanguage: {
        defaultValue: 'lat',
        labelText: 'Page language:',
        values: [
          {value: 'lat', text: 'Latin'},
          {value: 'grc', text: 'Greek'},
          {value: 'ara', text: 'Arabic'},
          {value: 'per', text: 'Persian'}
        ]
      }
    }
  }

  static initItems () {
    let items = {}
    for (let [key, item] of Object.entries(ContentOptions.defaults)) {
      items[key] = item
      item.currentValue = item.defaultValue
      item.name = key
      item.textValues = function () {
        return this.values.map(value => value.text)
      }
      item.currentTextValue = function () {
        for (let value of this.values) {
          if (value.value === this.currentValue) { return value.text }
        }
      }
      item.setValue = function (value) {
        item.currentValue = value
        ContentOptions.save(item.name, item.currentValue)
        return this
      }
      item.setTextValue = function (textValue) {
        for (let value of item.values) {
          if (value.text === textValue) { item.currentValue = value.value }
        }
        ContentOptions.save(item.name, item.currentValue)
        return this
      }
    }
    return items
  }

  get names () {
    return Object.keys(this.items)
  }

  /**
   * Will always return a resolved promise.
   */
  load (callbackFunc) {
    browser.storage.sync.get().then(
      values => {
        for (let key in values) {
          if (this.items.hasOwnProperty(key)) {
            this.items[key].currentValue = values[key]
          }
        }
        console.log('Content options are loaded successfully', this.items)
        callbackFunc(this)
      },
      error => {
        console.error(`Cannot retrieve options for Alpheios extension from a local storage: ${error}. Default values
          will be used instead`)
        callbackFunc(this)
      }
    )
  }

  static save (optionName, optionValue) {
    // Update value in the local storage
    let option = {}
    option[optionName] = optionValue

    browser.storage.sync.set(option).then(
      () => {
        // Options storage succeeded
        console.log(`Value "${optionValue}" of "${optionName}" option value was stored successfully`)
      },
      (errorMessage) => {
        console.error(`Storage of an option value failed: ${errorMessage}`)
      }
    )
  }
}
