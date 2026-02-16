export function getOrgId() {
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'lastActiveOrg') {
      try {
        const decoded = decodeURIComponent(value);
        const parsed = JSON.parse(decoded);
        return parsed.uuid || parsed.id || parsed;
      } catch {
        return value;
      }
    }
  }

  return null;
}

export async function fetchOrgId() {
  try {
    const response = await fetch('https://claude.ai/api/organizations', {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to fetch organizations');

    const orgs = await response.json();
    return orgs[0]?.uuid;
  } catch (error) {
    console.error('Error fetching org ID:', error);
    return null;
  }
}
