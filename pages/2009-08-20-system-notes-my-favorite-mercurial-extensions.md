---
layout: post
title: 'System Notes - My favorite mercurial extensions '
created: 1250808747
categories:
- system notes
---
<p />
<a name="foswikiTOC"></a><div class="foswikiToc"> <ul>

<li> <a href="#alias_user_defined_command_alias"> alias - user-defined command aliases</a>
</li> <li> <a href="#pbranch_Collaborative_and_or_lon"> pbranch - Collaborative and/or long-term patch development and maintenance</a>
</li> <li> <a href="#purge_all_files_and_dirs_in_the"> purge - all files and dirs in the repository that are not being tracked by Mercurial</a>
</li> <li> <a href="#convert_Convert_repositories_fro"> convert - Convert repositories from other SCMs into Mercurial</a>

</li> <li> <a href="#share_Share_repository_history_b"> share - Share repository history between multiple repos</a>
</li></ul> 
</div>
<p />
<h1><a name="alias_user_defined_command_alias"></a> <a href="http://mercurial.selenic.com/wiki/AliasExtension" target="_top">alias</a> - user-defined command aliases </h1>
I love my command line, but don't like typing long commands over and over.  Alias makes it all work out.  Instead of typing <code>hg pull ssh://hg@mercurial.wilcoxassoc.com/PcDmis/QA</code>, I simply type <code>hg pullQ</code>.  I've got about 10 entries in my mercurial.ini that cover all the normal commands I might type.

<p />
<h1><a name="pbranch_Collaborative_and_or_lon"></a> <a href="http://mercurial.selenic.com/wiki/PatchBranchExtension" target="_top">pbranch</a> - Collaborative and/or long-term patch development and maintenance </h1>
I was initially quite excited about Attic/Shelve which allows a user to convinently shelve changes for later use.  After more review, I found Attic too simplistic.  The extension author advertises it for "quick and dirty" patch mangement, but I wanted more.  Mq promises the ability to do almost magical things with a mercurial repository.  I found it too complex and error prone for my taste.  It is bolted on top of mercurial instead of using it and has ways of loosing work.  Mq also lacks the ability to have multiple lines of development which to my mind is the primary reason to have patches.
<p />
Pbranch seems to solve my problems with Attic and Mq.  It has all the power I could hope for.  It uses Mercurial concepts so I didn't have to learn much to feel comfortable.  If you already understand committing and named branches, there isn't much left to learn.
<p />
A typical workflow might look like this:
<p />
Create a new patch
<pre>>>>hg pnew NewPatch
marked working directory as branch NewPatch

do some work...

>>>hg commit -m"work"

do some more work...

>>>hg commit -m"more work"</pre>
<p />
Show your patch graph

<pre>>>>hg pgraph
@  NewPatch
|
o  default
</pre>
<p />
Your patch is marked as starting at a given changeset.  Others work needs to be pulled into your patch
<pre>>>>hg pmerge
NewPatch: merging from default
merging asdf
0 files updated, 1 files merged, 0 files removed, 0 files unresolved
.hgpatchinfo/NewPatch.dep already tracked!</pre>
<p />
<p />
You can see in the graphical log what happened.  PGraph pulled the changes on mainline into the patch
<pre>>>>hg glog
@    changeset:   5:c76094c77c8f
|\   branch:      NewPatch
| |  tag:         tip
| |  parent:      3:9ace0ba2d369
| |  parent:      4:329504378326
| |  user:        Ben Mathews <Ben.Mathews@HexagonMetrology.com>
| |  date:        Thu Aug 20 16:07:09 2009 -0600
| |  summary:     merge of default
| |
| o  changeset:   4:329504378326
| |  parent:      0:30a5ae17ec4d
| |  user:        Ben Mathews <Ben.Mathews@HexagonMetrology.com>
| |  date:        Thu Aug 20 16:06:58 2009 -0600
| |  summary:     work on mainline
| |
o |  changeset:   3:9ace0ba2d369
| |  branch:      NewPatch
| |  user:        Ben Mathews <Ben.Mathews@HexagonMetrology.com>
| |  date:        Thu Aug 20 16:06:24 2009 -0600
| |  summary:     more work
| |
o |  changeset:   2:f7e7988453c0
| |  branch:      NewPatch
| |  user:        Ben Mathews <Ben.Mathews@HexagonMetrology.com>

| |  date:        Thu Aug 20 16:06:10 2009 -0600
| |  summary:     work
| |
o |  changeset:   1:c5cd26061a49
|/   branch:      NewPatch
|    user:        Ben Mathews <Ben.Mathews@HexagonMetrology.com>
|    date:        Thu Aug 20 16:05:57 2009 -0600
|    summary:     start new patch on default
|
o  changeset:   0:30a5ae17ec4d
   user:        Ben Mathews <Ben.Mathews@HexagonMetrology.com>
   date:        Thu Aug 20 16:05:48 2009 -0600
   summary:     base</pre>
<p />
When it comes time to apply the patch, dump it out and apply it as a <em>real</em> changeset.
<pre>>>>hg pdiff > ..\patch

>>>hg up default
1 files updated, 0 files merged, 1 files removed, 0 files unresolved

>>>hg import -m"apply pbranch patch" ..\patch
applying ..\patch</pre>
<p />
<h1><a name="purge_all_files_and_dirs_in_the"></a> <a href="http://mercurial.selenic.com/wiki/PurgeExtension" target="_top">purge</a> - all files and dirs in the repository that are not being tracked by Mercurial </h1>

Purge is clean on steroids.  Running <code>purge --all</code> leaves your repository as if you just cloned it.  You are guaranteed no strange errors from left over obj and pch files.  This is a simple command, and I use it regularly.
<p />
<h1><a name="convert_Convert_repositories_fro"></a> <a href="http://mercurial.selenic.com/wiki/ConvertExtension" target="_top">convert</a> - Convert repositories from other SCMs into Mercurial </h1>
Unlike Purge, I don't use Convert very often.  When I do, it is pretty impressive.  The primary purpose of the extension is to import other source control systems into mercurial.  The part that I love though is its filemap feature.  Using it, I can slice and dice a repository into the shape I want it.  One recent case that I used it for was with our Math library.  I wanted to change the name of a directory and remove a couple of the files.  I could have renamed the directory and deleted the files, but then the history wouldn't have been consistent.  Using convert, I rewrote the history so that the it was as if the deleted files had never existed and the renamed files had always been renamed.
<p />
<h1><a name="share_Share_repository_history_b"></a> <a href="http://mercurial.selenic.com/wiki/ShareExtension" target="_top">share</a> - Share repository history between multiple repos </h1>

I like to keep several copies of our repository around so I can work on different projects.  This means that I'm always shuffling changesets around and never have all my copies quite up to date.  The share extension allows my several repositories to share one history store and only do one pull.
<p />
Because our repository is so large, having multiple clones causes problems with disk space.  Using the share extension, I can share most of the contents of the .hg directory (history) between multiple working directories.  A full clone of our repository takes 781mb on disk.  By using the share extension, I can reduce this to the 149mb that the tip revision takes when checked out into the working directory.  
