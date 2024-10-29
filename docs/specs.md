---
title: "Marlowe Tech Specs"
toc: false
permalink: specs.html
seealso: true
folder: faq
---

Marlowe consists of a DGX H100 Superpod.

The Superpod is built out of 31 DGX H100 nodes.

## DGX H100 Specs

Each DGX H100 has:

- 2 x Intel Xeon Platinum 8480C
- 8 x Nvidia H100 80GB
- 2TB Memory
- 400G NICs for fast data access

## Networking

Marlowe consists of four main networks:

- 400Gb Infiniband compute network to connect all compute nodes together
- 400Gb Infiniband storage network to connect all compute nodes to the DDN Exascaler scratch storage
- 100Gb Ethernet network to connect to DDN Intelliflash storage (used for home and project directories)
- 100Gb Ethernet network to connect to the outside world
