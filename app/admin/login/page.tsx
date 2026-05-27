import LoginClient from "./LoginClient";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawNext = resolvedSearchParams?.next;
  const nextUrl = Array.isArray(rawNext) ? rawNext[0] : rawNext;

  return <LoginClient nextUrl={nextUrl} />;
}
