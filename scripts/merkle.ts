// @ts-ignore
import btc = require('bitcore-lib-inquisition');
import axios from 'axios';
import { Tap } from '@cmdcode/tapscript'  // Requires node >= 19
import BigInteger = require('bigi')

import dotenv = require('dotenv');
dotenv.config();

async function fetchP2WPKHUtxos(address: btc.Address): Promise<any[]> {
    const url = `https://explorer.bc-2.jp/api/address/${address.toString()}/utxo`;

    let res = []
    try {
        // Make a GET request to the URL using axios
        const response = await axios.get(url);

        if (response.data) {
            for (let i = 0; i < response.data.length; i++) {
                const e = response.data[i]
                const utxo = {
                    address: address.toString(),
                    txId: e.txid,
                    outputIndex: e.vout,
                    script: new btc.Script(address),
                    satoshis: e.value
                };
                res.push(utxo)
            }
        }
    } catch (error) { // Handle any errors that occurred during the request
        console.error('Failed to fetch data:', error);
    }
    return res
}

async function main() {
    const seckey = new btc.PrivateKey(process.env.PRIVATE_KEY, btc.Networks.testnet)
    const pubkey = seckey.toPublicKey()
    const addrP2WPKH = seckey.toAddress(null, btc.Address.PayToWitnessPublicKeyHash)

    const xOnlyPub = pubkey.toBuffer().length > 32 ? pubkey.toBuffer().slice(1, 33) : pubkey.toBuffer()

    let scriptMerkle = new btc.Script(`20f37d289bd59a15740c6e12c881737a4a6ae64a16bdd518a20a10a021ca9bf79c57795779577957795779577957796156796156007600a26976539f697693946b6c766b796c766b796c750079009e630079519c63517953797eaa67527952797eaa68537a75527a527a6875756156517600a26976539f697693946b6c766b796c766b796c750079009e630079519c63517953797eaa67527952797eaa68537a75527a527a6875756156527600a26976539f697693946b6c766b796c766b796c750079009e630079519c63517953797eaa67527952797eaa68537a75527a527a6875750079517a75517a75517a75517a75517a75517a75517a75517a75615179877777777777777777`)
    const tapleafMerkle = Tap.encodeScript(scriptMerkle.toBuffer())
    const [tpubkeyMerkle, cblockMerkle] = Tap.getPubKey(pubkey.toString(), { target: tapleafMerkle })
    const scripMerkleP2TR = new btc.Script(`OP_1 32 0x${tpubkeyMerkle}}`)

    // Fetch UTXO's for address
    const utxos = await fetchP2WPKHUtxos(addrP2WPKH)

    console.log(utxos)

    const tx0 = new btc.Transaction()
        .from(utxos)
        .addOutput(new btc.Transaction.Output({
            satoshis: 6000,
            script: scripMerkleP2TR
        }))
        .change(addrP2WPKH)
        .feePerByte(2)
        .sign(seckey)

    console.log('tx0 (serialized):', tx0.uncheckedSerialize())


    //////// CALL - UNLOCK

    const utxoMerkleP2TR = {
        txId: tx0.id,
        outputIndex: 0,
        script: scripMerkleP2TR,
        satoshis: 6000
    };

    const tx1 = new btc.Transaction()
        .from(utxoMerkleP2TR)
        .to(
            [
                {
                    address: addrP2WPKH,
                    satoshis: 2000
                }
            ]
        )

    let witnesses = [
        Buffer.from('aa79d92d00a53039c34e90823b71d8b364c2107e4269158d65f75d8a13560ef0', 'hex'), // Leaf
        Buffer.from('e236cfa62d0caa7951ed9dc6a579a3e93ef3b3d2e1d7b1a106a6497867641736', 'hex'),
        Buffer.from('02', 'hex'),
        Buffer.from('bf5c456c293fa0e620576412897e9eb0d7f77bc38ef7e429e6d9b65693072610', 'hex'),
        Buffer.from('01', 'hex'),
        Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
        Buffer.from('', 'hex'),
        scriptMerkle.toBuffer(),
        Buffer.from(cblockMerkle, 'hex')
    ]
    tx1.inputs[0].witnesses = witnesses
    console.log('tx1 (serialized):', tx1.uncheckedSerialize())


    // Run locally
    let interpreter = new btc.Script.Interpreter()
    let flags = btc.Script.Interpreter.SCRIPT_VERIFY_WITNESS | btc.Script.Interpreter.SCRIPT_VERIFY_TAPROOT
    let res = interpreter.verify(new btc.Script(''), tx0.outputs[0].script, tx1, 0, flags, witnesses, 6000)
    console.log('Local execution success:', res)
}

main().catch(error => console.error('Error in main function:', error));
