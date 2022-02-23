import { Readm } from './readm/readm';
import express, { Application, Request, Response } from "express";
import cheerio from "cheerio"

const app: Application = express();
app.use(express.json());

const readm: Readm = new Readm(cheerio);
const secondsInDay = 86400;

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
    res.setHeader('Cache-Control', `s-maxage=${secondsInDay}`);
    res.json(results);
});

app.get("/manga/:mangaId/chapters/:chapterId", async (req: Request, res: Response) => {
    const mangaId = req.params.mangaId;
    const chapterId = req.params.chapterId;

    const results = await readm.getChapterDetails(mangaId, chapterId);
    res.setHeader('Cache-Control', `s-maxage=${secondsInDay * 7}`);
    res.json(results);
});


app.get("/manga/:mangaId/chapters", async (req: Request, res: Response) => {
    const query = req.params.mangaId;
    
    const results = await readm.getChapters(query);

    res.setHeader('Cache-Control', `s-maxage=${60 * 10}`);
    res.json(results);
});

app.get("/manga/:mangaId", async (req: Request, res: Response) => {
    const query = req.params.mangaId;
    
    const results = await readm.getMangaDetails(query);
    
    res.setHeader('Cache-Control', `s-maxage=${secondsInDay * 7}`);
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
