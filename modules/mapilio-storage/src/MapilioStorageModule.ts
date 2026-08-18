import { requireOptionalNativeModule } from 'expo';

type MapilioStorageNativeModule = {
  getAllExternalFilesDirs(): Promise<string[]>;
  getRemovableExternalFilesDir?(): Promise<string | null>;
};

export default requireOptionalNativeModule<MapilioStorageNativeModule>('MapilioStorage');
