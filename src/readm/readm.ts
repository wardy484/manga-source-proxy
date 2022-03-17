import { Source } from '../lib/source';

import {
    Chapter,
    ChapterDetails,
    ContentRating,
    createIconText,
    createMangaTile,
    createMangaUpdates,
    createPagedResults,
    HomeSection,
    Manga,
    MangaTile,
    MangaUpdates,
    PagedResults,
    SearchRequest,
    SourceInfo,
    TagSection,
    TagType,
} from './../types/Data';

import {
    isLastPage,
    parseChapterDetails,
    parseChapters,
    parseHomeSections,
    parseMangaDetails,
    parseTags,
    parseUpdatedManga,
    parseViewMore,
    UpdatedManga,
} from './readmParser'

const RM_DOMAIN = 'https://readm.org'

export const ReadmInfo: SourceInfo = {
    version: '2.0.2',
    name: 'Readm',
    icon: 'icon.png',
    author: 'Netsky',
    authorWebsite: 'https://github.com/TheNetsky',
    description: 'Extension that pulls manga from Readm.',
    contentRating: "MATURE", 
    websiteBaseURL: RM_DOMAIN,
    sourceTags: [
        {
            text: 'Notifications',
            type: "green"
        },
        {
            text: 'Cloudflare',
            type: "red"
        }
    ]
}

export class Readm extends Source {
    override requestManager = this.createRequestManager({
        requestsPerSecond: 4,
        requestTimeout: 15000,
    })

    getMangaShareUrl(mangaId: string): string { return `${RM_DOMAIN}/manga/${mangaId}` }

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = this.createRequestObject({
            url: `${RM_DOMAIN}/manga/`,
            method: 'GET',
            param: mangaId,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        })
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = this.createRequestObject({
            url: `${RM_DOMAIN}/manga/`,
            method: 'GET',
            param: mangaId,
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return await parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = this.createRequestObject({
            url: `${RM_DOMAIN}/manga/${mangaId}/${chapterId}`,
            method: 'GET',
            param: '/all-pages'
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data, { xmlMode: false })
        return parseChapterDetails($, mangaId, chapterId)
    }

    async getTags(): Promise<TagSection[]> {
        const request = this.createRequestObject({
            url: RM_DOMAIN,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return parseTags($) || []
    }

    async filterUpdatedManga(time: Date, ids: string[]): Promise<UpdatedManga> {
        let page = 1
        let updatedManga: UpdatedManga = {
            ids: [],
            loadMore: true
        }
        let results: UpdatedManga = {
            ids: [],
            loadMore: false
        };

        while (updatedManga.loadMore) {
            const request = this.createRequestObject({
                url: `${RM_DOMAIN}/latest-releases/${page++}`,
                method: 'GET',
            })
            const response = await this.requestManager.schedule(request, 1)
            const $ = this.cheerio.load(response.data)

            updatedManga = parseUpdatedManga($, time, ids)
            results.ids.push(...updatedManga.ids);
        }

        return results;
    }

    async getHomePageSections(): Promise<HomeSection[]> {
        const request = this.createRequestObject({
            url: RM_DOMAIN,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        return parseHomeSections($);
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
        let param = ''
        switch (homepageSectionId) {
            case 'popular_manga':
                param = `/popular-manga/${page}`
                break
            case 'latest_updates':
                param = `/latest-releases/${page}`
                break
            default:
                throw new Error('Requested to getViewMoreItems for a section ID which doesn\'t exist')
        }

        const request = this.createRequestObject({
            url: RM_DOMAIN,
            method: 'GET',
            param,
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const manga = parseViewMore($, homepageSectionId)
        metadata = !isLastPage($) ? { page: page + 1 } : undefined
        return createPagedResults({
            results: manga,
            metadata
        })
    }

    async getSearchResults(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const page: number = metadata?.page ?? 1
            
        //Regular search
        if (query.title) {
            const request = this.createRequestObject({
                url: `${RM_DOMAIN}/service/search`,
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json',
                },
                data: `dataType=json&phrase=${encodeURI(query.title)}`
            });


            let response = await this.requestManager.schedule(request, 1)
            console.log(typeof response.data === 'string' ? response.data.length : `not a string: ${typeof response.data}`);
            response = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data
            const data = Object(response)

            if (!data.manga) throw new Error('API Error: Failed to create proper response object, missing manga property!')

            //Create the search results
            const manga: MangaTile[] = []
            for (const m of data.manga) {
                if (!m.url || !m.title) {
                    console.log('Missing URL or Title property in manga object!')
                    continue
                }

                const id: string = m.url.replace('/manga/', '')
                const image: string = RM_DOMAIN + m.image
                const title: string = m.title

                if (!id || !title) continue
                console.log("pushing");
                manga.push(createMangaTile({
                    id,
                    image: image,
                    title: createIconText({ text: title }),
                }))
            }
            return createPagedResults({
                results: manga,
            })

            //Genre search, no advanced search since it requires reCaptcha
        } else {
            const request = this.createRequestObject({
                url: `${RM_DOMAIN}/category/${query?.includedTags?.map((x: any) => x.id)[0]}/watch/${page}`,
                method: 'GET',
            })

            const response = await this.requestManager.schedule(request, 1)
            console.log(response.data.length);

            const $ = this.cheerio.load(response.data)
            const manga = parseViewMore($, 'popular_manga')
            metadata = !isLastPage($) ? { page: page + 1 } : undefined
            return createPagedResults({
                results: manga,
                metadata
            })
        }
    }
}
