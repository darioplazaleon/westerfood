export type UserRole = 'admin_client_role' | 'rrhh_client_role' | 'employee_client_role';

export interface NavItem {
  label: string;
  href: string;
  hasSubmenu?: boolean;
  submenuItems?: NavItem[];
}

export type PaginatedResponse<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}