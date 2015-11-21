---
layout: post
title:  "Azure Logic Apps Push Trigger"
date:   2015-11-15 20:14:01
summary: "Notes on Azure Logic Apps Push Triggers"
categories: Technical
tags: Azure, Logic Apps, Push Trigger
featured_image: /images/cover.jpg
---

I have been toying with Azure Logic Apps for a project I am working on. I wanted to run a Cloud-based work flow triggered by some events within some web app. This post discusses things I had to to go through to get push triggers working as triggered from web events.

_Please refer to Nicholas Hauenstein's Azure session referenced below in the reference section for a great introduction_

## Use Case

As part of a loyalty program system, membership voucher redemption requests arrive to a server via software agents installed at different hotels. Here is how the hotel POS Agent communicates with our Web API:

![POS Architecture](http://i.imgur.com/xquyGYG.png)

The Web API validates, processes the validation requests and updates a legacy database. It has been requested to enhance this functionality to add the following things when a voucher redemption takes place:

* Notify the member via SMS that a voucher has been successfully redeemed at certain hotel  
* Notify the member via push notification that a voucher has been redeemed
* Notify customer support via Email that member so and so has successfully redeemed a voucher at certain hotel  
* Register an event with the analytic server

Instead of building all the functionality in the Web API layer, we decided to trigger an Azure Logic app work flow that handles all these events in a Cloud service.
 
## Push Triggers

Logic Apps can be triggered using many different mechanisms. In our use case, we would like to use a push trigger so that the Web API can trigger the Logic App whenever a voucher request is successfully processed.

![Trigger Architecture](http://i.imgur.com/VzqsehB.png)

But how does the Web API know how to trigger the Logic App? It turned out that there is a need to create a special purpose API App whose main job is to receive callback registrations from the Logic apps so that when a service or a piece of software needs to trigger the logic app, it would look up the callback URL and trigger the logic app. 

![Callback Architecture](http://i.imgur.com/bu9XEze.png)

Ok....great...but more questions come to mind. How does the logic app register its callback URL with the the API App? It turned out that the minute you drop a push trigger API App in the Logic App overflow (via the designer or the JSON template), the logic app would register its callback URL by putting (using HTTP `PUT` verb) against the API App. This happens the second you save the work flow and also every hour (just to make sure that API App is aware of the callback URL).

_This is one thing that took me a while to figure out. In order to make sure that the logic app re-registers the callback, you need to remove the push trigger API from the work flow, save and then put it back and re-save._

What does the API App have to do to be considered as a push trigger API App? Well...it has to support at least one PUT verb with something similar to this signature:

```csharp
[HttpPut]
[Metadata("Mosaic Voucher Redemption Trigger")]
[Trigger(TriggerType.Push, typeof(VoucherRedemptionPushTriggerOutput))]
[Route("api/mosaic/voucherredemption/callbacks/{triggerId}", Name = "MosaicVoucherRedemptionTriggerCallback")]
public HttpResponseMessage RegisterMosaicVoucherRedemptionCallback(
    string triggerId,
    [FromBody]TriggerInput<VoucherRedemptionPushTriggerConfiguration, VoucherRedemptionPushTriggerOutput> parameters)
{
    try
    {
        // TODO: Add things here
        
        // Report back to the logic app that everything is happy
        return Request.PushTriggerRegistered(parameters.GetCallback());
    }
    catch (Exception e)
    {
        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, e.Message);
    }
}
```

An API App can contain multiple PUT signatures and hence it will be able to support multiple trigger callback registration endpoints.
  
The `triggerId` is usually the name of the Logic App. This allows the API App to serve multiple Logic Apps using multiple trigger ids. The `VoucherRedemptionPushTriggerConfiguration` defines the API App configuration model and finally the `VoucherRedemptionPushTriggerOutput` is the API app output model (i.e. input to the Logic app). In our case, here is how the configuration is defined:

```csharp
public class VoucherRedemptionPushTriggerConfiguration
{
    [Metadata("Web API Url")]
    public string Url { get; set; }

    [Metadata("Web API User Id")]
    public string UserId { get; set; }

    [Metadata("Web API Password")]
    public string Password { get; set; }

    [Metadata("Is Restricted?")]
    public bool IsRestricted { get; set; }

    [Metadata("Permitted agent codes (comma delimited)")]
    public string PermittedAgentCodes { get; set; }
}
```    
The above shows the configuration properties that are available for the push trigger API App to control the workflow.

```csharp
public class VoucherRedemptionPushTriggerOutput
{
    [Metadata("Activation Code")]
    public string ActivationCode { get; set; }

    [Metadata("Voucher Code")]
    public string VoucherCode { get; set; }

    [Metadata("Card Number")]
    public string CardNumber { get; set; }

    [Metadata("Transaction Date")]
    public DateTime TransactionDate { get; set; }

    [Metadata("Hotel")]
    public string Hotel { get; set; }

    [Metadata("Outlet")]
    public string Outlet { get; set; }

    [Metadata("City")]
    public string City { get; set; }

    [Metadata("Country")]
    public string Country { get; set; }

    [Metadata("First Name")]
    public string FirstName { get; set; }

    [Metadata("Last Name")]
    public string LastName { get; set; }

    [Metadata("Email")]
    public string Email { get; set; }

    [Metadata("Mobile Number")]
    public string MobileNumber { get; set; }
}
```   
The above shows the API App output properties (which is an input to the logic app).

So in summary, the logic app calls the PUT method of the Api APP and provides configuration structure (based on `VoucherRedemptionPushTriggerConfiguration`) and then expects to receive a call back from the trigger source providing data that matches the `VoucherRedemptionPushTriggerOutput`. The API App is not the trigger source...in our case, the trigger source is the Web API. Hence whenever the API App receives a callback registration from the a logic app, it posts the callback info to the Web API via an endpoint and return to the Logic app. In this case, the API App is nothing but a middle man that receives a callback info and knows how to distribute it to its intended recipients. This is because the logic app cannot communicate directly to the Web API. 

Of course, the API App may send the callback info to multiple trigger sources. All of them will become eligible to trigger the logic app.

Here is an illustration of the trigger phases:

![Trigger Phases](http://i.imgur.com/TM0MHgZ.png) 

## Logic App
 
Finally, using the Azure portal editor, you drop the trigger APP App in the editor and choose one of the triggers available in the API App (as mentioned, one API App may support multiple triggers). You fill out the configuration information:

![Trigger Configuration Info](http://i.imgur.com/vP76X5O.png)

and see the expected input from the trigger source:

![Trigger Input](http://i.imgur.com/5ACczU2.png)  

## References

* Nicholas Hauenstein - 2015 Azure Con session on [https://azure.microsoft.com/en-us/documentation/videos/azurecon-2015-processing-nfc-tag-reads-in-an-azure-app-service-logic-app/](Processing NFC tag reads in an Azure APP service service)

