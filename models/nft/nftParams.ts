import { Pagination } from 'models/pagination'

export interface NftParams extends Partial<Pagination> {
	ownerAddress?: string
	comicSlug?: string
	userId?: string
	comicIssueId?: string
}
