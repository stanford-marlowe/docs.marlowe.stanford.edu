---
title: "Marlowe Usage Violations"
toc: false
permalink: violations.html
seealso: true
folder: faq
---

# Marlowe Usage Policy Violations

Marlowe is an Nvidia Superpod provided by Stanford for use by the Stanford research community. This means that all usage on Marlowe is required to follow Stanford's general [Computer and Network Usage Policy](https://adminguide.stanford.edu/chapters/computing/computer-and-network-usage).

However, this can be rather ambiguous when it comes to HPC tools. This page provides a non-exhaustive list of applications and services that violate Stanford's (and by extension Marlowe's) Usage Policy:

### Bypassing login requirements

- Websocket-based tunnels (such as SSHX)
- Userspace VPNs (Tailscale, Zerotier, etc.)
- Web Tunnels (launched with VSCode, Cursor, Windsurf Editor, or other applications)

(SSH tunnels by themself are not a violation as long as they require you to enter both your password and duo 2fa)

### Purposefully slowing down login or storage nodes

- CPU Benchmarks
- Storage Benchmarks
- Thrashing Swap Space


Users found in violation of the Marlowe and/or Stanford Usage Policy may be subject to immediate and permanent removal as well as immediate and permanent removal of their project group. This page is **NOT EXHAUSTIVE** and other applications/services not listed may violate the usage policy. When in doubt, refer to Stanford's [Computer and Network Usage Policy](https://adminguide.stanford.edu/chapters/computing/computer-and-network-usage).