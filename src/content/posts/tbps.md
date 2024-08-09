---
title: "The Roadmap: Data Availability - Terabytes per Second"
description: "If we want to handle millions of transactions per second, the Ethereum network must process gigabytes, if not terabytes, of data in real-time."
pubDate: "Jul 01 2024 12:00:04"
heroImage: "/tbps.webp"
authors:
  - name: "Alex Hook"
    twitterHandle: "alexhooketh"
---

# Introduction

It’s no secret that one of the most important bottlenecks in rollup scaling is data availability. Rollups consume _vast amounts of data_ for their transaction batches. Optimistic rollups store these batches to keep state proposers accountable to challengers, while ZK rollups store them to enable proposers to generate validity proofs and update the state.

While on-chain verification costs for both rollup types remain constant regardless of throughput, data storage limits continue to pose a significant challenge. To handle millions of transactions per second, the Ethereum network must process gigabytes, if not terabytes, of data in real-time. By enabling rollups to store as much data on Ethereum as needed, we unlock the potential for virtually limitless scalability on a global scale. Let's explore the solutions that are under consideration today.

# Rollups B.C.

In the early days of rollups, the only method for storing data on Ethereum was to inscribe it into transactions, permanently embedding it in the blockchain. This approach was prohibitively expensive, as block space was also in high demand from users of Ethereum's dApps. During peak hours, data prices would soar. Realistically, rollups could process [no more than about 110 TPS using block space](https://mirror.xyz/alexhook.eth/y9PTlM6tVr0H8X68r1LV2UwAnT9D6u1MEEiUFvcpyG0), and regardless of capacity, transactions remained costly due to _data availability expenses_.

![image](../assets/TheRoadmapTerabytesofDataperSecond/image3.png)

_The median rollup transaction fees as of 19 Feb 2024 (pre-Blobs). Source: https://growthepie.xyz_

Shortly after rollups' inception, the community recognized the need for Ethereum to be able to store data temporarily, reducing rollups' overpayment for data availability and alleviating pressure on block space.

# Blobs

