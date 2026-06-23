const VOTER_STORAGE_KEY = "hato-daily-voter-id";

export function getVoterId(): string {
  if (typeof window === "undefined") return "";

  let voterId = localStorage.getItem(VOTER_STORAGE_KEY);
  if (!voterId) {
    voterId = crypto.randomUUID();
    localStorage.setItem(VOTER_STORAGE_KEY, voterId);
  }

  return voterId;
}
