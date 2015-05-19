---
layout: post
title: Ajax Anonymous
---

Hello, my name is Chè and I’m a recovering ajax addict. I last used ajax 63 days ago. My addiction started about 8 years ago at the start of my career. One of my first assignments was to update and consolidate a set of support systems our engineers used for customer support. The only requirement was that I not refactor any of the server side code, but simply update the templates being used.

Ridiculous as this request was in retrospect, I dutifully accepted the assignment and began to research some potential solutions.
Being a young and impressional software developer in the late 2000’s, my attention was quickly caught by a trendy new buzzword, Ajax. It seemed to be all anyone talked about at the time and all cool kids were using it in their projects. So I began experimenting and before I knew it, I was injecting ajax responses all over my document body. 	

Pretty soon I started vocally promoting the use of ajax. I started showing my developer friends how awesome it made my applications feel. Online, the idea of Single Page Applications started to gain momentum and I found myself evangelizing the technique. I would go from cubical to cubical asking developers if they had heard of our lord and savior, SPAs.

The effort myself and other SPA evangelist have put into promoting the architecture seems to have paid off. Recently we’ve seen an explosion of frameworks aimed at helping developers build SPA’s, each with its own approach to the problem.

You would think that this would give me a sense of satisfaction, instead  I’ve grown increasingly concerned that splintered landscape of frontend development has blinded us to the benefits of the tried and tested solutions that the traditional multi-page architecture provides to solve common problems. 

The problem at the core of this issue, is that we as developers don’t fully understand the implications of this new approach. I’d like to cover some of those and provide some potential solutions. Think of this as an intervention for Single Page Apps. But before that, lets look at how we ended up in this position.


## The Evolution of the web.

When the web was created the architecture of a website was fairly simple. We requested a page and web server returned an HTML document which was accessible by every browser.
Javascript was then introduced and developers started taking advantage of it to allow for rich interactivity. New browsers entered the market, each providing its own set of features and API’s to interact with the DOM. jQuery was released in order to provide a common API to smooth over differences in each browser.

Then ajax came along. Once the initial page was requested, we could then use ajax request further HTML. Finally today SPAs are widely adopted, now the initial requested page contains almost no HTML, instead javascript is required to make subsequent requests, which are then used to render the view.

If we look at how webpages are loaded in browsers, these are the 7 steps in order:

1. HTML downloads
2. CSS downloads
3. CSS fetches additional assets
4. JS downloads
5. JS executes
6. JS fetches additional assets
7. JS updates DOM

Traditionally built webpages can start rendering after step 2. In SPA’s the rendering of the page usually only happens after all 7 steps have taken place, and if any of the steps from 4-7 encounters a failure, the page usually fails, disgracefully, resulting in a blank white page.

Besides robustness, performance should be a priority for every developer, especially if we consider that users are likely to experience a mental context switch after 1s. Therefor, Google recommends webpages load within this time and even use speed as a factor in their page ranking algorithm, and has even begun experimenting with displaying a “slow” warning in their search results.


## Time to Render
While SPA’s do generally perform well once the page has fully loaded, this usually comes at a cost, which is an increase in initial load times and even more importantly an increase in the time to render, causing latency between a user requesting information and being able to see it. Unfortunately this metric is easily neglected by developers, since we’re usually testing the application under ideal conditions.  
The filament group did an experiment, whereby took the the same todo app written using the 3 major client side frameworks to compare the first render time of each using multiple devices and connections. Their aim was to see if any of the applications could achieve first render times under 1s. What they found is that in most of the tests the budget was completely blown or extremely tight.  
Something you might notice in this graph is that although the angular and backbone apps are quite similar in size, there is huge difference in the first render times. This is because it is affected not only by request time, but also the time taken to parse and execute the javascript. Once again, this metric is incredibly easy to neglect when working in an ideal environment, since it become quite negligible on sufficiently powerful devices. Furthermore its easy to fall into the trap of believing that the parse & execute time will grow linearly with the size of the script, however, as the filament research shows, the complexity of the code has a drastic effect on these times.  
Tim Kadlec tested the time taken to parse and execute a minimized copy of jQuery on a range of devices. As you can see, apart from relative high end devices the times are far from negligible and can consume a large portion of your 1s budget. Its also clear that these times can vary considerably for different browsers on the same device.

