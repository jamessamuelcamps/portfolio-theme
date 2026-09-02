---
title: "Portal Design System • Tide"
description: "Designing, implementing, and governing Tide’s multi-platform design system and component architecture across squads."
publishDate: 2024-10-18
client: "Tide"
role: "Lead Product Designer"
timeline: "Ongoing"
heroImage: "/images/projects/tide-portal-design-system/Portal-Thumbnail.png"
tags: ["Design Systems","UI Architecture","Figma to Code","Design Tokens"]
featured: true
order: 3
---

## Context

**The Brief**

Systematise and scale Tide’s UI patterns to unify the product experience across web and mobile while accelerating feature delivery.

**The Architectural Challenge**

Consolidating disjointed platform libraries, legacy design debt, and multi-region guidelines into a single-source-of-truth system backed by clear, accessible documentation.

**The Operational Win**

Elevated the profile of the design system business-wide, establishing self-service processes and component frameworks that saved extensive engineering time and increased overall shipping velocity.

* * *

## Research & Discovery

Survey

To better understand how the wider business works with the DS day-to-day, I sent a survey to all design, product and engineering teams. There were some clearly positive signs coming back, but then some not-so-positive ones too:

### 94%

interacted with the design system often (44% interacted with it every day)

### 49%

knew what the process was for creating or updating a component

### 88%

felt the reason we have a design system was clear

### 43%

felt there was a clear connection between the design components and codebase

### 81%

strongly agreed that we should adhere to the DS where possible

### 44%

knew which components should be used for a particular task

Proposal for further exploration

I set up a meeting with heads-of from engineering, product and design to present our findings and plan of action. I put forward proposals for:

![](/images/projects/tide-portal-design-system/time-estimates.png)

Time estimates

4 weeks of discovery, 8 weeks of design, split into 4x 2-week blocks

![](/images/projects/tide-portal-design-system/plan.png)

Plan of action

Catalogued, categorised by function, then prioritised into the 2-week blocks

![](/images/projects/tide-portal-design-system/governance.png)

Governance

Specific objectives for project success and a RACI for all involved stakeholders

![](/images/projects/tide-portal-design-system/roadmap.png)

Roadmap

Higher-level plan for incorporating some of the new UI into our existing apps, ahead of migration

This was received enthusiastically, so we started right away with our discovery phase: auditing the existing DS and researching best-in-class DS examples.

Objectives

I felt it was important to align the project to more vision-based objectives, rather than simply focus on deliverables.

![](/images/projects/tide-portal-design-system/portal-objectives-2.png)

Audit

Oscar and I completed an audit of our existing system, looking at 10 main factors.

![](/images/projects/tide-portal-design-system/audit-1.png)

![](/images/projects/tide-portal-design-system/audit-2.png)

![](/images/projects/tide-portal-design-system/audit-3.png)

![](/images/projects/tide-portal-design-system/audit-4.png)

* * *

## Design

Cross-platform approach

Initially we had planned to keep the two platforms (web and native app) separate.

As our discovery progressed this made less sense, especially as the web platform was going to be fully responsive to three breakpoints.

Why have two components in a library when one can work across both?

> This cross-platform foundation allowed us to create a single component library that supported both platforms, with 60% fewer components than before.

Creating components

Liam and I started working on the components I had outlined for each sprint. We had a visual direction to work with and I delegated most of the component construction to Liam, so that they would have a sole ‘owner’ and be more consistent. I provided creative direction, and defined the logic of how each new component would be used in future design work.

![](/images/projects/tide-portal-design-system/DS-elements.png)

![](/images/projects/tide-portal-design-system/web-app-responsive.png)

* * *

## Information Architecture

Both apps suffered from poor IA that had built up over time. When the web app was built it was given a completely different structure to the mobile app for some reason, so the location of features was inconsistent across platforms.

Meanwhile, lots of features had been added to the mobile app over the years, with little high-level product direction. Most new features had to live in ‘More’, which research had shown to have a very high failure rate for discoverability – as high as 80-90% in some cases.

![](/images/projects/tide-portal-design-system/charts1-1024x666.png)

![](/images/projects/tide-portal-design-system/charts2-1024x667.png)

