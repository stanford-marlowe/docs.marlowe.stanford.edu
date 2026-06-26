---
title: "Software: Getting Started"
permalink: /software/software.html
folder: software
toc: false
---

Marlowe has multiple software packages pre-installed and available for use. 

Most are installed as modules and can be listed by running `module avail` in your terminal.

The only modules loaded by default are `slurm` and `gcc/13.1.0`. If you need other modules automatically loaded, it is recommended to add `module load <modulename>` to your `~/.bashrc` file.

If your jobs are crashing with `CUDA_ERROR_MPS_CONNECTION_FAILED` use `module load mps`. See the [FAQ entry](/faq.html#my-job-crashes-with-cuda_error_mps_connection_failed) for details.

Choose a page on the left to learn more about software on Marlowe.