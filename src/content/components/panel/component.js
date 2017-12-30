import Component from '../lib/component'
import template from './template.htmlf'
import interact from 'interactjs' // Interact.js (for resizability)

/**
 * This is a singleton component.
 */
export default class Panel extends Component {
  constructor (options) {
    super(Panel.defaults, options)

    this.panelOpenedClassName = 'opened'
    this.panelFullWidthClassName = 'full-width'
    this.bodyNormalWidthClassName = 'alpheios-panel-opened'
    this.zIndex = Panel.defaults.zIndex
    this.self.element.style.zIndex = this.zIndex

    this.width = Panel.widths.zero // Sets initial width to zero because panel is closed initially

    // Initialize Interact.js: make panel resizable
    interact(this.self.element)
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: false, top: false },

        // keep the edges inside the parent
        restrictEdges: {
          outer: document.body,
          endOnly: true
        },

        // minimum size
        restrictSize: {
          min: { width: 400 }
        },

        inertia: true
      })
      .on('resizemove', event => {
        let target = event.target
        // update the element's style
        target.style.width = `${event.rect.width}px`
      })
  }

  static get defaults () {
    return {
      template: template,
      selfSelector: '[data-component="alpheios-panel"]',
      innerElements: {
        attachToLeftButton: { selector: '[data-element="attachToLeftBtn"]' },
        attachToRightButton: { selector: '[data-element="attachToRightBtn"]' },
        closeButton: { selector: '[data-element="closeBtn"]' }
      },
      outerElements: {
        page: { selector: 'body' }
      },
      contentAreas: {
        messages: {},
        shortDefinitions: {},
        fullDefinitions: {},
        inflectionsLocaleSwitcher: {},
        inflectionsViewSelector: {},
        inflectionsTable: {}
      },
      position: Panel.positions.default,
      zIndex: 2000
    }
  }

  static get positions () {
    return {
      default: 'alpheios-panel-left',
      left: 'alpheios-panel-left',
      right: 'alpheios-panel-right'
    }
  }

  static get widths () {
    return {
      default: 'alpheios-panel-opened',
      zero: 'alpheios-panel-zero-width',
      normal: 'alpheios-panel-opened',
      full: 'alpheios-panel-full-width'
    }
  }

  /**
   * Sets a z-index of a panel to be higher than a z-index of any page element.
   * @param {Number} zIndexMax - A maximum z-index of elements on a page.
   */
  updateZIndex (zIndexMax) {
    if (zIndexMax >= this.zIndex) {
      this.zIndex = zIndexMax
      if (this.zIndex < Number.POSITIVE_INFINITY) { this.zIndex++ } // To be one level higher that the highest element on a page
      this.self.element.style.zIndex = this.zIndex
    }
  }

  setPositionTo (position = Panel.positions.default) {
    if (this.bodyPositionClassName !== position) {
      this.bodyPositionClassName = position
      if (position === Panel.positions.right) {
        // Panel is at the right
        this.outerElements.page.element.classList.remove(Panel.positions.left)
        this.outerElements.page.element.classList.add(Panel.positions.right)
        this.innerElements.attachToRightButton.hide()
        this.innerElements.attachToLeftButton.show()
      } else {
        // Default: Panel is at the left
        this.outerElements.page.element.classList.remove(Panel.positions.right)
        this.outerElements.page.element.classList.add(Panel.positions.left)
        this.innerElements.attachToLeftButton.hide()
        this.innerElements.attachToRightButton.show()
      }
    }
  }

  open (width = Panel.widths.normal) {
    this.resetWidth()
    this.width = width

    if (this.width === Panel.widths.full) {
      // Panel will to be shown in full width
      this.self.element.classList.add(this.panelOpenedClassName)
      this.outerElements.page.element.classList.add(this.bodyPositionClassName)

      this.self.element.classList.add(this.panelOpenedClassName)
      this.self.element.classList.add(this.panelFullWidthClassName)
    } else {
      // Default: panel will to be shown in normal width
      this.self.element.classList.add(this.panelOpenedClassName)
      this.outerElements.page.element.classList.add(this.bodyNormalWidthClassName)
      this.outerElements.page.element.classList.add(this.bodyPositionClassName)
      this.self.element.classList.add(this.panelOpenedClassName)
    }
    return this
  }

  close () {
    if (this.isOpened) {
      this.resetWidth()
      this.options.methods.onClose()
    }
    return this
  }

  attachToLeft () {
    this.setPositionTo(Panel.positions.left)
    console.log('attach to left')
  }

  attachToRight () {
    this.setPositionTo(Panel.positions.right)
    console.log('attach to right')
  }

  get isOpened () {
    return !(this.width === Panel.widths.zero)
  }

  resetWidth () {
    this.self.element.classList.remove(this.panelOpenedClassName)
    this.outerElements.page.element.classList.remove(this.bodyNormalWidthClassName)
    this.outerElements.page.element.classList.remove(this.bodyPositionClassName)

    this.self.element.classList.remove(this.panelOpenedClassName)
    this.self.element.classList.remove(this.panelFullWidthClassName)

    this.width = Panel.widths.zero
  }

  toggle () {
    if (this.isOpened) {
      this.close()
    } else {
      this.open()
    }
    return this
  }

  clearContent () {
    for (let contentArea in this.contentAreas) {
      if (this.contentAreas.hasOwnProperty(contentArea)) {
        this.contentAreas[contentArea].clearContent()
      }
    }
    return this
  }

  showMessage (messageHTML) {
    this.contentAreas.messages.setContent(messageHTML)
    this.tabGroups.contentTabs.activate('statusTab')
  }

  appendMessage (messageHTML) {
    this.contentAreas.messages.appendContent(messageHTML)
  }

  clearMessages () {
    this.contentAreas.messages.setContent('')
  }
}
