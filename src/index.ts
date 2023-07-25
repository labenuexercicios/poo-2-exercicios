import express, { Request, Response } from "express";
import cors from "cors";
import { Video } from "./models/Videos";
import { VideoDatabase } from "./database/VideoDatabase";
import { TVideoDB } from "./types";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "PONNGGG!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/videos", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    const videoDatabase = new VideoDatabase();
    const videosDB = await videoDatabase.findVideo(q);

    const videos: Video[] = videosDB.map(
      (videoDB) =>
        new Video(
          videoDB.id,
          videoDB.titulo,
          videoDB.segundos,
          videoDB.created_at
        )
    );
    // let videoDB;

    // if (q) {
    //   const result: TVideoDB[] = await db("videos").where(
    //     "titulo",
    //     "LIKE",
    //     `%${q}%`
    //   );
    //   videoDB = result;
    // } else {
    //   const result: TVideoDB[] = await db("videos");
    //   videoDB = result;
    // }

    // const videos = videoDB.map((videoDB) => {
    //   return new Video(
    //     videoDB.id,
    //     videoDB.titulo,
    //     videoDB.segundos,
    //     videoDB.created_at
    //   );
    // });

    res.status(200).send(videos);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/videos", async (req: Request, res: Response) => {
  try {
    const { id, titulo, segundos } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'Id' deve ser string!");
    }

    if (typeof titulo !== "string") {
      res.status(400);
      throw new Error("'Name' deve ser string!");
    }

    if (typeof segundos !== "number") {
      res.status(400);
      throw new Error("'Segundos' deve ser number!");
    }

    // const [videoDBExists]: TVideoDB[] | undefined[] = await db("videos").where(
    //   {
    //     id,
    //   }
    // );

    const videoDatabase = new VideoDatabase();
    const videoDBExists = await videoDatabase.findVideo(id);
    console.log(videoDBExists);

    if (videoDBExists) {
      res.status(400);
      throw new Error("'Id' já existe!");
    }

    // const video = new Video(id, titulo, segundos, new Date().toISOString());

    const newVideo = new Video(id, titulo, segundos, new Date().toISOString());

    const newVideoDB: TVideoDB = {
      id: newVideo.getId(),
      titulo: newVideo.getTitulo(),
      segundos: newVideo.getSegundos(),
      created_at: newVideo.getCreatedAt(),
    };

    await videoDatabase.insertVideo(newVideoDB);

    res.status(201).send(newVideo);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/videos/:id", async (req: Request, res: Response) => {
  try {
    const idFindVideo = req.params.id;

    // const newId = req.body.id as string | undefined;
    // const newTitulo = req.body.titulo as string | undefined;
    // const newSegundos = req.body.segundos as number | undefined;
    const { id, titulo, segundos, createdAt } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'Id' deve ser string!");
    }

    if (typeof titulo !== "string") {
      res.status(400);
      throw new Error("'Name' deve ser string!");
    }

    if (typeof segundos !== "number") {
      res.status(400);
      throw new Error("'Segundos' deve ser number!");
    }

    // const [video] = await db
    //   .select("*")
    //   .from("videos")
    //   .where({ id: idFindVideo });

    // if (video) {
    //   await db
    //     .update({
    //       id: newId || video.id,
    //       titulo: newTitulo || video.titulo,
    //       segundos: newSegundos || video.segundos,
    //     })
    //     .from("videos")
    //     .where({ id: idFindVideo });
    // } else {
    //   res.status(404);
    //   throw new Error("'Id' não encontrado!");
    // }

    const videoDatabase = new VideoDatabase();
    const videoDB = await videoDatabase.findVideoById(idFindVideo);

    if (!videoDB) {
      res.status(404);
      throw new Error("'Id' não encontrado!");
    }
    const video = new Video(
      videoDB.id,
      videoDB.titulo,
      videoDB.segundos,
      videoDB.created_at
    );

    id && video.setId(id);
    titulo && video.setTitulo(titulo);
    segundos && video.setSegundos(segundos);
    createdAt && video.setCreatedAt(createdAt);

    const updatedVideoDB: TVideoDB = {
      id: video.getId(),
      titulo: video.getTitulo(),
      segundos: video.getSegundos(),
      created_at: video.getCreatedAt(),
    };
    await videoDatabase.updateVideo(idFindVideo, updatedVideoDB);

    res
      .status(200)
      .send({ message: "Produto atualizado com sucesso!", idFindVideo });
  } catch (error: any) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send(
        "Erro inesperado! Verifique o Id informado no params/Path Variables/value!"
      );
    }
  }
});

app.delete("/videos/:id", async (req: Request, res: Response) => {
  try {
    const videoIdDelete = req.params.id;

    // const [videoIndex] = await db
    //   .select("*")
    //   .from("videos")
    //   .where({ id: videoIdDelete });

    // if (!videoIndex) {
    //   res.status(404);
    //   throw new Error("'Id' não encontrado!");
    // }
    // await db.delete().from("videos").where({ id: videoIdDelete });

    const videoDatabase = new VideoDatabase();
    const videoDB = await videoDatabase.findVideoById(videoIdDelete);

    if (!videoDB) {
      res.status(404);
      throw new Error("'Id' não encontrado!");
    }

    await videoDatabase.deleteVideo(videoIdDelete);
    res
      .status(200)
      .send({ message: "Video deletado com sucesso!!", videoIdDelete });
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});
