# Accounts

Each allocation is given a project ID. This project ID corresponds to a job account on Marlowe.

One of the requirements (for accounting purposes) is for each job to be credited to a job account. If you don't add a valid account, you will see the following error message when submitting jobs:

```
srun: error: ACCOUNT ERROR: Did you remember to set your account?
srun: error: Please check the Marlowe SLURM docs for info on how to set a your project account properly
```

## How do I add my project account to SBATCH/SRUN/SALLOC?

It's simple! There are two ways you can do it, using `-A` or `--account=`. Both accomplish the same thing and will allow you run jobs!

All accounts start with `marlowe-` and are followed by their project ID. So if your project ID was `m223813`, your account would be `marlowe-m223813`.

Here are some Examples:

**SRUN**: `srun -N 1 -G 4 -A marlowe-m223813 -p beta --pty bash`

**SALLOC**: `salloc -N 1 -A marlowe-m223813 -p beta`

**SBATCH**:
```
#!/bin/sh

#SBATCH --job-name=test
#SBATCH -p beta
#SBATCH --nodes=1
#SBATCH -A m223813
#SBATCH -G 8
#SBATCH --time=00:30:00
#SBATCH --error=/users/srcc/foo.err

module load slurm
module load cudatoolkit
module load cudnn/cuda12/9.3.0.75

bash /users/srcc/test.sh
```

Notice the **-A** in each of the examples. Without it, you will not be able to submit jobs