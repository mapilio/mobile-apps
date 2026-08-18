const fs = require('fs');
const path = require('path');

const projectFile = (...parts) => path.join(__dirname, '..', '..', ...parts);

describe('Android release signing', () => {
  it('does not sign release builds with the tracked debug key', () => {
    const gradle = fs.readFileSync(projectFile('android', 'app', 'build.gradle'), 'utf8');
    const releaseBlock = gradle.slice(gradle.indexOf('release {'));

    expect(releaseBlock).not.toContain('signingConfig signingConfigs.debug');
  });

  it('uses EAS-managed credentials for production builds', () => {
    const eas = JSON.parse(fs.readFileSync(projectFile('eas.json'), 'utf8'));

    expect(eas.build.production.credentialsSource).toBe('remote');
  });
});
