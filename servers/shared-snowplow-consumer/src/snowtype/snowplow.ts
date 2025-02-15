import { buildSelfDescribingEvent, SelfDescribingJson, Timestamp, Tracker } from '@snowplow/node-tracker';
// Automatically generated by Snowtype

/**
 * Event triggered when the backend updates the properties of an object. Entities included:
 * a new and an old entity for the object being updated, api_user, and [sometimes] user.
 */
export type ObjectUpdate = {
    /**
     * The name of the entity being updated.
     */
    object: Object;
    /**
     * The backend action taken that triggers the object update.
     */
    trigger: ObjectUpdateTrigger;
}

/**
 * The name of the entity being updated.
 */
export type Object = "account" | "syndicated_article" | "newsletter_subscriber" | "user" | "payment_subscription" | "collection" | "reviewed_corpus_item" | "scheduled_corpus_candidate" | "scheduled_corpus_item" | "prospect" | "shareable_list" | "shareable_list_item" | "pocket_share";

/**
 * The backend action taken that triggers the object update.
 */
export type ObjectUpdateTrigger = "sso_login" | "account_signup" | "account_product_digest_update" | "account_email_updated" | "account_delete" | "collection_created" | "collection_updated" | "newsletter_signup" | "payment_subscription_renewed" | "payment_subscription_ended" | "payment_subscription_created" | "pocket_share_created" | "pocket_share_context_updated" | "prospect_created" | "prospect_reviewed" | "reviewed_corpus_item_updated" | "reviewed_corpus_item_removed" | "reviewed_corpus_item_rejected" | "reviewed_corpus_item_added" | "scheduled_corpus_candidate_generated" | "scheduled_corpus_item_rescheduled" | "scheduled_corpus_item_removed" | "scheduled_corpus_item_added" | "shareable_list_created" | "shareable_list_updated" | "shareable_list_deleted" | "shareable_list_hidden" | "shareable_list_unhidden" | "shareable_list_published" | "shareable_list_unpublished" | "shareable_list_item_created" | "shareable_list_item_deleted" | "shareable_list_item_updated" | "modify" | "insert" | "user_guid_linked" | "account_login" | "account_password_changed";

/**
 * Entity that describes the concept of an item within a shareable list. This item must be
 * added by a logged-in user to the shareable list, which also saves the item to the user's
 * Saves (For the time being, any item that is able to be added to the shareable list must
 * already have been saved to the user's list).
 */
export type ShareableListItem = {
    /**
     * The list of the author(s) for the shareable list item.
     */
    authors?: any[];
    /**
     * The UTC unix timestamp (in seconds) for when the shareable list item was created.
     */
    created_at: number;
    /**
     * The excerpt of the shareable list item.
     */
    excerpt?: string;
    /**
     * The full URL of the content. Warning, this is a unique URL and does NOT uniquely identify
     * the same piece of content across multiple users. For that, use content_id.
     */
    given_url: string;
    /**
     * The url of the main image of the shareable list item.
     */
    image_url?: string;
    /**
     * An optional note that the list owner may add to a list item.
     */
    note?: string;
    /**
     * The publisher for the shareable list item.
     */
    publisher?: string;
    /**
     * The backend identifier for the parent shareable list of which the item belongs to. May be
     * not unique.
     */
    shareable_list_external_id: string;
    /**
     * The unique backend identifier for a shared list item.
     */
    shareable_list_item_external_id: string;
    /**
     * The zero-based index of the story within the shareable list.
     */
    sort_order: number;
    /**
     * The title of the shareable list item.
     */
    title?: string;
    /**
     * The UTC unix timestamp (in seconds) for when the shareable list item was last updated.
     */
    updated_at?: number;
}

/**
 * Entity that describes the concept list that can be created then shared with other users
 * regardless of logged-in status.
 */
