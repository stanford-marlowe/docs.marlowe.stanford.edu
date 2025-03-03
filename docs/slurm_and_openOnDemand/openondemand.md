---
title: "Open OnDemand"
permalink: /openondemand.html
folder: slurm_and_openOnDemand
layout: default
toc: true
customjs: ./assets/js/connect.js
---

Marlowe has an Open OnDemand instance available at [https://ood.marlowe.stanford.edu](https://ood.marlowe.stanford.edu)

There are currently two interactive apps available for use on the Marlowe Open OnDemand instance: Jupyter Lab, and Code Server.

## Jupyter Lab

From the official [Jupyter Lab website](https://jupyterlab.readthedocs.io/en/latest/): **JupyterLab is a highly extensible, feature-rich notebook authoring application and editing environment**

If you need to run a Jupyter Notebook, you can allocate resources and run them remotely through the Marlowe Open OnDemand instance.

## Code Server

Code Server is a tool to allow you to run VSCode on a remote server.

As Marlowe does not allow SSH port forwarding on compute nodes, accessing Code Server via Open OnDemand is the only way to run Code Server on Marlowe (See [the slurm page](../slurm_and_openOnDemand/slurm.md) for more details).

**Note on Github Copilot**: As Github Copilot uses the `VSIXPackage` format instead of `VSIX`, code-server does not support directly installing it through the extension tab. However, you can still manually install the VSIXPackage file through the user interface. Any extension that doesn't use the `VSIXPackage` format will install correctly from the extension tab.

## Running Apps

To run an app on Open OnDemand, click the `Interactive Apps` button at the top and choose your specific application:

{% include image.html file="/assets/images/marlowe-ood-int-apps.png" alt = "interactive apps" %}

<br/><br/>
After that, you will see a submit form similar to this:

<br/><br/>
{% include image.html file="/assets/images/marlowe-ood-submit-form.png" alt = "submit form" %}

<br/><br/>
Once your job has been submitted and resources have been allocated, you will be presented with this screen:

<br/><br/>
{% include image.html file="/assets/images/marlowe-ood-sessions.png" alt = "sessions screen" %}


Click "Connect" and your app instance will be launched automatically.
