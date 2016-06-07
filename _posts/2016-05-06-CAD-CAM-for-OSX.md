---
layout: post
title: CAD/CAM Software for OSX
excerpt: "A survey of CAD software available for OSX"
tags: [software, sculpture, CAD, automata]
categories: Tools Presentations
modified: 2016-05-06
comments: false
---

<iframe src="https://docs.google.com/presentation/d/1Cfj7w3QQmAPHmxyc1FgQ0RWQr9pFfxjYS12a9_zBes8/embed?start=false&loop=false&delayms=3000" frameborder="0" width="480" height="299" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

Over the last four months, I have spent a lot of time working through how to make things that move, and how to produce them in a predictable way in any well-equipped makerspace. I'm defining a well-equipped space as one with a laser-cutter and a 3D printer that handles PLA, though a lathe and mill are nice to have.

### Procedural Generation - OpenSCAD
[OpenSCAD](http://www.openscad.org/) is a FLOSS project out of Kitchener/Waterloo in Canada. It is amazing and a very good solution if you are comfortable programming. It runs on donations, and it is absolutely the best for things like, ie: furniture design.

##### Pros
    * Probably the most interesting for designing things like bookshelves and non-fancy-curved CAD things
    * you change a single variable and everything else changes
    * good for modelling plywood, angle brackets, large-scale non-fiddly things
    * sending out a model is as simple as sending out some code
    * use GitHub/etc to store your models
    * Generators exist for doing, ie: 3D printed helical gears. Amazing!

##### Cons
    * getting 3D printed helical gears right on it will take years from your life, if you're not good at that already
    * when you get right into it, this involves a lot of programming effort
    * if you're only middle-comfortable with programming, will be slower than other packages to get what you want.
    * this is not a CAM package, there's no machine tooling in here.

### Rhino/Grasshopper for OSX
Rhino is great and easy to use. Grasshopper allows linked updates for generated models. In practical terms, that means that a model will update when you change something in the underlying design. While Grasshopper for OSX is in early beta right now, Rhino is still a great, practical choice. It's pretty affordable, too, at $495USD and a 90-day free trial.

##### Pros
* affordable
* offline working space available
* Great workspace, good rendering, joints and animations
* [Grasshopper](http://www.grasshopper3d.com/page/grasshopper-for-mac) is now available on mac in deep beta.

##### Cons
* UI less polished than some low-level Autodesk project
* Maybe overkill if you're just getting started


### Autodesk

Autodesk is the big goon of the OSX CAD world. They have a real sweet spot going on in their acqui-hire policy for smaller companies, which has allowed them to take on a lot with their 123D line of products.

#### TinkerCAD
[TinkerCAD](http://www.tinkercad.com) is Autodesk's entry-level free-to-play cloud-based CAD offering. It is essentially a toy, best used with a MakerBot or Ultimaker to print action-figure-y non-moving components.

The big pitch for TinkerCAD is that it comes with a lot of pre-modelled drag-and-drop components that will get you started quick, including some fiddly joints that are nice for putting together snap-together pieces. It is a toy and has no measurement tools! I expect you will move on quickly, there are a lot of constraints here.

#### 123D Design
[123D Design](http://www.123dapp.com/design)

This is the tool I use most often to design small solid parts for 3D printing.

##### Pros

* Most intuitive modelling controls, relative to other packages
* Exports STL and OBJ files directly
* Can in theory import SVG as sketches to make objects
* easy to save files locally
* do not have to be online to use
* sketches have constraints/suggestions, making them v. easy to handle.

##### Cons
* Designed to manage small, 3d-printed parts, so if you're doing something complex it will run slowly even on high-end hardware
* Anything to do with curves, lofting, or path-tracing can be very frustrating very fast
* can't generate one component and linked-edit that component, which means a lot of redrawing parts if you change something.
* gonna have to hand-animate your joints, and they're gonna be an estimate.

##### Tips:
* Do one part at a time 
* make sure to draw it out in advance 
* do you _really need_ to 3D print that?  

#### Fusion 360

[Fusion 360](http://www.autodesk.com/products/fusion-360/overview) is Autodesk's challenger to Solidworks, and elect replacement for Inventor. You can get a free/hobbyist licence for 360 for one year by signing up as a hobbyist and tinkerer. Fusion _in theory_ does it all: CAD, CAM, hingeing, and animations. In practice, it has a ton of weirdly awkward little gotchas, like being an always-on cloud computing platform. It might get better, as it is in active development.

##### Pros
* joints, hinges, animations included
* can do large, complex projects
* In theory, modelling is easy!
* things like gear generation scripts exist for the platform, handy!
* CAM toolpath exports, the whole thing, you can run a shop off this

##### Cons
* you are probably using a laptop, and it will probably pig out your resources
* Cloud-based = Do u have internet? No? No work for you!
* You have to place holes as components, rather than dropping a fastener in place and auto-generating around that fastener.
* Super weird, Autodesk-specific control panels and UI conventions
* Component management, etc, shows signs of being inherited from a different world of design than 123D. Long learning curve.

_______

There's a lot more to be said on this topic, and the next post you should read is about _generators_, which are LIKE CAD software... but for making things in a generic way that you can then customize using 2D vector drawing software. [Here is that post](http://www.alexleitch.com/articles/2016-05/Kinetic-SVG-Generator-Reference-Library)

This post is derived from a talk I did at ITP Camp 2016