export type ShareableList = {
    /**
     * The UTC unix timestamp (in seconds) for when the shareable list was created.
     */
    created_at: number;
    /**
     * The description of the shareable list (filled in by the user creating the list).
     */
    description?: string;
    /**
     * Indication of whether the list's notes are private or public.
     */
    list_item_note_visibility: ListItemNoteVisibility;
    /**
     * The name of the moderator that reviewed the reported list. NULL by default.
     */
    moderated_by?: string;
    /**
     * Extra details/notes why the list was moderated. NULL by default.
     */
    moderation_details?: string;
    /**
     * The reason that the shareable list was reviewed & moderated. NULL by default.
     */
    moderation_reason?: string;
    /**
     * Indication of whether the list is viewable vs. has been deleted by being (1) reported by
     * a user, (2) reviewed by the moderation team, (3) reviewed by legal, and (4) deleted for
     * violating Terms of Service.
     */
    moderation_status: ModerationStatus;
    /**
     * If the list was hidden then restored, this field will be populated with the reason for
     * restoration of the list.
     */
    restoration_reason?: string;
    /**
     * The unique backend identifier for a shared list.
     */
    shareable_list_external_id: string;
    /**
     * The slug for the shareable list.
     */
    slug?: string;
    /**
     * Indication of whether the list is private (default) or public (after publishing).
     */
    status: ListItemNoteVisibility;
    /**
     * The title of the shareable list.
     */
    title: string;
    /**
     * The UTC unix timestamp (in seconds) for when the shareable list was last updated.
     */
    updated_at?: number;
    /**
     * The backend identifier for the Pocket user account that created this shareable list.
     */
    user_id?: number;
}

/**
 * Indication of whether the list's notes are private or public.
 *
 * Indication of whether the list is private (default) or public (after publishing).
 */
export type ListItemNoteVisibility = "PRIVATE" | "PUBLIC";

/**
 * Indication of whether the list is viewable vs. has been deleted by being (1) reported by
 * a user, (2) reviewed by the moderation team, (3) reviewed by legal, and (4) deleted for
 * violating Terms of Service.
 */
export type ModerationStatus = "VISIBLE" | "HIDDEN";

/**
 * Entity to describe an app using the Pocket API that triggers (not executes) updates on
 * the backend. Expected to be included on all events.
 */
export type APIUser = {
    /**
     * Pocket backend identifier for an app using the Pocket API.
     */
    api_id: number;
    /**
     * The version number for the client hitting the API.
     */
    client_version?: string;
    /**
     * Indicates whether an app is a native Pocket app.
     */
    is_native?: boolean;
    /**
     * Indicates whether an app has been whitelisted as one that sends non-automated actions and
     * represents real human usage.
     */
    is_trusted?: boolean;
    /**
     * The name of the app using the Pocket API.
     */
    name?: string;
}

/**
 * Entity to describe a user based on available identifiers. Expected to be included in all
 * events that are [theoretically] initiated by a human.
 */
export type User = {
    /**
     * The Adjust device ID used by the Adjust SDK.
     */
    adjust_id?: string;
    /**
     * Email address of the user.
     */
    email?: string;
    /**
     * The backend cookie-based identifier for a user (logged in or out).
     */
    guid?: number;
    /**
     * The hashed backend cookie-based identifier for a user (logged in or out).
     */
    hashed_guid?: string;
    /**
     * The hashed backend identifier for a full Pocket account.
     */
    hashed_user_id?: string;
    /**
     * The backend identifier for a full Pocket account.
     */
    user_id?: number;
}

/**
 * A unique user within the Pocket backend (always represented by an email address,
 * sometimes by a user ID). Expected (new and old) on all object_update events where object
 * = account.
 */
export type Account = {
    /**
     * The UTC unix timestamp (in seconds) for when the user account was created (users.birth).
     */
    created_at?: number;
    /**
     * The email addresses associated with the account, always beginning with the primary
     * address.
     */
    emails?: string[];
    /**
     * The hashed backend identifier for a Pocket user account.
     */
    hashed_user_id?: string;
    /**
     * Whether the user currently has Premium functionality enabled.
     */
    is_premium?: boolean;
    /**
     * Indication of whether the version of the entity is before or after the modifications were
     * made.
     */
    object_version: ObjectVersion;
    /**
     * The single-sign-on services the user has connected with their account.
     */
    sso_services?: SsoService[];
    /**
     * The backend identifier for a Pocket user account.
     */
    user_id: number;
}

