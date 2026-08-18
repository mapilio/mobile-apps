const { transformExpoSQLiteUmbrella } = require('../../scripts/ios/patch-expo-sqlite-umbrella');

const originalUmbrella = `#ifdef __OBJC__
#import <UIKit/UIKit.h>
#endif

#import "sqlite3.h"

FOUNDATION_EXPORT double ExpoSQLiteVersionNumber;
`;

describe('ExpoSQLite umbrella header patch', () => {
  test('qualifies the vendored sqlite3 import', () => {
    expect(transformExpoSQLiteUmbrella(originalUmbrella)).toBe(
      originalUmbrella.replace('#import "sqlite3.h"', '#import <ExpoSQLite/sqlite3.h>')
    );
  });

  test('is idempotent', () => {
    const patched = transformExpoSQLiteUmbrella(originalUmbrella);

    expect(transformExpoSQLiteUmbrella(patched)).toBe(patched);
  });

  test('rejects unexpected umbrella content', () => {
    expect(() => transformExpoSQLiteUmbrella('#import <Foundation/Foundation.h>')).toThrow(
      'ExpoSQLite umbrella header does not contain the expected sqlite3 import'
    );
  });
});
