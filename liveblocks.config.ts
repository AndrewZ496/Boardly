// liveblocks.config.ts
import {
  createClient,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import type { Layer, Color } from "@/types/canvas";

// Create the Liveblocks client
const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

// Define Presence
type Presence = {
  // cursor: { x: number; y: number } | null;
  // selection: string[];
  // pencilDraft: [x: number, y: number, pressure: number][] | null;
  // pencilColor: Color | null;
};

// Define Storage
type Storage = {
  // layers: LiveMap<string, LiveObject<Layer>>;
  // layerIds: LiveList<string>;
};

// User metadata
type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    picture?: string;
  };
};

// Room events (empty for now)
type RoomEvent = {};

// Thread metadata (empty for now)
export type ThreadMetadata = {};

// Create the Room context
export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
  useBroadcastEvent,
  useEventListener,
  useErrorListener,
  useStorage,
  useObject,
  useMap,
  useList,
  useBatch,
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStatus,
  useLostConnectionListener,
  useThreads,
  useUser,
  useCreateThread,
  useEditThreadMetadata,
  useCreateComment,
  useEditComment,
  useDeleteComment,
  useAddReaction,
  useRemoveReaction,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client,
  {
    async resolveUsers({ userIds }) {
      // Optionally resolve users for comments / mentions
      return [];
    },
    async resolveMentionSuggestions({ text, roomId }) {
      // Optionally resolve mentions
      return [];
    },
  }
);
