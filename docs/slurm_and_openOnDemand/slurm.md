---
title: "Slurm"
permalink: /slurm.html
folder: slurm_and_openOnDemand
layout: default
toc: true
customjs: ./assets/js/connect.js
---

Marlowe uses SLURM, a job scheduling system, to run jobs. There are three main Account types: Basic/Preempt, Medium/Batch, and Large/Hero.

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

`salloc -N 1 -A marlowe-[Project ID] -p preempt`

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

## Which partition do I submit to?

1) If you have a medium project allocation, you should submit to the batch partition

2) If you have a large project allocation, you should submit to the hero partition

3) For basic access, you can only submit to the preempt partition

**Note**: You will be charged against your GPU hours allocation if you submit to the preempt queue with your medium or large project ID. While this can be useful for running short interactive jobs, it's recommended you use your basic access project id for submitting to the preempt queue.

## What are the partition limits?

**Hero**: 25 nodes, 24 hours

**Batch**: 16 nodes, two days

**Preempt**: 8 nodes, 12 hours

**Note**: Any jobs in the `preempt` queue can be preempted within 15 minutes if a job in a higher priority partition (`batch` or `hero`) requests the node that the `preempt` job is running on.

## How do I check my GPU hour usage in a given cycle?

If you have a medium or large project, you'll be given a GPU hours allocation. Once you reach that limit, you will be unable to run jobs using that project id.

To view your current usage for a set billing cycle, run the following:

```
sreport cluster UserUtilizationByAccount -T gres/gpu Start=<start of billing cycle> End=now account=<your medium project account> -t hours
```

Replace the start date with the first day of your billing cycle and the account with your medium project account.
