import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { AuthState } from "../../store/auth/auth.state";

export const teacherGuard: CanActivateFn = () => {
    const store = inject(Store);
    const router = inject(Router);

    const isTeacher = store.selectSnapshot(AuthState.isTeacher)

    if (isTeacher) {
        return true;
    }

    return router.createUrlTree(['/login']);
}