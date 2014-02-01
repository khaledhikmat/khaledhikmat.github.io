---
layout: post
title:  "TypeScript"
date:   2013-09-09 20:14:01
summary: "TypeScript and Web Essentials in VS2012"
categories: Technical
tags: TypeScript WebEssnetials
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

I have been using TypeScript with WebEssentials in Visual Studio 2012 for about 6-7 months and things are just great. For a non-JavaScript programmer, I love TypeScript! WebEssentials made it that much funner by integrating very well with the VS2012 and TypeScript environments.

This did not last that long! I upgraded to the latest TypeScript 0.9.1.1 and WebEssentials 3 . WE3 removed all TypeScript support!!!! Almost everything broke.

I had code that looked like this which no longer compiles:

```
    // Repositories Factory - produces singleton objects
    export class RepositoriesFactory {
        /*** Content Repositories ***/
        private static _hotelsRepository: IHotelsRepository = null;

        constructor() {
            throw new Error('RepositoriesFactory - You should not new this class!');
        }

        public static getHotelsRepository(logger: App.Utils.ILogger): IHotelsRepository {
            if (_hotelsRepository == null)
                _hotelsRepository = new HotelsRepository(logger);

            return _hotelsRepository;
        }
    }
```

until I changed it to this:

```
    // Repositories Factory - produces singleton objects
    export class RepositoriesFactory {
        /*** Content Repositories ***/
        private static _hotelsRepository: IHotelsRepository = null;

        constructor() {
            throw new Error('RepositoriesFactory - You should not new this class!');
        }

        public static getHotelsRepository(logger: App.Utils.ILogger): IHotelsRepository {
            if (RepositoriesFactory._hotelsRepository == null)
                RepositoriesFactory._hotelsRepository = new HotelsRepository(logger);

            return RepositoriesFactory._hotelsRepository;
        }
    }
```

In addition the type bool has been renamed to boolean in TypeScript 0.9 and the Definitely Typed declaration has been updated as well. So I had to re-get all the .d.ts files from the definitely typed repository.

Then I ran into a problem where my .ts files no longer auto-compile despite the settings in Tools -> Options -> Text Editor -> TypeScript -> Project that instructs TypeScript to Compile on Save ( I checked the two options: Automatically compile TypeScript files which are part of a project and the other). All the instructions that I found of changing the project file to do post or pre build commands did not work. The only thing that finally made it work for me is the NuGet package Ltc.MSBuild.TS0911WE3.targets mentioned in this Stackoverflow post. 

Now things are better but I lost two very nice feature that Web Essentials used to provide:

* Nesting the generated files behind the .ts files in the solution explorer
* The generation of the min JS file!

Very unfortunate!!! I hope these things will be recovered in the next TypeScript plugin release.