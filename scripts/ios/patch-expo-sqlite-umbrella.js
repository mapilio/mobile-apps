const fs = require('fs');

const ORIGINAL_IMPORT = '#import "sqlite3.h"';
const PATCHED_IMPORT = '#import <ExpoSQLite/sqlite3.h>';

function transformExpoSQLiteUmbrella(content) {
  if (content.includes(PATCHED_IMPORT)) {
    return content;
  }

  if (!content.includes(ORIGINAL_IMPORT)) {
    throw new Error('ExpoSQLite umbrella header does not contain the expected sqlite3 import');
  }

  return content.replace(ORIGINAL_IMPORT, PATCHED_IMPORT);
}

function patchExpoSQLiteUmbrella(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const patched = transformExpoSQLiteUmbrella(content);

  if (patched !== content) {
    fs.writeFileSync(filePath, patched);
  }
}

if (require.main === module) {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error('ExpoSQLite umbrella header path is required');
  }

  patchExpoSQLiteUmbrella(filePath);
}

module.exports = {
  transformExpoSQLiteUmbrella,
};
