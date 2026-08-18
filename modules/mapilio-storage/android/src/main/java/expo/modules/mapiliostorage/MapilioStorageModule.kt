package expo.modules.mapiliostorage

import android.os.Environment
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MapilioStorageModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MapilioStorage")

    AsyncFunction("getAllExternalFilesDirs") {
      val context = appContext.reactContext
        ?: error("MapilioStorage application context is unavailable")
      context.getExternalFilesDirs(null)
        .asSequence()
        .filterNotNull()
        .filter { directory ->
          Environment.getExternalStorageState(directory) == Environment.MEDIA_MOUNTED &&
            directory.exists() && directory.isDirectory && directory.canWrite()
        }
        .map { it.absolutePath }
        .toList()
    }

    AsyncFunction("getRemovableExternalFilesDir") {
      val context = appContext.reactContext
        ?: error("MapilioStorage application context is unavailable")
      context.getExternalFilesDirs(null)
        .asSequence()
        .filterNotNull()
        .firstOrNull { directory ->
          Environment.isExternalStorageRemovable(directory) &&
            Environment.getExternalStorageState(directory) == Environment.MEDIA_MOUNTED &&
            directory.exists() && directory.isDirectory && directory.canWrite()
        }
        ?.absolutePath
    }
  }
}
