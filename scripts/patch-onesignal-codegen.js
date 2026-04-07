/**
 * Patches react-native-onesignal for RN 0.76 compatibility.
 *
 * OneSignal 5.4+ uses CodegenTypes.EventEmitter which requires RN 0.78+.
 * On RN 0.76 the codegen parser rejects these properties.
 *
 * This script:
 * 1. Removes EventEmitter declarations from the TurboModule spec (so codegen passes)
 * 2. Patches the native ObjC code to use sendEventWithName: instead of codegen-generated emitOnXxx:
 * 3. Patches the header to inherit from RCTEventEmitter directly
 */

const fs = require('fs');
const path = require('path');

const osDir = path.join(__dirname, '..', 'node_modules', 'react-native-onesignal');

// 1. Patch NativeOneSignal.ts — remove EventEmitter lines
const specPath = path.join(osDir, 'src', 'NativeOneSignal.ts');
if (fs.existsSync(specPath)) {
  let content = fs.readFileSync(specPath, 'utf8');
  if (content.includes('CodegenTypes')) {
    content = content.replace(
      /import type \{ CodegenTypes, TurboModule \} from 'react-native';/,
      "import type { TurboModule } from 'react-native';",
    );
    content = content.replace(/\s*readonly \w+: CodegenTypes\.EventEmitter<[^>]+>;/g, '');
    fs.writeFileSync(specPath, content, 'utf8');
    console.log('[patch-onesignal] 1/3 Patched NativeOneSignal.ts');
  }
}

// 2. Patch RCTOneSignalEventEmitter.mm — replace emitOnXxx: with sendEventWithName:
const mmPath = path.join(osDir, 'ios', 'RCTOneSignal', 'RCTOneSignalEventEmitter.mm');
if (fs.existsSync(mmPath)) {
  let content = fs.readFileSync(mmPath, 'utf8');
  if (content.includes('emitOnPermissionChanged:')) {
    // Replace all emitOnXxx: calls with sendEventWithName:body:
    const replacements = [
      ['emitOnPermissionChanged:', 'sendEventWithName:@"onPermissionChanged" body:'],
      ['emitOnSubscriptionChanged:', 'sendEventWithName:@"onSubscriptionChanged" body:'],
      ['emitOnUserStateChanged:', 'sendEventWithName:@"onUserStateChanged" body:'],
      ['emitOnNotificationWillDisplay:', 'sendEventWithName:@"onNotificationWillDisplay" body:'],
      ['emitOnNotificationClicked:', 'sendEventWithName:@"onNotificationClicked" body:'],
      ['emitOnInAppMessageClicked:', 'sendEventWithName:@"onInAppMessageClicked" body:'],
      ['emitOnInAppMessageWillDisplay:', 'sendEventWithName:@"onInAppMessageWillDisplay" body:'],
      ['emitOnInAppMessageDidDisplay:', 'sendEventWithName:@"onInAppMessageDidDisplay" body:'],
      ['emitOnInAppMessageWillDismiss:', 'sendEventWithName:@"onInAppMessageWillDismiss" body:'],
      ['emitOnInAppMessageDidDismiss:', 'sendEventWithName:@"onInAppMessageDidDismiss" body:'],
    ];
    for (const [from, to] of replacements) {
      content = content.split(from).join(to);
    }
    // Add supportedEvents method required by RCTEventEmitter
    if (!content.includes('supportedEvents')) {
      content = content.replace(
        'RCT_EXPORT_MODULE(OneSignal)\n',
        `RCT_EXPORT_MODULE(OneSignal)

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"onPermissionChanged",
    @"onSubscriptionChanged",
    @"onUserStateChanged",
    @"onNotificationWillDisplay",
    @"onNotificationClicked",
    @"onInAppMessageClicked",
    @"onInAppMessageWillDisplay",
    @"onInAppMessageDidDisplay",
    @"onInAppMessageWillDismiss",
    @"onInAppMessageDidDismiss"
  ];
}

`,
      );
    }
    // Remove getTurboModule: method (not needed for old architecture)
    content = content.replace(
      /- \(std::shared_ptr<facebook::react::TurboModule>\)getTurboModule[\s\S]*?\n\}/,
      '',
    );
    fs.writeFileSync(mmPath, content, 'utf8');
    console.log('[patch-onesignal] 2/3 Patched RCTOneSignalEventEmitter.mm');
  }
}

