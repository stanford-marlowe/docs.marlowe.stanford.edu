---
title: "Slurm"
permalink: /slurm.html
folder: slurm_and_openOnDemand
layout: default
toc: true
customjs: ./assets/js/connect.js
---

Marlowe uses SLURM, a job scheduling system, to run jobs. 

## Accounts

Each allocation is given a project ID. This project ID corresponds to a job account on Marlowe.

One of the requirements (for accounting purposes) is for each job to be credited to a job account. If you don't add a valid account, you will see the following error message when submitting jobs:

```
srun: error: ACCOUNT ERROR: Did you remember to set your account?
srun: error: Please check the Marlowe SLURM docs for info on how to set a your project account properly
```

## How do I add my project account to SBATCH/SRUN/SALLOC?

It's simple! There are two ways you can do it, using `-A` or `--account=`. Both accomplish the same thing and will allow you run jobs!

All accounts start with `marlowe-` and are followed by their project ID. So if your project ID was `m223813`, your account would be `marlowe-m223813`.

_optional: enter your project ID below and click the Generate button to generate copy & paste commands with your project ID pre-filled_

<div class="form-row ">
  <div class="col-auto">
    <label class="sr-only" for="projectId">Project ID</label>
    <input type="text" class="form-control form-control-lg" name="projectId" id="projectId" placeholder="Project ID" />
  </div>
  <div class="col-auto">
    <a class="btn btn-info generate" id="generateBtn" title="Generate Commands"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate!</a>
    <a class="btn btn-info generate" id="clearBtn" title="Clear">Clear</a>
  </div>
</div>

Here are some Examples:

**SRUN**: 

<div class="form-group form-inline">
<div class="form-row flex-grow-1">
  <div class="col-auto tip-input replace" id="srun" markdown="1" >

`srun -N 1 -G 4 -A marlowe-[Project ID] -p beta --pty bash`

</div>
    <div class="col-auto tip-btn">
      <a class="btn btn-info copy" title="Copy to Clipboard" data-target="srun"><i class="fa-regular fa-clipboard"></i></a>
    </div>
</div>
</div>

**SALLOC**:

<div class="form-group form-inline">
<div class="form-row flex-grow-1">
<div class="col-auto tip-input replace" id="salloc" markdown="1" >

`salloc -N 1 -A marlowe-[Project ID] -p beta`

</div>
<div class="col-auto tip-btn">
<a class="btn btn-info copy" title="Copy to Clipboard" data-target="salloc"><i class="fa-regular fa-clipboard"></i></a>
</div>
</div>
</div>

**SBATCH**:


<div class="form-group form-inline">
<div class="form-row flex-grow-1">
<div id="sbatch" markdown="1" class="replace col-auto tip-input ">

```
#!/bin/sh

#SBATCH --job-name=test
#SBATCH -p preempt
#SBATCH --nodes=1
#SBATCH -A marlowe-[Project ID]
#SBATCH -G 8
#SBATCH --time=00:30:00
#SBATCH --error=~/foo.err

module load slurm
module load nvhpc
module load cudnn/cuda12/9.3.0.75

bash ~/test.sh
```

</div>
<div class="col-auto tip-btn">
  <a class="btn btn-info copy" title="Copy to Clipboard" data-target="sbatch" data-method="text"><i class="fa-regular fa-clipboard"></i></a>
</div>
</div>
</div>

Notice the **-A** in each of the examples. Without it, you will not be able to submit jobs

## Why can't I SSH directly into the compute node I have reserved?

Due to the underlying system architecture of the superpod, you cannot SSH into a compute node directly from a new terminal instance.

You do have an option to reconnect to a running job with the following steps:

Step 1: Allocate your resources with `salloc` as mentioned above

Step 2: Run `srun --jobid=<jobid> --pty bash` in another terminal. It will connect to your allocated resource and you will be able to work out of two terminal sessions now.

In addition to the above commands, you also have the ability to use `tmux` and `screen` on the compute nodes.

**NOTE**: You can only have a maximum of two terminal windows connected to a job at one time. One through `salloc` and one through `srun`. It's currently recommended to allocate resources via `salloc` if you want to use a shell. You cannot connect to an already running job with `salloc`.

### I use srun in an sbatch script, how can I connect to my job?

There are three options (in order of recommendation): Connecting via `sattach` or replacing `srun` with `mpirun`.

The recommended option is to replace `srun` with `mpirun`. For the most part, they are completely interchangeable. After replacing `srun` with `mpirun`, you can follow the previous instructions starting from Step 2.

**Note**: you may need to run `module load openmpi4/gcc/4.1.5`, or add it to your `sbatch` script for `mpirun` to work.

The second option is to use `sattach`. To use `sattach`, you will need to already have started a shell (using `srun --pty bash`) in your job. `sattach` replaces that shell instance entirely.

To connect via `sattach`, run the following: `sattach <jobid>.0`. This will attach to the pre-existing shell.

As `sattach` requires a shell to already exist, it is recommended to move `srun` outside of your `sbatch` script and use `mpirun` instead.

## I need more than two terminal instances connected to my job

If you need more than two terminal instances connected (say, via tmux), or you've already used `srun`, you can still connect in a different way via `srun`

If you add `--overlap` to your `srun` command, you can connect to job with an already running `srun` connection.

As an example:

```
srun --jobid=5239 --overlap --pty bash
```
The above example will connect to your running job in a new terminal instance. Note that exiting from this terminal instance will not cancel your job.