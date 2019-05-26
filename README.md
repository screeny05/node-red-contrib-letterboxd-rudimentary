# node-red-contrib-letterboxd-rudimentary
A [Node-RED](http://nodered.org) node to communicate with [Letterboxd](https://letterboxd.com). This package does not use the official API but instead relies on making HTTP-requests to endpoints provided by the website itself.

## Install
Either through the admin-interface or:
```
cd ~/.node-red
npm install node-red-contrib-letterboxd-rudimentary
```

## Contains
* **letterboxd-controller** config node to connect to your letterboxd account
* **mark-as-watched** node to which is able to set the watched-status of a movie to a given value

## Motivation
This project was created out of frustration about kodi, missing a plugin to sync watched movies to letterboxd.
This node can be used in conjunction with the [node-red-contrib-kodi](https://github.com/estbeetoo/node-red-contrib-kodi)-package:

Upon receiving an `VideoLibrary.OnUpdate`-event from kodi, you can query its RPC-endpoint to get the TMDB-/IMDB-ID and the watched-status of the updated movie. That can be funneled to the `mark-as-watched`-node.
