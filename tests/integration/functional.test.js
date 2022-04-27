import { expect } from "chai";
import fs from 'fs';
import path from 'path';
import { uploadImage } from "../../src/handlers/upload.js";
import { retrieveImage } from "../../src/handlers/retrieve.js";

const __dirname = path.resolve();

describe('integration tests', async function () {
    this.timeout(6000000);

    const document = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../js-thumbor-dash/tests/data/document.json")));
    const image = fs.readFileSync(path.resolve(__dirname, document.imagePath));
    const masternode = document.masternode;

    it('should upload image', async () => {
        const response = await uploadImage(image, masternode, document);
    });

    it('should retrieve image', async () => {
        const response = await retrieveImage(masternode, document);
        expect(response).equal(document.requestUrl);

    });

});