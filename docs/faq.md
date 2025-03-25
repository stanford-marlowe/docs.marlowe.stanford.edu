---
title: "Frequently Asked Questions"
permalink: /faq.html
folder: faq
toc: true
seealso: true
---

### I receive a "disk quota exceeded" error when writing files. What does this mean?

Each [filesystem](./getting-started/filesystems.md) on Marlowe has a user space quota. You're most likely to run into this issue when adding files to your home directory.

### I can't run a docker container

Docker is not supported on Marlowe due to the security risks associated with it. Fortunately, [Apptainer](./modules/apptainer.md) supports running docker containers natively.

### Where are the CUDA tools?

CUDA tools and libraries such as nvcc are available in the nvhpc module. This module is not loaded by default, so it will need to be loaded whenever you use any CUDA tools and libraries. You can always automate this by adding `module load nvhpc` to your `~/.bashrc` file.

### I can't see my project directory

The `/projects/` filesystem uses a system called [autofs](https://www.kernel.org/doc/html/latest/filesystems/autofs.html) to dynamically mount NFS shares in `/projects/`.

Due to this, you may not see your specific `/projects/` directory until you first access it after login. As soon as you run a command that accesses your project directory, it will show up and be accessible. A simple way to show your `/projects/` directory is to run `ls /projects/<project ID>`.

Here is an example:

{% include image.html file="/assets/images/filesystems.gif" alt = "walkthrough of finding projects directory" %}

### I see "A requested component was not found" when submitting an MPI job.

You may see a similar error to the following when your code either doesn't detect the infiniband fabric properly, or gets confused when it detects both Ethernet and Infiniband:

```
--------------------------------------------------------------------------
A requested component was not found, or was unable to be opened.  This
means that this component is either not installed or is unable to be
used on your system (e.g., sometimes this means that shared libraries
that the component requires are unable to be found/loaded).  Note that
Open MPI stopped checking at the first component that it did not find.

Host:      n12
Framework: pml
Component: ucx
--------------------------------------------------------------------------
```

To fix this, load the `gcc/64` module by running the following/adding to your slurm command:

```
module load gcc/64
```

The `gcc/64` module essentially reloads the network fabric libraries and forces them to be loaded in the correct order. It is recommended to load it after [NVHPC](./modules/nvhpc.md).

### I can't SSH into compute nodes

As of 3/3/25, SSH-ing into compute nodes has been disabled. You can find more information on other ways to connect on the [SLURM docs](./slurm_and_openOnDemand/slurm.md).

### I can't connect to a compute node from VSCode

As of 3/3/25, SSH-ing into compute nodes has been disabled. You can find more information on the [SLURM docs](./slurm_and_openOnDemand/slurm.md).

VSCode Server can be deployed separately via [Open OnDemand](./slurm_and_openOnDemand/openondemand.md).