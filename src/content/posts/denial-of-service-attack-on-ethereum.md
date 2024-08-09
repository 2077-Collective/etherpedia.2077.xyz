---
title: "The Roadmap: Denial-of-Service (DoS) Attack on Ethereum"
description: "Explore Ethereum's 2016 DoS attacks. This article goes into the vulnerabilities exploited, the network's resilient response, and the long-term impact on Ethereum's development."
pubDate: "Aug 09 2024 12:00:04"
heroImage: "/dos.png"
authors:
  - name: "Wei Han Ng"
    twitterHandle: "ngweihan_eth"
---

Ethereum is one of the most reliable decentralized networks in existence. However, if we look back at its history, there was a time when it faced a series of challenges.

In late 2016, a series of incidents involving technical vulnerabilities and malicious attacks, prompted swift responses from the Ethereum development team, leading to pivotal changes in the network's structure and operations.

## A Primer on Denial-of-Service (DoS) Attacks

**A DoS attack is a cyber assault that aims to make a machine, network, or service (in this case, Ethereum) unavailable to its intended users by overwhelming it with a barrage of illegitimate requests or data.**

Here’s an analogy.

Imagine a server/system as a store with a limited number of employees. A DoS attack is like sending a massive crowd of people to the store simultaneously, all demanding service. The employees become overwhelmed, unable to handle the sheer volume of requests, and the store effectively shuts down or halts for legitimate customers.

In the analogy, this "crowd" consists of data packets or requests sent from various sources, often compromised computers or devices. These packets can be legitimate-looking, making it difficult to distinguish them from genuine traffic.

And that’s [what happened with Ethereum back in 2016](https://blog.ethereum.org/2016/09/22/transaction-spam-attack-next-steps). Attackers spammed the network with transactions (which are essentially data packets that, in large quantity, overwhelmed the network).

## September 22, 2016: Ethereum Network Undergoes a DoS Attack

On [September 22, 2016](https://blog.ethereum.org/2016/09/22/ethereum-network-currently-undergoing-dos-attack), the Ethereum network was targeted by a sophisticated Denial-of-Service (DoS) attack.

**The attackers flooded the network with a high volume of transactions, causing nodes to spend a long time processing some blocks.**

The attack exploited a [vulnerability](https://ethereum.stackexchange.com/questions/9883/why-is-my-node-synchronization-stuck-extremely-slow-at-block-2-306-843) caused by the *EXTCODESIZE* opcode which had a relatively low gas price and required nodes to read state information from disk. I/O operations on the disk are computationally expensive and a large amount of them caused the nodes to slow down.

The short-term fix proposed by the technical team was to increase the cache size of the nodes to reduce disk I/O operations, as well as to decrease the gas limit to reduce the maximum processing time of a block.

## October 18, 2016: Tangerine Whistle Hard Fork Activated

To solve the problems caused by the DoS attacks on the Ethereum network, the [Tangerine Whistle hard fork](https://blog.ethereum.org/2016/10/18/faq-upcoming-ethereum-hard-fork) was first activated with the addition of [EIP-150](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-150.md) to significantly increase the gas cost of the opcodes that may induce heavy I/O operations (i.e., *EXTCODESIZE, EXTCODECOPY, BALANCE, SLOAD, CALL, DELEGATECALL, CALLCODE, SUICIDE*).

**With the higher gas cost of these opcodes, attackers could no longer simply spam the network with cheap transactions.**

## November 22, 2016: Spurious Dragon Hard Fork Activated

The [Spurious Dragon hard fork](https://blog.ethereum.org/2016/11/18/hard-fork-no-4-spurious-dragon) was the second hard fork proposed to mitigate the DoS attack issues. While the Tangerine Whistle hard fork successfully stopped the DoS attacks, it didn't address the remnants of those attacks.

**Attackers had created 20 million empty accounts during the attacks, which increased the Ethereum state size and reduced node performance.**

One of the EIPs introduced in the Spurious Dragon hard fork was EIP-161 which was particularly notable because it targeted and removed these empty accounts, greatly reducing the state size and easing the hard disk load on full nodes.

## April 25, 2021: Berlin Hard Fork Activated

About five years after the infamous DoS attack was resolved, the [Berlin hard fork](https://hackmd.io/@fvictorio/gas-costs-after-berlin) was activated.

One of the key EIPs introduced in this hard fork was EIP-2929, which increased the gas cost for state access opcodes. The primary change introduced by EIP-2929 was that the first-time state accesses in a transaction would cost significantly more than subsequent accesses.

**The rationale behind this change is that when a state is accessed for the first time, the node loads the data from the disk, which is an expensive I/O operation.**

Once the data is read, it is stored in the node cache, allowing for faster and cheaper access on subsequent requests.

This adjustment ensures that the initial cost reflects the true resource usage, while subsequent accesses benefit from the cached data.

## Conclusion

The 2016 DoS attacks on Ethereum served as a critical turning point in the network's development. These events not only exposed vulnerabilities but also showcased the resilience and adaptability of the Ethereum community and its technology.

The swift implementation of hard forks like Tangerine Whistle and Spurious Dragon demonstrated a proactive approach to addressing security threats and ensuring the network's continued operation.

**These challenges ultimately strengthened Ethereum, leading to a more robust and secure platform.** The lessons learned from these attacks continue to inform ongoing development efforts, contributing to the ongoing evolution of Ethereum as a leading force in the blockchain space.

As Ethereum continues to grow and expand its reach, the memory of these attacks serves as a reminder of the importance of constant vigilance and a commitment to innovation in the face of adversity.