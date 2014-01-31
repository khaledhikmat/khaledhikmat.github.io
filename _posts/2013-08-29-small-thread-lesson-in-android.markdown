---
layout: post
title:  "A small thread lesson in Android"
date:   2013-11-07 20:14:01
summary: "An easier and more efficient way to employ threads"
categories: Technical
tags: Android Thread
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-navigation.html %}

If you find yourself doing something like this in Android, there is a better approach! Let us say you want to animate a map in an Android application after 2 seconds. I see lots of code samples resort to something like this:

```
new Thread() {
	public void run() {
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
					 
		((Activity)getContext()).runOnUiThread(new Runnable() {
			@Override
			public void run() {
				googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(hotelLatLng, 16));
			}
		});
	}
}.start();
```

A much better approach would be to create a handler on the main UI thread and post a delayed message to it:

```
// Post the position animation after a delay
mHandler.postDelayed(animateMapPositioning, MAP_POSITION_DELAY);
```

where mHandler is defined in the Activity init method like so:

```
@Override
public void init() {
	super.init();
	mHandler = new Handler();
}
```

and the animateMapPositioning is defined like so:

```
private Runnable animateMapPositioning = new Runnable () {
	public void run() {
		googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(hotelLatLng, 16));
	}
};
```

I hope this helps someone.