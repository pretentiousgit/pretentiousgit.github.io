# Twison Interface

This project accepts a Twison export from Twine 2, and automatically generates a basic HTML interface for it.

### Basic Use

- click the remix button to create your own version of this code

- install [Twison](https://github.com/lazerwalker/twison) as a story format in Twine
- Edit your story's Details to export to .json when you hit Play, rather than building a playable game
- save your game file as game.json, and upload it into your code remix

- edit HTML in index.html
- edit CSS in style.css

### Code Structure:
#### README.md
This file! It's the readme

#### data.js
How to asynchronously load and return static or API data

#### game.js
the main file for loading our game interface

#### game.json
our game data, a Twine 2 export through Twison

#### index.html
This has our basic page structure. The page requires a page header (h1) and two divs, one with the `id` of `story-display` and one with both class and id of `choices` - this is to hook up the CSS and JS. It also requires a button with an id of `restart` to restart any given playthrough.

#### script.js
the entrypoint for our javascript modules. Loads data, writes the game header.


### Provisions from Twine

This codebase expects minimal outputs from Twine to be stored in a file called `game.json.`

It uses standard async load methods to provide that file into your HTML/css interface, which then can be customized by you as you like.

This means that you can supply the following options in your updated JSON:

- video links
- image files
- sound files

How you load and connect those files is up to you!

### Text Cleaning

There is a function to automatically clean some types of Twine inline styling built into `game.js` - this may or may not help you.