/**
 * Indication of whether the version of the entity is before or after the modifications were
 * made.
 */
export type ObjectVersion = "new" | "old";

/**
 * A single-sign-on service.
 */
export type SsoService = "google" | "firefox" | "apple";

/**
 * Event triggered when the backend updates the state of a saved item for a user. Entities
 * included: list_item (one new and one old), api_user, and user.
 */
export type ListItemUpdate = {
    /**
     * The action performed on the user-item.
     */
    trigger: ListItemUpdateTrigger;
}

/**
 * The action performed on the user-item.
 */
export type ListItemUpdateTrigger = "save" | "archive" | "delete" | "favorite" | "unfavorite" | "tags_update" | "unarchive";

/**
 * Entity to describe an item that has been saved to a user’s list. Expected (new and old)
 * on all list_item_update events.
 */
export type ListItem = {
    /**
     * The UTC unix timestamp (in seconds) for when the list item was created (list.time_added).
     */
    created_at: number;
    /**
     * Indicates whether the item is favorited by the user.
     */
    is_favorited: boolean;
    /**
     * The backend identifier for the URL.
     */
    item_id: number;
    /**
     * Indication of whether the version of the entity is before or after the modifications were
     * made.
     */
    object_version: ObjectVersion;
    /**
     * The status of the list item.
     */
    status: ListItemStatus;
    /**
     * The set of tags the user has added to the item.
     */
    tags: string[];
    /**
     * The URL of the list item.
     */
    url: string;
}

/**
 * The status of the list item.
 */
export type ListItemStatus = "unread" | "archived" | "deleted" | "pending" | "pending_hidden" | "hidden" | "not_in_list";

/**
 * Entity containing the meta data for curated collections. Expected (new and old) on all
 * object_update events where object = collection.
 */
export type Collection = {
    /**
     * The list of the author(s) for the collection.
     */
    authors?: CollectionAuthor[];
    /**
     * A guid that identifies the collection, sometimes referred to as the collection’s
     * external_id.
     */
    collection_id: string;
    /**
     * The UTC unix timestamp (in seconds) for when the collection was created.
     */
    created_at?: number;
    /**
     * Curation category of the collection.
     */
    curation_category?: CurationCategory;
    /**
     * The excerpt for the collection.
     */
    excerpt?: string;
    /**
     * The IAB child category of the collection.
     */
    iab_child_category?: IabChildCategory;
    /**
     * The IAB Parent category of the collection.
     */
    iab_parent_category?: IabParentCategory;
    /**
     * The url of the main image of the collection.
     */
    image_url?: string;
    /**
     * The intro text of the collection.
     */
    intro?: string;
    /**
     * The list of label(s) assigned to the collection
     */
    labels?: Label[];
    /**
     * The language of the collection.
     */
    language?: Language;
    /**
     * Indication of whether the version of the entity is before or after the modifications were
     * made.
     */
    object_version: ObjectVersion;
    /**
     * Partnership details of the collection.
     */
    partnership?: Partnership;
    /**
     * The UTC unix timestamp (in seconds) for when the collection was most recently published.
     */
    published_at?: number | null;
    /**
     * The slug for the collection.
     */
    slug: string;
    /**
     * The publication status of the collection.
     */
    status: CollectionStatus;
    /**
     * The list of the stories for the collection.
     */
    stories?: Story[];
    /**
     * The title of the collection.
     */
    title?: string;
    /**
     * The UTC unix timestamp (in seconds) for when the collection was last updated.
     */
    updated_at?: number;
}

/**
 * An author of the collection.
 */
export type CollectionAuthor = {
    /**
     * Boolean flag whether an author is currently active or not.
     */
    active?: boolean;
    /**
     * Author's biography.
     */
    bio?: string;
    /**
     * A guid that identifies an author of the collection, sometimes referred to as the
     * collection author’s external_id.
     */
    collection_author_id?: string;
    /**
     * The url of the author image.
     */
    image_url?: string;
    /**
     * The name of an author of the collection.
     */
    name?: string;
    /**
     * The slug for the author.
     */
    slug?: string;
    [property: string]: any;
}

