import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface CreateQueryConfig<TData, TParams = void> {
    key: string | string[];
    fn: (params: TParams) => Promise<TData>;
    defaultOptions?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>;
}

export function createQuery<TData, TParams = void>(
    config: CreateQueryConfig<TData, TParams>
) {
    const { key, fn, defaultOptions } = config;

    return function useGeneratedQuery(
        params?: TParams,
        options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
    ) {
        const queryKey = Array.isArray(key)
            ? [...key, params].filter(Boolean)
            : [key, params].filter(Boolean);

        return useQuery({
            ...defaultOptions,
            ...options,
            queryKey,
            queryFn: () => fn(params as TParams),
        });
    };
}



/**
 * IMPLEMENTATION EXAMPLES BELOW
 */
// 1. No Parameters(void)
// typescript
// export const useUsers = createQuery({
//     key: 'users',
//     fn: userService.getAllUsers, // () => Promise<User[]>
// });
// // Usage
// const { data } = useUsers(); // No params needed

// 2. Single Parameter
// typescript
// export const useUser = createQuery({
//     key: ['user', 'detail'],
//     fn: userService.getUserById, // (id: string) => Promise<User>
// });
// // Usage
// const { data } = useUser("user-123"); // Type-safe parameter

// 3. Object Parameters
// typescript
// export const usePaginatedUsers = createQuery({
//     key: ['users', 'paginated'],
//     fn: userService.getPaginatedUsers, // (params: { page: number; limit: number }) => Promise<User[]>
// });
// // Usage
// const { data } = usePaginatedUsers({ page: 1, limit: 10 });

// 4. Optional Parameters
// typescript
// export const useUsersWithFilters = createQuery({
//     key: ['users', 'filtered'],
//     fn: userService.getUsersWithFilters, // (filters?: { active?: boolean; role?: string }) => Promise<User[]>
// });
// // Usage
// const { data: allUsers } = useUsersWithFilters(); // No filters
// const { data: activeUsers } = useUsersWithFilters({ active: true }); // With filters


// 5. Complex Parameters
// typescript
// export const useSearchResults = createQuery({
//     key: ['search'],
//     fn: searchService.search, // (params: { query: string; filters: Filter[]; sort: SortOption }) => Promise<SearchResult[]>
// });
// // Usage
// const { data } = useSearchResults({
//     query: "typescript",
//     filters: [{ field: "language", value: "en" }],
//     sort: { field: "relevance", order: "desc" }
// });


// Advanced Parameter Handling
// Conditional Queries with Parameters
// typescript
// export const useUserProfile = createQuery({
//     key: ['user', 'profile'],
//     fn: userService.getProfile, // (userId: string) => Promise<Profile>
// });

// // Usage with conditional fetching
// function UserProfile({ userId, enabled = true }) {
//     const { data, isLoading } = useUserProfile(
//         userId,
//         {
//             enabled: enabled && !!userId // Only fetch if enabled and userId exists
//         }
//     );

//     if (isLoading) return <div>Loading...</div>;
//     return <div>{ data?.name } </div>;
// }



// Transform Parameters
// typescript
// // If you need to transform parameters before passing to the service
// export const useUsersWithTransformedParams = createQuery({
//     key: ['users', 'transformed'],
//     fn: (params: { search?: string; filters?: string[] }) => {
//         // Transform parameters before API call
//         const apiParams = {
//             q: params.search,
//             filter: params.filters?.join(','),
//             limit: 100
//         };
//         return userService.searchUsers(apiParams);
//     },
// });




