import express, {Router} from 'express';
import compression from 'compression';
import path from "path";

interface Options {
    port: number;
    routes: Router;
    publicPath?: string;
}

export class Server {
    private app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(private options: Options) {
        const {port, routes, publicPath = 'public'} = options;
        this.port = port;
        this.publicPath = publicPath;
        this.routes = routes;
    }

    async start() {
        //* Middleware
        this.app.use(express.json()); // for parsing application/json raw
        this.app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
        this.app.use(compression());
        //* public folders
        this.app.use(express.static(this.publicPath));
        //* Routes
        this.app.use(this.routes);
        //* SPA
        this.app.get('*', (req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
        });

        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}