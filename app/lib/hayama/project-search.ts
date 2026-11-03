export interface HayamaProject { id: string; account: string; code: string; name: string; department: string; policy: string; amount: number; page: number }
export interface ProjectFilters { query: string; policy: string; department: string; code: string }
const normalized = (s: string) => s.normalize('NFKC').toLowerCase().trim();
export function filterHayamaProjects(projects: HayamaProject[], filter: ProjectFilters): HayamaProject[] {
  return projects.filter(p =>
    (!filter.policy || p.policy === filter.policy) && (!filter.department || p.department === filter.department) &&
    (!filter.code || p.code.split(' ').includes(filter.code)) &&
    (!normalized(filter.query) || normalized(`${p.name} ${p.department} ${p.id}`).includes(normalized(filter.query)))
  );
}
