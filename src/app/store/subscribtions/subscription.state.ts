import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { Subscription } from "../../core/models/subscription.models";
import { inject, Injectable } from "@angular/core";
import { SubscriptionService } from "../../core/services/subscription.service";
import { tap } from "rxjs";
import { CreateSubscription, LoadMySubscriptions } from "./subscribtion.actions";

export interface SubscriptionStateModel {
    subscriptions: Subscription[],
    loading: boolean
}

@State<SubscriptionStateModel>({
    name: 'subscriptions',
    defaults: {
        subscriptions: [],
        loading: false
    }
})

@Injectable()

export class SubscriptionState {
    private subscriptionService = inject(SubscriptionService);

    @Selector()
    static subscriptions(state: SubscriptionStateModel): Subscription[] {
        return state.subscriptions;
    }

    @Selector()
    static loading(state: SubscriptionStateModel): boolean {
        return state.loading;
    }

    static isSubscribed(teacherid: number) {
        createSelector([SubscriptionState], (state: SubscriptionStateModel) =>
            state.subscriptions.some((s) => s.teacherId == teacherid && s.isCurrentlyActive))
    }



    @Action(CreateSubscription)
    createSubscription(ctx: StateContext<SubscriptionStateModel>, action: CreateSubscription) {
        ctx.patchState({ loading: true });
        return this.subscriptionService.createSubscription(action.payload).pipe(
            tap({
                next: () => ctx.patchState({ loading: false }),
                error: () => ctx.patchState({ loading: false })
            })
        )
    }

    @Action(LoadMySubscriptions)
    loadMySubscriptions(ctx: StateContext<SubscriptionStateModel>) {
        ctx.patchState({ loading: true });
        return this.subscriptionService.getMySubscriptions().pipe(
            tap({
                next: (subscriptions) => ctx.patchState({ subscriptions, loading: false }),
                error: () => ctx.patchState({ loading: false })
            })
        );
    }
}