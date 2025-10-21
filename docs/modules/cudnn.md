---
title: "CuDNN"
permalink: /software/cudnn.html
folder: software
toc: false
---

CuDNN is a library provided by Nvidia. More information on it can be found here: [https://developer.nvidia.com/cudnn](https://developer.nvidia.com/cudnn)

There are currently three versions of CuDNN available on Marlowe:

```
cudnn/cuda11/9.3.0.75
cudnn/cuda12/9.3.0.75
cudnn/cuda12/8.9.7.29
```

To load CuDNN, run the following:

```
module load cudnn/cuda12
```

If your job crashes with `CUDA_ERROR_MPS_CONNECTION_FAILED`, add 
```
module load mps
```
before running CUDA. See [FAQ entry](/faq.html#my-job-crashes-with-cuda_error_mps_connection_failed) for details.
