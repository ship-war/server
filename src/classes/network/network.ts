import { HttpException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import {
  User,
  Map,
  AuthenticateRequest,
  AuthenticateResponse,
  DoActionRequest,
  DoActionResponse,
  MapResponse,
  NetEntity,
  ID,
  Nullable
} from '../../models';
import { Game } from '../game';
import { World } from '../world';
import { Entity, Ship } from '../entities';
import { processActions } from './network-action';

export class Network {
  public readonly graphicToken: string = 'graphical';
  private readonly users: Map<User> = {};
  private readonly game: Game;

  constructor(game: Game) {
    this.game = game;

    this.game.onEvent('ENTITY_DIE', ({ entity }: { entity: Entity }) => {
      if (entity.type === 'SHIP') {
        this.removeUserLikedToShip(entity.id);
      }
    });
  }

  private getUserByShipId(id: ID): Nullable<User> {
    for (const token in this.users) {
      if (this.users[token].shipId === id) {
        return this.users[token];
      }
    }
    return null;
  }

  private removeUserLikedToShip(shipId: ID): void {
    const user: Nullable<User> = this.getUserByShipId(shipId);

    if (user) {
      delete this.users[user.token];
    }
  }

  public userExists(token: string): boolean {
    return !!this.users[token];
  }

  public userNameExists(name: string): boolean {
    for (const token in this.users) {
      if (this.users[token].name === name) {
        return true;
      }
    }
    return false;
  }

  public getSeenEntities(userId: string): Array<NetEntity> {
    return this.game.getWorld().entities
    .mapItems((entity: Entity) => entity.toNetEntity());
  }

  public getMap(token: string): MapResponse {
    const world: World = this.game.getWorld();

    if (token === this.graphicToken) {
      return {
        map: {
          radius: world.radius,
          id: world.id,
          entities: world.entities
          .mapItems((entity: Entity) => entity.toNetEntity())
        },
        users: Object.keys(this.users).map((token) => ({
          shipId: this.users[token].shipId,
          name: this.users[token].name
        } as User))
      };
    }

    const user: User = this.users[token];

    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }

    return {
      map: {
        radius: world.radius,
        id: world.id,
        entities: this.getSeenEntities(user.shipId)
      },
      users: Object.keys(this.users).map((token) => ({
        shipId: this.users[token].shipId,
        name: this.users[token].name
      } as User))
    };
  }

  public createUser(request: AuthenticateRequest): AuthenticateResponse {
    if (!request.username || this.userNameExists(request.username)) {
      throw new HttpException('Unauthorized', 401);
    }
    const mainWorld: World = this.game.getWorld();
    const ship: Entity = mainWorld.spawnShip();

    const user: User = {
      token: uuid(),
      name: request.username,
      shipId: ship.id
    };

    this.users[user.token] = user;

    return {
      user,
      map: {
        radius: mainWorld.radius,
        id: mainWorld.id,
        entities: this.getSeenEntities(user.shipId)
      },
      users: Object.keys(this.users).map((token) => ({
        shipId: this.users[token].shipId,
        name: this.users[token].name
      } as User))
    };
  }

  public foo(token: string, request: DoActionRequest): DoActionResponse {
    const user: User = this.users[token];

    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }

    if (!((typeof request) === 'object')) {
      throw new HttpException('Action Not Found', 460);
    }

    const ship: Ship = this.game.getWorld().entities.getItem(user.shipId) as Ship;

    if (!ship) {
      throw new HttpException('Unauthorized', 401);
    }

    return processActions(request, ship);
  }

}
