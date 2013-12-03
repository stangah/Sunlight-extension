# Sunlight-extension

A Chrome extension using APIs from [Sunlight Foundation](http://sunlightfoundation.com/) that scans a webpage to give the user more information about legislation, Congressional key terms, and current Congressmen.

## Install

### Through the Chrome Extension Store

Head over to the hosted extension [at this broken link](http://lolImBroken) and follow the install instructions. 

### From Github

Clone the repo to a local folder and load the contents of the *extension-files* folder into Chrome using [these instructions](http://developer.chrome.com/extensions/getstarted.html#unpacked).

<pre><code>git clone https://github.com/stangah/Sunlight-extension.git</code></pre>

### Server

The server is a standard node.js/Express app that can be deployed using node. Be sure to run npm install from the root directory before starting the server.

<pre><code>npm install
node server.js</code></pre>

## Use

Click on the extension icon in your browser action bar to scan the page and request info from the server. Results will be organized into the provided tabs. Click on each line to access more info.

## Contribute

Contributing to this repo is an easy way to become my friend.

## License

Sunlight-extension is distributed under the [license that I haven't decided on yet](http://lolNoLicenseYet).


