# FAQ

### **I receive a "disk quota exceeded" error when writing files. What does this mean?**

Each [filesystem](./getting-started/filesystems.md) on Marlowe has a user space quota. You're most likely to run into this issue when adding files to your home directory.

### **I can't run a docker container**

Docker is not supported on Marlowe due to the security risks associated with it. Fortunately, [Apptainer](./modules/apptainer.md) supports running docker containers natively.

### **I can't see my project directory**

The `/projects/` filesystem uses a system called [autofs](https://www.kernel.org/doc/html/latest/filesystems/autofs.html) to dynamically mount NFS shares in `/projects/`.

Due to this, you may not see your specific `/projects/` directory until you first access it after login. As soon as you run a command that accesses your project directory, it will show up and be accessible. A simple way to show your `/projects/` directory is to run `ls /projects/<project ID>`.

Here is an example:

![walkthrough](./assets/Untitled.gif)

### Where are the CUDA tools?

CUDA tools and libraries such as `nvcc` are available in the [nvhpc module](./modules/nvhpc.md). This module is not loaded by default, so it will need to be loaded whenever you use any CUDA tools and libraries. You can always automate this by adding `module load nvhpc` to your `~/.bashrc` file.