## The myth of client-side templating
One of the characteristics that initially attracted me to SPA was that once the page was loaded, all subsequent navigation seemed incredibly fast and snappy. The page didn’t need to reload an I didn't see that tacky white flash. This gave me the false impression that my application actually performed better since it used client-templating. I figured that the reason for this was that instead of HTML, I was requesting small pieces of JSON data, therefore the request size would always be drastically smaller as a result. 
This was my go-to argument when challenged about the decision to build SPA’s. Only after years of experience and research into web performance did I realize how self serving this metric was. Not only did it turn out to be much less of advantage than I thought, but I also learned that the topic of web performance is a lot more nuanced than simply measuring request sizes.
Also, once you gzip the requests, the difference is negligible until fairly high numbers of records.
In this research done by Brett Slatkin, he found that by comparing the request size of a table of data, using server and client-side templating, that the difference is negligible until about 1000 records of data. 

Not only was my argument flawed, but another factor that I didnt consider at the time was that compiling the templates required CPU cycles from the browser. Since javascript is single threaded, this would potentially result in the thread being locked up. This is especially noticeable on infinite scrolling websites that use client side templating. Once the next set of records are requested, scrolling locks up resulting  in a degraded user experience.
Twitter ditched their Single Page architecture specifically due to the poor performance of client side templating. Not only did they reduce their initial load by 80%, but they also ensured smooth scrolling by requesting compiled HTML to load the next set of tweets.

This research shows that an over reliance of javascript to render our web pages has a very real impact on its performance and as a result negatively impacts the users experience. While it may seem negligible under ideal conditions, its clear the performance can depend heavily based on the device being used and the quality of the connection. 
The most effective way to get meaningful performance metrics is to enable real user monitoring of your application. Both Google Analytics and New Relic report detailed information which you can use to analyze both the server response times as well as how long your users browsers are taking to process and render your page.

## So What Now?
So you’ve found that your single page application is performing poorly, what can you do to improve it.

### Option 1: Limit reliance on client side code
DHH wrote a great article on how basecamp achieves sub-second render times, using mostly rails features and only sprinkles of javascript. 
They use turbo-links to allow navigating to different pages without needed a full page reload. As well as  Russian doll caching, to cache nested fragments of html.
In this example rails caches a todo item, the todo list and block of todo lists. Instead of one change invalidating the entire cache for a page, they only throw out the piece that changed. They take this a step further and reuse cached pieced between separate pages further improving response times. The beauty of this approach is that all that was required to enable it was to augment your templates with helpers which indicate which pieces of html to cache.
Using these rails features they’ve managed to get response times between 20 and 50ms once the cache is warmed.
Keeping your application simple, not only improves performance, but can simplify your code base considerably. By moving away from a single page architecture, Shopify managed to shave 2.5MB of their minified javascript, while deleting 28 000 lines of CoffeeScript and 4000 lines of Ruby.

### Option 2: Isomorphic Code
If you’re dead-set on going the SPA route because your application requires that much interactivity, or if you’ve already built an application and drastically refactoring it is infeasible, you could investigate approaches that allow your application to be isomorphic, which simply means it can run both on the client and the server. 
In this setup node.js (or io.js) can use your application to render the initial page based on the route that’s requested. Once that page is loaded, the client-side code takes over, handling all subsequent request.
Airbnb has had success with this approach for their mobile web app. Instead of throwing out their existing backbone code, they simply refactored it to be isomorphic, and as a result, they’ve managed to reduce their time to render on 3G connections from 10 to 2s.

### Option 3: Cut the Mustard
The most prudent approach I’ve come across so far, which tries to take advantage of the benefits of feature rich browsers, without sacrificing accessibility on less powerful ones is called cutting the mustard, which was was made popular by the BBC web developers. On page load, they provide all browsers with a core experience, which is a simple HTML document that works on every browser including those on extremely low end devices.

They then do very simple feature detection which splits browsers into two, “dumb browsers” and “smart browsers”. If the browser if found to be in the latter group, the SPA is bootstrapped and takes over, providing those users with an enhanced experience that is afforded by the latest browser features.

Users in the former group are still able to view and use the site as a traditional webpage. This has the added benefit of failing gracefully, ensuring that any javascript errors don’t prevent their users from seeing the content they’ve requested.

## No Silver Bullet
Each of these solutions have their pros and cons and should be chosen based on the constrains of you particular project. There is no silver bullet and whatever route you choose will require some work. However, the benefits will always out way the cost, since you’re providing a baseline experience, using the foundational elements of the web which have served us well for so long, and by doing so, you can support the widest number of browsers, devices and users possible.

## Lets Be Considerate
And I'm not saying don't build single page applications. Just be considerate and make informed decisions. Sometimes I think we needlessly overcomplicate our systems, in the blinding desire to stay current. While this is real problem, what makes it a travesty is that we’re carelessly sacrificing performance and accessibility as a result. This is a dis-service to our users, especially those unfortunate enough to have weak devices and slow connections.

## Also, I’m Sorry!
So in closing, my apologies to all those I previously convinced to build single page application, without understanding the implications myself, I hope this article has given you something to think about and helps you make more informed decisions in the future.
