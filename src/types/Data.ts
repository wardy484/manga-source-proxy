export interface IRequest {
    url: string;
}

export interface ISearchResults {
    results: MangaListItem[]
}

export interface IChapters {
    chapters: Chapter[]
}

export class MangaListItem {
    constructor(
        public id: string,
        public image: string,
        public title: string,
        public iconText: string,
        public primaryText?: string,
        public secondaryText?: string,
        public badge?: number,
    ){}
}

export interface Manga {
    id: string
	titles: string[]
	image: string
	rating?: number
	status: MangaStatus
	langFlag?: string
	artist?: string
	author?: string
	covers?: string[]
	desc?: string
	follows?: number
	tags?: TagSection[]
	views?: number
	hentai?: boolean
	relatedIds?: string[]
	lastUpdate?: Date
}

export enum MangaStatus {
	ONGOING = 1,
	COMPLETED = 0,
	UNKNOWN = 2,
	ABANDONED = 3,
	HIATUS = 4
}

export enum LanguageCode {
    UNKNOWN = '_unknown',
    BENGALI = 'bd',
    BULGARIAN = 'bg',
    BRAZILIAN = 'br',
    CHINEESE = 'cn',
    CZECH = 'cz',
    GERMAN = 'de',
    DANISH = 'dk',
    ENGLISH = 'gb',
    SPANISH = 'es',
    FINNISH = 'fi',
    FRENCH = 'fr',
    WELSH = 'gb',
    GREEK = 'gr',
    CHINEESE_HONGKONG = 'hk',
    HUNGARIAN = 'hu',
    INDONESIAN = 'id',
    ISRELI = 'il',
    INDIAN = 'in',
    IRAN = 'ir',
    ITALIAN = 'it',
    JAPANESE = 'jp',
    KOREAN = 'kr',
    LITHUANIAN = 'lt',
    MONGOLIAN = 'mn',
    MEXIAN = 'mx',
    MALAY = 'my',
    DUTCH = 'nl',
    NORWEGIAN = 'no',
    PHILIPPINE = 'ph',
    POLISH = 'pl',
    PORTUGUESE = 'pt',
    ROMANIAN = 'ro',
    RUSSIAN = 'ru',
    SANSKRIT = 'sa',         
    SAMI = 'si',
    THAI = 'th',
    TURKISH = 'tr',
    UKRAINIAN = 'ua',
    VIETNAMESE = 'vn'
}

export interface Tag {
    /**
     * An internal identifier of this tag
     */
    id: string

    /**
     * A user-presentable representation of how people read the tag. This 
     * may be the same as {@link Tag.id}
     */
    label: string
}

export interface TagSection {
    /**
     * The internal identifier of this tag category
     */
    id: string

    /**
     * How the tag category should be rendered to the user
     */
    label: string

    /**
     * A list of {@link Tag} objects which should be rendered under this category
     */
    tags: Tag[]
}


export interface Chapter {

  /**
   * A given identifier of this chapter. This may be unique to the source.
   * For example, one source may use 'Chapter-1' in it's URLs to identify this chapter,
   * whereas other sources may use some numeric identifier
   */
  id: string

  /**
   * The given identifier of the Manga that owns this chapter. This may be unique to the source
   * which uses it. For example, one source may use the value '1234' to 
   * identify a manga, whereas another one may use the value 'One-Piece' to identify
   */
  mangaId: string

  /**
   * An identifier of which chapter number this is, in a given {@link Manga}
   */
  chapNum: number

  /**
   * The language code which this chapter is associated with.
   * This allows the application to filter by language
   */
  langCode: LanguageCode

  /**
   * The title of this chapter, if one exists
   */
  name?: string

  /**
   * The volume number that this chapter belongs in, if one exists
   */
  volume?: number

  /**
   * A grouping of chapters that this belongs to
   */
  group?: string

  /**
   * The {@link Date} in which this chapter was released
   */
  time?: string
}

export interface ChapterDetails {
    /**
     * The chapter identifier which this source uses. This may be unique to the source.
     * For example, one source may use 'Chapter-1' in it's URLs to identify this chapter,
     * whereas other sources may use some numeric identifier
     */
    id: string
  
    /**
     * The given identifier of the Manga that owns this chapter. This may be unique to the source
     * which uses it. For example, one source may use the value '1234' to 
     * identify a manga, whereas another one may use the value 'One-Piece' to identify
     */
    mangaId: string
  
    /**
     * A list of page URLs which directly reference the image on the page.
     * Example: http:
     * These are what the application renders when the chapter is pulled up
     */
    pages: string[]
  
