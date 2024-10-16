# Apptainer

Apptainer (formerly known as Singularity) is an HPC-oriented container system. 

Unlike Docker, Apptainer is designed for use in HPC systems such as Marlowe. More info on Apptainer can be found here: [https://apptainer.org/](https://apptainer.org/)

To load Apptainer:
```
module load apptainer
```

## Apptainer Cache Directory

By default, Apptainer stores all of a user's containers in their home directory.

Since a user's home directory on Marlowe is only 15GB, that space can quickly be used up and the quota limit will block you from pulling and running containers.

To get past this, you can set your Apptainer Cache directory to a different location. Learn more about the filesystems on Marlowe [here](../getting-started/filesystems.md).

For instance, If you wanted set the apptainer cache directory to your `/scratch` directory and your project ID is `m223813`, you can run the following:

```
export APPTAINER_CACHEDIR=/scratch/m223813/apptainercache
```

After running the above command, all apptainer containers will be pulled to the `apptainercache` folder in your project's scratch directory.