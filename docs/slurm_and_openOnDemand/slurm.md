---
title: "Slurm"
permalink: /slurm.html
folder: slurm_and_openOnDemand
layout: default
toc: true
customjs: ./assets/js/connect.js
---

Marlowe uses SLURM, a job scheduling system, to run jobs. There are three main Account types: Basic/Preempt, Medium/Batch, and Large/Hero.

The Slurm commands srun, salloc, and sbatch will take you far!

Marlowe accounts are start with `marlowe-` followed by the project ID. So if your project ID was `m223813`, your account would be `marlowe-m223813`. To use the batch or hero partitions, you will need to add a suffix to your account, like marlowe-m223813-pm01. Read more about it in the [Accounts](#accounts) section below. 

_optional: enter your information below and click the Generate button to generate copy & paste commands with your information pre-filled_

<div class="form-group">
  <div class="form-row align-items-end">
  <div class="col-auto my-1">
    <label for="projectId">Project ID</label>
    <input type="text" class="form-control form-control-lg project-id" name="projectId" id="projectId" placeholder="Project ID" />
  </div>
      <div class="col-auto my-1">
      <label for="partition">Partition</label>
      <select name="partition" id="projectPartition" class = "form-control form-control-lg">
        <option value="preempt">preempt</option>
        <option value="batch">batch (medium)</option>
        <option value="hero">hero (large)</option>
      </select>
    </div>
    <div class="col-auto my-1" id="suffixDiv">
      <label for="endDate">Project Suffix</label>
      <input type="text" class="form-control project-suffix form-control-lg" id="projectIdSuffix" placeholder="ex. pm01" maxlength="4"/>
    </div>
  <div class="col-auto my-1">
<a class="btn btn-info generate gen-btn" id="generateBtn" title="Generate Commands"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate!</a>
    <a class="btn btn-outline-info generate clear-btn" id="clearBtn" title="Clear">Clear</a>
  </div>
</div>
</div>

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
#SBATCH -G 1
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

## Check GPU allocation usage

Use the form below to generate the sreport command.

To see a medium project’s usage, use its pm suffix. To see a large project’s usage, use its pl suffix.

<div class="form-group" id="sreportUtilization">
  <div class="form-row align-items-end">
    <div class="col-auto my-1">
      <label for="startDate">Start Date</label>
      <input type="date" id="startDate" class="form-control date" min="2025-03-01"/>
    </div>
    <div class="col-auto my-1">
      <label for="endDate">End Date</label>
      <input type="date" id="endDate" class="form-control date" />
    </div>
    <div class="col-auto my-1">
    <a class="btn btn-info generate gen-btn" id="generateBtn2" title="Generate Commands"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate!</a>
    <a class="btn btn-outline-info generate clear-btn" id="clearBtn2" title="Clear">Clear</a>
  </div>
  <div class="col-auto tip-btn my-1">
    <a class="btn btn-info copy generate" title="Copy to Clipboard" data-target="utilization" data-method="text"><i class="fa-regular fa-clipboard"></i></a>
  </div>
  </div>
  </div>
  <div id="utilization" markdown="1" class="replace col-auto tip-input ">
<pre style="white-space: pre-wrap;">
<code>
sreport cluster UserUtilizationByAccount -T gres/gpu Start=[start of billing cycle] End=now account=[your project account] -t hours
</code>
</pre>
</div>

## Accounts

Each allocation is given a project ID. This project ID corresponds to a job account on Marlowe.

One of the requirements (for accounting purposes) is for each job to be credited to a job account. If you don't add a valid account, you will see the following error message when submitting jobs:

```
srun: error: ACCOUNT ERROR: Did you remember to set your account?
```

Medium and large projects are given a GPU hours allocation, tied to a suffix on the main project ID. The suffix is required when using the batch/medium and hero/large partitions. Users can keep track of their allocation using the <a href="#sreportUtilization">sreport command</a>.

The suffix will be something like ***pm***01 for a medium project, or ***pl***01 for a large project. Check your Marlowe welcome email if you need your project's suffix.

**Note**: You will be charged against your GPU hours allocation if you submit a job with a medium/large project suffix to the preempt partition. The generator above assumes that you do not want to use your GPU hours allocation for your preempt partition job.


## Available Partitions

1) If you have a medium project allocation, you should submit to the batch partition

2) If you have a large project allocation, you should submit to the hero partition

3) For basic access, you can only submit to the preempt partition


## Partition Limits

**Hero**: 25 nodes, 24 hours

**Batch**: 16 nodes, two days

**Preempt**: 8 nodes, 12 hours

**Note**: Any jobs in the `preempt` queue can be preempted within 15 minutes if a job in a higher priority partition (`batch` or `hero`) requests the node that the `preempt` job is running on.

