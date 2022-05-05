/* eslint-disable max-len */
import {expect} from 'chai';
import fs from 'fs';
import path from 'path';
import {generateUploadURL, generateRequestUrl} from '../../src/url/url.js';

const __dirname = path.resolve();

describe('generate upload URL test', () => {
  it('should create an upload URL', () => {
    const url = generateUploadURL('localhost:8888');
    expect(url).to.equal('http://localhost:8888/image');
  });

  it('should not create wrong url', () => {
    const url = generateUploadURL('localhost:80');
    expect(url).to.not.equal('http://localhost:8888/image');
  });
});

describe('generate request URL test', () => {
  const document = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../js-thumbor-dash/tests/data/document.json')));
  const masternode = document.masternode;

  it('should create an request URL', () => {
    const url = generateRequestUrl(masternode, document);
    expect(url).to.equal(document.requestUrl);
  });
});

