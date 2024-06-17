import { expect, use } from 'chai'
import { Sha256, reverseByteString } from 'scrypt-ts'
import { BTCMerkle } from '../src/contracts/btcMerkle'
import { getDefaultSigner } from './utils/txHelper'
import chaiAsPromised from 'chai-as-promised'
import { MerklePath, MerkleProof, NodePos } from '../src/contracts/merklePath'
use(chaiAsPromised)

describe('Test SmartContract `BTCMerkle`', () => {
    let instance: BTCMerkle

    before(async () => {
        await BTCMerkle.loadArtifact()

        const merkleRoot = Sha256(
            reverseByteString(
                '9662207b12f8d515eaad007828c9e9f404496d805e00033461b235162aaf83d6',
                32n
            )
        )

        instance = new BTCMerkle(merkleRoot)
        await instance.connect(getDefaultSigner())
        
        console.log('Script len:', instance.lockingScript.toBuffer().length)
    })

    it('merkle proof validation', async () => {
        const leaf = Sha256(
            reverseByteString(
                'b56e7872506c7eedbda2c0c777235a827014e0cd4511dc16c8819e828ca6b2cb',
                32n
            )
        )

        const merkleProof: MerkleProof = [
            {
                hash: Sha256(
                    reverseByteString(
                        '5c467fff75d9b287543af108b915ab2f1292b4455bdfee581b84688e02f1757f',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '28cf703de3c228d6137a22d78664ef4adee60f58bedebd93a1524d086e580d77',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '1ed596283bbbbbec777779f6e15b49641a2821c8a5c6bc6532c8c93705ed5e1f',
                        32n
                    )
                ),
                pos: NodePos.Left,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        'bf09df2adb28700296884a4d98c4557602d9e192f74261ba596256d70951cc14',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '2170ac7dd082f91f79e26f608334912f51342840004c44f467a6160a9bde21be',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '21b9cb162a3c4fd8b13e4c31dc20f340bef05511f21e576325da7106b506dd73',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        'a5d0a5adff3f4e19536313e4b8d1a883758d30a8b5bfa97666e3d120a4fad4d4',
                        32n
                    )
                ),
                pos: NodePos.Left,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '3c9eae626871a5a97f16bf27451b0f1eda63ad65e4aabe7007ca4aaaaea04349',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '74e31bdf48fb91784874194238dba3aff933331e6ad1ee78f29e29216364d934',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        'b4638203ebc68a5bc3dac151373b44b7b326421e152aa91c8bf6665920799f5c',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        'e78e29bfdb7dc728f96be29462a73fe97fa9aa3f458b12863c6ac64e7fc17c17',
                        32n
                    )
                ),
                pos: NodePos.Left,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '7dc21d4fb04fc56709988652c55257c51deb23f147d22e46f41a6b3bf79c50ae',
                        32n
                    )
                ),
                pos: NodePos.Left,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '8e314e3bc7193773342c3982fe1c28a08010c2f88b03d4e41e0b9bd1f99a513b',
                        32n
                    )
                ),
                pos: NodePos.Left,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        'a0a47ef3439eada02b68a16f93e1876eee6694e6a24a4cbeaf708bc6f29f6f14',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '40330475405b219552d7067c33702da70c33107f0a6556304ea61b861672ddbc',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '1c344c713e744c48e25f0023a55dbf45fce1a72ba721ba130927a524043b6862',
                        32n
                    )
                ),
                pos: NodePos.Left,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        'c11762d7987539e97030d0e581226b23607dddc5503dfdcd675b7825abd1b356',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '16f8810622c4c6d5c4a950a02eae60a4141e4f260a3ea91f76721575de4572e6',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '4ca42e393a4cff6d9d4e837d29d23cd36f9b6fc0f35e1e043ca68e06f1cbaf66',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        'c973ca6289dc0861ee4804d0dbaf8bd7d227b79d9ca73fa208e079cb95bcadbc',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        '713e20bf8fd50f287b58669cbba114a154d279053adae07ee4af9d5967c265f7',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            {
                hash: Sha256(
                    reverseByteString(
                        'bba3635e83a918fa0b39c564b746aa8cf0e8c71055b74b30253cd19aaa7503da',
                        32n
                    )
                ),
                pos: NodePos.Right,
            },
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid }, // Fill in rest to match buffer len
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid },
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid },
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid },
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid },
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid },
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid },
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid },
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid },
            { hash: Sha256('00'.repeat(32)), pos: NodePos.Invalid },
        ]

        const result = instance.verify((self) => {
            self.unlock(leaf, merkleProof)
        })
        expect(result.success, result.error).to.be.true

        // Sould fail if anything is off
        merkleProof[9] = {
            hash: Sha256(
                reverseByteString(
                    'b4638203ebc68a5bc3dac151373b44b7b326421e152fa91c8bf6665920799f5c',
                    32n
                )
            ),
            pos: NodePos.Right,
        }
        expect(() => {
            instance.verify((self) => {
                self.unlock(leaf, merkleProof)
            })
        }).to.throw(/Execution failed/)
    })

})