/**
 * Curation category of the collection.
 */
export type CurationCategory = {
    /**
     * The guid that identifies a collection's curation category. Sometimes referred to as the
     * collection's curation category's external_id.
     */
    collection_curation_category_id?: string;
    /**
     * Name of a collection's curation category.
     */
    name?: string;
    /**
     * Slug of a collection's curation category.
     */
    slug?: string;
    [property: string]: any;
}

/**
 * The IAB child category of the collection.
 */
export type IabChildCategory = {
    /**
     * The guid that identifies IAB Category. Sometimes referred to as the collection's child
     * IAB category's external_id.
     */
    collection_iab_child_category_id?: string;
    /**
     * Name of the IAB category.
     */
    name?: string;
    /**
     * Slug of the IAB category.
     */
    slug?: string;
    [property: string]: any;
}

/**
 * The IAB Parent category of the collection.
 */
export type IabParentCategory = {
    /**
     * The guid that identifies IAB Category. Sometimes referred to as the collection's parent
     * IAB category's external_id.
     */
    collection_iab_parent_category_id?: string;
    /**
     * Name of the IAB category.
     */
    name?: string;
    /**
     * Slug of the IAB category.
     */
    slug?: string;
    [property: string]: any;
}

/**
 * Label(s) assigned to the collection.
 */
export type Label = {
    /**
     * A guid that identifies the collection label, sometimes referred to as the collection
     * label's external_id.
     */
    collection_label_id?: string;
    /**
     * The name or the string value of the label itself.
     */
    name?: string;
    [property: string]: any;
}

/**
 * The language of the collection.
 */
export type Language = "DE" | "EN";

/**
 * Partnership details of the collection.
 */
export type Partnership = {
    /**
     * Blurb of a collection's partnership.
     */
    blurb?: string;
    /**
     * The guid that identifies a collection's partnership. Sometimes referred to as the
     * collection's partnership's external_id.
     */
    collection_partnership_id?: string;
    /**
     * Image url of a collection's partnership.
     */
    image_url?: string;
    /**
     * Name of a collection's partnership.
     */
    name?: string;
    /**
     * Type of collection partnership.
     */
    type?: Type;
    /**
     * The url of a collection's partnership.
     */
    url?: string;
    [property: string]: any;
}

/**
 * Type of collection partnership.
 */
export type Type = "PARTNERED" | "SPONSORED";

/**
 * The publication status of the collection.
 */
export type CollectionStatus = "draft" | "published" | "archived" | "review";

/**
 * A story in the collection.
 */
export type Story = {
    /**
     * The list of author(s) of the story.
     */
    authors?: StoryAuthor[];
    /**
     * A guid that identifies the collection story, sometimes referred to as the collection
     * story’s external_id.
     */
    collection_story_id?: string;
    /**
     * The excerpt of the story.
     */
    excerpt?: string;
    /**
     * The url of the image of the story.
     */
    image_url?: string;
    /**
     * Boolean flag to know if the story is from a partner or not
     */
    is_from_partner?: boolean;
    /**
     * The publisher of the story.
     */
    publisher?: string;
    /**
     * The zero-based index of the story within the collection.
     */
    sort_order?: number | null;
    /**
     * The title of the story.
     */
    title?: string;
    /**
     * The url for the story.
     */
    url?: string;
    [property: string]: any;
}

/**
 * A collection story author
 */
export type StoryAuthor = {
    /**
     * name of the author of the collection story
     */
    name?: string;
    /**
     * The zero-based index of the author within the collection story.
     */
    sort_order?: number | null;
    [property: string]: any;
}

/**
 * Candidate corpus item awaiting review
 */
