---
layout: post
title: "NodeJS - HTML5 video and sockets.io using an iframe with node-webkit"
excerpt: "Testing your hybrid mobile sockets.io app directly on the desktop"
categories: Code
tags: [node.js, html5, webkit]
date: 2014-03-31
comments: true
---

NodeJS - HTML5 video and sockets.io using an iframe with node-webkit
Node-webkit is a pretty great package. It's optimised to boot node and open a webkit window with no toolbars by default. It is nice! It works easily and is reasonably well-documented. Unfortunately, it also assumes you want to write desktop applications that use web code.

I am assuming that, as a web developer, you want to write web applications you can demo on a desktop instead.

The difference is important, because in one case, you care a lot about your application's speed and performance on local, but not about websockets, and in the other case, all you care about is whether your websockets connect properly when you press "go." This is very simple: it involves an iFrame and a few gotchas about HTML5 video.

### Gotchas

HTML5 video is a political kickball and therefore you'll need to have webm available.
Miro Video Converter will fix that for you. http://www.mirovideoconverter.com. It's a nice face on FFMPEG, which is how GIFs are made also.
If you use an iFrame, you can keep your references to h.264, and they'll load nicely elsewhere. Like on your iPad controller.
So.

Download node-webkit 0.7.4. HTML5 video is, as of this writing, broken in all other builds of node-webkit (0.8.5.x) - I assume this is to do with HTML5 video codec sharing being the large ugly elephant in the room of open source media browsers. Whatever. You shouldn't be distributing patented media codecs anyway, you'll get sued, see also: the whole DRM In The Browser fight.

Once everything is downloaded and working with your pre-existing application, add your node-webkit package to your app directory. Make sure everything still boots, memorize the port you're serving your app from (0.0.0.0:3003? 0.0.0.0:8888? whatever).

Open a new file called "index.html"

Copy and paste and lightly edit the following. I've bolded the things that want changing.

For fun, I also looked up how to publish your localhost's ip address - this is now the address of your server on your network, wherever that may be - and included it in a large and ugly H1 tag.

{% highlight html %}
{% raw %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>YOUR APP NAME</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

  </head>
  <body>
    <iframe src="http://0.0.0.0:YOURPORT/WHATEVER" width="1024" height="720" frameBorder="0">
      Whoops! Something went wrong.
    </iframe>

<!-- This is for listing your server location - localhost - publicly -->
    <script>
    var os=require('os');
    var ifaces=os.networkInterfaces();
    var ipArray = [];
    for (var dev in ifaces) {
      var alias=0;
      ifaces[dev].forEach(function(details){
        if (details.family=='IPv4') {
          console.log(dev+(alias?':'+alias:''),details.address);
          ipArray.push(dev+(alias?':'+alias:''),details.address);
          ++alias;
        }
      });  
    }
    var compare = ipArray.toString();
    // this regexp filters for a localhost-flavoured ip 
    var patt = new RegExp("10.\\d+.\\d+.\\d+|192.168.\\d+.\\d+",'');
    var ipLocal = patt.exec(compare);
    document.getElementById("ipAddress").innerHTML = ipLocal+":3003/";  
  </script>
  </body>
</html>
{% endraw %}
{% endhighlight %}

Add "main": "index.html" to the minimal node-webkit package.json - npm init can help with this - and you should be away to the races.