---
title: "Slurm"
permalink: /slurm.html
folder: slurm
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
#SBATCH -p beta
#SBATCH --nodes=1
#SBATCH -A marlowe-[Project ID]
#SBATCH -G 8
#SBATCH --time=00:30:00
#SBATCH --error=/users/srcc/foo.err

module load slurm
module load cudatoolkit
module load cudnn/cuda12/9.3.0.75

bash /users/srcc/test.sh
```

</div>
<div class="col-auto tip-btn">
  <a class="btn btn-info copy" title="Copy to Clipboard" data-target="sbatch" data-method="text"><i class="fa-regular fa-clipboard"></i></a>
</div>
</div>
</div>

Notice the **-A** in each of the examples. Without it, you will not be able to submit jobs