    /**
     * A mode flag. Should this manga be rendered in longStrip mode?
     */
    longStrip: boolean
  }
  
  export interface MangaTile {
    /**
   * The given identifier of this Manga. This may be unique to the source
   * which uses it. For example, one source may use the value '1234' to
   * identify a manga, whereas another one may use the value 'One-Piece' to identify
   */
    id: string;
    /**
     * What is this manga called? How should it be rendered on the MangaTile?
     */
    title: IconText;
    /**
     * A URL pointing to the image thumbnail which should be displayed on the tile
     */
    image: string;
    /**
     * Any available text which can be displayed as a subtitle to the tile
     * This is what is displayed directly below the title
     */
    subtitleText?: IconText;
    /**
     * IconText which can be shown as primary text to the thumbnail
     * This is rendered in the bottom left of the manga object on the view.
     */
    primaryText?: IconText;
    /**
     * IconText which can be shown as secondary text to the thumbnail
     * This is rendered on the bottom right of the manga object on the view
     */
    secondaryText?: IconText;
    /**
     * The badge value which should be shown on this tile
     */
    badge?: number;
}

export interface IconText {
    text: string;
    icon?: string;
}

export function createManga(info: {
        id: string;
    } & Manga): Manga {
    return {
        id: info.id,
        titles: info.titles,
        image: info.image,
        status: info.status,
        langFlag: info.langFlag,
        artist: info.artist,
        author: info.author,
        covers: info.covers,
        desc: info.desc,
        follows: info.follows,
        tags: info.tags,
        views: info.views,
        hentai: info.hentai,
        relatedIds: info.relatedIds,
        lastUpdate: info.lastUpdate,
    };
}

export interface HomeSection {
    /**
     * An internal identifier of this HomeSection
     */
    id: string;
    /**
     * The title of this section.
     * Common examples of HomeSection titles would be 'Latest Manga', 'Updated Manga',
     * 'Hot Manga', etc.
     */
    title: string;
    /**
     * Type of the section
     * Defaults to HomeSectionType.singleRowNormal
     */
    type?: HomeSectionType;
    /**
     * A list of {@link MangaTile} objects which should be shown under this section
     */
    items?: MangaTile[];
    /**
     * Should you be able to scroll, and view more manga on this section?
     * This method, when true, triggers the {@link Source.getViewMoreRequest} method
     * when the user tries to scroll further on the HomePage section. This usually means
     * that it will traverse to another page, and render more information
     */
    view_more?: any;
}

export declare enum TagType {
    BLUE = "default",
    GREEN = "success",
    GREY = "info",
    YELLOW = "warning",
    RED = "danger"
}

export interface SourceTag {
    text: string;
    type: string;
}

export interface SourceInfo {
    /**
     * Required class variable which denotes the current version of the application.
     * This is what the application uses to determine whether it needs to update it's local
     * version of the source, to a new version on the repository
     */
    readonly version: string;
    /**
     * The title of this source, this is what will show up in the application
     * to identify what Manga location is being targeted
     */
    readonly name: string;
    /**
     * An INTERNAL reference to an icon which is associated with this source.
     * This Icon should ideally be a matching aspect ratio (a cube)
     * The location of this should be in an includes directory next to your source.
     * For example, the MangaPark link sits at: sources/MangaPark/includes/icon.png
     * This {@link Source.icon} field would then be simply referenced as 'icon.png' and
     * the path will then resolve correctly internally
     */
    readonly icon: string;
    /**
     * The author of this source. The string here will be shown off to the public on the application
     * interface, so only write what you're comfortable with showing
     */
    readonly author: string;
    /**
     * A brief description of what this source targets. This is additional content displayed to the user when
     * browsing sources.
     * What website does it target? What features are working? Etc.
     */
    readonly description: string;
    /**
     * A content rating attributed to each source. This can be one of three values, and should be set appropriately.
     * Everyone: This source does not have any sort of adult content available. Each title within is assumed safe for all audiences
     * Mature: This source MAY have mature content inside of it. Even if most content is safe, mature should be selected even if a small subset applies
     * Adult: This source probably has straight up pornography available.
     *
     * This rating helps us filter your source to users who have the necessary visibility rules toggled for their profile.
     * Naturally, only 'Everyone' sources will show up for users without an account, or without any mode toggles changed.
     */
    readonly contentRating: string;
    /**
     * A required field which points to the source's front-page.
     * Eg. https://mangadex.org
     * This must be a fully qualified URL
     */
    readonly websiteBaseURL: string;
    /**
     * An optional field where the author may put a link to their website
     */
    readonly authorWebsite?: string;
    /**
     * An optional field that defines the language of the extension's source
     */
    readonly language?: string;
    /**
     * An optional field of source tags: Little bits of metadata which is rendered on the website
     * under your repositories section
     */
    readonly sourceTags?: SourceTag[];
}
/**
 * A content rating to be attributed to each source.
 */