In early 2022, Ethereum developer [Protolambda](https://x.com/protolambda) proposed [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), colloquially known as "Protodanksharding" – a nod to both its creator and the earlier data sharding technique proposed by Dankrad Feist.

This upgrade introduced temporary data cells called "Blobs," each approximately 128 KB in size and pruned after about two weeks. Specifically, a blob is a set of 4096 very large numbers, in which one can about 254 bits of data. These numbers are points on an elliptic curve, enabling the generation of short proofs that a certain number exists in the blob, using only a short cryptographic commitment (think of as a hash) to the data. This technique is known as the KZG commitment scheme.

These proofs don’t make much sense for ZK rollups, as those can simply _(figurative; it’s pretty complex as well)_ generate an equivalence ZK proof for the blob, which would then be used to generate a validity proof for the state. They’re mostly needed for optimistic rollups. These short proofs allow them to reveal only a small portion of the blob which is being contested, instead of revealing the entire blob in the blockchain.

![image](../assets/TheRoadmapTerabytesofDataperSecond/image1.png)

_The features of KZG from [my blobs explainer article (technical!)](https://mirror.xyz/alexhook.eth/W4PYt5zGWjw9VcB8Z6KIJDoyCU0RPA1d304cM0J75mQ)_

EIP-4844 was implemented in the Ethereum network as part of the Cancun-Deneb (Dencun) upgrade, which went live on March 13, 2024. Shortly after, rollup fees plummeted by approximately 10x, and Ethereum finally opened an alternative data channel specifically for rollups.

The current capacity of blobs is 64 KB/s, translating to roughly 600-1200 TPS of data, depending on the rollup.

# PeerDAS

The characteristics of blobs enable the implementation of Data Availability Sampling (DAS). Here's how PeerDAS works:

- All blobs are extended 2x using [erasure coding](https://en.wikipedia.org/wiki/Erasure_code), allowing recovery of the entire blob with just 50% of the data.
- Extended blobs are split into 128 columns. Roughly speaking, each column contains 1/128th part of every extended blob at the same position.
- Validators are divided into 64 subnets, each receiving 4 columns. Thus, each validator stores only 1/64th of every extended blob.
- Commitment schemes allow validators to probabilistically verify that other subnets store their assigned columns by requesting and verifying samples against the commitment. This way, validators can be sure that everyone stores their assigned data without downloading the entire data, only a few samples.
- As long as at least 50% of columns are available, all blobs can be recovered.

![image](../assets/TheRoadmapTerabytesofDataperSecond/image4.png)

Theoretically, this technique should allow the network to handle at least 64 times more blobs than it currently does (6 per block). However, the proposal specifies reusing an existing networking stack for DAS implementation simplicity, which limits efficient data handling. The target for PeerDAS is 32–64 blobs per block, with potential increases to 128.

PeerDAS offers a capacity of ~680 KB/s, translating to approximately 6500-13000 TPS of data, depending on the rollup.

# 2D PeerDAS

This becomes complicated.

![image](../assets/TheRoadmapTerabytesofDataperSecond/image2.png)

In 2D PeerDAS, instead of columns, data is organized into a matrix, with validators storing its cells. This structure enables more efficient sampling and increases the targeted blob number to 64-128, with potential increases to 256.

2D PeerDAS boasts a capacity of ~1.3 MB/s, enabling approximately 13000-26000 TPS of data, depending on the rollup.

# Replace Networking (FullDAS)

There are proposals that suggest implementing a new networking stack designed specifically for efficient Data Availability Sampling. Even though they aren’t in the roadmap,[ such discussions take place in the Ethereum Research forum](https://ethresear.ch/t/fulldas-towards-massive-scalability-with-32mb-blocks-and-beyond/19529). One such design is FullDAS.

Intriguingly, replacing the networking stack is projected to double the capacity of the same DAS mechanism. FullDAS offers a capacity of ~2.6 MB/s, potentially enabling 26000-52000 TPS of data, depending on the rollup.

# Validiums and Volitions

Validiums are layer-two networks that function like ZK rollups but store transaction data off-chain. They are not considered rollups, because they don’t roll up their transactions to Ethereum, but  still represent a noteworthy technology.

The obvious advantage of validiums is that their data is essentially free. The only cost incurred by the transaction is for proof generation. The disadvantage is that in case of data loss, the network will not be able to continue, because the latest batches cannot be proven. In such case, the DAO or security council of the network will have to roll back these batches to the latest finalized state.

Volition combines on-chain and off-chain data storage in a ZK rollup. Users can choose to store their accounts on-chain or off-chain, always maintaining interaction with on-chain accounts. However, off-chain accounts risk loss if their data is misplaced. This option may appeal to high-frequency trading accounts requiring access to high-security on-chain DeFi protocols, offering costs similar to validiums while maintaining synchronous interoperability with the ZK rollup.

The capacity of validiums and volitions depends on their DA system. High-end DA protocols can process gigabytes of data per second, while centralized DA systems offer virtually unlimited capacity. This could potentially enable millions of TPS on ZK rollups using volition systems.

# Why No Optimiums

Similar to validiums, optimiums function like optimistic rollups but store transaction data off-chain. Crucially, _optimiums are not considered L2 networks_ because a DA layer failure could result in the theft of all funds in the optimium's bridge. Therefore, it’s more similar to sidechains, where a consensus failure can also lead to theft of funds from the bridge.

In other words, ZK and optimistic rollups inherit security and liveness from the L1. Validiums and volitions inherit security, but not liveness, while optimiums inherit neither.

# Conclusion

The Ethereum roadmap presents various solutions for expanding the network's data capacity. New ideas and designs are being discussed within the community almost daily. Even considering only current plans, we can confidently anticipate Ethereum rollups processing tens of thousands of transactions per second in the future.

Given that VISA and Mastercard collectively process approximately 25,000 simple transfers per second, Ethereum's projected capacity should suffice for the most critical operations in the international Web3 ecosystem. If additional capacity is required, ZK technology can handle off-chain DA securely, making the trade-offs acceptable in several use cases.

Currently, our focus must shift to ZK performance and rollup interoperability, as these will likely become the primary barriers once DA is resolved. Fortunately, the Ethereum community is already addressing these challenges. We'll explore these topics in greater depth in upcoming articles. Together, let's continue to make Ethereum great again!

Thank you for reading.
