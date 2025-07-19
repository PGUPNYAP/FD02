import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { libraryApi } from '../services/api';

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: libraryApi.getLocations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLibraries = (city: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['libraries', city],
    queryFn: ({ pageParam = 1 }) => libraryApi.getLibraries(city, pageParam, 10),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1, // ✅ Required in TanStack React Query v5+
    enabled: enabled && !!city,
    staleTime: 2 * 60 * 1000,
  });
};


export const useLibraryDetails = (libraryId: string, enabled = true) => {
  return useQuery({
    queryKey: ['library', libraryId],
    queryFn: () => libraryApi.getLibraryById(libraryId),
    enabled: enabled && !!libraryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchLibraries = (searchParams: {
  city?: string;
  state?: string;
  libraryName?: string;
}) => {
  return useQuery({
    queryKey: ['searchLibraries', searchParams],
    queryFn: () => libraryApi.searchLibraries(searchParams),
    enabled: !!(searchParams.city || searchParams.state || searchParams.libraryName),
    staleTime: 2 * 60 * 1000,
  });
};