
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRnFfmpegVideoEditorSpec.h"

@interface RnFfmpegVideoEditor : NSObject <NativeRnFfmpegVideoEditorSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RnFfmpegVideoEditor : NSObject <RCTBridgeModule>
#endif

@end