// 3. Patch RCTOneSignalEventEmitter.h — use RCTEventEmitter directly
const hPath = path.join(osDir, 'ios', 'RCTOneSignal', 'RCTOneSignalEventEmitter.h');
if (fs.existsSync(hPath)) {
  let content = fs.readFileSync(hPath, 'utf8');
  if (content.includes('NativeOneSignalSpecBase')) {
    // Replace codegen import and class inheritance
    content = content.replace(
      '#import <RNOneSignalSpec/RNOneSignalSpec.h>',
      '#import <React/RCTEventEmitter.h>',
    );
    content = content.replace(
      /: NativeOneSignalSpecBase <NativeOneSignalSpec,\s*OSNotificationLifecycleListener>/,
      ': RCTEventEmitter <RCTBridgeModule, OSNotificationLifecycleListener>',
    );
    fs.writeFileSync(hPath, content, 'utf8');
    console.log('[patch-onesignal] 3/3 Patched RCTOneSignalEventEmitter.h');
  }
}

// 4. Patch dist/index.js — replace codegen EventEmitter with NativeEventEmitter
const distPath = path.join(osDir, 'dist', 'index.js');
if (fs.existsSync(distPath)) {
  let content = fs.readFileSync(distPath, 'utf8');
  if (content.includes('this.RNOneSignal.onPermissionChanged')) {
    // Add NativeEventEmitter import at the top
    content = content.replace(
      "const { NativeModules } = require('react-native');",
      "const { NativeModules, NativeEventEmitter } = require('react-native');",
    );
    // If above didn't match, try alternative import pattern
    if (!content.includes('NativeEventEmitter')) {
      content = `const { NativeEventEmitter } = require('react-native');\n` + content;
    }

    // Replace setupListeners method
    const oldSetup = /setupListeners\(\)\s*\{[\s\S]*?this\.RNOneSignal\.onInAppMessageDidDismiss\(\(payload\) => \{[^}]*\}\)\);[\s\n]*\}/;
    const newSetup = `setupListeners() {
		if (this.RNOneSignal == null) return;
		const emitter = new NativeEventEmitter(this.RNOneSignal);
		const events = [
			['onPermissionChanged', (payload) => { const typed = payload; this.dispatchHandlers(PERMISSION_CHANGED, typed.permission); }],
			['onSubscriptionChanged', (payload) => { this.dispatchHandlers(SUBSCRIPTION_CHANGED, payload); }],
			['onUserStateChanged', (payload) => { this.dispatchHandlers(USER_STATE_CHANGED, payload); }],
			['onNotificationWillDisplay', (payload) => { this.dispatchHandlers(NOTIFICATION_WILL_DISPLAY, new NotificationWillDisplayEvent(payload)); }],
			['onNotificationClicked', (payload) => { this.dispatchHandlers(NOTIFICATION_CLICKED, payload); }],
			['onInAppMessageClicked', (payload) => { this.dispatchHandlers(IN_APP_MESSAGE_CLICKED, payload); }],
			['onInAppMessageWillDisplay', (payload) => { this.dispatchHandlers(IN_APP_MESSAGE_WILL_DISPLAY, payload); }],
			['onInAppMessageDidDisplay', (payload) => { this.dispatchHandlers(IN_APP_MESSAGE_DID_DISPLAY, payload); }],
			['onInAppMessageWillDismiss', (payload) => { this.dispatchHandlers(IN_APP_MESSAGE_WILL_DISMISS, payload); }],
			['onInAppMessageDidDismiss', (payload) => { this.dispatchHandlers(IN_APP_MESSAGE_DID_DISMISS, payload); }],
		];
		for (const [name, handler] of events) {
			this.nativeSubscriptions.push(emitter.addListener(name, handler));
		}
	}`;
    content = content.replace(oldSetup, newSetup);
    fs.writeFileSync(distPath, content, 'utf8');
    console.log('[patch-onesignal] 4/4 Patched dist/index.js (NativeEventEmitter)');
  }
}

console.log('[patch-onesignal] Done.');
