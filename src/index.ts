import express, { Request, Response } from 'express'
import cors from 'cors'
//import { db } from './database/BaseDatabase'
import { VideoDatabase } from "./database/VideoDatabase"
import { Video } from './models/Video'
import { TVideoDB } from './types'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string | undefined

        const videoDB = new VideoDatabase()

        const videosDB = await videoDB.findVideos(q)

        const videos: Video[] = videosDB.map((videoDB) => new Video(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.uploaded_at
        ))

        res.status(200).send(videos)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/video", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("'duration' deve ser string")
        }

       const videoDB = new VideoDatabase()

       const videoDBExists = await videoDB.findVideoById(id)

        if (videoDBExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }


        const newVideo = new Video(
            id,
            title,
            duration,
            new Date().toISOString()
        )

        const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            uploaded_at: newVideo.getUploadedAt()
        }

        await videoDB.insertVideo(newVideoDB)

        res.status(201).send(newVideo)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// app.put("/videos/:id", async (req: Request, res: Response) => {
//     try {
//         const idToEdit = req.params.id

//         const newId = req.body.id as string | undefined
//         const newTitle = req.body.title as string | undefined
//         const newDuration = req.body.duration as number | undefined

//         const videos = await db("videos")
//         const videoToEdit = videos.find((video) => video.id === idToEdit)

//         const updateVideo = {
//             id: newId || videoToEdit.id,
//             title: newTitle || videoToEdit.title,
//             duration: newDuration || videoToEdit.duration
//         }

//         await db("videos").update(updateVideo).where({ id: idToEdit })
//         res.status(200).send({ message: "Vídeo atualizado com sucesso" })


//     } catch (error) {
//         console.log(error)

//         if (req.statusCode === 200) {
//             res.status(500)
//         }

//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })

// app.delete("/videos/:id", async (req: Request, res: Response) => {

//     try {

//         const idToDelete = req.params.id

//         const videos = await db("videos")

//         const indexToDelete = videos.findIndex((video) => {
//             return video.id === idToDelete
//         })

//         if (indexToDelete >= 0) {

//             await db("videos").del().where({ id: idToDelete })

//             res.status(200).send({ message: "Vídeo deletado com sucesso" })
//         }
//         else if (indexToDelete === -1) {

//             res.status(400)

//             throw new Error("Video não encontrado")
//         }



//     } catch (error) {
//         console.log(error)

//         if (req.statusCode === 200) {
//             res.status(500)
//         }

//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }

// })