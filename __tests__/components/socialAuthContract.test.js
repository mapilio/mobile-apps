const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('social auth source contract', () => {
  const components = ['GoogleLogin', 'FacebookLogin', 'AppleLogin', 'OSMLogin'].map((name) =>
    read(`components/SocialLogin/${name}.js`)
  );

  it('uses the shared helper for every provider', () => {
    components.forEach((source) => expect(source).toContain('socialTokenLogin'));
  });

  it('does not put tokens or client credentials in social auth URLs', () => {
    const forbiddenNames = [
      ['EXPO_PUBLIC', 'AUTH_CLIENT_ID'].join('_'),
      ['EXPO_PUBLIC', 'AUTH_CLIENT_SECRET'].join('_'),
      ['EXPO_PUBLIC', 'OSM_CLIENT_SECRET'].join('_'),
      'clientSecret',
      'token=',
    ];
    const source = components.concat([read('.env.example'), read('README.md')]).join('\n');

    forbiddenNames.forEach((name) => expect(source).not.toContain(name));
    components.forEach((component) => expect(component).not.toMatch(/https?:\/\/[^\n]*\?/));
  });

  it('keeps provider credentials out of Redux credential state', () => {
    expect(read('components/SocialLogin/GoogleLogin.js')).toContain("payload: { type: 'google' }");
    expect(read('components/SocialLogin/FacebookLogin.js')).toContain(
      "payload: { type: 'facebook' }"
    );
    expect(read('components/SocialLogin/OSMLogin.js')).toContain(
      "payload: { type: 'openstreetmap' }"
    );
    expect(read('components/SocialLogin/AppleLogin.js')).toContain(
      "payload: { type: 'apple', user: credential.user }"
    );
  });

  it('uses expo-auth-session PKCE for OSM and sends the generated verifier', () => {
    const osm = read('components/SocialLogin/OSMLogin.js');

    expect(osm).toContain("codeChallengeMethod: 'S256'");
    expect(osm).toContain('usePKCE: true');
    expect(osm).toContain('code_verifier: request.codeVerifier');
    expect(osm).toContain("socialTokenLogin('openstreetmap', accessToken)");
    expect(osm).not.toContain('clientSecret');
    expect(osm).not.toContain(['react-native', 'pkce-challenge'].join('-'));
  });
});
