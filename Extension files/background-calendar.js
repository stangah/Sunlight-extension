/**
 * The namespace for background page related functionality.
 * @namespace
 */
var background = {};

/**
 * A static constant that decides whether debug messages get shown or not.
 * @type {boolean}
 * @private
 * @const
 */
background.DEBUG_ = true;

/**
 * Colors used for the badge, other than calendar colors.
 * @enum {string}
 * @const
 */
background.BADGE_COLORS = {
  ERROR: '#f00',
  IN_PROGRESS: '#efefef'
};

/**
 * The ID of the currently-selected tab. This is required because the same
 * browser action icon shows the status for multiple tabs, and must be updated
 * on every tab switch to indicate the events in that particular tab.
 * @type {number}
 */
background.selectedTabId = 0;

/**
 * A map of tab IDs to the list of events we have detected in that tab.
 * @type {Object.<string,Array.<Object>>}
 */
background.eventsFromPage = {};

/**
 * @typedef {{
 *   text: (string|undefined),
 *   color: (string|undefined),
 *   title: (string|undefined)
 * }}
 */
background.BadgeProperties;

/**
 * Initializes the background page by registering listeners.
 */
background.initialize = function() {
  background.initMomentJs_();
  background.listenForRequests_();
  background.listenForTabUpdates_();
  scheduler.start();
};

/**
 * A function that logs all its arguments if background.DEBUG_ is true.
 * @param {string} message The message to log.
 * @param {*=} opt_dump An optional set of parameters to show in the console.
 */
background.log = function(message, opt_dump) {
  if (background.DEBUG_) {
    if (opt_dump) {
      window.console.log(message, opt_dump);
    } else {
      window.console.log(message);
    }
  }
};

/**
 * Initializes Moment.js with a new 'language' for the badge text. It only has
 * strings for relative dates, such as 1h, 2m, 3d. It is used as the language
 * for a single local instance (not changed globally) when required to render
 * the badge text. This method creates the language and installs it for later
 * use elsewhere.
 * @private
 */
background.initMomentJs_ = function() {
};

/**
 * Listens for incoming RPC calls from the browser action and content scripts
 * and takes the appropriate actions.
 * @private
 */
background.listenForRequests_ = function() {
  chrome.extension.onMessage.addListener(function(request, sender, opt_callback) {
    switch(request.method) {
      case 'events.detected.set':
        background.selectedTabId = sender.tab.id;
        background.eventsFromPage['tab' + background.selectedTabId] = request.parameters.events;
        chrome.browserAction.setIcon({
          path: 'icons/calendar_add_19.png',
          tabId: sender.tab.id
        });
        break;

      case 'events.detected.get':
        if (opt_callback) {
          opt_callback(background.eventsFromPage['tab' + background.selectedTabId]);
        }
        break;

      case 'events.feed.get':
        if (opt_callback) {
          opt_callback(feeds.events);
        }
        break;

      case 'events.feed.fetch':
        feeds.fetchCalendars();
        break;

      case 'options.changed':
        feeds.refreshUI();
        break;
    }

    // Indicates to Chrome that a pending async request will eventually issue
    // the callback passed to this function.
    return true;
  });
};


/**
 * Listen to when user changes the tab, so we can show/hide the icon.
 * @private
 */
background.listenForTabUpdates_ = function() {
  chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
    background.selectedTabId = tabId;
  });

  // We need to reset the events detected in case the page was reloaded
  // in the same tab. Otherwise, even after the user clicks away
  // from the page that originally contained that event, we would
  // continue to show the orange button and events list.
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'loading') {
      delete background.eventsFromPage['tab' + tabId];
    }
  });
};


/**
 * Update specific properties of the badge.
 * @param {background.BadgeProperties} props The properties to update.
 */
background.updateBadge = function(props) {
  if ('text' in props) {
    chrome.browserAction.setBadgeText({'text': props.text});
  }
  if ('color' in props) {
    chrome.browserAction.setBadgeBackgroundColor({'color': props.color});
  }
  if ('title' in props) {
    chrome.browserAction.setTitle({'title': props.title});
  }
};


background.initialize();