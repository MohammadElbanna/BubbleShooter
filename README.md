#Bubbleshooter
This repo is about building a responsive bubbleshooter game that works almost everywhere using vanilla js.

###Demo
The game is better suited in portrait mode. You can try it [here](http://mohammadelbanna.github.io/BubbleShooter/).

### \<div\> all the things
This game was implemented using the DOM API and CSS instead of the Canvas element.  
All objects in the game are _**\<div\>**_ elements that are moving using CSS3 transformations or requestAnimationFrame.

###MVC approach
This implementation was an experiment to build a game using the MVC approach where:  
_**M**_ represents model or the state of the game,  
_**V**_ represents the view layer or how different objects are rendered on the screen  
_**C**_ represents the controller layer or 
how to respond to different user inputs or external events in order to update the view and the state correspondingly.

###Front-end tools used
* Babel
* Browserify to use ES6 module syntax
* BrowserSync
* gulp as a build tool

### Acknowledgments
Much of the implementation of the game was inspired by Karl Bunyan's book [Build an HTML5 game](http://www.amazon.com/Build-HTML5-Game-Developers-JavaScript/dp/1593275757),
though the author used JQuery and the game was built for a fixed size screen (was not responsive).

Also the sprite sheet that I used for the bubbles was from Karl Bunyan's website for the book [here.](http://buildanhtml5game.com/?page_id=18)

###License
MIT. This game was mainly for educational purposes.
