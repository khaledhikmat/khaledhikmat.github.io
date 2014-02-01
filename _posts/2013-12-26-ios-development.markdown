---
layout: post
title:  "iOS Development"
date:   2013-12-26 20:14:01
summary: "My first exposure to iOS development"
categories: Technical
tags: iOS Native Development
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

In a recent trip across the globe, I flew for about 30 hours. Before the trip, I planned to take advantage of this long flight time and decided to learn something new. I have always wanted to learn iOS and Objective C …. but like everyone else, the thought is scary. The language and the platform are notorious for being offensive. My programming experience for the last 10 years has been server-side code in Java and C#. Just to be frank, I am not much of a front-end developer.

By the way, I believe that mobile development has to be done (at least in the foreseeable future) in each platform's mainstream language using native code. Although the promise of HTML5 is huge and it might one day become the only thing we program in for all platforms, this is not the case today. So learning iOS and Objective C, Android and Java and Windows Phone and C# is mandatory if you are planning to support all these platforms. This might sound like a lot of work...but it is not that difficult if you are already familiar with one OOP language such as Java, C# or Objective C. I fiddled with PhoneGap for a while....although the platform is quite familiar to a lot of folks, it was difficult to build apps without extending to the native code. In PhoneGap, this meant writing plug-ins for each platform we support. My overall experience with PhoneGap and HTML5 mobile apps was not very encouraging and I scrapped the HTML5 code and wrote a native app for each platform (in this order): Windows Phone, Android and iOS.

I also believe that mobile development should happen on the main development tool provided by each mobile platform. So for Windows Phone, it should be Visual Studio. For Android, it should be Eclipse or Android Studio (once it becomes more stable). For iOS, it should be XCode. This explains why I would not use something like Xamrin...I just do not see the value....yes...writing code in C# is quite pleasant but you must learn the target platform anyway. Writing common code for all platforms sounds really good but each platform has its own specifics that must be exploited....hence it is quite difficult to find common grounds.

Anyway, I picked up two books in PDF format about Objective C, loaded them on my Surface and off I went. For the first 4-5 hours, things were not making much sense and I was getting really sleepy eyes. Finally when I got to my destination, I borrowed my son’ Mac to see if I can make sense of what I just learned. For the next two weeks, I would spend about 2 hours a day looking at the syntax and trying something new using Objective C. It was really useful Mac time.

Six weeks later, I have finished my first app in iOS. It is not a ‘hello world!’ app ….it has bunch of stuff built in it. I will talk about my experience building my first iOS app here and try to compare it with Android and Windows Phone when applicable.

Objective C:
============

Someone called Objective C the @ language! I could not agree more. It seems that everything you do has an @ sign somewhere. Example:

```
@interface DialogService : NSObject 
-(id) init;
@end
```

Perhaps the most challenging thing for me was to know how to read the method name. It does not follow the regular convention....it wants you to read it like English. For example, consider this method:

```
-(void) showConfirmationWithMessage:(NSString *) message
                           andTitle:(NSString *) title
                        andDelegate:(id) delegate
                   andOkButtonTitle:(NSString *) okButtolTitle
               andCancelButtonTitle:(NSString *) cancelButtonTitle;
```

It is an instance method declaration designated by the – sign as opposed to the class method (also known as static in other languages) which is designated by a + sign. The method is really showConfirmation. The first parameter is Message but the convention is to concatenate the method name with the first parameter …hence showConfirmationWithMessage. The whole method now reads: show confirmation with message and title and delegate and OK button title and cancel button title.

Ok…that is nice! But it is really very different from other languages and makes it really difficult to grasp unless you spend good time going through bunch of declarations and examples.

Besides the weird method naming convention, I find the language reasonable and has a lot of nice libraries in iOS. Most of these library classes start with NS such NSString and NSDate and so on. NS stands for Next Step and it is the company that Steve Jobs headed for a while. When he returned to Apple, he brought with him all the Objective C NS libraries.

There are some fancy features in Objective C that makes it close to C# and Java. Here are some examples:

* Protocols - equivalent to interfaces in C# and Java
* Categories - similar to extension methods in C#
* NS Predicate - similar to LINQ in C#
* Blocks - similar to anonymous functions in C#

One of the annoying things in Objective C is that, sometimes, you see a mixture with C code and it kinds of breaks the beauty of the language. Consider this piece of code, for example:

```
+(id) shared {
    static InstancesFactory * sharedInstancesFactory = nil;
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        sharedInstancesFactory = [[self alloc] init];
    });
    
    return sharedInstancesFactory;
}
```

