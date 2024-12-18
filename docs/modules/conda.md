---
title: "Conda"
permalink: /software/conda.html
folder: software
toc: false
---

Conda is a python package manager used by a wide variety of projects.

Marlowe uses an optimized version of Conda called Mamba.

To load Mamba, run the following after logging in:

```
module load conda
```

Every conda command works with mamba. No code customization is needed.

## Setting up Conda and pip

Conda works for the most part straight out of the box, but if you need to `pip install` packages, you will need to follow these steps:

**1**) Run `module load conda`

**2**) Run `mamba init`

**3**) Log out of Marlowe

**4**) Log back in to Marlowe

After you've done this, mamba will be added to your path and `pip install` will function properly.

## Installing a Conda environment in a different location

Home directories have a quota of 15GB by default. This means that even small conda environments can run into quota issues rather quickly.

To combat this, we recommend setting up your conda environment in a separate directory. You can do this with the `--prefix` command.

For example:
```
conda create --prefix /projects/m223813/mycondadir numpy=1.21
```
The above will create a new conda environment in the `/projects/m223813/mycondadir` folder with numpy 1.21. Since it's not being installed into your home directory, you don't have to worry about the same 15GB quota as before!

You can also use the `--prefix` argument with `conda env` and other commands.