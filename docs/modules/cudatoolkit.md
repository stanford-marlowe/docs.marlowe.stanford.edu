---
title: "Cuda Toolkit"
permalink: /software/cudatoolkit.html
folder: software
toc: false
---


This module does the exact same things as [nvhpc](./nvhpc.md) and nvhpc is the preferred method of using CUDA. The only difference is that the Cuda Toolkit module also sets the `CUDA_HOME` directory.

The Cuda Toolkit module is only updated when `nvhpc` is updated.

To load Cuda Toolkit, run the following:

```
module load cudatoolkit
```

If your job crashes with `CUDA_ERROR_MPS_CONNECTION_FAILED`, add 
```
module load mps
```
before running CUDA. See [FAQ entry](/faq.html#my-job-crashes-with-cuda_error_mps_connection_failed) for details.

### Stock Cuda Toolkit

If you absolutely need a stock cuda toolkit install, you can load the following module:

```
module load stockcuda/12.6.2
```

Since it is a stock cuda install, some HPC libraries are missing. Due to this, it is highly recommended to use [nvhpc](./nvhpc.md) instead. The stock cuda toolkit module is also only sporadically updated.
