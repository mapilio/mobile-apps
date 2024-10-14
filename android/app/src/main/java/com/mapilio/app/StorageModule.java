package com.mapilio.app;

import android.os.StatFs;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;


import java.io.File;

public class StorageModule extends ReactContextBaseJavaModule {

    public StorageModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "StorageModule";
    }

    @ReactMethod
    public void getStorageInfo(String path, Promise promise) {
        try {
            File file = new File(path);
            StatFs stat = new StatFs(file.getPath());
            long blockSize = stat.getBlockSizeLong();
            long totalBlocks = stat.getBlockCountLong();
            long availableBlocks = stat.getAvailableBlocksLong();

            long totalSpace = totalBlocks * blockSize;
            long freeSpace = availableBlocks * blockSize;

            WritableMap resultMap = Arguments.createMap();
            resultMap.putDouble("totalSpace", (double) totalSpace);
            resultMap.putDouble("freeSpace", (double) freeSpace);

            promise.resolve(resultMap);
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }
}