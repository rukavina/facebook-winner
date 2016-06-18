# Facebook Winner

## Overview

Facebook Winner is a quick and easy way to pick a winner for Facebook timeline post promotions.

You already know that Facebook now allows to run promotions and winning games directly from your timeline posts. You are free to reward your commenters and/or likes and boost your page social engagement. Just announce: **like to win** or **comment to win**. If you are lucky you can get hundreds or thousands or likes and comments, but there's no built-in facebook tool for you to export or randomly pick some of comments or likes.

Facebook Winner helps you select a page, list posts, export comments, export likes and randomly pick one or more winners.

## Features

* Select Winner(s) from Post "Likes" and/or "Comments"
* Export Likes and Comments as CSV
* Limit 1 Person to 1 Candidate
* Javascript only, no server side scripts!
* No DB needed
* Created with modular backbone.js and require.js
* Created with Bootstrap 3

## Quick Start Guide

### Step 1: copy files

Copy **source** folder contents to your domain.

### Step 2: create your facebook application

You have to create your own facebook application for your domain. You have to go to [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/) and create new app. Just add _Website_ platform and set "App Domains" to point to your domain, as well as site URL.

Please read [this tutorial](https://developers.facebook.com/docs/opengraph/getting-started#create-app) for more information.

### Step 3: update app info

All this is left is to update facebook app id in **config.js**:

```
facebook:{
    appId: '580108675359307', //your facebook app id
}
```

> **Warning!** Since May 1. 2014. all facebook apps asking for more than `public_profile, email and user_friends` have to be [reviewed and approved by Facebook](https://developers.facebook.com/docs/apps/review).  
> Facebook Winner is basically admin tool, and if you define all your users as your app admins in _Roles_ section of the app management, you don't have to apply for review process even though Winner could be asking either for `manage_pages` or `user_likes` as defined by you in _facebook.scope_ option.

## Options

You can setup different app options in **config.js** file.

| option | description | default | possible values |
|pageId|Specify ID of a facebook page if you want to show only this page posts, leave null for free page selection|null|null/string|
|facebook.appId|ID of a custom app on [Facebook platform](https://developers.facebook.com/apps/). Please read [this tutorial](https://developers.facebook.com/docs/opengraph/getting-started#create-app)|''|string|
|facebook.scope|Comma separated list of [permissions](https://developers.facebook.com/docs/reference/login/) needed for facebook app. "manage_pages" is needed if _showAdminPages_ is true.|'user_likes'|string|
|facebook.limit|Count of items obtained per facebook api call|1000|int|
|perPage|Count of pages and post displayed per page|20|int|
|showAdminPages|If the app should list pages for which logged in user is administrator. For this option _facebook.scope_ must include _manage_pages_ permission. Else liked pages are listed.|false|boolean|
|dateTimeFormat|Date/time [format](https://github.com/agschwender/jquery.formatDateTime) for pages|'mm/dd/y g:ii a'|string|
|loadWinners|Function which loads existing winners from a storage.|
```
loadWinners: function(postId){
    var winners = JSON.parse(localStorage.getItem('mgw_' + postId));
    if(!winners){
        winners = []
    }
    return winners;
}
```|function|
|saveWinners|Function which stores winners to a storage. Ex. make ajax call to trigger server script which stores to a DB.|
```
saveWinners: function(postId, winners){
    localStorage.setItem('mgw_' + postId, JSON.stringify(winners));
}```||function|
