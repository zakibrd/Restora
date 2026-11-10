from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrCashierForWrite(BasePermission):
    """
    Read access (GET/HEAD/OPTIONS) is public — needed for the customer-facing
    QR menu, which has no login.
    Write access (POST/PUT/PATCH/DELETE) requires an authenticated user whose
    role is 'admin' or 'cashier'.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) in ["admin", "cashier"]
        )


class IsAdminForWrite(BasePermission):
    """
    Same as above but write access is restricted to 'admin' only
    (e.g. menu management, category management).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "admin"
        )


class IsStaff(BasePermission):
    """No public access at all — must be logged in as admin or cashier."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) in ["admin", "cashier"]
        )