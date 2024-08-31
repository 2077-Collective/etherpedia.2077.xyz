---
title: "WTF is Secret Leader Election (SLE)"
description: "This article explores the concept of Secret Leader Election (SLE). It explains the need for leaders in decentralized systems, the current leader election process in Ethereum, and the potential risks and vulnerabilities associated with it."
pubDate: "Aug 31 2024 14:00:04"
heroImage: "/sle.webp"
authors:
  - name: "Agrimony"
    twitterHandle: "agriimony"
---

“**Secret Leader Elections**” — sounds like something straight out of a dystopian novel, where a shadowy cabal gathers to decide on the future of the world. But no; here, we’re talking about leaders in a decentralized system.

“Why do we need a leader anyway?”, you might ask.

The whole point of decentralized systems is to prevent centralization of power in a single entity. Doesn’t the concept of having a leader run against that very ethos?
Simply put, leaders are required as part of any decentralized consensus mechanism.

- Under Bitcoin’s Proof of Work (PoW) consensus, the leader is the miner with the longest chain (i.e., the one which has put in the most work).
- Under Ethereum’s Proof-of-Stake (PoS) consensus, validators elect leaders randomly from the validator set to propose a block. Once the block is proposed, all validators attest to the validity of the proposed block to add it to the chain.

**Bad leaders can damage both the credibility and liveness of the blockchain** by intentionally omitting certain transactions or purposely proposing a malformed block. Having a large validator set can help prevent collusion between malicious parties and ensure credible neutrality of the chain.

Leader elections are crucial in decentralized systems and must be done in a fair fashion — averaged over time, each participant would have an equal chance of being selected to be the leader. 

**In this article, we will go into detail about the critical components of SLE, its role in the context of Ethereum, and discuss a few implementation methods.**

## What’s With All The Secrecy?

