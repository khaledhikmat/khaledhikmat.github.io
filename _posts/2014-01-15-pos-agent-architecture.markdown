---
layout: post
title:  "POS Agent Macro Architecture and Flow Diagram"
date:   2014-01-15 20:14:01
summary: "Shows the POS Agent Macro Architecture and the Flow Diagram"
categories: HMC Symphony Backend .NET POS Agent Architecture
tags: HMC Symphony Backend .NET POS Agent Architecture
project: Symphony
tagline: Symphony for .NET is an HMC Backend product
---

The POS Agent is mainly a .NET TCP/IP socket listener which listens to byte stream from the POS terminal. There is only one POS agent per hotel and hence it is '
capable of servicing multiple POS terminals.  

![Macro Architecture]({{ site.baseurl }}{{ site.url }}/images/SymphonyPOSAgentMacroArchitecture.png)

![Flow Diagram]({{ site.baseurl }}{{ site.url }}/images/SymphonyPOSAgentFlowDiagram.png)

{% include post-navigation.html %}

