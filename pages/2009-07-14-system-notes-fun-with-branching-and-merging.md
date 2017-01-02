---
layout: post
title: 'System Notes - Fun with branching and merging '
created: 1247580183
categories:
- system notes
---
 Note: My company recently started using Mercurial.  I wrote this article to provide some education on the value of branches. 

There have been some emails flying around discussing making branches so we can &ldquo;isolate changes.&rdquo; I thought some discussion of what a branch is and what it is good for was warranted.
 
A branch isn&rsquo;t anything complicated. It is simply a way for to make some changes without sharing them with everyone else. Jeff Atwood  describes branching as a parallel universe . "They're places where, for whatever reason, history didn't go quite the same way as it did in your universe." In our company, we could have used a "parallel universe" to: 

*  Upgrade to a new compiler while everyone else works on the old one.
*  Add in a new graphics engine without lots of ugly preprocessor macros
*  Develop a new feature that is poorly defined and therefore risky

Branching would have simplified the contention developers from different parts of the company faced.
 
To get technical, in mercurial anytime two changesets are committed against a common parent, a branch is created. A simple illustration shows how this works.
 
 
L:\illustration&#62;hg commit -A -m &#34;root&#34;
adding test.txt


&#60;&#60;do some work&#62;&#62;

L:\illustration&#62;hg commit -m &#34;branch a&#34;
 
 
Back up to a parent changeset. Remember, branches are created by making multiple commits to a given changeset.
 L:\illustration&#62;hg up 0 
1 files updated, 0 files merged, 0 files removed, 0 files unresolved

&#60;&#60;do some work&#62;&#62;

L:\illustration&#62;hg commit -m &#34;branch b&#34;

created new head

L:\illustration&#62;hg glog
&#64;  changeset:   2:fa2d515d48a1
&#124;  tag:         tip
&#124;  parent:      0:376cbd5c11ae
&#124;  user:        Ben Mathews &#60;Ben.Mathews&#64;HexagonMetrology.com&#62;
&#124;  date:        Mon Jul 13 12:52:11 2009 -0600
&#124;  summary:     branch b

&#124;
&#124; o  changeset:   1:b4376a3bc2af
&#124;/   user:        Ben Mathews &#60;Ben.Mathews&#64;HexagonMetrology.com&#62;
&#124;    date:        Mon Jul 13 12:51:52 2009 -0600
&#124;    summary:     branch a
&#124;
o  changeset:   0:376cbd5c11ae
   user:        Ben Mathews &#60;Ben.Mathews&#64;HexagonMetrology.com&#62;
   date:        Mon Jul 13 12:51:23 2009 -0600
   summary:     root

 
 
This gives us a TortoiseHg changelog like this  ___img width="232" alt="simplebranch.png" src="http://mathews2000.com/drupal/files/simplebranch.png" height="66" />
 
    Complications  
 Nothing comes free in life, and branching does have its problems. There is some complexity tracking which changes are where and eventually, those parallel universes have to be merged back together.
 
There is a trade off between complexity and code safety. No branches avoids all the complexity, but gives us none of the benefits. Thousands of branches buries the benefits in the overhead of tracking and maintaining them. At some point in the middle, there is a sweet spot where branches protect the source code, but are not too much hassle the work with.
 
    Merging without branches  
 Branches give the appearance of causing merge problems because we often procrastinate merging branches until it is really hard. But, what branches really do is give you control when the merging is done. If we worked on one mainline with no branches, we still have to merge our work with other developers. The difference is we have no control over when the merging is done. The timing is dictated by when the other programmers push their changes to the server, not when it is convenient for me to merge. With branches, I decided when I want to incorporate others work into mine. Lets look how this works

 
 
&#60;&#60;do some work&#62;&#62;

L:\illustration\client&#62;hg commit -A -m &#34;more work&#34;
  Meanwhile, the other guy is working away and beats you pushing code up  