In the simplest (non-secret) approach, validators could take turns to be the leader in a round-robin fashion. However, this opens up room for abuse.
For example, a malicious proposer may profit by carrying out a [Denial of Service (DOS) attack](https://etherpedia.2077.xyz/posts/denial-of-service-attack-on-ethereum/) on the proposer just before and grabbing all of the victim’s tips for themselves. This is especially problematic for smaller “home stakers” who may not be able to afford sophisticated levels of protection against such attacks.

Thus, **a good election mechanism must ensure that the vote is not only conducted fairly and with sufficient randomness** — this way an attacker will not be able to overwhelm the network leader with spam.

**That’s is where Secret Leader Election (SLE) comes in**.

As the name suggests, Secret Leader Election refers to the process of electing validators as the leader to propose a block. Mathematically, it is possible to ensure that only the selected validator knows that they are up for block proposal duty. This way, it becomes **probabilistically impossible for a DOS attack** to be carried out, since the leader is not known till after the block has been proposed.

In a line; **a good SLE mechanism must preserve fairness and unpredictability in its outcomes**. 

## Current State Of Leader Election In Ethereum

Before diving further into the various machinations of SLE, we should first consider how leader election is currently carried out in Ethereum.

The Ethereum blockchain is secured with the stake of more than 1 million validator nodes, each supplying 32 ETH of security. Each epoch, the entire validator set is split into 32 committees across 32 slots.

**The current leader election protocol in Ethereum is done via a verifiable random function (RANDAO) weighted by the validator’s staked balance**. RANDAO provides the randomness needed to shuffle the entire validator set into these various groups.

The first member of each committee is designated as the leader or block proposer. The rest of the committee is then tasked with attesting to the validity of the proposed block by signing off on the header of each block.

- If sufficient validators attest to the validity of the block, it gets included and eventually finalized on the chain if more than ⅔ of the active validators in the committee voted for the same block.
- If the number of validators voting for the leader block drops below ⅔, then the fork choice rule comes into play and validators begin to lose part of their staked ETH until consensus about the leader is re-established.

This gives strong cryptoeconomic security into the ordering of transactions in the chain (finality) while still allowing the chain to remain operational (liveness).

The block leaders of the current epoch then elect the subsequent group of leaders (technically, the n+2th group of leaders) based on RANDAO. During the epoch, each leader adds more entropy into the RANDAO function. After each epoch (32 slots), the final mix from all the leaders are then combined and the next list of leaders is published.

**The current approach minimizes the attack risk, but is still vulnerable to DOS attacks since the list is still known some time in advance** (in practice, leaders are nominated 2 epochs in advance). Neither is the current approach entirely fair, as leaders could potentially collude to influence the pseudorandom function used to calculate the next list of leaders.

Thus, the Ethereum Foundation is actively researching better approaches to incorporate SLE and reduce the risks of collusion or DOS attacks.

## Several Approaches To SLE

**An ideal SLE implementation should ensure that the leader is only known after the block is published**.

Many approaches have been proposed earlier. It is important to note that most of the technologies are still being actively researched, and may not be used in the final implementation.

- **Random selection**: Imagine that each validator rolls a secret dice and commits that data to be revealed during the slot. When the election comes, all validators reveal their commits and the validator with the highest roll gets elected as leader. Zero-knowledge proofs can also be used with verifiable random functions to ensure that no cheating took place.

- **Multi-party computation**: This is similar to a game whereby each participant writes a number on a piece of paper and passes it around the room. Each participant adds more data to the mix, and after everyone has participated, the final number is revealed and the leader is elected.

The main difficulty here lies in broadcasting the results to all 1 million nodes (at time of writing) within the timeframe of a single slot (12 seconds). For example, if the winning roll was only broadcast to half the network, then 50% of the validators would be voting for the wrong leader — creating a fork in the chain. Thus, a robust SLE approach must ensure uniqueness of the elected leader, while still maintaining fairness and unpredictability.

**Current Solution: Shuffling It All**

The current solution uses **a shuffle-based approach for SLE** which ensures that a single leader is elected and avoids unnecessary tie breakers (also known as Secret Single Leader Election or SSLE).

**Let’s understand this approach with an analogy**.

Each person first writes a secret phrase that only they know on a piece of paper.

The paper is then torn in two, and one half is dropped into a hat while the other half is kept. Throughout the day, the pieces of paper get shuffled and mixed around till no one knows which paper belongs to who. 

Towards the end, several pieces of paper are drawn from the hat and listed in order.

While everybody can see the revealed phrases, only the person who wrote down the secret will know that they have been selected. When their turn is called, all they have to do is show up and reveal that they own the other half!

## Technical Mechanism

### Initialization

- Each participant generates a secret key and a corresponding public key.
- The public keys are collected and combined to form a shared public key.

### Commitments
- Participants encrypt their secret keys using the shared public key and submit these encrypted commitments.
- A commitment phase ensures that participants cannot change their secret keys later.

### Shuffling
- A series of verifiable shuffles is performed on the encrypted commitments.
- The shuffles rearrange the commitments, obscuring the link between a participant and their original commitment.
- Several shuffle protocols can be used, such as:
  - Fisher-Yates Shuffle
  - MixNet
  - Verifiable Delay Functions (VDFs)

### Decryption
- After shuffling, participants take turns partially decrypting one commitment each.
- Partial decryption reveals a portion of the original secret key.
- The process continues until one commitment is fully decrypted, revealing the leader's secret key.

### Verification
- Participants verify that:
  - The shuffles were performed correctly.
  - The partial decryptions were valid.
  - The final decrypted secret key corresponds to a valid participant.

## Other Considerations

Of course, in practice this is much [more complicated](https://ethresear.ch/t/whisk-a-practical-shuffle-based-ssle-protocol-for-ethereum/11763). There have also been proposals to implement [secret non-single leader elections](https://ethresear.ch/t/secret-non-single-leader-election/11789). This is an interesting paradigm in which more than one leader is allowed to propose a block in each slot. This removes the need for uniqueness of the elected leader.

However, non-single leader protocols have some centralizing risks, especially when controlling more than one leader might give certain advantages for value extraction.

## Conclusions

SLE is slated to arrive soon. In the meantime, more research continues to be done to understand the potential risks and attack vectors before it can be implemented. Smarter ways to carry out SLE may still be out there! 
