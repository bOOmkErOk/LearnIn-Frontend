import { CreateSubscriptionRequest } from "../../core/models/subscription.models";

export class CreateSubscription {
    static readonly type = '[Subscription] Create Subscription'
    constructor(public payload: CreateSubscriptionRequest) { }

}

export class LoadMySubscriptions {
    static readonly type = '[Subscription] Load My Subscriptions';
}