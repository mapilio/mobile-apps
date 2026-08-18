const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectFile = (...parts) => path.join(__dirname, '..', '..', ...parts);

const poppinsFiles = {
  'Poppins-Light.ttf': '647f014d36822ef7e0413ffbb65598ae0cb57fb798e635c63912c93d94eb356a',
  'Poppins-Medium.ttf': 'e554db189b5d944ef0e6f98ee0e4e8c75f69e95315dc9f4ae0c616a8756a2ba4',
  'Poppins-Regular.ttf': '78f127277756ae464f4eb665ce214cb6315746f6f4193e95b31f18f4b3e97527',
  'Poppins-SemiBold.ttf': 'bf9c1ff640acc8bb5441a9b564360943f9db90969742aa33a36329b2828d2759',
};

describe('bundled asset licensing', () => {
  it('includes the complete Poppins OFL notice', () => {
    const license = fs.readFileSync(projectFile('assets', 'fonts', 'OFL.txt'), 'utf8');

    expect(license).toContain('Copyright 2020 The Poppins Project Authors');
    expect(license).toContain('SIL OPEN FONT LICENSE Version 1.1');
    expect(license).toContain('PERMISSION & CONDITIONS');
    expect(license).toContain('DISCLAIMER');
  });

  it.each(Object.entries(poppinsFiles))('tracks the licensed bytes for %s', (file, digest) => {
    const contents = fs.readFileSync(projectFile('assets', 'fonts', file));
    const actual = crypto.createHash('sha256').update(contents).digest('hex');

    expect(actual).toBe(digest);
  });
});
