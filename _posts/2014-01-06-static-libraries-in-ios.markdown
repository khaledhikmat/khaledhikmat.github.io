---
layout: post
title:  "Static Libraries in iOS"
date:   2014-01-06 20:14:01
summary: "A sample of how to create static libraries in iOS"
categories: Technical
tags: iOS Static Libraries
featured_image: /images/cover.jpg
---

As you develop more and more iOS apps, you will realize you will need the same set of utilities and base classes in all your app projects. You can place this common or shared code in a shared static library and include it in all of your projects.

In this post, I will explain how to create and use a very simple static library in IOS that contains some util functions. The main objective is to show how to create and use a static library so you don't have to jump through hoops like I did!! Hence the library itself will be quite simple.

### Creating a static library:

Let us start by creating a static library in Xcode:

![Distribution by committer]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-15.15.36.png)  

![Distribution by committer]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-15.18.35.png)  

Once the library is created, let us create a Utils class that inherits from NSObject:

![Distribution by committer]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-15.20.25.png)  

Let us add code to the Utils.h file:

```
//
//  Utils.h
//  MySharedLib
//
//  Created by Khaled Hikmat on 1/6/14.
//  Copyright (c) 2014 Blogs. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Utils : NSObject
+ (NSDate *) dateFromUnixDate:(NSString *)unix;
+ (int) indexOfText:(NSString *)text inSentence:(NSString *)sentence;
+ (BOOL) date:(NSDate *)date isBetweenDate:(NSDate *)beginDate andDate:(NSDate *)endDate;
+ (int) hoursBetweenDate:(NSDate *)fromDate andDate:(NSDate *)toDate;
+ (int) monthsBetweenDate:(NSDate *)fromDate andDate:(NSDate *)toDate;
+ (int) yearsBetweenDate:(NSDate *)fromDate andDate:(NSDate *)toDate;
@end
```

and implement the Utils methods in the implementation file Utils.m:

```
//
//  Utils.m
//  MySharedLib
//
//  Created by Khaled Hikmat on 1/6/14.
//  Copyright (c) 2014 Blogs. All rights reserved.
//

#import "Utils.h"

@implementation Utils
// Converts from JSON Unix Date (in .NET): /Date(1303884000000)/
+ (NSDate *) dateFromUnixDate:(NSString *)unix {
    NSDate * date = nil;
    
    @try {
        int index = [Utils indexOfText:@"(" inSentence:unix];
        if (index != -1) {
            NSString * newDate = @"";
            newDate = [unix substringWithRange:NSMakeRange(index+1, 13)];
            if ([newDate longLongValue] > 0) {
                NSTimeInterval interval = [newDate longLongValue] / 1000;
                date = [NSDate dateWithTimeIntervalSince1970:interval];
            }
        }
    }
    @catch (NSException *exception) {
    }
    @finally {
    }
    
    return date;
}

+ (int) indexOfText:(NSString *)text inSentence:(NSString *)sentence {
    NSRange range = [sentence rangeOfString:text];
    if (range.length > 0)
        return range.location;
    else
        return -1;
}

+ (BOOL) date:(NSDate *)date isBetweenDate:(NSDate *)beginDate andDate:(NSDate *)endDate {
    if ([date compare:beginDate] == NSOrderedAscending)
        return NO;
    
    if ([date compare:endDate] == NSOrderedAscending)
        return NO;
    
    return YES;
}

+ (int) hoursBetweenDate:(NSDate *)fromDate andDate:(NSDate *)toDate {
    NSDateComponents * components;
    NSInteger hours;
    
    components = [[NSCalendar currentCalendar] components: NSHourCalendarUnit fromDate:fromDate toDate:toDate options:0];
    hours = [components hour];
    return hours;
}

+ (int) monthsBetweenDate:(NSDate *)fromDate andDate:(NSDate *)toDate {
    NSDateComponents * components;
    NSInteger months;
    
    components = [[NSCalendar currentCalendar] components: NSMonthCalendarUnit fromDate:fromDate toDate:toDate options:0];
    months = [components month];
    return months;
}

+ (int) yearsBetweenDate:(NSDate *)fromDate andDate:(NSDate *)toDate {
    NSDateComponents * components;
    NSInteger years;
    
    components = [[NSCalendar currentCalendar] components: NSYearCalendarUnit fromDate:fromDate toDate:toDate options:0];
    years = [components year];
    return years;
}
@end
```

