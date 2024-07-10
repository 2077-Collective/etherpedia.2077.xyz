---
title: "The Roadmap: Rollup Scaling"
description: "A rollup is a separate blockchain that processes transactions off-chain."
pubDate: "Jul 01 2024 12:00:03"
heroImage: "/rollups.png"
authors:
  - name: "Alex Hook"
    twitterHandle: "alexhooketh"
---

# Introduction

In retrospect, it's fair to say that Ethereum's impact on the crypto world has been nothing short of revolutionary. The introduction of virtual machines within crypto networks, enabling smart contracts, paved the way for the entire DeFi and Web3 ecosystem we know today.

However, this innovation has also amplified the scaling challenges that blockchains have grappled with since Bitcoin's inception. Ethereum still processes a mere 15 to 20 transactions per second—a fraction of what traditional banking systems handle. In this article, we'll delve into the intricacies of scaling Ethereum and explore how the community is addressing this challenge.

# Theory of Scaling

Ethereum is slow.

It is slow because all Ethereum nodes have to re-execute all transactions happening in the network themselves. This is the cornerstone of blockchain technology—eliminating the need to trust a central entity by allowing users to process transactions themselves. However, this creates a capacity dilemma: either maintain low capacity to keep node operation affordable but transactions expensive, or vice versa.

As decentralization is the core thesis of Ethereum, the Ethereum community leans towards the former. Other blockchains, like Solana or BNB, have chosen to prioritize capacity over decentralization. Consequently, Ethereum stands as the most decentralized crypto network, but also the most expensive.

Ethereum's journey has been a persistent quest to increase transaction throughput while preserving maximum decentralization. Initially, the focus was on sharding.

# The Evolution of Scaling Solutions

## Sharding

Sharding was the Ethereum community's first major scaling initiative. This approach involves dividing the network into multiple interoperable chains, all coordinated by a central "Beacon Chain." Validators, organized into committees, would operate these chains.

![image](../assets/TheRoadmapRollups101/image1.png)

