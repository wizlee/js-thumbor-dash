import fetch from 'node-fetch';
import fs from 'fs';
import Dash from 'dash';
import bs58 from 'bs58';
import { generateUploadURL } from "../../src/url/generateUrl.js";


/**
 * Uploads an image to the thumbor_dash server
 * @param {*} image - image binary data
 * @param {*} server - server address [ip:port]
 * @param {*} params - document data [contractId, ownerId]
 */

export async function uploadImage(image, server, params) {

    fetch(
        generateUploadURL(server), {
        method: 'POST',
        body: image,
    }
    )
        .then((response) => {
            const avatarUrl = response.headers.get("location");

            // Create a thumbanil contract document for the image
            return createDocument(avatarUrl, params);
        }
        )
        .catch(err => console.log(err));
}



/**
 * Create thumbnail contract document
 * @param {*} avatarUrl - thumbnail image url
 * @param {*} params - document data [contractId, ownerId]
 */
async function createDocument(avatarUrl, params) {

    const ownerId = params.ownerId;
    const contractId = params.contractId ? params.contractId : "Bw7U7xUiwoE5wkkrJxbBLdf442TiY63SDvCDZLNrzTHr";
    const documentType = params.documentType ? params.documentType : "thumbnailField";
    const field = avatarUrl;
    const resizeValues = params.resizeValues ? params.resizeValues : [1, 1, 1200, 800];
    const mnemonic = params.mnemonic;

    if ((typeof ownerId === 'undefined') || (typeof mnemonic === 'undefined')) {
        console.log("missing required data - ownerId, mnemonic");
        return;
    }

    const clientOpts = {
        network: params.network ? params.network : 'testnet',
        wallet: {
            mnemonic: mnemonic,
            unsafeOptions: {
                skipSynchronizationBeforeHeight: 650000, // only sync from early-2022
            },
        },
        apps: {
            thumbnailContract: {
                contractId: contractId,
            },
        },
    };

    const client = new Dash.Client(clientOpts);

    const submitNoteDocument = async () => {
        const { platform } = client;
        const identity = await platform.identities.get(ownerId);

        const docProperties = {
            ownerId: Buffer.from(bs58.decode(ownerId)),
            contractId: contractId,
            documentType: documentType,
            field: field,
            resizeValues: Array.from(resizeValues),
        };

        // Create the thumbnail document
        const thumbnailDocument = await platform.documents.create(
            'thumbnailContract.thumbnailField',
            identity,
            docProperties,
        );

        const documentBatch = {
            create: [thumbnailDocument], // Document(s) to create
            replace: [],            // Document(s) to update
            delete: [],             // Document(s) to delete
        };
        // Sign and submit the document(s)
        return platform.documents.broadcast(documentBatch, identity);
    };

    return submitNoteDocument()
        .then((d) => console.log(d))
        .catch((e) => console.error('Something went wrong:\n', e))
        .finally(() => client.disconnect());
}

uploadImage(fs.readFileSync("/Volumes/harddrive/Projects/js-thumbor-dash/js-thumbor-dash/tests/data/images/example.jpg"), "localhost:8888", {
    ownerId: "3GVAAkyWDK68V92Evy4jrnYyBJamri8bXQakWbMedr93",
    contractId: "Bw7U7xUiwoE5wkkrJxbBLdf442TiY63SDvCDZLNrzTHr",
    mnemonic: "bulk chimney foam muscle detail matter snake purchase science exile upon marriage where history notice antique arm lawn upgrade hope athlete foam hidden false",
});