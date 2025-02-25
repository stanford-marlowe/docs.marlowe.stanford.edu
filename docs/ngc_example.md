---
title: "Using NVIDIA NIM Containers"
toc: false
permalink: /ngc_example.html
---

We will assume you have set up your Apptainer cache directory as noted [here](/software/apptainer.html).

We provide two examples: one using a stock [the 
Llama 3.1 (8B) model](https://catalog.ngc.nvidia.com/orgs/nim/teams/meta/containers/llama-3.1-8b-base) image another where we build a container for the [Evo](https://arcinstitute.org/news/blog/evo) DNA foundation model.

NVIDIA provides [Docker](https://www.docker.com) images on the [NGC Site](https://catalog.ngc.nvidia.com/). Since Docker is ill-suited to an HPC environment, Marlowe uses [Apptainer](/software/apptainer.html) which works seamlessly with Docker images. However, NGC requires authentication to download images and therefore, a one-time set up is required.

## One-time Setup

1. Create an NVIDIA Developer account if you haven't already done so.

2. Get an API KEY for logging into NVIDIA GPU Cloud (NGC). For our example, you can obtain one by clicking on the the [Get API Key](https://build.nvidia.com/meta/llama-3_1-8b-instruct?snippet_tab=Python) at the top of the python code.
   
   To avoid having to deal with this everytime, you can save the username and key in your `~/.bash_profile` and ensure it is effective (or log out and back in again).
   
    ```bash
    export APPTAINER_DOCKER_USERNAME='$oauthtoken'
    export APPTAINER_DOCKER_PASSWORD="NGC_API_KEY"
    ```

3. Beware that python packages such as `triton` make use of caches, typically in home directories. Since space is limited there, you should make a symbolic link to a larger/faster directory, for example:

    ```bash
    ln -s /scratch/m223813/.triton_cache ~/.triton 
    ```
	
    Same goes for other packages which use `~/.cache` for hugging face downloads. Better to make a symbolic link for that too. 

3. Apptainer also uses a cache that can become large. So best to create a cache directory in scratch set an environment variable to point Apptainer to it in your `~/.bash_profile`.

```bash
export APPTAINER_CACHEDIR=/scratch/<your_space>/.apptainer_cache
```


## Llama Example

1. Pull down the `Llama` image---you can search for it on the NGC website and find a copyable link for the image. Then create an apptainer image (`.sif` file) as below.

    ```bash
    you@login-02$ cd /scratch/m223813	
    you@login-02$ apptainer pull docker://nvcr.io/nim/meta/llama-3.1-8b-instruct:1.3.3
    ```

2. Run an interactive queue on the partition provided for you. We use 8 GPUs and ask for 30 minutes in our example. Note down the node number which is typically something like `n01` or `n02` etc. We'll assume `n01` in what follows.

    ```bash
    you@login-02$ srun --partition=<your_partition> --gres=gpu:8 --ntasks=1 --time=30:00 --pty /bin/bash
    ```

3. This Llama example runs a web service, so you need to use a tool such as `tmux` to split the screen into two, one where you will run the web service (call it `A`) and the other where you will send requests (`B`). Run the container in session `A`; this will take about 10 minutes the first time. Note the use of the API Key from step 2 which can be set up once in your `~/.bash_profile` for convenience. 

    ```bash
    export LOCAL_NIM_CACHE=$SCRATCH/.cache/nim
    mkdir -p "$LOCAL_NIM_CACHE"
    apptainer run --nv \
      --bind "$LOCAL_NIM_CACHE:/opt/nim/.cache" \
      --env NGC_API_KEY=$NGC_API_KEY \
      llama-3.1-8b-instruct_1.3.3.sif
    ```
  Once the API service has started, you will see lines like below:

    ```bash
    INFO 2025-02-07 11:36:27.25 server.py:82] Started server process [1275338]
    INFO 2025-02-07 11:36:27.25 on.py:48] Waiting for application startup.
    INFO 2025-02-07 11:36:27.52 on.py:62] Application startup complete.
    INFO 2025-02-07 11:36:27.69 server.py:214] Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
    ```
   
4. Switch to session `B` to hit the API end point. Below is the result of a  test API call using `curl` on `n01` where we ask for a limerick about Marlowe:

    curl -X 'POST' \
     'http://localhost:8000/v1/chat/completions' \
     -H 'accept: application/json' \
     -H 'Content-Type: application/json' \
    -d '{
       "model": "meta/llama-3.1-8b-instruct",
       "messages": [{"role":"user", "content":"Write a limerick about Marlowe GPU Cluster (31 DGXs)"}],
       "max_tokens": 64
       }'

    JSON Output:

    ```bash
   {"id":"chat-39fd51da910b4ac1ad29974525901d0e","object":"chat.completion","created":1738957038,"model":"meta/llama-3.1-8b-instruct","choices":[{"index":0,"message":{"role":"assistant","content":"There once was a cluster so fine,\nMarlowe's DGXs, 31 in line,\n Processing with care,\nThrough NVIDIA GPUs fair,\nIn AI work, a speedy shrine."},"logprobs":null,"finish_reason":"stop","stop_reason":null}],"usage":{"prompt_tokens":27,"total_tokens":65,"completion_tokens":38},"prompt_logprobs":null}
    ```

    which contains:

    ```
    There once was a cluster so fine,
    Marlowe DGXs, 31 in line,
    Processing with care,
    Through NVIDIA GPUs fair,
    In AI work, a speedy shrine.
    ```

## Evo container

Often, it is more convenient to create a custom container that can be used over and over to run a bunch of jobs. We demonstrate by building such a container for the [Evo](https://github.com/evo-design/evo) model using the definition file `evo.def` below.

```
Bootstrap: docker
From: nvcr.io/nvidia/pytorch:25.01-py3

%post
    # Update package list and install development tools
    apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        cmake \
        wget \
        git \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/*
    # Several NVIDIA containers contain bad triton versions, which
    # look for libcuda.so in the wrong places, so delete if installed
    # and reinstall latest
    pip uninstall -y triton
    pip install triton
    pip install evo-model

%runscript
    # Run an Evo example script
    echo "Running Evo example"
    git clone --depth 1 https://github.com/evo-design/evo.git
    cd evo
    python -m scripts.generate \
           --model-name evo-1-131k-base \
           --prompt ACGT \
           --n-samples 10 \
           --n-tokens 100 \
           --temperature 1. \
           --top-k 4 \
           --device cuda:0
```

This definition file starts off using the `pytorch:25.01-py3` container from NVIDIA NGC and then `pip` installs `evo-model`. One could use other pytorch containers, but we've found that earlier versions of the containers (e.g. `pytorch:24.02-py3`) contain `triton` package versions that do a bad job of locating `libcuda.so`. If you use those, be sure to uninstall the `triton` package and update to the latest version. In the worst case, you may have to build it yourself. 

The `%runscript` section runs an example from the github repo and uses just one GPU device.

Building the container image doesn't require a GPU, so one can do the folllwing on the login node.

```bash
export APPTAINER_DOCKER_USERNAME='$oauthtoken'
export APPTAINER_DOCKER_PASSWORD="YOUR NGC API KEY"
apptainer build evo.sif evo.def
```

This will create a file `evo.sif` that can then be run on a GPU node via `apptainer run <image.sif>` which will simply execute the example in `%runscript` section. Or you can use an `sbatch` script.

```bash
#!/bin/bash

#SBATCH --job-name=run_evo
#SBATCH -p batch
#SBATCH --nodes=1
#SBATCH -A marlowe-m000xxx
#SBATCH -G 1
#SBATCH --time=2:00:00
#SBATCH --chdir=/scratch/m000xxx/
#SBATCH --error=/scratch/m000xxx/run_evo.err

export APPTAINER_DOCKER_USERNAME='$oauthtoken'
export APPTAINER_DOCKER_PASSWORD="YOUR NGC API KEY"

module load slurm

apptainer run --nv --bind /scratch/m000xxx evo.sif
```

Here is the output:

```
Running test Evo script
Generated sequences:
Prompt: "ACGT",	Output: "AGACAAGGGCATACACCCCACCCTCAGTAAACTTCGGCCTGCCCTTGGAGCAGCACGGGAACCCCCACGCATCCTTGTTGAACTCGGTGAGCACGGTCTC",	Score: -1.458408236503601
Prompt: "ACGT",	Output: "CCGGTTCCTCGGCCGTCTCCTCCGGCGCCAGATCGTAGATATTGGCAACTTCTTCGGCAAAGGCGTCCACGGCCAGCGCATGGCCGTCGCGGTTATTGCG",	Score: -1.601033091545105
Prompt: "ACGT",	Output: "GTTCGACGAGCCGGTGGCAGTGCAGCATCCGGCCCGCCTGGGAGACCTCCTTGCCCATCCCGGTGATGACCAGCCCGGGATCGACGAGCTGCACCACGCG",	Score: -1.5202327966690063
Prompt: "ACGT",	Output: "TGAAATAAACCTTGACGAACTTGGTGAATGGATTGAAAGCGAAGCGGTTAAGGGTGGAGCAATTGATATTCTTGTTGCTAATCCTCCTTACATTTCAAAG",	Score: -1.7276207208633423
Prompt: "ACGT",	Output: "CATCCTCGGAGTTCATGGCTGTCCCCTTGCGCCTCGTCTTGACAACTCCATGCCACTGGCGCAACCATCGCTGACGGCCGGTGAGTAGGCGGTGTGCGGG",	Score: -1.3855290412902832
Prompt: "ACGT",	Output: "GCAGGGGCTTGAGGCGTTGGCGCGTTACCATTTCCATCGTTTTATGTATGGCGAGAGTCAGAAGCGCTTGCATCAGGTGGCTCGCGACGATGCCGAACAG",	Score: -1.5511059761047363
Prompt: "ACGT",	Output: "CGAATATCTGGGCATCCTTGTCGTGGGGCGTGCCCATGGTGGCCAGCGCCAGCGTGCAACCGTCGAGCATGGCGGTGCAGACGAAGGGCACGGGCATCAT",	Score: -1.6281002759933472
Prompt: "ACGT",	Output: "CCTCGCCATTGGTCTCACGCACGCGCGGCCGACTGTCGCCCATGCCGCCCCCCGCCGATCGGCCTCGCCCGCGCCATCGGCAGAACTCCGAAAGCACAGC",	Score: -1.3561044931411743
Prompt: "ACGT",	Output: "ATAAAGGCGGACAGGTTACGGTGGAGAAGTTCTTAAGGAAGTCCACACGGACAACCGGTAACGTTTATGGGTATGATGATCCGGAGGTGGCTGAAATAGC",	Score: -1.5136480331420898
Prompt: "ACGT",	Output: "CATACTCGGTATCGGATTCTTTCAGTGCTTCAGCCACCGCATCCCTGACCGTTTCCAGATCATCCCCGGGGGACAGAATCGCCCACGGGCGCTTCTTCTG",	Score: -1.473382830619812
```

One can run something other than the code in the `%runscript` section using the line

```bash
apptainer shell --nv --bind /scratch/m000xxx evo.sif
``` 

which will drop one into a shell. Or one can append a command:

```bash
apptainer exec --nv --bind /scratch/m00000x evo.sif python -m scripts.generate \
    --model-name evo-1-131k-base \
    --prompt ACGT \
    --n-samples 10 \
    --n-tokens 100 \
    --temperature 1. \
    --top-k 4 \
    --device cuda:0
```

The `evo.sif` file can be shared among your lab members or others and will help with reproducibility.

A few things to note.

1. Tools such as `Evo` download models etc. and place them in caches, typically in the home directory, e.g. `~/.cache`. To avoid running out of disk quota, it is best to symlink the cache into the scratch area and ensure that scratch is mounted on the container. That is done via the `--bind` option above.

2. Apptainer itself uses a cache and once again, it is best to set a variable as indicated at the top of this document. 

