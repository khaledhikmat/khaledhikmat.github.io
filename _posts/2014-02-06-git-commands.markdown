---
layout: post
title:  "Git commands"
date:   2014-02-06 20:14:01
summary: "A list of useful 'git' commands one might need on a daily basis if you work with git-based repositories"
categories: Technical
tags: Git
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

Configuration
=============

Git provides 3 levels of configurations:
* System-level:
	* git config --system
	* Stored in /etc/gitconfig or c:\Program Files (x86)\Git\etc\gitconfig
* User-level:
	* git config --global
	* Stored in ~/.gitconfig or c:\Users\<NAME>\.gitconfig
* Repository-level:
	* git config
	* Stored in .git/config in each repo

To list all global configuration options:
```
git config --global --list	
```

To add your your name, email, editor and help level:
```
git config --global user.name "Khaled Hikmat"	
git config --global user.email "khaled.hikmat@gmail.com"	
git config --global core.editor vim	
git config --global help.autocorrect 1	
git config --global color.ui auto	
git config --global core.autocrlf true (for Windows)	
git config --global core.autocrlf input (for Mac)
```

Aliasing:
```
git config --global alias.co "checkout"
```

Git configuration is heirarchical where the repo configuration overrides the global configuration and the global configuration overrides 
the system's.

Working Locally
===============

Create a new directory i.e. GitCommands
```
mkdir GitCommands
```

Initialize the directory for git
```
cd GitCommands
git init
ls -al
```

Check status
```
git status
```

Create new files 
```
echo "Hello World" > README.txt
git add README.txt
git status
git commit
git log
```

Commits Management and difference between the head and previous commits
```
git add -u (add all updated files)
git commit -m "Added a second line"
git log
git diff HEAD~1..HEAD (the difference between the latest minus one commit and the latest one)
git diff HEAD~1.. (same as above but abbreviated)
```

New files 
```
touch file1.txt file1.txt
git add -A (add added files)
commit -m "Added new feature" 
```

Stage as two different commits
```
git touch file3.txt
vim README.txt
git add file3.txt
git commit -m "Added new feaure"
git add file3.txt
git commit -m "Added new feaure"
git add README.txt
git commit -m "Updated README.txt"
``` 

File deletions
```
git rm file3.txt
git status
git add -u
```

File renaming
```
mv file4.txt new_file.txt
git add -A
git status
git commit -m "Refactored code"
```

Undo - revert changes
```
git checkout README.txt
git reset --hard (reset back to the head)
git reset --hard HEAD~1
git reset --soft HEAD~1
git clean -n (what would happen)
git clean -f (force)
```

Ignore files
```
vim .gitignore
/logs/*.txt (/ is the root of my repository)
logs/*.txt
```

Working Remotely
================

Cloning and examining logs - the entire history is available
```
git clone https://github.com/jquery/jquery.git (clone jquery locally)
cd jquery
git log
git log --oneline
git log --oneline | wc -l (line count) 
git log --oneline --graph
git log --format=short
git shortlog
git shortlog -sne (short + numerical + email)
```

Exmaining changes
```
git show HEAD
git show HEAD~1
git show <SHAW1>
```

Examining origin
```
git remote
git remote -v
```
Protocols
=========

* http and https, port 80 & 443, https://github.com/jquery/jquery.git
* git, port 9418, git://github.com/jquery/jquery.git
* ssh, port 22, git@github.com:jquery/jquery.git
* File, n/a, /Users/James/code/jquery

View Branches & tags
====================

```
cat .git/config
git branch
git branch -r
git tag
```

Create a new repository on the command line
===========================================

```
touch README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:khaledhikmat/GitCommands.git
git push -u origin master
```

Push an existing repository from the command line
=================================================

```
git remote add origin git@github.com:khaledhikmat/GitCommands.git
git push -u origin master
```

Tagging
=======

Gives you stable points in your release!!

```
git tag v1.0
git tag -a v1.0_with_message
git tag -a v1.0_with_message -m "Blah..."
git tag -s v1.0_signed (requires gnupq to verify)
git tag -v v1.0_with_message (cannot verify)
git push --tags
```

Branch Visualizations
======================

```
git log --oneline --graph --all --decorate
git config --global alias.lga "log --oneline --graph --all --decorate"
git lga
```

Branching, Merging and Rebasing
===============================

```
git branch feature1
git checkout feature1
git echo "Feature1" >> README.txt
git status
git commit -am "Added feature1"
git lga (HEAD now points to feature1)
git checkout master
git lga (HEAD now points to the last master commit)
```

You can get also base branches on a particlat shaw commoit
```
git branch Fix1 6993d83
git chekout Fix1
echo "Fixed bug 3123" >> README.txt
git commit -am "Fixed bug 3123"
git lga
```

Renaming a branch
```
git branch -m fix1 bug1234
```

Deleting a branch
```
git branch -d bug 1234 (not allowed because it is not committed)
git branch -D bug 1234 (force)
```

Recover  a deleted branch
```
git reflog
git branch 
```

Creating and checking out a branch (all in one):
```
git chekout -b feature2
```

Stashing
========

Don't want to lose work in progress

```
# Switch to feature2
git checkout feature2
# Do some work but could not complete it
echo "not completed Feature stuff" >> README.txt
git status
# Stash it away so I don't lose my changes
git stash 
# My changes on feature2 are rolled back into a stash area like a holding area
git status 
# This lists the stash area
git stash list
# Ok switch to another branch and fix buys and commit
git checkout feature1
echo "do real work on feature1" >> README.txt
git ccommit -am "Really goof stuff for feature1"
# Once done, switch back to feature2
git checkout feature2
# Re-apply the stash
git stash apply
# or (pop is the same as push...but pop removes it from my stash list)
git stach pop 
# or drop to drop the stash without applying
git stash drop
# If I decide that the stuff in the stash requires its own branch, this is very uesful: it creates a branch, applies the stash and checks it out
git stash branch feature2_advanced
```

Merging
=======

```
git checkout master
git merge feature1
# No longer need this label
git branch -d feature1
# Watch what happened
git lga
# Now let us merge feature2
git merge feature2
# Conflist? Either fix manually or
git mergetool
# Need to setup a merge tool (kdiff3)
git diff --cached
git commit -am "Fixed merge"
rm README.txt.orig
```

Checkout this [tutorial](http://jebaird.com/2013/07/08/setting-up-kdiff3-as-the-default-merge-tool-for-git-on-windows.html) to see how you setup kdiff3 as a merge tool for Windows.

Rebasing
========

```
git branch feature3 v1.0
git checkout feature3
notepad file.txt
git commit -am "Added things for feature3"
git lga
# But I really want to make it look like feature3 has been in master...soI want to rebase my master
git rebase master (git rebase continue)
git checkout master
3 Easy fast-forward merge
git merge feature 3 
```

Remote branching
================

```
git fetch
git push
git branch v1.0_fixes
# Now I can push my changes and create that same branch remotely thus exposing the branch
git push origin v1.0_fixes or git push origin v1.0_fixes:v1.0_my_great_stuff
git branch -r
````

Delete remote branch by pushing nothing into it
```
git push origin :v1.0_my_great_stuff
git push origin :v1.0_fixes
```

References
==========

* [Git Funamentals](http://pluralsight.com/training/Courses/TableOfContents/git-fundamentals) by James Kovacs
* [Introduction to Git](http://pluralsight.com/training/Courses/TableOfContents/introduction-to-git) by Geoffrey Grosenbach 