Notice the weird dispatch_once call and how it does not rhyme well with the rest of the code. Patterns such as Singletons, Factories, etc can all be programmed in Objective C. By the way, Objective C does not support static properties and/or methods the same way Java and C# do...but it is close enough. Please see the example above.

Anyway, for an introductory book on Objective C and iOS, I used this [book](http://www.amazon.com/Learn-Objective-C-Mac-For-iOS/dp/1430241888) and I think it was reasonably good.

XCode:
======

This is the main tool in iOS and Mac development. It provides a similar role as Windows' Visual Studio and Android's Eclipse (and Android Studio). I started working on iOS using XCode 5 and iOS7. In a way, I feel lucky based on the horror stories I hear about pre-XCode 5.

After 6 weeks, I still do not feel quite at ease with it. It is missing (or maybe not very obvious) a lot of convenient features if compared with Visual Studio or Eclipse. In my opinion, editing and navigation are not as programer-friendly as they could be. I am certain Apple will make this tool much better given the influx of iOS developers.

For security reasons, Apple allows allows static libraries only with iOS...no dynamic libraries. Linking the project to a static library is a lot of effort. A lippo tool has to be used to combine the different flavors of the libraries i.e. x86 and/or ARM. Native scripts are needed to empliy LIPPO but writing something like this is not trivial.

If you are new to iOS, you will feel at loss of how to build the interface! There are three main approaches: code, interface builder using XIB files and storyboards. Storyboards are the latest from Apple and they are the preferred way to go forward. However, they are cumbersome and quite slow to load. I have a main storyboard that has about 22 view controllers and it takes about 20-30 seconds to load (on a Mac pro with 8 GB). Nevertheless storyboards are a good idea and I am certain Apple will make this part much better in future versions of XCode. I read but I have not tried myself....multiple story boards in one project are allowed. There is also a good fun debate about whether to use code, nibs or storyboards here.

*Storyboards:*

The way you connect the views to the code-behind requires a lot of manual drag and drop. You have to use XCode to control-drag from the views to the header files. This will create outlets and/or actions. If you write the outlets and actions manually in the code, the storyboard does not synchronize properly. This sort of stuff is much better in XAML and also in Android.

*Segues:*

Segues, the lines that connect the different view controllers, are really good concepts but I feel they are very restrictive. Lines have to be drawn and the segue have to be named if you plan to control the navigation programmatically.

*The Simulator and Testing:*

Unlike Android and similar to Windows Phone, the simulator comes up really fast. It is fully featured and runs really fast. Similar to Android but unlike Windows Phone, it does not receive push notifications. This requires a real device!!

Attaching and testing on a real device is lengthy, difficult and frustrating process! You have to understand a lot of concepts. This article does a good job in helping you understand this.

*Code Organization:*

In Xcode, all the files are laid out in the same directory! XCode provides grouping of files so they can better organized in the IDE:

{% include illustration.html param="XCode Directory1;XCode Directory1;/images/2013-12-26/Directory.png" %}

Initially I found this very frustrating but then I got used to it. I still prefer the VS or Eclipse way of doing things though.

By default, the linkage to frameworks and libraries and the header search paths are all hard-coded. This becomes obvious the minute you share your workspace or project with someone else. You have to go to the project settings (many tabs and many options) and set the paths properly using ${src_path} or $SOURCEPATH. This could be a very frustrating experience to new users.

I have a static library where I stash away all the common code and a UI project for each app flavor that I have. I created a workspace that contains all 3 projects. It feels very similar to Eclipse's workspace and Visual Studio's solution. Although referencing one project from another is straightforward in Eclipse and VS ...not so in Xcode.

Git support comes in bundled in ...so this was a great plus for me as I now use GitHub for almost everything.

App Architecture:
=================

Most of the sample code I have seen in iOS and Objective C tends to place most of the code in the View Controllers and the App Delegate classes. This might be acceptable in small apps that are usually created and maintained by one person. However, for slightly larger apps where maintainability is a must, the all-in-one-place architecture does not cut it. This is nothing specific to iOS and it also applies to Android and Windows Phone but the sample code and the general Apple literature encourage (or does not frown strong enough) on this behavior.

In my learning phase, I did the same thing.....I lumped most everything in the view controllers and the app delegate classes. So I handled the location update in one of my view controllers and the remote and local notifications in my app delegate. When I was done, the app did run well but I ended up with difficult-to-maintain and difficult-to-test code. It was time for my second step. ....code refactoring and re-architecture.

Being familiar with Windows Phone development which does encourage (but not enforce) better separation of concerns and better architecture, I wanted to apply these same concepts to my new iOS app!! The result, I think, is a much better code base and easier to maintain and test code.

Here is the macro architecture my app:

{% include illustration.html param="iOS App Architecture;iOS App Architecture;/images/2013-12-26/Symphony-iOS-App-Architecture.jpg" %}

Ideally I should have added another layer of view models (to pair with the view controllers)! These view models will contain the actual code and interaction with the services and they will be the thing to test while the view controllers will contain interaction with UI elements only. Given the current architecture, the view controllers are doing UI controls and services orchestration which is too much and cause a mixture of concerns. However I voted against adding the view model layer for following reasons:

* There is no easy way to pair the view controllers with their data context (as they are called in Windows Phone). In XAML (Microsoft UI design language), the view model can be instantiated from within it which makes them quite ideal.
* There is data binding mechanism in iOS like there is in Windows Phone. The data context (which usually will be represented by a view model) can provide data to the views (via binding) and can also provide commands (like clicks) from the UI elements. The data binding and the command processing places most of the business rules in the view model away from actual views. In my opinion, this abstraction is extremely valuable as it allows the views (and their code behind) to be built separately from the view models. The view models can also be tested in a mock-up environment by injecting mock up services.
* Forcing a view models layer in my app would work though but it will not be mainstream code and it will feel like trying to shove a square peg in a round hole.

*My main objectives:*

Produce an easier-to-test and easier-to-maintain source code with proper separation of concerns. The front-end developer(s) will be restricted to the storyboard and the view controllers while the back-end developer will be concerned with everything else.

*Services:*

Briefly, I created 8 services to deal with the different aspect of the app functionality:

* Data Service - employs repositories which would know how to communicate (i.e. serialization) with the service side services. The repositories use a caching layer to help save a server trip whenever possible. The data service formats the data in such a way that makes sense to the App UI.
* Error Service - centralizes all error processing in the app. This allows me to process errors properly for all aspects of the app.
* Location Service - receives location changes from the app. It handles foreground and background processes.
* Local Storage Service - persists certain app objects to the local file storage. I use this to store favorites and other client-side models.
* Local Notification Service - handles all immediate and scheduled local notifications
* Remote Notification Service - registers the device with a remote notification hub (in my case Windows Azure Notification Hubs) so the device can received push notifications
* Navigation Service - handles the navigation from one page to another.

In order to reduce the hard dependency of these services on the view controllers and the App delegate, I created protocols (i.e. delegates) to abstract away the actual implementation. Doing so also allows me to replace the actual services with mock-up services for testing.

{% include illustration.html param="XCode Directory1;XCode Directory2;/images/2013-12-26/Directory2.png" %}

The view controllers and the app delegate use a home-brewed DI (Dependency Injector) that will property inject the services into their the view controllers and app delegate. I could not find many DIs in iOS ...and the ones that I found are a bit complicated. So I did my own...it is rudimentary ...but it does the job. Services can also rely on other services..so the DI can also inject in services.

*Navigation:*

All the services worked out pretty well! The only one that I could not accomplish is the navigation service. Perhaps the biggest reason is that the navigation is tightly coupled with the story boards via the Segues! It is quite difficult to separate the two. In Android, Intents are used to navigate to different screens (i.e. activities) and carry data. In Windows Phone, a URL-like navigation mechanism is used to address the destination page and carry parameterized data. Although the iOS storyboard is quite powerful, I wish there was a way to do navigation from a centralized place to reduce the tight coupling between the storyboard and navigation.

*Repositories and caching*

I use repositories to perform network access to fetch data from my remote server. The repositories are responsible for converting the server model data to the client model data and bunch of other things. Some repositories use caching to save some round trip trips to the server. The caching layer is not sophisticated but it will do. It only use in-memory dictionary to store cache keys against the JSON payload. The caching policy determines when a cache is stale. Repositories can be instantiated with caching support or without.

*Threading*

Because we don't want to block the main UI thread, we must employ some asynchronous calls on different threads when we access network data or any operation that is bound to take a long time. This is needed in all mobile platforms. Android provides AsyncTask which is a very convenient way to delegate long-running task to a different thread and receive the results back on the UI thread. Windows Phone uses the async/await paradigm which makes it really easy to write async code. iOS has several ways to employ tasks...all of which are not straight forward. You can dip down to the C level and use the POSIX threads but this is not a very trivial exercise. Apple introduced GCD (Grand Central Dispatch) which reduces the burden of programming for multi-core and multiple threads. GCD uses queues you can dispatch things to it. There are 3 different types of queues: serial, concurrent and main. You can read more about this stuff in Apple developer documentation and/or the book mentioned above.

I ended up using NSOPerationQueue and NSOperation. I create NSOperationQueue and queue things to it. When done, I will call a call back block that runs on the main thread. This is an example:

```
-(void) summariesWithParams:(SearchParams *) params andCallback:(MultipleItemsBlock)callback {
    [self.queue addOperationWithBlock:^{
        NSMutableArray * items = [self.thingsRepository summariesWithParams:params];
        [[NSOperationQueue mainQueue] addOperationWithBlock:^{
            callback(items, nil);
        }];
    }];
}
```

where I declared my queue to look like this:

```
@property (nonatomic, strong) NSOperationQueue * queue;
```

and the multipleItemsBlock declared this way:

```
typedef void (^ MultipleItemsBlock)(NSMutableArray * items, NSError * error);
```

The client (i.e. a view controller) will call the service method this way:

```
[self.dataService summariesWithParams:params
									 andCallback:^(NSMutableArray *items, NSError *error) {
	 if (error) {
			[self.errorService errorDidOccur:error andCallback:^(NSError *error) {
				NSLog(@"SampleViewController - errorDidOccur %@", error);
			}];
	 } else {
		 // Update the view controller data source
		 self.hotels = items;
		 // Reload the table view data
		 [self.tableView reloadData];
	 }
 }];
```

So basically the view controller will use the data service to retrieve items. The service queues up the request using an NSOperation on its NSOperationQueue. When done, the service will call back the view controller's block on the main thread. Please note how the service queues the callback on the main thread:

```
[[NSOperationQueue mainQueue] addOperationWithBlock:^{
            callback(items, nil);
        }];
```

I really like that! It is quite powerful and clean.

Conclusion:
==========

Apple is very successful because they know how to package things well for the consumers and users. iOS developers are under the mercy of the users because Apple empowers the users by making sure they have the best experience. Android, on the other hand, seems to favor developers and does a fair job protecting the users. Windows Phone strikes a reasonable balance.

Having worked and produced apps in all three mobile platforms, I conclude that, from a developer's perspective, Microsoft provides better developer tooling and better endorsement of programming concepts and patterns. Their UI controls are also top notch. Android brings in a very clever and pleasant programming model but lacks in the UI aspects. iOS does an excellent job in the UI but offers less for developers when it comes to code organization and tools.

From a user's perspective, needless to mention that Apple rules because they cater for the users a lot more than the other two. Android is also not doing bad at all because there are many mobile manufacturers who are using Android and hence most mobile devices are actually Android. Windows Phone comes in trailing badly behind Apple's iOS and Google's Android. If I were to guess why this is the case (although the WP platform is quite strong), I would come up with two main reasons:

* No one likes Microsoft!! For some reason, Microsoft developed this bad reputation of being disliked by a lot of folks. I think this is due to the monopoly they imposed on the PC software for many years. I really think Microsoft has made an ideological shift in the past couple of years and they are not the same monster they once were. To a lot of users, opting for Apple devices and Android devices is a cry of independence from Microsoft.
* Microsoft developers are mainly enterprise developers! Android and Apple app developers are usually smart folks with entrepreneurial/startup personality. The enterprise developers tend to take more time on architecture and design because their apps have much longer life span and therefore code maintainability must be catered for.

Learning iOS and Objective C was well worth it for me. I encourage anyone who wants to create apps for Apple devices to do the same. HTML5 is still in the infancy stages but has a very bright future. Comparing the 3 different mobile mobile platforms (Apple's iOS, Google's Android and Microsoft's Windows Phone) gives you better perspectives on things.

References:
==========

* Storyboards Tutorial in iOS7: [http://www.raywenderlich.com/50308/storyboards-tutorial-in-ios-7-part-1](http://www.raywenderlich.com/50308/storyboards-tutorial-in-ios-7-part-1)
* Static Libraries: [http://www.raywenderlich.com/41377/creating-a-static-library-in-ios-tutorial](http://www.raywenderlich.com/41377/creating-a-static-library-in-ios-tutorial)
* NSOperation Tutorial - important: [http://www.raywenderlich.com/19788/how-to-use-nsoperations-and-nsoperationqueues](http://www.raywenderlich.com/19788/how-to-use-nsoperations-and-nsoperationqueues)
* iOS 7 by tutorials: [http://www.raywenderlich.com/store/ios-7-by-tutorials](http://www.raywenderlich.com/store/ios-7-by-tutorials)