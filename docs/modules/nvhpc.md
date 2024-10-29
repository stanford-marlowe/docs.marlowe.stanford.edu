---
title: "Nvidia HPC SDK"
permalink: /software/nvhpc.html
folder: software
toc: false
---

The Nvidia HPC SDK provides CUDA-related tools such as `nvcc` to the end user. It includes all HPC libraries except for cuDNN which is loaded as a [separate module](./cudnn.md).

Find out more [here](https://developer.nvidia.com/hpc-sdk)

To load the Nvidia HPC SDK, run the following:
```
module load nvhpc
```

Due to NVPC overwriting the local CC and CXX variables, by default it is not loaded. This means you will have to load the nvhpc module whenever you want to use any CUDA tools.