// core/queryHooks.ts
import { UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

interface CreateInfiniteQueryConfig<TData, TParams = void> {
    key: string;
    fn: (params: TParams & { pageParam?: unknown }) => Promise<TData>;
    getNextPageParam: (lastPage: TData, allPages: TData[]) => unknown | undefined;
    getPreviousPageParam?: (firstPage: TData, allPages: TData[]) => unknown | undefined;
    initialPageParam?: unknown;
    defaultOptions?: Omit<UseInfiniteQueryOptions<TData>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'getPreviousPageParam' | 'initialPageParam'>;
}

function createInfiniteQuery<TData, TParams = void>(
    config: CreateInfiniteQueryConfig<TData, TParams>
) {
    const {
        key,
        fn,
        getNextPageParam,
        getPreviousPageParam,
        initialPageParam,
        defaultOptions
    } = config;

    return function useGeneratedInfiniteQuery(
        params?: TParams,
        options?: Omit<UseInfiniteQueryOptions<TData>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'getPreviousPageParam' | 'initialPageParam'>
    ) {
        const queryKey = params ? [key, params] : [key];

        return useInfiniteQuery({
            ...defaultOptions,
            ...options,
            queryKey,
            queryFn: ({ pageParam }) => fn({ ...params, pageParam } as TParams & { pageParam?: unknown }),
            getNextPageParam,
            getPreviousPageParam,
            initialPageParam,
        });
    };
}


/**
 * IMPLEMENTATION EXAMPLES
 */

// Usage Examples
// 1. Paginated Items(Most Common)
// typescript
// // queries/userQueries.ts
// interface PaginatedUsersResponse {
//     users: User[];
//     nextCursor?: string;
//     hasMore: boolean;
// }

// export const useInfiniteUsers = createInfiniteQuery({
//     key: 'infinite-users',
//     fn: (params: { search?: string; pageParam?: string }) =>
//         userService.getPaginatedUsers({
//             search: params.search,
//             cursor: params.pageParam
//         }),
//     getNextPageParam: (lastPage: PaginatedUsersResponse) =>
//         lastPage.hasMore ? lastPage.nextCursor : undefined,
// });


// Complete Usage in a Feature
// features/posts/queries.ts
// import { createQuery, createInfiniteQuery } from '@/core/queryHooks';

// // Regular queries
// export const usePost = createQuery({
//     key: 'post',
//     fn: postService.getPost,
// });

// export const usePostComments = createQuery({
//     key: 'post-comments',
//     fn: postService.getComments,
// });

// // Infinite queries
// export const useInfinitePosts = createInfiniteQuery({
//     key: 'infinite-posts',
//     fn: (params: { category?: string; pageParam?: number }) =>
//         postService.getPosts({
//             category: params.category,
//             page: params.pageParam
//         }),
//     getNextPageParam: (lastPage: PostsResponse, allPages) =>
//         allPages.length < 10 ? allPages.length : undefined, // Max 10 pages
// });

// export const useInfiniteUserPosts = createInfiniteQuery({
//     key: 'infinite-user-posts',
//     fn: (params: { userId: string; pageParam?: string }) =>
//         postService.getUserPosts({
//             userId: params.userId,
//             cursor: params.pageParam
//         }),
//     getNextPageParam: (lastPage: UserPostsResponse) =>
//         lastPage.nextCursor,
// });


// 2. Timeline / Feed
// typescript
// // queries/postQueries.ts
// interface TimelineResponse {
//     posts: Post[];
//     nextPage?: number;
// }

// export const useInfiniteTimeline = createInfiniteQuery({
//     key: 'infinite-timeline',
//     fn: (params: { pageParam?: number } = {}) =>
//         postService.getTimeline({ page: params.pageParam || 0 }),
//     getNextPageParam: (lastPage: TimelineResponse) =>
//         lastPage.nextPage ?? undefined,
//     defaultOptions: {
//         initialPageParam: 0,
//     },
// });



// 3. Search with Filters
// typescript
// // queries/searchQueries.ts
// interface SearchResponse {
//     results: Product[];
//     total: number;
//     nextOffset: number;
// }

// export const useInfiniteSearch = createInfiniteQuery({
//     key: 'infinite-search',
//     fn: (params: {
//         query: string;
//         filters?: Filter[];
//         pageParam?: number
//     }) => searchService.search({
//         query: params.query,
//         filters: params.filters,
//         offset: params.pageParam
//     }),
//     getNextPageParam: (lastPage: SearchResponse, allPages) => {
//         const totalItems = allPages.flatMap(page => page.results).length;
//         return totalItems < lastPage.total ? lastPage.nextOffset : undefined;
//     },
// });

// // Component usage
// function SearchResults({ query, filters }: { query: string; filters?: Filter[] }) {
//     const { data, fetchNextPage, hasNextPage } = useInfiniteSearch(
//         { query, filters },
//         { enabled: !!query } // Only search when we have a query
//     );

//     // ... render logic
// }




import { UseMutationOptions, useMutation } from '@tanstack/react-query';

interface CreateMutationConfig<TData, TError = Error, TVariables = void, TContext = unknown> {
    key?: string | string[];
    fn: (variables: TVariables) => Promise<TData>;
    defaultOptions?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationKey' | 'mutationFn'>;
}

export function createMutation<TData, TError = Error, TVariables = void, TContext = unknown>(
    config: CreateMutationConfig<TData, TError, TVariables, TContext>
) {
    const { key, fn, defaultOptions } = config;

    return function useGeneratedMutation(
        options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationKey' | 'mutationFn'>
    ) {
        const mutationKey = key ? (Array.isArray(key) ? key : [key]) : undefined;

        return useMutation({
            ...defaultOptions,
            ...options,
            mutationKey,
            mutationFn: fn,
        });
    };
}

/**
 * IMPLEMENTATION EXAMPLE
 */

// 1. Basic Create Mutation
// typescript
// // mutations/userMutations.ts
// export const useCreateUser = createMutation({
//     key: 'create-user',
//     fn: (userData: CreateUserDto) => userService.createUser(userData),
// });

// // Component usage
// function CreateUserForm() {
//     const createUserMutation = useCreateUser();

//     const handleSubmit = (userData: CreateUserDto) => {
//         createUserMutation.mutate(userData, {
//             onSuccess: (newUser) => {
//                 console.log('User created:', newUser);
//                 // Invalidate users query to refetch the list
//                 queryClient.invalidateQueries({ queryKey: ['users'] });
//             },
//             onError: (error) => {
//                 console.error('Failed to create user:', error);
//             },
//         });
//     };

//     return (
//         <form onSubmit= { handleSubmit } >
//         {/* Form fields */ }
//         < button type = "submit" disabled = { createUserMutation.isPending } >
//             { createUserMutation.isPending ? 'Creating...' : 'Create User' }
//             </>
//             </form>
//   );
// }


// 2. Update Mutation
// typescript
// export const useUpdateUser = createMutation({
//     key: 'update-user',
//     fn: (variables: { id: string; data: UpdateUserDto }) =>
//         userService.updateUser(variables.id, variables.data),
//     defaultOptions: {
//         onSuccess: (updatedUser, variables) => {
//             // Update the cache for the specific user
//             queryClient.setQueryData(['user', variables.id], updatedUser);
//             // Invalidate the list to ensure it's fresh
//             queryClient.invalidateQueries({ queryKey: ['users'] });
//         },
//     },
// });

// // Component usage
// function EditUserForm({ userId }: { userId: string }) {
//     const updateUserMutation = useUpdateUser();

//     const handleSubmit = (userData: UpdateUserDto) => {
//         updateUserMutation.mutate({ id: userId, data: userData });
//     };

//     // ...
// }

// 3. Delete Mutation
// typescript
// export const useDeleteUser = createMutation({
//     key: 'delete-user',
//     fn: (userId: string) => userService.deleteUser(userId),
//     defaultOptions: {
//         onSuccess: (_, userId) => {
//             // Remove from cache
//             queryClient.removeQueries({ queryKey: ['user', userId] });
//             // Invalidate the list
//             queryClient.invalidateQueries({ queryKey: ['users'] });
//         },
//     },
// });

// // Component usage
// function DeleteUserButton({ userId }: { userId: string }) {
//     const deleteUserMutation = useDeleteUser();

//     const handleDelete = () => {
//         if (window.confirm('Are you sure?')) {
//             deleteUserMutation.mutate(userId);
//         }
//     };

//     return (
//         <button
//       onClick= { handleDelete }
//     disabled = { deleteUserMutation.isPending }
//         >
//         { deleteUserMutation.isPending ? 'Deleting...' : 'Delete User' }
//         </button>
//   );
// }

// 4. Complex Mutation with Optimistic Updates
// typescript
// export const useToggleUserStatus = createMutation({
//     key: 'toggle-user-status',
//     fn: (variables: { id: string; isActive: boolean }) =>
//         userService.updateUserStatus(variables.id, variables.isActive),
//     defaultOptions: {
//         onMutate: async (variables) => {
//             // Cancel any outgoing refetches
//             await queryClient.cancelQueries({ queryKey: ['user', variables.id] });

//             // Snapshot the previous value
//             const previousUser = queryClient.getQueryData<User>(['user', variables.id]);

//             // Optimistically update to the new value
//             queryClient.setQueryData(['user', variables.id], (old: User) =>
//                 old ? { ...old, isActive: variables.isActive } : old
//             );

//             // Return context with the snapshotted value
//             return { previousUser };
//         },
//         onError: (error, variables, context) => {
//             // If the mutation fails, use the context returned from onMutate to roll back
//             if (context?.previousUser) {
//                 queryClient.setQueryData(['user', variables.id], context.previousUser);
//             }
//         },
//         onSettled: (data, error, variables) => {
//             // Always refetch after error or success to make sure we're in sync
//             queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
//         },
//     },
// });