As part of this project, we aligned the web app primary navigation to the mobile app, provided a scalable secondary nav component for both platforms, and separated options related to user details and preferences into a dedicated ‘user’ area.

![](/images/projects/tide-portal-design-system/int-model-web.png)

Structural model for web

Large view with sidesheet for displaying items and small tasks; medium view with visible primary nav; small view with expanded user menu.

All breakpoints feature a persistent secondary navigation where required

![](/images/projects/tide-portal-design-system/int-model-mobile.png)

Structural model for mobile app

Same primary navigation as web. Bottom sheets used to display overflow menus. Modal views for same purpose as sidesheets.

Tab controls and search incorporated into app header

* * *

## Documentation

To aid the designers in the team, and answer a pain point from my survey, I personally wrote over 100 pages of documentation for the components. I used Zeroheight, covering everything from correct component usage to writing consistent UX copy.

![](/images/projects/tide-portal-design-system/zeroheight-example-1-1024x640.png)

![](/images/projects/tide-portal-design-system/zeroheight-example-4-1024x640.png)

![](/images/projects/tide-portal-design-system/zeroheight-example-2-1-1024x640.png)

![](/images/projects/tide-portal-design-system/zeroheight-example-5-1024x640.png)

![](/images/projects/tide-portal-design-system/zeroheight-example-3-1024x640.png)

![](/images/projects/tide-portal-design-system/zeroheight-example-6-1024x640.png)

* * *

## Maintenance, ownership & advocacy

Contribution model

One key takeaway from my survey was that just over half of respondents didn’t know how to make updates to the DS. Engagement and participation are crucial to adoption; designers will feel much more invested and willing to use the DS if they feel they have a hand in its future.

Once the bulk of the design work with Liam was done, I began to work on the governance aspect. I conducted some research, consulted with our designers and engineers, and outlined a full end-to-end contribution model from initial idea to shipping finished code.

Enabling conversation

Once the DS was active, I started gathering feedback from the design team. The sentiment was positive, although many felt that the comms could be improved.

They wanted to know what updates were being made, how their suggestions were progressing and how they could ask questions about usage.

In response, I created a dedicated Slack channel where we would post all significant updates. I also hosted a weekly 30-minute clinic where designers could drop in and ask any questions or share work.

> After two months, around half of the design team had attended at least one session, and we had logged nearly ten significant updates to be carried out.

Delegating

Alex & I set up a steering committee to establish cross-department ownership. I reached out to seven senior engineers and PMs, and set up a monthly meeting, led by design, to discuss strategic concerns.

I also formalised a working group of two designers and two engineers, who would completely own the contribution process. They would be responsible for managing all component updates and comms to the wider business.

File structure

Finally, in order to ensure a seamless transition from one DS and product file set to another, the team needed a new set of files for the new design work to be completed in.

I set up an entirely new structure for all business areas — we now had clearer and lighter file structures, dedicated spaces for research/workshop materials, and more spaces for working and iteration.

* * *

## Conclusion

The Portal design system is one of my favourite projects that I’ve worked on. It was deeply collaborative, drove incredible efficiencies and communication within the team and beyond, and helped to elevate my personal profile within the business by giving me dedicated face-time with senior stakeholders.

Tide now has a dedicated design system team with several designers working on it – I am incredibly pleased that my efforts to kick this project off have really taken root and picked up by others.

Personal learnings

The main thing I learned from this project is that for all the talk of design systems, particularly within the Figma community, most of it relates to creating UI. There is very little information around the planning, execution and ongoing maintenance – the latter of which I believe is the most important aspect of design system management by far.

Beautiful UI is great but if your team don’t know how to use it, or feel that they can engage with it, then the whole thing will wither and die. Design systems need to be treated like products within themselves, with continuous ongoing development and input.

* * *

## Credits

**My role**  
Design/Strategic Lead

**Tools used**  
Figma  
Figjam  
Zeroheight  
Confluence  
Invision

**Date**  
Summer 2020-Apr 2022

**Team**  
Oscar Wong, Lead UI Designer  
Alex Frewin, Head of Product Design  
Liam Thomas, Product Designer  
Katie Hayward, UX Writer  
Tarunya Varma, Product Designer