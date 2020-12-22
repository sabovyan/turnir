import { IRoute } from 'express';
import BasicRoute from './basicRoute';

class UserRoute extends BasicRoute {
  constructor() {
    super('user/');
  }

  register(cb: ) : IRoute {
    return this.postData('/register', cb)
}