While not novel—blockchains like NEAR and TON have employed sharding from inception—this approach faces significant security challenges at scale. As validators are evenly distributed across shards, each shard becomes more vulnerable to attacks. This isn't problematic with a total stake of $10 billion across ten shards, but to rival [VISA's capacity](https://cointelegraph.com/news/bitcoin-lightning-network-vs-visa-and-mastercard-how-do-they-stack-up), we'd need about 1200 shards! Given Ethereum's current stake of roughly $70 billion, this would leave each shard with only $60 million in economic security—a sum that even individual wealthy actors could potentially compromise.

This is why Ethereum community spent years for fruitless research of sharding before coming up with an alternative solution—rollups.

## Rollups: The New Frontier

A rollup is an independent blockchain that processes transactions off-chain. Periodically, a _sequencer_ compresses all rollup transactions into a single batch and publishes it to Ethereum. To enable interoperability between the rollup and Ethereum, the rollup's _proposer_ asserts about its new state to a bridge smart contract on Ethereum. Then, the proposer proves the validity of this state against previously published transactions to the smart contract, and it can now process the transfers between these two networks.

Essentially, rollups operate _atop_ Ethereum, hence their classification as layer-two (L2) networks, with Ethereum serving as the layer-one (L1) parent network.

There are two leading ways for a proposer to verify the state of the rollup to its bridge:

### Optimistic Rollups

In this model, a proposer asserts the rollup's new state after sequentially executing all transactions (hence "sequencing") and stakes a bond. The bridge smart contract then opens a _challenge window_, typically seven days, during which anyone can submit a fraud proof—a verifiable claim that any part of the proposed state doesn't align with the original transactions. A valid proof results in state reversion and the challenger claiming the proposer's entire bond. In practice, interactive games are used instead, where proposer and challenger engage in a back-and-forth defense, but the core concept remains the same.

After 7 days with no valid fraud proofs, the state output is automatically considered valid, and the withdrawals from the L2 are processed according to this output.

Optimistic rollups reach scalability in that the L1 executes no computations. If the proposed state is valid, it will just be finalized in a week. As long as at least one honest challenger exists in the network, the rollup's bridge remains secure.

### ZK Rollups

In this approach, a proposer asserts the rollup's new state after executing all batches and generates a _zero-knowledge validity proof_. This proof verifies that executing these batches indeed results in the asserted state. The bridge smart contract then verifies this proof and accepts the new state as valid.

Roughly speaking, Zero-Knowledge (ZK) proofs are sets of mathematical equations that prove the outputs of computations without actually performing those computations. This is useful when the computations are too complex or when some necessary values are unavailable (private).
A key characteristic of ZK proofs is their asymmetric computational demands: they're much harder to generate than the computations they prove, but extremely simple to validate in comparison. This is because generating a ZK proof requires "converting" all computations into numerous mathematical equations.

ZK rollups achieve scalability because the proof is generated only once, and the complexity of proof _verification_ on L1 is very low, comparable to executing 5-10 ERC20 transfers. As long as the ZK proof system contains no bugs and vulnerabilities, the rollup’s bridge will always stay secure.

# Is Sky the Limit?

![image](../assets/TheRoadmapRollups101/image2.png)

As of this writing, rollups process approximately 110 transactions per second—a ninefold increase over Ethereum L1. Some rollups, including Arbitrum, Base, and ZKsync Era, have reached impressive peaks of 150-200 TPS on them alone. Transaction fees on rollups [are less than a cent](https://www.growthepie.xyz/fundamentals/transaction-costs)—orders of magnitude lower than on Ethereum. The [DeFi ecosystem on rollups is thriving](https://defillama.com/chains/Rollup), with most Ethereum dApps already deployed on leading rollups. Moreover, many projects like [Farcaster](https://www.farcaster.xyz), [Worldcoin](https://worldcoin.org), and [Zora[(https://zora.co) are rollups-native and have deployed on rollups since day 1.

This can make one wonder: Did we really solve the scalability problem? Are rollups the perfect solution for scaling Ethereum? What’s to be done? Where’s the next billion users?

# Difficulties and Unsolved Tasks

## Technological Complexity

Rollups, both optimistic and ZK, are **very complicated** pieces of technology.

Challenging the output of the computer on-chain and generating cryptographic proofs for the entire virtual machines are quite the novel tasks. For instance, blockchains were the first systems to employ zero-knowledge cryptography in production. An Ethereum Virtual Machine wasn’t supposed to be challenged on another Ethereum Virtual Machine, either. Rollup teams are [investing millions of dollars on audits](https://x.com/code4rena/status/1708934949166825777) and training new developers to find bugs in such systems.

And the most important problem of this complexity is that [tens of billions are at stake](https://l2beat.com/scaling/summary). Any bug could lead to unrecoverable losses. Since rollups aren’t considered a part of Ethereum, they can't rely on hard forks to recover from failures. This necessitates the implementation of "training wheels."

These training wheels are trusted components that allow designated entities to halt or upgrade the system in case of a bug. For example, the vast majority of today’s rollups [are instantly upgradable](https://l2beat.com/scaling/risk). This centralization factor dissuades large projects from building on rollups. However, as rollups mature, these safety measures will gradually become obsolete. Recently, OP Stack upgraded to [Stage 1 trustlessness](https://medium.com/l2beat/introducing-stages-a-framework-to-evaluate-rollups-maturity-d290bb22befe), joining Arbitrum as the second major rollup to achieve this milestone. Arbitrum is further developing the [BoLD proof system](https://docs.arbitrum.io/how-arbitrum-works/bold/gentle-introduction), which allows it to integrate Stage 2 and become fully trustless.

![image](../assets/TheRoadmapRollups101/image3.png)

## Data Availability

This challenge pertains not to the rollup ecosystem, but to Ethereum itself.

As you may have noticed, the crucial part of rollup state verification is sequencing—that is, publishing all transactions so that they can be used to verify the proposed state. If a ZK rollup loses its transaction data, proposers can't generate ZK proofs, halting the chain. In optimistic rollups, lost transaction data prevents challengers from contesting the proposer's state output, potentially enabling fund theft from the bridge.

This is why the batches are posted directly to the Ethereum. Data stored there is as secure as everything else in the network, and as we’re already using Ethereum’s consensus as the source of trust, we don’t introduce any new trust assumptions. However, Ethereum's current data capacity is severely constrained.

Previously, sequencers posted batches directly to the blockchain by including data in transaction call data. This meant that published batches were permanently stored on Ethereum—an inefficient approach, given that this data is only needed for about seven days in optimistic rollups and mere minutes in ZK rollups for proof generation.

Recognizing this inefficiency, Ethereum developers implemented [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844), also known as Protodanksharding. This upgrade introduced blobs—temporary data cells pruned from the network after approximately two weeks. Blobs significantly reduced the load on Ethereum block space, shifting all rollups to the more efficient _blob space_. This innovation [increased throughput by 5-10x](https://mirror.xyz/alexhook.eth/y9PTlM6tVr0H8X68r1LV2UwAnT9D6u1MEEiUFvcpyG0), enabling the impressive transaction speeds we see today.

Nevertheless, this is still certainly not enough for the world scale, so the Ethereum community will have to work on solutions that increase data storage capacity in the network. We’ll explore some of these solutions in the next article.

# Conclusion

Rollups are potentially the only world-level scaling solution we have today. Optimistic fraud provers are [already being tested in the permissionless environment](https://x.com/Optimism/status/1800256837088145799), and [ZK proof systems are steadily optimizing](https://x.com/dlubarov/status/1778092116377493711) towards real-time Ethereum environment verification. Even today’s rollups handle billions of value and hundreds of transactions per second. The entire DeFi is building on top of rollups.

The Ethereum community is actively working to increase network data throughput. Combined with the invaluable efforts of rollup teams, this will enable us to onboard the next generation of Web3 users in the near future. We're constructing this future today, striving to make Ethereum truly great again!

Thank you for reading.