export declare enum ContentRating {
    EVERYONE = "EVERYONE",
    MATURE = "MATURE",
    ADULT = "ADULT"
}

export declare enum HomeSectionType {
    singleRowNormal = "singleRowNormal",
    singleRowLarge = "singleRowLarge",
    doubleRow = "doubleRow",
    featured = "featured"
}


export interface Request {
    /**
     * The URL which this HTTP request should be delivered to
     */
    url: string;
    /**
     * The type of HTTP method. Usually GET or POST
     */
    method: string;
    /**
     * Metadata is something which can be applied to a Request, which will
     * be passed on to the function which consumes this request. By inserting
     * data here, you are able to forward any data you need as a Source developer
     * to the methods meant to parse the returning data
     */
    metadata?: any;
    /**
     * Any HTTP headers which should be applied to this request
     */
    headers?: RequestHeaders;
    /**
     * Data which
     */
    data?: any;
    /**
     * Formatted parameters which are to be associated to the end of the URL.
     * Eg: ?paramOne=ImportantData&paramTwo=MoreData
     */
    param?: string;
    /**
     * Any formatted cookies which should be inserted into the header
     */
    cookies?: Cookie[];
    /**
     * A toggle for if this request should be made in incognito mode or not
     */
    incognito?: boolean;
}
export interface SearchRequest {
    /**
     * The title of the search request. This usually is the plaintext query you are
     * making as a user
     */
    title?: string;
    includedTags?: Tag[];
    excludedTags?: Tag[];
    includeOperator?: SearchOperator;
    excludeOperator?: SearchOperator;
    /**
     * This is basically anything other than tags that the user enters such as:
     * author: ShindoL author: Miyazuki
     * where `author` would be the key and `ShindoL`, `Myazuki` would be the values.
     */
    parameters: Record<string, string[]>;
}
export declare enum SearchOperator {
    AND = "AND",
    OR = "OR"
}


export interface Cookie {
    name: string;
    value: string;
    domain: string;
    path?: string;
    created?: Date;
    expires?: Date;
}
interface RequestHeadersAny {
    [header: string]: string;
}
interface RequestHeadersDefined {
    'user-agent'?: string;
    'content-type'?: string;
    'content-length'?: string;
    'authorization'?: string;
    'accept-encoding'?: string;
    'referer'?: string;
}
export declare type RequestHeaders = RequestHeadersAny & RequestHeadersDefined;
   
export function createChapter(chapter: Chapter): Chapter {
    return {
        ...chapter
    };
}

export function createChapterDetails(chapterDetails: ChapterDetails): ChapterDetails {
    return {
        ...chapterDetails
    };
}

export function createHomeSection(section: HomeSection): HomeSection {
    return { ...section };
}

export function createMangaTile(mangaTile: MangaTile): MangaTile{
    return { ...mangaTile };
}

export function createIconText(iconText: IconText): IconText {
    return { ...iconText };
}

export function createTag(tag: Tag): Tag {
    return { ...tag };
}
   
export function createTagSection(tagSection: TagSection): TagSection {
    return { ...tagSection };
}

export function createRequestObject(requestObject: Request): Request {
    return { ...requestObject };
}

export function createCookie(cookie: Cookie): Cookie {
    return { ...cookie };
}




export interface MangaUpdates {
    ids: string[];
}

export function createMangaUpdates(update: MangaUpdates): MangaUpdates {
    return { ...update };
}

export interface PagedResults {
    results: MangaTile[];
    metadata?: any;
}

export function createPagedResults(update: PagedResults): PagedResults {
    console.log("Create paged results");
    console.log(update);
    return { ...update };
}

export interface RequestInterceptor {
    /**
     * This method is invoked asynchronously
     * @param request The intercepted request
     */
    interceptRequest(request: Request): Promise<Request>;
    /**
     * While this method can be marked async, you should not
     * do any long running/blocking tasks here. The underlying swift
     * implementation does not run asynchronously and blocks the
     * thread it was invoked on
     *
     * You *cannot* modify anything other than the data in a Response
     * @param response The intercepted response
     */
    interceptResponse(response: Response): Promise<Response>;
}


export interface RequestManagerInfo {
    requestsPerSecond: number;
    /**
     * The time (in milliseconds) before a request is retried or dropped
     */
    requestTimeout?: number;
    interceptor?: RequestInterceptor;
}
export interface RequestManager extends RequestManagerInfo {
    schedule: (request: Request, retryCount: number) => Promise<Response>;
}


