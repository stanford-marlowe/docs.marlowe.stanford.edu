---
title: "Marlowe User Filesystems"
permalink: /getting-started/filesystems.html
folder: getting-started
---


There are multiple filesystems available to end users on Marlowe.

## /users/

`/users/` is where a user's home directory lives. It is directly mapped to the `$HOME` variable, so whenever you run `cd ~` or `cd $HOME` you will be sent to `/users/<Your-sunet-ID>`.

For example, if my sunetID was `bob`, then my home directory on Marlowe would be `/users/bob`

Each directory in `/users/` is unique to that user.

`/users/` is backed up once every 24 hours.

{% include important.html content="Your home directory only has 32GB of storage available. For any large files or conda installs, we recommend using a different filesystem." %}


## /projects/

`/projects/` is the filesystem where all allocation project directories live.

When you are given an allocation, you are given a project ID. This project ID is also your directory in `/projects/`

For example: If your allocation's project ID was `m231631`, then your allocation's project folder would be `/projects/m231631/`

Directory quotas in `/projects/` vary depending on the amount approved in the allocation.

Every user added to an allocation shares the same `/projects/` folder. So `bob` and `amy` in project `m231631` would both have files in `/projects/m231631/`, but `greg` in project `m402630` would have files in `/projects/m402630`

`/projects/` is backed up once every 24 hours at 9:15pm.

{% include important.html content="Directories in `/projects/` are mounted as needed, so your specific folder may not show up when you login initially. `cd` to your project directory and it will show up until you log out." %}


Here is an example:

{% include image.html file="/assets/images/filesystems.gif" alt = "walkthrough of finding projects directory" %}

## /scratch/

`/scratch/` is the lustre filesystem meant (as the name implies) to be used as scratch storage.

Much like in `/projects/`, your `/scratch/` folder corresponds to your project ID. `/scratch/m231631`,`/scratch/m402630`, etc.

`/scratch/` is *not* backed up. Unlike `/users/` and `/projects/`, `/scratch/` is not replicated.

Allocations are given 20TB is `/scratch/` by default.
