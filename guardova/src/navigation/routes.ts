// Guard'Ova — typed hrefs for dynamic routes inside the (tabs) group.
// Object form (pathname + params): the typed-routes generator types these paths as static strings,
// so template strings like `/member/${name}` don't type-check. expo-router fills [member] from params.

export const memberProfileHref = (name: string) =>
  ({ pathname: '/member/[member]', params: { member: name } }) as const;

export const invitationHref = (name: string) =>
  ({ pathname: '/invitation/[member]', params: { member: name } }) as const;
