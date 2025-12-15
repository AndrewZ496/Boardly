import { v } from "convex/values";
import { getAllOrThrow } from "convex-helpers/server/relationships";
import { query } from "./_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // Unauthorized check
    if (!identity) {
      throw new Error("Unauthorized");
    }

    console.log("Convex userId:", identity.subject);
    console.log("Convex orgId:", args.orgId);

    // If fetching only favorites
    if (args.favorites) {
      const favoritedBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();

      console.log(
        "Favorited boards for user in org:",
        favoritedBoards.map((b) => b.boardId)
      );

      const ids = favoritedBoards.map((b) => b.boardId);
      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board) => ({
        ...board,
        isFavorite: true,
      }));
    }

    // Otherwise, fetch all boards (optionally filtered by search)
    let boards: any[] = [];
    if (args.search) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", args.search!).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .collect();
    }

    // Attach isFavorite property
    const boardsWithFavoriteRelation = boards.map(async (board) => {
      const favorite = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", identity.subject).eq("boardId", board._id)
        )
        .unique();
      return {
        ...board,
        isFavorite: !!favorite,
      };
    });

    return Promise.all(boardsWithFavoriteRelation);
  },
});
