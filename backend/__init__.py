# Fix numba/coverage incompatibility: numba 0.64 expects attributes from
# an older coverage API that were renamed/removed in coverage >= 7.4.4.
try:
    from typing import Callable, Optional
    import coverage.types

    if not hasattr(coverage.types, "Tracer"):
        coverage.types.Tracer = coverage.types.TracerCore
    if not hasattr(coverage.types, "TShouldTraceFn"):
        coverage.types.TShouldTraceFn = Callable
    if not hasattr(coverage.types, "TShouldStartContextFn"):
        coverage.types.TShouldStartContextFn = Optional[Callable]
except (ImportError, AttributeError):
    pass
