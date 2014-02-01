---
layout: post
title:  "Custom Views in iOS"
date:   2014-01-05 20:14:01
summary: "A sample of how to create custom views in iOS"
categories: Technical
tags: iOS Custom Views
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

Recently I started working on an iOS app ...so I had to learn the iOS platform and Objective C. For my experience on this, please check my post here.

In an effort to re-factor the code and make things more organized in my iOS app, I sat out to add custom views to my app. I discovered this is a very convoluted process and most the stackflow posts led me to confusions and different ways to do things. After several iterations and several hours, I came up with a reasonable approach. This post details what I did.

Assuming you have an iOS app based on storyboards (I am using iOS7 and Xcode 5), start by adding a new UI View item in Xcode. Let us call this new XIB file 'HeaderView.xib':

{% include illustration.html param="UI View Item;UI View Item;/images/2014-01-05/Screenshot-2014-01-05-14.49.19.png" %}

My test custom view is quite simple...it should only have a label and a button. Drag a label and a button so that it looks like this:

{% include illustration.html param="Label and a buttom;Label and a buttom;/images/2014-01-05/Screenshot-2014-01-05-14.52.17.png" %}

Add a new Objective C class and make it extend UIView. Let us call it HeaderView. So your project file hierarchy might look something like this:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-15.15.50.png" %}

Now comes the tricky part.... open up your XIB file and assign the file owner (in the placeholder) to the newly created HeaderView custom class:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-15.17.34.png" %}

But leave the View's custom class to UIView:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-15.17.52.png" %}

This is really important and it the source of my confusion when I read how other people have done this. Anyway, let make the custom view do something by creating an action from the button:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-14.54.58.png" %}

Now open up the Custom View .m file and add this method:

```
- (id) initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        HeaderView * hView = [[[NSBundle mainBundle] loadNibNamed:@"HeaderView" owner:self options:nil] lastObject];
        [self addSubview:hView];
    }
    return self;
}
```

Note the following about the above piece of code:

* We are overriding initWithCoder as opposed to initWithFrame. This is recommended in Apple's dev documentation.
* We are using the bundle to decode the XIB file. This returns an array ...we are using the last object and assign it to a local variable
* We are adding the newly loaded view as a subview

Your entire HeaderView.m file should look like something like this:

```
@implementation HeaderView

- (id) initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        HeaderView * hView = [[[NSBundle mainBundle] loadNibNamed:@"HeaderView" owner:self options:nil] lastObject];
        [self addSubview:hView];
    }
    return self;
}

#pragma Action Handlers

- (IBAction)buttonClicked:(id)sender {
}
@end
```

Now that we have this nifty custom view designed, let us test it out in a view controller. Create a new ViewController class called `TestCustomViewController`:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-15.22.32.png" %}

Drag in a new view controller to your storyboard. Assign the newly created view controller custom class to the view controller:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-15.24.56.png" %}

Drag a UIView to the view controller, size it manually and give it a background color so it becomes recognizable:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-15.27.30.png" %}

Now assign our custom view class i.e. HeaderView to this new UIView like so:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-15.29.14.png" %}

This new UIView that you dragged onto the view controller is actually a place holder. We will place our custom view inside it in a bit.

Now create an outlet in the TestCustomViewController.h for the new UIView:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-15.32.43.png" %}

Your TestCustiomViewController.h should look something like this:

```
#import <UIKit/UIKit.h>

#import "HeaderView.h"

@interface TestCustomViewController : UIViewController
@property (weak, nonatomic) IBOutlet HeaderView *headerView;

@end
```

When the view controller is loaded, the custom view is already loaded with it and the headerView property already contains an instance of the HeaderView. Verify this by running your app and navigate to the TestCustomViewController. You should see the custom view loaded in the place holder in the test view controller.

Now that the app is running and the view controller has an instance of the custom view, let us test that by adding a method in the custom view which we can call from the view controller. So add an API method in the HeaderView.h and implement it in the .m file like this:

```
@interface HeaderView : UIView
- (IBAction)buttonClicked:(id)sender;

-(void) sayHello;
@end
```

```
@implementation HeaderView

- (id) initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        HeaderView * hView = [[[NSBundle mainBundle] loadNibNamed:@"HeaderView" owner:self options:nil] lastObject];
        [self addSubview:hView];
    }
    return self;
}

#pragma Action Handlers

- (IBAction)buttonClicked:(id)sender {
}

#pragma Custom View APIs Implementation

-(void) sayHello {
    NSLog(@"Hello from my header view!!!");
}
@end
```

In the View Controller's viewDidLoad method, add a call to the 'sayHello' message and watch it appear in the output window:

```
- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    [self.headerView sayHello];
}
```

Great....now we have a way to create a custom view as XIB, load it in our view controller and communicate with it via a set of messages we define in its public interface.

one more thing left to do. Let us add a way to make the custom view pluggable in different view controllers. For example, we want to delegate processing the click handler to the view controller so it can do its thing. Let us define a new delegate like this:

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-16.16.12.png" %}

{% include illustration.html param="Header View;Header View;/images/2014-01-05/Screenshot-2014-01-05-16.16.32.png" %}

Your HeaderViewDelegate.h file should look something like this:

```
@protocol HeaderViewDelegate 
-(void) handleClick;
@end
```

Let us modify the ViewController to become an implementer of this protocol:

```
#import "HeaderView.h"
#import "HeaderViewDelegate.h"

@interface TestCustomViewController : UIViewController 
@property (weak, nonatomic) IBOutlet HeaderView *headerView;
@end
```

The TestCustomViewController.m file:

```
@implementation TestCustomViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    [self.headerView sayHello];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma HeaderViewDelegate Implementation

-(void) handleClick {
    NSLog(@"handleClick handler");
}
@end
```

Let us modify the HeaderView code to accept a delegate and call the delegate when the button is clicked. First the HeaderView.h:

```
#import <UIKit/UIKit.h>

#import "HeaderViewDelegate.h"

@interface HeaderView : UIView
@property (nonatomic) id delegate;

- (IBAction)buttonClicked:(id)sender;

-(void) sayHello;
@end
```

Modify the custom view implementation action handler method to look like this:

```
#pragma Action Handlers

- (IBAction)buttonClicked:(id)sender {
    if (self.delegate != nil)
        [self.delegate handleClick];
}
```

One final thing...let us assign the view controller to be the delegate for the custom view. So modify the view controller viewDidLoad method to look like this:

```
- (void)viewDidLoad
{
    [super viewDidLoad];

    // Assign self to be the delegate for the custom view
    self.headerView.delegate = self;

    // Do any additional setup after loading the view.
    [self.headerView sayHello];
}
```

Now if you run the app and click on the custom view's button, you should see the view controller's handleClick gets called.

Given this test custom view, you can build more sophisticated custom views that can plug in view controllers. The ability to delegate calls back to the view controllers decouples the view code from its parent.