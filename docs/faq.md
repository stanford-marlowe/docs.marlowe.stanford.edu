# FAQ

### **I receive a "disk quota exceeded" error when writing files. What does this mean?**

Each [filesystem](./getting-started/filesystems.md) on Marlowe has a user space quota. You're most likely to run into this issue when adding files to your home directory.

### **I can't run a docker container**

Docker is not supported on Marlowe due to the security risks associated with it. Fortunately, [Apptainer](./modules/apptainer.md) supports running docker containers natively.

