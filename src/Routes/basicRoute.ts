import { IRoute, RequestHandler, Router } from 'express';

interface ParamsDictionary {
  [key: string]: string;
}

interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

type handler = RequestHandler<ParamsDictionary, any, any, ParsedQs>;

class BasicRoute {
  path: string;

  route: IRoute | undefined | null;

  private router: Router;

  constructor(path: string) {
    this.path = path;
    this.router = Router();
  }

  getData(ending: string, ...handlers: handler[]): IRoute {
    const slug = ending || '';
    return this.router.route(this.path + slug).get(...handlers);
  }

  postData(ending: string, ...handlers: handler[]): IRoute {
    const slug = ending || '';
    return this.router.route(this.path + slug).post(...handlers);
  }

  updateData(id: number, ...handlers: handler[]): IRoute {
    return this.router.route(this.path + id).put(...handlers);
  }

  deleteData(id: number, ...handlers: handler[]): IRoute {
    return this.router.route(this.path + id).delete(...handlers);
  }
}

export default BasicRoute;
