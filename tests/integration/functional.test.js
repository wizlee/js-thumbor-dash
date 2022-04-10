import { throws } from "assert";
import { expect } from "chai";
import { assert } from "console";
import fs from 'fs';
import path from 'path';
import { uploadImage } from "../../src/handlers/upload.js";

const __dirname = path.resolve();

describe('integration tests', async function () {
    this.timeout(6000000);

    const documentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../js-thumbor-dash/tests/data/documentData.json")));
    const image = fs.readFileSync(path.resolve(__dirname, "../js-thumbor-dash/tests/data/images/example.jpg"));
    const masternode = "localhost:8888"

    it('should upload image', async () => {
        const response = await uploadImage(image, masternode, documentData);
        expect(typeof response).equal('undefined');
    });

});