&#60;&#60;do some work&#62;&#62;

L:\illustration\client2&#62;hg commit -m &#34;other guys work&#34;

L:\illustration\client2&#62;hg push
pushing to l:\illustration\server
searching for changes
adding changesets
adding manifests
adding file changes
added 1 changesets with 1 changes to 1 files
 
 
This means you can't push without doing the whole pull, merge routine. (You have had to do this a couple times right?)
 
L:\illustration\client&#62;hg push
pushing to l:\illustration\server
searching for changes
abort: push creates new remote heads!
(did you forget to merge? use push -f to force)

L:\illustration\client&#62;hg pull
pulling from l:\illustration\server
searching for changes
adding changesets
adding manifests
adding file changes
added 1 changesets with 1 changes to 1 files (+1 heads)
(run &#39;hg heads&#39; to see heads, &#39;hg merge&#39; to merge)

L:\illustration\client&#62;hg merge
merging test.txt
0 files updated, 1 files merged, 0 files removed, 0 files unresolved
(branch merge, don&#39;t forget to commit)

L:\illustration\client&#62;hg commit

L:\illustration\client&#62;hg push
pushing to l:\illustration\server
searching for changes
adding changesets
adding manifests
adding file changes
added 2 changesets with 2 changes to 1 files

  ___img width="320" alt="mergeconflicts.png" src="http://mathews2000.com/drupal/files/mergeconflicts.png" height="96" />
 
Using this method, your changelog will start to get a lot of these loops in it. A couple times doing this and it gets frustrating. I've heard some of this frustration and sympathize with you. Frustration naturally begets shortcuts like not compiling a merge or testing completely. Let us look at an easier alternative using branches.
 
    Merging with branches  
 Here we use a model were our changes stay on a branch until we are done with them. To ease merging at the end of what could be a long running branch, we ocasionaly do a reverse merge, pulling others changes into our branch. When we are done, we merge our changes into the mainline.
 
We want to create a branch, so go ahead and force a push that creates multiple heads.
 
L:\illustration2\client1&#62;hg push
pushing to l:\illustration2\server
searching for changes
abort: push creates new remote heads!
(did you forget to merge? use push -f to force)

L:\illustration2\client1&#62;hg push -f
pushing to l:\illustration2\server
searching for changes
adding changesets
adding manifests
adding file changes
added 1 changesets with 0 changes to 1 files (+1 heads)
 

 
Now, we do some more work uninteruppted by others changes. However, we can't ignore others changes completely. Every change you and the other guys make is diverging the two branches. You could wait until the end of your efforts to merge the other guys changes in, but that would probably be really hard. To make it easier, ocassionally pull in others changes to your branch.
 
L:\illustration2\client1&#62;hg pull
pulling from l:\illustration2\server
searching for changes
adding changesets
adding manifests
adding file changes
added 4 changesets with 2 changes to 1 files (+1 heads)
(run &#39;hg heads&#39; to see heads, &#39;hg merge&#39; to merge)

L:\illustration2\client1&#62;hg merge
merging test.txt
0 files updated, 1 files merged, 0 files removed, 0 files unresolved
(branch merge, don&#39;t forget to commit)
  ___img width="224" alt="branchreverseintegration.png" src="http://mathews2000.com/drupal/files/branchreverseintegration.png" height="213" />
 
Eventually, you have finished with this branch and are ready to merge it back to the mainline. Switch to the mainline and merge the branch into it.

 
L:\illustration2\client1&#62;hg up 10 -C
1 files updated, 0 files merged, 0 files removed, 0 files unresolved

L:\illustration2\client1&#62;hg merge
merging test.txt
0 files updated, 1 files merged, 0 files removed, 0 files unresolved
(branch merge, don&#39;t forget to commit)

L:\illustration2\client1&#62;hg commit
  ___img width="392" alt="branchend.png" src="http://mathews2000.com/drupal/files/branchend.png" height="283" />
