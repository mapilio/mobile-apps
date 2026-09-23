import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

describe('accessible control contracts', () => {
  it('keeps login controls named while their state changes', () => {
    const login = read('screens/Login.js');

    expect(login).toContain(
      "accessibilityLabel={securePassword ? 'Show password' : 'Hide password'}"
    );
    expect(login).toContain('{toggleEye && (');
    expect(login).toContain('onPress={() => setSecurePassword((current) => !current)}');
    expect(login).toContain("accessibilityLabel={t('login')}");
    expect(login).toContain('accessibilityState={{ disabled: loading, busy: loading }}');
    expect(login).not.toContain('onPressIn={() => setSecurePassword(false)}');
  });

  it('names map controls and exposes the location long-press action', () => {
    const center = read('components/Map/CenterToUserButton.js');
    const profile = read('components/Map/ProfileButton.js');
    const attribution = read('components/Map/AttributonButton.js');
    const styles = read('styles/appMapStyle.js');

    expect(center).toContain('accessibilityLabel="Center map on my location"');
    expect(center).toContain("{ name: 'longpress', label: 'Show or hide nearby contributors' }");
    expect(center).toContain("nativeEvent.actionName === 'longpress'");
    expect(profile).toContain('accessibilityLabel="Profile"');
    expect(attribution).toContain('accessibilityLabel="Map attribution"');
    expect(styles).toContain('width: RFValue(48)');
    expect(styles).toContain('height: RFValue(48)');
  });

  it('provides non-gesture alternatives for image selection and upload deletion', () => {
    const imageCard = read('components/UploadImageCard.js');
    const uploadItem = read('components/Uploads/UploadItem.js');

    expect(imageCard).toContain('accessibilityState={{ selected }}');
    expect(imageCard).toContain("name: 'toggleSelection'");
    expect(imageCard).toContain("nativeEvent.actionName === 'toggleSelection'");
    expect(uploadItem).toContain(
      "accessibilityActions={[{ name: 'deleteUpload', label: t('delete') }]}"
    );
    expect(uploadItem).toContain("nativeEvent.actionName === 'deleteUpload'");
    expect(uploadItem).toContain("accessibilityLabel={t('delete')}");
  });

  it('keeps upload and capture text or icon actions exposed as buttons', () => {
    const uploadModal = read('components/Uploads/UploadModal.js');
    const captureCompleted = read('screens/CaptureCompleted.js');
    const uploadCompleted = read('screens/UploadCompleted.js');
    const cameraSidebar = read('components/CameraSidebar.js');

    expect(uploadModal).toContain("accessibilityLabel={isPaused ? t('resume') : t('pause')}");
    expect(uploadModal).toContain("accessibilityLabel={t('stop_upload')}");
    expect(captureCompleted).toContain('accessibilityRole="button"');
    expect(uploadCompleted).toContain('accessibilityRole="button"');
    expect(cameraSidebar).toContain("accessibilityLabel={t('safe_mode')}");
  });

  it('names the Marketplace information and close buttons', () => {
    const popover = read('components/Marketplace/MarketplacePopover.js');
    const list = read('components/Marketplace/List.js');

    expect(popover).toContain('accessibilityLabel="Marketplace information"');
    expect(popover).toContain('accessibilityRole="button"');
    expect(popover).toContain('onPress={() => setShowPopover(true)}');
    expect(popover).not.toContain('onPressIn=');
    expect(list).toContain("accessibilityLabel={t('profile:close')}");
    expect(list).toContain('accessibilityRole="button"');
  });

  it.each(['AuthUserButton', 'ListItem'])(
    'names %s profile navigation and exposes row expansion',
    (component) => {
      const source = read(`components/Leaderboard/${component}.js`);

      expect(source).toContain('accessibilityRole="button"');
      expect(source).toContain("accessibilityLabel={`${t('navigation:profile')}: ${displayName}`}");
      expect(source).toContain('accessibilityState={{ expanded }}');
    }
  );

  it('identifies each winner profile by name', () => {
    const winners = read('components/Leaderboard/WinnersBox.js');

    expect(winners).toContain('accessibilityRole="button"');
    expect(winners).toContain(
      "accessibilityLabel={`${t('navigation:profile')}: ${winner.display_name}`}"
    );
  });
});
