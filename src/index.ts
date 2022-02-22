import { Readm } from './readm/readm';
import express, { Application, Request, Response } from "express";
import cheerio from "cheerio"

const app: Application = express();
app.use(express.json());

const readm: Readm = new Readm(cheerio);

app.set("port", process.env.PORT || 3000);

app.get("/", async (req: Request, res: Response) => {
    const query = req.query.manga as string ?? "";
    let results;

    try {
        results = await readm.getSearchResults({
            title: query,
            parameters: {},
        }, {});
    } catch (e) {
        results = { "results": [] };
    }

    res.json(results);
});

app.get("/manga/:mangaId/chapters/:chapterId", async (req: Request, res: Response) => {
    const mangaId = req.params.mangaId;
    const chapterId = req.params.chapterId;

    const results = await readm.getChapterDetails(mangaId, chapterId);

    res.json(results);
});


app.get("/manga/:mangaId/chapters", async (req: Request, res: Response) => {
    const query = req.params.mangaId;
    
    const results = await readm.getChapters(query);

    res.json(results);
});

app.get("/manga/:mangaId", async (req: Request, res: Response) => {
    const query = req.params.mangaId;
    
    const results = await readm.getMangaDetails(query);

    res.json(results);
});

app.post("/updated-manga", async (req: Request, res: Response) => {
    const ids = req.body.ids;
    const time = new Date(req.body.time);

    const results = await readm.filterUpdatedManga(time, ids);

    res.json(results);
});




app.listen(app.get("port"), () => {
  console.log(`Server on http://localhost:${app.get("port")}/`);
});
