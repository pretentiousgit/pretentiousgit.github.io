---
layout: post
title: SVG Generators and Automata Support Libraries for Kinetic Art
excerpt: "SVG generators that help with box design, gear generation, and how to think about making motion."
tags: [software, sculpture, CAD, automata, kinetics]
categories: Tools
modified: 2016-05-06
comments: false
---

This post is intended to be read alongside my CAD/CAM software for OSX reference list. It's a group of generators I like to use together to help make things like mechanical flowers, or maybe just nicer parts enclosures.

##### SVoronoiG: https://github.com/stg/SVoronoiG
[SVoronoiG](https://github.com/stg/SVoronoiG)
Do you like pretty root patterns? SVoronoiG supplies a square and lets you place voronoi-based cells into that square, then tinker with how thick various cell walls should be. This can then be included alongside a more thorough SVG-based pipeline to make pretty, accessible box walls. 

This is how you make pretty cell-based root patterns! It is super, super great.

##### Gear Generator Dot Com
[GearGenerator](geargenerator.com/#144,144,72,6,1,0,15355.500000006388,3,1,8,2,4,27,-90,0,0,13,3.25,4,27,-90,0,0,13,3.25,4,27,8,0,0,2,1104)

Generate functional gears with minimal slop, appropriate for laser-cutting. This does not do helical gears. Nothing will help you with helical gears, certainly nothing less than actual maths or a full-on 3D suite, but that turns out to be okay: helical gears are kind of overkill for a lot of simple automata projects.

##### MakerCase
[MakerCase](http://www.makercase.com/)
Got a project? You're gonna need a box. This is the best of the box generators out there at present, although it requires some attention to detail to use effectively. You need, for instance, to remember that the part marked "Front" is probably better suited to being your box-top or your box-bottom, because that is where the nice corners will be. MakerCase does a sensible thing by connecting the notch lines of the box rather than drawing separate lines for each notch, which means cases printed from MakerCase take less time to cut and are less fiddly to work with afterwards.

##### Iris Calculator
(Iris Calculator)[http://iris-calculator.com/basic.php] Need an aperture motion? Want it to be fancy? Bad at math? Here is a new friend, it is for calculating mechanical iris, also called apertures. Now is when you should get all your GlasOS jokes out of your system.

This post is derived from a talk I did at ITP Camp 2016.

##### 507 Movements
[507 Movements](http://507movements.com/)
So, I am very enthusiastic and I work really hard, and also, I can be a bit of a stubborn goose about not using what has already been invented, with the net result that I've personally recreated about 50 of these movements and felt momentarily brilliant. Perhaps using this reference site will spare you that effort, if you're interested in making automata! 

The hard thing about picking a piece of software is that eventually, you will come to see your work through the lens of your tools. Things that your software makes difficult will become more difficult to do than other things, and you will start to make aesthetic choices in line with what your well-intentioned software developers intended. By going to somewhere like 507 Movements and your local cardboard pile _first_, you may well save some time and think of something new, something that a full software package like Fusion or SolidWorks might make difficult.