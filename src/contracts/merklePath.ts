import {
    prop,
    method,
    SmartContractLib,
    hash256,
    Sha256,
    FixedArray,
} from 'scrypt-ts'

export const MERKLE_PROOF_MAX_DEPTH = 32

export type Node = {
    hash: Sha256
    /*
    Where the actual Merkle path is shorter than the predefined DEPTH, all trailing nodes will be marked as invalid.
     0: invalid
     1: on the left
     2: on the right
    */
    pos: bigint
}

export type MerkleProof = FixedArray<Node, typeof MERKLE_PROOF_MAX_DEPTH> // If shorter than 32, pad with invalid nodes.

export class MerklePath extends SmartContractLib {
    @prop()
    static readonly INVALID_NODE: bigint = 0n

    @prop()
    static readonly LEFT_NODE: bigint = 1n

    @prop()
    static readonly RIGHT_NODE: bigint = 2n

    // According to the given leaf node and merkle path, calculate the hash of the root node of the merkle tree.
    @method()
    static calcMerkleRoot(
        leaf: Sha256,
        merkleProof: MerkleProof
    ): Sha256 {
        let root = leaf

        for (let i = 0; i < MERKLE_PROOF_MAX_DEPTH; i++) {
            const node = merkleProof[i]
            if (node.pos != MerklePath.INVALID_NODE) {
                // s is valid
                root =
                    node.pos == MerklePath.LEFT_NODE
                        ? Sha256(hash256(node.hash + root))
                        : Sha256(hash256(root + node.hash))
            }
        }

        return root
    }
}
