---
layout: default
title: Posts
permalink: /posts/
---

<header class="post-header">
  <h1 class="post-title">{{ page.title }}</h1>
</header>
<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
      <h2>
        <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
      </h2>
    </li>
  {% endfor %}
</ul>