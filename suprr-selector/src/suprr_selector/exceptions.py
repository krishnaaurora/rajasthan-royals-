class SupeRRException(Exception):
    """Base exception for SupeRR Selector platform."""

class DataValidationError(SupeRRException):
    """Raised when dataset integrity check fails."""

class MatchStateError(SupeRRException):
    """Raised when cricket state transition is invalid."""

class PressureEngineError(SupeRRException):
    """Raised when pressure calculation encounters invalid parameters."""
