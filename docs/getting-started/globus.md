---
title: "Transferring data using Globus"
toc: false
permalink: /getting-started/globus.html
folder: getting-started
---

Marlowe has a Globus DTN that can be accessed via the [Globus web ui](https://app.globus.org). You will need to sign in to Globus with your Stanford SUNet.

## Globus shares

You can transfer data directly through globus to three shares: `/scratch/`, `/projects/`, and `$HOME`.

All three are selectable as collections in the Globus file manager.

## I can't see my `/projects/` folder in Globus

Just like in the terminal, `/projects/` is mounted only as needed (an explanation is [here](https://docs.marlowe.stanford.edu/faq.html#i-cant-see-my-project-directory)).

To get your `/projects/` directory to show up, select the "Marlowe /projects directories" Globus collection, then manually type in your project ID *after* the slash.

Here's an example:

{% include image.html file="/assets/images/globus.gif" alt = "walkthrough of finding projects directory in globus" %}}