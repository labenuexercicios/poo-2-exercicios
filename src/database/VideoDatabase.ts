import { TVideoDB } from "../types";
import { BaseDatabase } from "./BaseDatabase ";

export class VideoDatabase extends BaseDatabase {
  public static TABLE_VIDEOS = "videos";

  public findVideo = async (q?: string): Promise<TVideoDB[]> => {
    let result: TVideoDB[];

    if (q) {
      [result] = await BaseDatabase.connection(
        VideoDatabase.TABLE_VIDEOS
      ).where({
        id: q,
      });
    } else {
      result = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS);
    }
    return result;
  };
  public insertVideo = async (videoDB: TVideoDB): Promise<void> => {
    await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).insert(videoDB);
  };

  public async findVideoById(id: string): Promise<TVideoDB | undefined> {
    const [response]: TVideoDB[] = await BaseDatabase.connection(
      VideoDatabase.TABLE_VIDEOS
    ).where({ id });

    return response;
  }

  public updateVideo = async (
    idFindVideo: string,
    updatedVideoDB: TVideoDB
  ): Promise<void> => {
    await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)
      .update(updatedVideoDB)
      .where({ id: idFindVideo });
  };

  public deleteVideo = async (id: string): Promise<void> => {
    await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)
      .delete()
      .where({ id });
  };
}
