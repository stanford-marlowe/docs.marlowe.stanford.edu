---
title: "Using NVIDIA NIM Containers"
toc: false
permalink: /ngc_example.html
---


We illustrate using [this
Llama 3.1 (8B) model](https://build.nvidia.com/meta/llama-3_1-8b-instruct?snippet_tab=Docker). 

NVIDIA provides Docker images for the running the model locally but Docker is ill-suited to a server infrastructure. Marlowe uses [Apptainer](http://docs.marlowe.stanford.edu/modules/apptainer/) instead and so one needs to convert the provided Docker image into an Apptainer image. Also, since the image is hosted on the [NVIDIA Developer Site](https://build.nvidia.com/explore/discover) that requires one to authenticate,  one has to use a Docker tools on one's local machine to download the image, and then upload it to Marlowe for conversion for use with Apptainer. 

We will assume you have set up your Apptainer cache directory as noted [here](http://docs.marlowe.stanford.edu/modules/apptainer/).

1. Create an NVIDIA Developer account if you haven't already done so.

2. On your local machine, install [Docker Desktop](https://www.docker.com/) if you haven't already done so and ensure it is running.

3. Get an API KEY for logging into NVIDIA GPU Cloud (NGC). For our example, you can obtain one by clicking on the the[Get API Key](https://build.nvidia.com/meta/llama-3_1-8b-instruct?snippet_tab=Python) at the top of the python code.

4. In a terminal on  your local machine (`bluebird`), log into the NGC via:

    ```bash
    bluebird$ docker login nvcr.io
    ```

5. Pull down the Llama image and save it as a tar file. The image is about 13G!

    ```bash
    bluebird$ docker pull nvcr.io/nim/meta/llama-3.1-8b-instruct:latest
    bluebird$ docker save nvcr.io/nim/meta/llama-3.1-8b-instruct:latest -o llama.tar
    ```

6. Upload to Marlowe project directory (assuming `m223813` is your project directory).

    ```bash
    bluebird$ scp llama.tar login.marlowe.stanford.edu:/scratch/m223813
    ```

7. Log in to Marlowe and convert the image to a `.sif` file. This takes a while to complete and is done once. 

    ```bash
    you@login-02$ cd /scratch/m223813
    you@login-02$ ml load apptainer
    you@login-02$ apptainer build llama.sif docker-archive://llama.tar
    ```

8. Run an interactive queue on the partition provided for you. We use 8 GPUs in our example. Note down the node number which is typically something like `n01` or `n02` etc. We'll assume `n01` in what follows.

    ```bash
    you@login-02$ srun --partition=<your_partition> --gres=gpu:8 --ntasks=1 --time=1:00:00 --pty /bin/bash
    ```

9. Run the container on `n01`; this will take about 10 minutes the first time. Note the use of the API Key from step 2 which can be set up once in your `~/.bash_profile` for convenience. 

    ```bash
    export NGC_API_KEY=<your_api_key> ## fill in your API key
    ml load apptainer
    export LOCAL_NIM_CACHE=$PROJDIR/.cache/nim
    mkdir -p "$LOCAL_NIM_CACHE"
    apptainer run --nv \
      --bind "$LOCAL_NIM_CACHE:/opt/nim/.cache" \
      --env NGC_API_KEY=$NGC_API_KEY \
      llama.sif
    ```
  Once the API service has started, you will see lines like below:

    ```bash
    INFO 2024-10-17 18:26:48.395 server.py:82] Started server process [394400]
    INFO 2024-10-17 18:26:48.395 on.py:48] Waiting for application startup.
    INFO 2024-10-17 18:26:48.409 on.py:62] Application startup complete.
    INFO 2024-10-17 18:26:48.411 server.py:214] Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
    INFO 2024-10-17 18:27:10.522 httptools_impl.py:481] 127.0.0.1:37712 - "POST /v1/chat/completions HTTP/1.1" 200
    ```
   
9. Typically, one would forward the port using `ssh` to access the service on `localhost:8000` or similar, but that is not feasible in an HPC environment. At some point [OnDemand applications](https://www.osc.edu/resources/online_portals/ondemand) may be set up, but until then, one can do batch processing by creating another session on the job node `n01` (log into Marlowe, and then `ssh n01`) to hit the API service. 

Below is the result of a  test API call using `curl` on `n01` where we ask for a limerick about Marlowe:

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
{"id":"chat-b2f3244d98b647caaa0d32ca54ed57db","object":"chat.completion","created":1729214830,"model":"meta/llama-3.1-8b-instruct","choices":[{"index":0,"message":{"role":"assistant","content":"There once was a cluster so fine,\nMarlowe GPU's, with power divine,\nThirty-one DGXs to play,\n Made for work in a major way,\nApplied Math's problems did align."},"logprobs":null,"finish_reason":"stop","stop_reason":null}],"usage":{"prompt_tokens":28,"total_tokens":69,"completion_tokens":41}}
```

which contains:

```
There once was a cluster so fine,
Marlowe GPU's, with power divine,
Thirty-one DGXs to play,
Made for work in a major way,
Applied Math's problems did align.
```
