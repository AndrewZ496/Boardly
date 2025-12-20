"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { EmptyBoards } from "./empty-boards";
import { EmptyFavorites } from "./empty-favorites";
import { EmptySearch } from "./empty-search";
import { BoardCard } from "./board-card";
import { NewBoardButton } from "./new-board-button";

interface BoardListProps {
  orgId: string;
  searchParams: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ orgId, searchParams }: BoardListProps) => {
  const favorites = searchParams.favorites ?? "";
  const search = searchParams.search ?? "";

  const data = useQuery(api.boards.get, { orgId, search, favorites });

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-2xl">
          {favorites ? "Favorite Boards" : "Team Boards"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled />
          {[...Array(9)].map((_, index) => (
            <BoardCard.Skeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length && search) return <EmptySearch />;
  if (!data.length && favorites) return <EmptyFavorites />;
  if (!data.length) return <EmptyBoards />;

  return (
    <div>
      <h2 className="text-2xl">
        {favorites ? "Favorite Boards" : "Team Boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};
