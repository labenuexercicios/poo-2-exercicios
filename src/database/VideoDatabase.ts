import { BaseDatabase } from "./BaseDatabase";
import { TVideoDB } from "../types";

export class VideoDatabase extends BaseDatabase {

    public static TABLE_VIDEOS = "videos"

    public async findVideos(q: string | undefined): Promise<TVideoDB[]> {

        let videosDB

        if (q) {
            const result: TVideoDB[] = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).where('title', 'LIKE', `%${q}%`)
            videosDB = result
        } else {
            const result: TVideoDB[] = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)
            videosDB = result
        }

        return videosDB
    }

    public async findVideoById(id: string): Promise<TVideoDB | undefined> {

        const [videoDB]: TVideoDB[] | undefined = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).where({ id })

        return videoDB
    }

    public async insertVideo(newVideoDB: TVideoDB): Promise<void> {

        await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).insert(newVideoDB)
    }
}