Compile to make sure that the library has no errors.

So now we have some static useful Util methods that are part of a static library. We would like to make these methods available to any iOS app project that we work on. You can add more classes to the static library but, for the sake of this post, I will keep it simple. In my shared library, I have generic classes that I use as base classes for a lot of my code.

Before we create a new project to use the newly created static library in, let us briefly discuss the library's output. There are two things: the include files (i.e. Utils.h) and the library binary. The library's binary is of type .a. In order to let the library know to include the Util.h that we just created, we need to tell it to include it in its output. Open the static library project settings and navigate to the Build Phases -> Copy Files:

![Distribution by committer]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-15.40.29.png)  

Click the little plus sign to add additional header files:

![Distribution by committer]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-15.40.38.png)  

![Distribution by committer]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-15.40.56.png)  

At the end, your project's build phases should look like something like this:

![Distribution by committer]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-15.41.12.png)  

Now the library knows to include the Utils.h in its output. Having done that, make sure you re-compile the library and let us examine the actual output in Finder. Expand the 'Products' folder in Xcode and right-click the libMySharedLib.a:

![Distribution by committer]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-15.41.39.png)  

This launches the Finder to show the output:

![Distribution by committer]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-15.42.05.png)  

You will see that output consists of the .a file and the include files. By the way, Xcode includes the MySharedLib.h automatically in the output. I see lots of libraries that place all the headers in the main include file (i.e. MySharedLib.h), but I do prefer different header files.

*IMPORTANT*:
Please note that static libraries do not have universal binaries. In other words, if you compile the library while an iOS device is the target, you will get ARM object code. Otherwise, you will get x86 object code (for the simulators). If you want your library's output to support both architectures, you will have to use a tool called 'LIPO'. There is a reference at the end of this post that refers to another post that deals with this issue in a very clear way.

### Using the static library:

To use our newly created static library, let us create an iOS app...any thing will do. For this demo, I created a Single Page iOS App.

Before we can use the library, let us create a folder in the App's directory with the name of 'MySharedLib'. This folder should contain the headers and the .a file from the library's output. The App folder might look something like this:

![UI View Item]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-18.57.06.png)  

Now that we copied the library's output to the app's folder, we can tell the app to link it in statically and make its header files known to the app.

Access the project settings (General -> Linked Frameworks and Libraries) and add the MySharedLib to the project's linking:

![UI View Item]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-17.03.05.png)  

Click 'Add Others' to open up the additional menu. Navigate to the mySharedLib .a and choose it:
![UI View Item]({{ site.baseurl }}/images/2014-01-06/Screenshot-2014-01-06-17.03.20.png)  

Access the project settings (Build Settings -> Search Paths ...make sure you are in the 'All' level not 'Basic'). Change both the header and library search path to be:

```
${SOURCE_ROOT}/MySharedLib
```

Notice how we are pointing to the directory that we created within our project. Now that we have our app project linked to the library and knows how to search for its headers, we can modify the ViewController code to import the library's Utils.h and use it like so:

```
//
//  ViewController.m
//  MyApp
//
//  Created by Khaled Hikmat on 1/6/14.
//  Copyright (c) 2014 Blogs. All rights reserved.
//

#import "ViewController.h"

#import 

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // Use a method from Utils in MySharedLib:
    NSLog(@"Index of 'hat' in 'Cat in the hat' is %i", [Utils indexOfText:@"hat" inSentence:@"Cat in the hat"]);
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
```

Please note that we are using the library import as opposed to the file import (notice the brackets as opposed to the double quotation):

```
#import <Utils.h>
```

Static libraries allow us to manage our code properly and reduce the code duplication. After I wrote this article, I noticed there is a much detailed post/tutorial about iOS static libraries [here](http://www.raywenderlich.com/41377/creating-a-static-library-in-ios-tutorial) which digs into more details and further explains what you need to do to make your library have universal binaries to it can run on the ARM and x86 architectures.
