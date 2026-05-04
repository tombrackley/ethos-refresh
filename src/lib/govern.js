import tenant from '@/config/tenant'

const BOARDS = tenant.pages.govern?.boards ?? []
const DEFAULT_BOARD_ID = tenant.pages.govern?.activeBoardId ?? BOARDS[0]?.id

export function getActiveBoardId(searchParams) {
  return searchParams?.get('board') || DEFAULT_BOARD_ID
}