export type Prospect = {
    /**
     * The list of authors of the candidate corpus item.
     */
    authors?: string[];
    /**
     * The UTC unix timestamp (in seconds) for when the candidate corpus item was created.
     */
    created_at: number;
    /**
     * The name of the online publication that published this story.
     */
    domain?: string;
    /**
     * The excerpt for the candidate corpus item.
     */
    excerpt?: string;
    /**
     * The url of the main image of the candidate corpus item.
     */
    image_url?: string;
    /**
     * Indicates whether the candidate corpus item is a collection.
     */
    is_collection?: boolean;
    /**
     * Indicates whether the candidate corpus item is a syndicated article.
     */
    is_syndicated?: boolean;
    /**
     * The language of the candidate corpus item.
     */
    language?: string;
    /**
     * Indication of whether the version of the entity is before or after the modifications were
     * made.
     */
    object_version: ObjectVersion;
    /**
     * The identifier for the curation prospect, used to join with the dataset that describes
     * the prospect.
     */
    prospect_id: string;
    /**
     * The decision by the curator on the item’s validity for the curated corpus.
     */
    prospect_review_status: ProspectReviewStatus;
    /**
     * Source of Prospect candidate sets
     */
    prospect_source: string;
    /**
     * The name of the online publication that published this story.
     */
    publisher?: string;
    /**
     * The UTC unix timestamp (in seconds) for when the candidate corpus item was created.
     */
    reviewed_at?: number;
    /**
     * The curator who created the candidate corpus item.
     */
    reviewed_by?: string;
    /**
     * A guid that identifies the scheduled surface.
     */
    scheduled_surface_id: string;
    /**
     * An optional text field for the curator to provide more information about a change in
     * status.
     */
    status_reason_comment?: string;
    /**
     * The list of reasons why the curator set the current status for the candidate corpus item.
     */
    status_reasons?: string[];
    /**
     * The title of the candidate corpus item.
     */
    title?: string;
    /**
     * The topic of the candidate corpus item.
     */
    topic?: string;
    /**
     * The url of the candidate corpus item.
     */
    url?: string;
}

/**
 * The decision by the curator on the item’s validity for the curated corpus.
 */
export type ProspectReviewStatus = "created" | "recommendation" | "corpus" | "rejected" | "dismissed";

/**
 * Entity to describe an Item that has been shared from the Pocket Share button.
 */
export type PocketShare = {
    /**
     * The UTC unix timestamp (in seconds) for when the list item was created (list.time_added).
     */
    created_at: number;
    /**
     * The number of characters in the attached note (zero if there is no note)
     */
    note_length: number;
    /**
     * The number of quotes from the article included on the share (can be zero)
     */
    quote_count: number;
    /**
     * The share url's slug. Corresponds to the slug used in the database.
     */
    slug: string;
    /**
     * The URL of the Item that was shared.
     */
    target_url: string;
}

/**
 * Event triggered when SearchResults are returned from Pocket's search api (for saves and
 * corpus). Entities included: api_user; sometimes user, feature_flag.
 */
export type SearchResponseEvent = {
    /**
     * A unique ID for this result
     */
    id: string;
    /**
     * Number of results in the result set.
     */
    result_count_total: number;
    /**
     * Ordered result of urls in the search result connection
     */
    result_urls: string[];
    /**
     * UNIX time in seconds when the results were sent by the Search API.
     */
    returned_at: number;
    /**
     * The search query
     */
    search_query: SearchQuery;
    /**
     * Identifies the corpus that was searched
     */
    search_type: SearchType;
}

/**
 * The search query
 */
export type SearchQuery = {
    /**
     * Identifies the filters which were applied to the search, if applicable.
     */
    filter: Filter[];
    /**
     * 2-5 character language code to indicate the language the search was performed in
     */
    language?: string;
    query:     string;
    /**
     * Identifies the fields which were searched.
     */
    scope: Scope;
}

export type Filter = "domain" | "title" | "tags" | "contentType" | "status" | "isFavorite" | "publishedDateRange" | "topic" | "excludeML" | "excludeCollections" | "addedDateRange" | "publisher" | "author";

/**
 * Identifies the fields which were searched.
 */
export type Scope = "all" | "all_contentful" | "title" | "excerpt" | "content" | "publisher";

/**
 * Identifies the corpus that was searched
 */
