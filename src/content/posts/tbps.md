---
title: "The Roadmap: Data Availability - Terabytes per Second"
description: "If we want to handle millions of transactions per second, the Ethereum network must process gigabytes, if not terabytes, of data in real-time."
pubDate: "Jul 01 2024 12:00:04"
heroImage: "/tbps.png"
author: "Alex Hook"
---

# Introduction

It’s no secret that one of the most important bottlenecks in rollup scaling is data availability. Rollups consume _a lot of data_ for their transaction batches. Optimistic rollups store their batches so that the state proposers can be kept accountable by the challengers, and ZK rollups store their batches so that the proposers can generate a validity proof for them and update the state.

While on-chain verification costs on both types of rollups remain static no matter the throughput, the data storage limits still present a problem. If we want to handle millions of transactions per second, the Ethereum network must process gigabytes, if not terabytes, of data in real-time. By allowing the rollups to store as much data on Ethereum as needed, we open the doors for essentially limitless scalability for the entire world. Let’s explore what solutions are being considered today.

# Rollups B.C.

A long time ago, when rollups were just invented, the only way to store data on Ethereum was to inscribe it into the transactions, keeping it in the blockchain forever. This kind of data was very expensive, as the block space is also demanded by users of Ethereum’s dApps, and in the hours of high demand, the price for data was increasing as well. Realistically, rollups could not process [more than about 110 TPS using block space](https://mirror.xyz/alexhook.eth/y9PTlM6tVr0H8X68r1LV2UwAnT9D6u1MEEiUFvcpyG0), and no matter the capacity, the transactions were expensive because of _data_.

![image](../assets/TheRoadmapTerabytesofDataperSecond/image3.png)

_The median rollup transaction fees as of 19 Feb 2024 (pre-Blobs). Source: https://growthepie.xyz_

Shortly after the inception of rollups the community has realized the necessity in making Ethereum store data temporarily, so that rollups don’t overpay for data availability and don’t overload the block space.

# Blobs

In early 2022, Ethereum developer [Protolambda](https://x.com/protolambda) proposed [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), informally dubbed as “Protodanksharding.” Proto—after the inventor, danksharding—because of the old data sharding technique proposed by another developer, [Dankrad Feist](https://x.com/dankrad).

This upgrade introduced temporary data cells, called “Blobs,” that are roughly 128 KB in size and are pruned after about two weeks. Specifically, a blob is a set of 4096 very large numbers, in which you can fit about 254 bits of data each. These numbers are points on an elliptic curve that allow us to generate short proofs that a certain number exists in the blob, only using a short cryptographic commitment (think of as a hash) to the data. This technique is called KZG commitment scheme.

These proofs don’t make much sense for ZK rollups, as those can simply _(figurative; it’s pretty complex as well)_ generate an equivalence ZK proof for the blob, which would then be used to generate a validity proof for the state. They’re mostly needed for optimistic rollups. These short proofs allow them to reveal only a small portion of the blob which is being contested, instead of revealing the entire blob in the blockchain.

![image](../assets/TheRoadmapTerabytesofDataperSecond/image1.png)

_The features of KZG from [my blobs explainer article (technical!)](https://mirror.xyz/alexhook.eth/W4PYt5zGWjw9VcB8Z6KIJDoyCU0RPA1d304cM0J75mQ)_

EIP-4844 was implemented in the Ethereum network as part of the Cancun-Deneb (Dencun) upgrade. This upgrade went live on March 13, 2024. Shortly after, the rollup fees dropped ~10x, and the Ethereum network finally opened an alternative data channel specifically for rollups.

The capacity of today’s blobs is 64 KB/s. Depending on the rollup, this is ~600-1200 TPS of data.

# PeerDAS

The characteristics of blobs allow us to implement Data Availability Sampling (DAS). This is how it works in PeerDAS:

- All blobs are extended 2x using [erasure coding](https://en.wikipedia.org/wiki/Erasure_code). It allows us to recover the entire blob only by having at least 50% of the data.
- All extended blobs are split into 128 columns. Roughly speaking, each column contains 1/128th part of every extended blob at the same position.
- Validators are divided into 64 subnets, and each subnet receives 4 of those columns. Thus, each validator only stores 4 columns, or 1/64th of every extended blob.
- Thanks to commitment schemes, validators can probabilistically verify that validators in another subnet store their columns by asking for multiple samples and verifying them against the commitment. This way, validators can be sure that everyone stores their assigned data without downloading the entire data, only a few samples.
- As long as at least 50% of columns are available, all the blobs can be recovered.

![image](../assets/TheRoadmapTerabytesofDataperSecond/image4.png)

Technically, this technique should allow the network to handle at least 64 times more blobs than it handles today (6 per block). However, this proposal specifies reusing an existing networking stack to handle DAS for the simplicity of the implementation. This stack doesn’t allow to efficiently handle this much data. The targeted number for PeerDAS is 32–64 blobs per block, with potential increase to 128.

The capacity of this PeerDAS is ~680 KB/s. Depending on the rollup, this is ~6500-13000 TPS of data.

# 2D PeerDAS

This becomes complicated.

![image](../assets/TheRoadmapTerabytesofDataperSecond/image2.png)

In short, instead of columns, now there’s a matrix, and validators store its cells. This structure allows for more efficient sampling, and increases the targeted blob number to 64-128, with potential increase to 256.

The capacity of 2D PeerDAS is ~1.3 MB/s. Depending on the rollup, this is ~13000-26000 TPS of data.

# Replace Networking (FullDAS)

There are proposals that suggest implementing a new networking stack designed specifically for efficient Data Availability Sampling. Even though they aren’t in the roadmap,[ such discussions take place in the Ethereum Research forum](https://ethresear.ch/t/fulldas-towards-massive-scalability-with-32mb-blocks-and-beyond/19529). One of such designs is FullDAS.

The interesting thing is how replacing a networking stack supposedly increases the capacity of the same DAS mechanism twice. The capacity of this proposal is ~2.6 MB/s. Depending on the rollup, this is ~26000-52000 TPS of data.

# Validiums and Volitions

Validiums are a type of layer-two networks that act like a ZK rollup, but store their transaction data off-chain. They are not considered rollups, because they don’t roll up their transactions to Ethereum, but are still a noteworthy technology.

The obvious advantage of validiums is that their data is essentially free. The only cost incurred by the transaction is for proof generation. The disadvantage is that in case of data loss, the network will not be able to continue, because the latest batches cannot be proven. In such case, the DAO or security council of the network will have to roll back these batches to the latest finalized state.

Volition is a combination of on-chain and off-chain data storage in a ZK rollup. Users have a choice whether to store their account on-chain or off-chain. They can always interact with the on-chain accounts, but if they’re off-chain and their data gets lost, they risk losing their account. This might be an option for high-frequency trading accounts that have to access liquidity from the high-security on-chain DeFi protocol, as this would make the costs the same as in validiums, but synchronously interoperable with its ZK rollup.

The capacity of validiums and volitions depends on their DA system. The high-end-style DA protocols can process gigabytes of data per second. If the centralized DA is used, the capacity is practically unlimited. Potentially millions of TPS on ZK rollups using volition systems.

# Why no Optimiums

Similarly to validiums, optimiums act like an optimistic rollup, but store their transaction data off-chain. _Optimiums are not considered L2 networks_, because in case of a DA layer’s failure, all funds in the optimium’s bridge can be stolen. Therefore, it’s more similar to sidechains, where a consensus failure can also lead to theft of funds from the bridge.

In other words, ZK and optimistic rollups inherit security and liveness from the L1. Validiums and volitions inherit security, but not liveness. Optimiums inherit neither.

# Conclusion

The roadmap provides various solutions for increasing data capacity in the network. Moreover, many new ideas and designs are being discussed in the community almost every day. Even if we look at today’s plans, we can confidently say that eventually Ethereum rollups will process tens of thousands of transactions per second.

Considering VISA and Mastercard process ~25000 simple transfers per second in total, Ethereum’s endgame capacity should be enough for the most important operations in the international Web3. If more capacity is needed, ZK technology can handle off-chain DA in a pretty secure way, making trade-offs for using it acceptable in several cases.

Today, we have to think about performance of ZK and rollup interoperability, as these will be the largest barriers after DA is solved. Thankfully, Ethereum community got you covered here too! We’ll dive deeper into these topics in the next articles. Let’s make Ethereum great again!

Thank you for reading.
