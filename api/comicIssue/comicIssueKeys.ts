import { ComicIssueParams } from 'models/comicIssue/comicIssueParams'

export const COMIC_ISSUE_QUERY_KEYS = Object.freeze({
	COMIC_ISSUE: 'comic-issue',
	GET: 'get',
	CREATE: 'create',
	BY_OWNER: 'by-owner',
	PAGES: 'pages',
	UPDATE: 'update',
	FILES: 'files',
	PDF: 'pdf',
	SIGNATURE: 'signature',
	STATELESS_COVERS: 'stateless-covers',
	STATEFUL_COVERS: 'stateful-covers',
	FAVOURITISE: 'favouritise',
	RATE: 'rate',
	READ: 'read',
	PUBLISH_ON_CHAIN: 'publish-on-chain',
	PUBLISH_OFF_CHAIN: 'publish-off-chain',
	UNPUBLISH: 'unpublish',
	DELETE: 'delete',
	RECOVER: 'recover',
})

export const comicKeys = Object.freeze({
	getMany: (params: ComicIssueParams) => [
		COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE,
		COMIC_ISSUE_QUERY_KEYS.GET,
		params.comicSlug,
		params.creatorSlug,
		params.genreSlugs,
		params.titleSubstring,
		params.filterTag,
		params.sortOrder,
		params.sortTag,
		params.skip,
		params.take,
	],
	get: (id: string | number) => [COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE, COMIC_ISSUE_QUERY_KEYS.GET, `${id}`],
	getByOwner: (userId: string) => [
		COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE,
		COMIC_ISSUE_QUERY_KEYS.GET,
		COMIC_ISSUE_QUERY_KEYS.BY_OWNER,
		userId,
	],
	getPages: (id: string | number) => [
		COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE,
		COMIC_ISSUE_QUERY_KEYS.GET,
		`${id}`,
		COMIC_ISSUE_QUERY_KEYS.PAGES,
	],
})
