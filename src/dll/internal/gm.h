#ifndef FORCEINLINE
  #if defined(_MSC_VER)
    #define FORCEINLINE __forceinline
  #elif defined(__GNUC__) || defined(__clang__)
    #define FORCEINLINE inline __attribute__((always_inline))
  #else
    #define FORCEINLINE inline
  #endif
#endif

#ifndef __YY__RUNNER_INTERFACE_H_
#include <YYRunnerInterface.h>
#endif
#ifndef __YYRVALUE_H__
#include <YYRValue.h>
#endif
#ifndef __REF_H__
#include <Ref.h>
#endif