export type SearchType = "saves" | "corpus_en" | "corpus_es" | "corpus_de" | "corpus_it" | "corpus_fr";

interface CommonEventProperties<T = Record<string, unknown>> {
    /** Add context to an event by setting an Array of Self Describing JSON */
    context?: Array<SelfDescribingJson<T>> | null;
    /** Set the true timestamp or overwrite the device sent timestamp on an event */
    timestamp?: Timestamp | null;
}

/**
 * Creates a Snowplow Event Specification entity.
 */
export function createEventSpecification(eventSpecification: EventSpecification){
    return {
        schema:
            'iglu:com.snowplowanalytics.snowplow/event_specification/jsonschema/1-0-2',
        data: eventSpecification,
    }
}

/**
 * Automatically attached context for event specifications
 */
interface EventSpecification {
    id: string;
    name: string;
    data_product_id: string;
    data_product_name: string;
}

type ContextsOrTimestamp<T = any> = Omit<CommonEventProperties<T>, 'context'> & { context?: SelfDescribingJson<T>[] | null | undefined }

/**
 * Track a Snowplow event for ObjectUpdate.
 * Event triggered when the backend updates the properties of an object. Entities included: a new and an old entity for the object being updated, api_user, and [sometimes] user.
 */
export function trackObjectUpdate<T extends {} = any>(tracker: Tracker, objectUpdate: ObjectUpdate & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = objectUpdate; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/object_update/jsonschema/1-0-20',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow ObjectUpdate entity.
 */
export function createObjectUpdate(objectUpdate: ObjectUpdate){
    return {
        schema: 'iglu:com.pocket/object_update/jsonschema/1-0-20',
        data: objectUpdate
    }
}
/**
 * Track a Snowplow event for ShareableListItem.
 * Entity that describes the concept of an item within a shareable list. This item must be added by a logged-in user to the shareable list, which also saves the item to the user&#x27;s Saves (For the time being, any item that is able to be added to the shareable list must already have been saved to the user&#x27;s list).
 */
export function trackShareableListItem<T extends {} = any>(tracker: Tracker, shareableListItem: ShareableListItem & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = shareableListItem; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/shareable_list_item/jsonschema/1-0-5',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow ShareableListItem entity.
 */
export function createShareableListItem(shareableListItem: ShareableListItem){
    return {
        schema: 'iglu:com.pocket/shareable_list_item/jsonschema/1-0-5',
        data: shareableListItem
    }
}
/**
 * Track a Snowplow event for ShareableList.
 * Entity that describes the concept list that can be created then shared with other users regardless of logged-in status.
 */
export function trackShareableList<T extends {} = any>(tracker: Tracker, shareableList: ShareableList & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = shareableList; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/shareable_list/jsonschema/1-0-6',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow ShareableList entity.
 */
export function createShareableList(shareableList: ShareableList){
    return {
        schema: 'iglu:com.pocket/shareable_list/jsonschema/1-0-6',
        data: shareableList
    }
}
/**
 * Track a Snowplow event for APIUser.
 * Entity to describe an app using the Pocket API that triggers (not executes) updates on the backend. Expected to be included on all events.
 */
export function trackAPIUser<T extends {} = any>(tracker: Tracker, aPIUser: APIUser & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = aPIUser; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/api_user/jsonschema/1-0-2',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow APIUser entity.
 */
export function createAPIUser(aPIUser: APIUser){
    return {
        schema: 'iglu:com.pocket/api_user/jsonschema/1-0-2',
        data: aPIUser
    }
}
/**
 * Track a Snowplow event for User.
 * Entity to describe a user based on available identifiers. Expected to be included in all events that are [theoretically] initiated by a human.
 */
export function trackUser<T extends {} = any>(tracker: Tracker, user: User & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = user; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/user/jsonschema/1-0-1',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow User entity.
 */
export function createUser(user: User){
    return {
        schema: 'iglu:com.pocket/user/jsonschema/1-0-1',
        data: user
    }
}
/**
 * Track a Snowplow event for Account.
 * A unique user within the Pocket backend (always represented by an email address, sometimes by a user ID). Expected (new and old) on all object_update events where object &#x3D; account.
 */
export function trackAccount<T extends {} = any>(tracker: Tracker, account: Account & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = account; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/account/jsonschema/1-0-3',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow Account entity.
 */
export function createAccount(account: Account){
    return {
        schema: 'iglu:com.pocket/account/jsonschema/1-0-3',
        data: account
    }
}
/**
 * Track a Snowplow event for ListItemUpdate.
 * Event triggered when the backend updates the state of a saved item for a user. Entities included: list_item (one new and one old), api_user, and user.
 */
export function trackListItemUpdate<T extends {} = any>(tracker: Tracker, listItemUpdate: ListItemUpdate & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = listItemUpdate; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/list_item_update/jsonschema/1-0-1',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow ListItemUpdate entity.
 */
export function createListItemUpdate(listItemUpdate: ListItemUpdate){
    return {
        schema: 'iglu:com.pocket/list_item_update/jsonschema/1-0-1',
        data: listItemUpdate
    }
}
/**
 * Track a Snowplow event for ListItem.
 * Entity to describe an item that has been saved to a user’s list. Expected (new and old) on all list_item_update events.
 */
export function trackListItem<T extends {} = any>(tracker: Tracker, listItem: ListItem & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = listItem; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/list_item/jsonschema/1-0-1',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow ListItem entity.
 */
export function createListItem(listItem: ListItem){
    return {
        schema: 'iglu:com.pocket/list_item/jsonschema/1-0-1',
        data: listItem
    }
}
/**
 * Track a Snowplow event for Collection.
 * Entity containing the meta data for curated collections. Expected (new and old) on all object_update events where object &#x3D; collection.
 */
export function trackCollection<T extends {} = any>(tracker: Tracker, collection: Collection & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = collection; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/collection/jsonschema/1-0-3',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow Collection entity.
 */
export function createCollection(collection: Collection){
    return {
        schema: 'iglu:com.pocket/collection/jsonschema/1-0-3',
        data: collection
    }
}
/**
 * Track a Snowplow event for Prospect.
 * Candidate corpus item awaiting review
 */
export function trackProspect<T extends {} = any>(tracker: Tracker, prospect: Prospect & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = prospect; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/prospect/jsonschema/1-0-1',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow Prospect entity.
 */
export function createProspect(prospect: Prospect){
    return {
        schema: 'iglu:com.pocket/prospect/jsonschema/1-0-1',
        data: prospect
    }
}
/**
 * Track a Snowplow event for PocketShare.
 * Entity to describe an Item that has been shared from the Pocket Share button.
 */
export function trackPocketShare<T extends {} = any>(tracker: Tracker, pocketShare: PocketShare & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = pocketShare; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/pocket_share/jsonschema/1-0-1',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow PocketShare entity.
 */
export function createPocketShare(pocketShare: PocketShare){
    return {
        schema: 'iglu:com.pocket/pocket_share/jsonschema/1-0-1',
        data: pocketShare
    }
}
/**
 * Track a Snowplow event for SearchResponseEvent.
 * Event triggered when SearchResults are returned from Pocket&#x27;s search api (for saves and corpus). Entities included: api_user; sometimes user, feature_flag.
 */
export function trackSearchResponseEvent<T extends {} = any>(tracker: Tracker, searchResponseEvent: SearchResponseEvent & ContextsOrTimestamp<T>){
    const { context, timestamp, ...data } = searchResponseEvent; 
    tracker.track(buildSelfDescribingEvent({
        event: {
            schema: 'iglu:com.pocket/search_response_event/jsonschema/1-0-4',
            data
        }
    }), context, timestamp);
}

/**
 * Creates a Snowplow SearchResponseEvent entity.
 */
export function createSearchResponseEvent(searchResponseEvent: SearchResponseEvent){
    return {
        schema: 'iglu:com.pocket/search_response_event/jsonschema/1-0-4',
        data: searchResponseEvent
    }
}

/**
 * Tracks a ItemSave event specification.
 * ID: 2565192a-4600-45db-861d-d9b9378ed87e
 */
export function trackItemSaveSpec(tracker: Tracker, itemSave: ListItemUpdate & ContextsOrTimestamp<APIUser | ListItem | User>){
    const eventSpecificationContext: SelfDescribingJson<EventSpecification> = createEventSpecification({ 
        id: '2565192a-4600-45db-861d-d9b9378ed87e',
        name: 'Item Save',
        data_product_id: '4a1a7785-38d7-432d-8453-01ddc046450f',
        data_product_name: 'Pocket Backend'
    });

    const context = Array.isArray(itemSave.context)
        ? [...itemSave.context, eventSpecificationContext]
        : [eventSpecificationContext];

    const modifiedItemSave: ListItemUpdate & ContextsOrTimestamp<APIUser | ListItem | User | EventSpecification> = {
        ...itemSave,
        context,
    };

    trackListItemUpdate(tracker, modifiedItemSave);
}
/**
 * Tracks a CreateShareLink event specification.
 * ID: 3dbe5b4a-333c-4798-83f4-4ef30dfe84be
 */
export function trackCreateShareLinkSpec(tracker: Tracker, createShareLink: ObjectUpdate & ContextsOrTimestamp<APIUser | PocketShare | User>){
    const eventSpecificationContext: SelfDescribingJson<EventSpecification> = createEventSpecification({ 
        id: '3dbe5b4a-333c-4798-83f4-4ef30dfe84be',
        name: 'Create Share Link',
        data_product_id: '4a1a7785-38d7-432d-8453-01ddc046450f',
        data_product_name: 'Pocket Backend'
    });

    const context = Array.isArray(createShareLink.context)
        ? [...createShareLink.context, eventSpecificationContext]
        : [eventSpecificationContext];

    const modifiedCreateShareLink: ObjectUpdate & ContextsOrTimestamp<APIUser | PocketShare | User | EventSpecification> = {
        ...createShareLink,
        context,
    };

    trackObjectUpdate(tracker, modifiedCreateShareLink);
}
/**
 * Tracks a UpdateShareLink event specification.
 * ID: 6d541fdc-440e-4873-afd2-fe522806157b
 */
export function trackUpdateShareLinkSpec(tracker: Tracker, updateShareLink: ObjectUpdate & ContextsOrTimestamp<APIUser | PocketShare | User>){
    const eventSpecificationContext: SelfDescribingJson<EventSpecification> = createEventSpecification({ 
        id: '6d541fdc-440e-4873-afd2-fe522806157b',
        name: 'Update Share Link',
        data_product_id: '4a1a7785-38d7-432d-8453-01ddc046450f',
        data_product_name: 'Pocket Backend'
    });

    const context = Array.isArray(updateShareLink.context)
        ? [...updateShareLink.context, eventSpecificationContext]
        : [eventSpecificationContext];

    const modifiedUpdateShareLink: ObjectUpdate & ContextsOrTimestamp<APIUser | PocketShare | User | EventSpecification> = {
        ...updateShareLink,
        context,
    };

    trackObjectUpdate(tracker, modifiedUpdateShareLink);
}
/**
 * Tracks a SearchResult event specification.
 * ID: 8bde42c4-659f-40b6-9a95-865bde7f05c3
 */
export function trackSearchResultSpec(tracker: Tracker, searchResult: SearchResponseEvent & ContextsOrTimestamp<APIUser | User>){
    const eventSpecificationContext: SelfDescribingJson<EventSpecification> = createEventSpecification({ 
        id: '8bde42c4-659f-40b6-9a95-865bde7f05c3',
        name: 'Search Result',
        data_product_id: '4a1a7785-38d7-432d-8453-01ddc046450f',
        data_product_name: 'Pocket Backend'
    });

    const context = Array.isArray(searchResult.context)
        ? [...searchResult.context, eventSpecificationContext]
        : [eventSpecificationContext];

    const modifiedSearchResult: SearchResponseEvent & ContextsOrTimestamp<APIUser | User | EventSpecification> = {
        ...searchResult,
        context,
    };

    trackSearchResponseEvent(tracker, modifiedSearchResult);
}

