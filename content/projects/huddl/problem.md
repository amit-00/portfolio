---
title: Problem & Motivation
order: 1
---

# Problem & Motivation

## The gap

There's currently a trend of content creators and influences on popular
shortform content platforms (TikTok, Instagram Reels, Youtube Shorts etc)
making content where they play group games that test knowledge on specific
domains.

I personally have been seeing this a lot for sports related content from
creators such as the Sideline Bros for this. Their videos tend to average
30k-70k views however can hit peaks where they get hundreds of thousands
or even millions of views on a single video of them playing these games.

This got me thinking that people probably want to play these games with
their friends and family, especially if they share common interests
in topics that are very opinionated (sports, movies, etc). While there
does exist apps/platforms that allow people to play some of these games
individually, they usually target audiences that are physically in the same
space.

Currently there is no real solution for playing these games online with your
friends. This is what Huddl is built to provide. Currently the application
only targets the sports niche, however has future plans to allow users to
create their own game packs, allowing them to play these games for whatever
topics they wish.

## Who this is for

Groups who already have a group chat going for a game. Watch parties,
fantasy leagues, a group of friends with a running sports rivalry, who
want something to do together for a few minutes that isn't just the game
itself.

## Why I actually built it

To be honest, I wanted to see if I could drum up a project that could
garner some users. I enjoy the content I see and think people would
love to be able to play games like this fast with their friends. This
would give them the ability to do that.

The product is real, but the reason I picked this project was the
engineering shape underneath it. A lobby is a small piece of shared,
authoritative state (who's seated, whose turn it is, what the score is)
that has to stay consistent across however many phones are connected to
it, survive people's wifi dropping mid-round, and support more than one
game without the lobby code caring which game is currently running. The
shape of this problem gave me a perfect scenario to work with and implement
Cloudflare's durable objects and also work with problems with two way
communication
