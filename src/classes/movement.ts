import {
  Copyable,
  Vector,
  ZeroVector,
  DirectionAction,
  Map,
  Opt,
  NetMovement
} from '../models';
import { distance as getDistance } from '../utils';

type MovementFunction = (directionAction: DirectionAction, origin: Vector) => void;

export class Movement implements Copyable<Movement> {
  private readonly movementFunctions: Map<MovementFunction> = {};
  private readonly direction: Vector = { x: 0, y: 0 };
  private speed: number = 5;

  constructor(direction: Vector = ZeroVector, speed: number = 1) {
    this.setDirection(direction);
    this.setSpeed(speed);
    this.movementFunctions['POINT'] = (
      directionAction: DirectionAction, origin: Vector
    ) => this.setDirectionByPoints(origin, directionAction.point || ZeroVector);
    this.movementFunctions['RADIAN'] = (
      directionAction: DirectionAction
    ) => this.setDirectionByRadian(directionAction.radian || 0);
    this.movementFunctions['DEGRES'] = (
      directionAction: DirectionAction
    ) => this.setDirectionByRadian(directionAction.degres || 0);
  }

  public getSpeed(): number {
    return this.speed;
  }

  public getVelocity(modifier: number = 1): Vector {
    return {
      x: this.direction.x * this.speed * modifier,
      y: this.direction.y * this.speed * modifier
    };
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public setDirectionByAction(directionAction: DirectionAction, origin: Vector): void {
    const movementFunction: Opt<MovementFunction> = this.movementFunctions[directionAction.directionType.toUpperCase()] as Opt<MovementFunction>;

    if (movementFunction) {
      movementFunction(directionAction, origin);
    }
  }

  public setDirectionByRadian(radian: number): void {
    this.setDirection({
      x: Math.cos(radian),
      y: Math.sin(radian),
    });
  }

  public setDirectionByDegres(degres: number): void {
    this.setDirection({
      x: Math.cos(degres * Math.PI / 180),
      y: Math.sin(degres * Math.PI / 180),
    });
  }

  public setDirectionByPoints(a: Vector, b: Vector): void {
    const distance: number = getDistance(a.x, a.y, b.x, b.y);

    if (distance === 0) {
      this.setDirection(ZeroVector);
    } else {
      this.setDirection({
        x: (b.x - a.x) / distance,
        y: (b.y - a.y) / distance
      });
    }
  }

  public setDirection(vector: Vector): void {
    this.direction.x = vector.x;
    this.direction.y = vector.y;
  }

  public copy(): Movement {
    return new Movement(this.direction, this.speed);
  }

  public toNet(): NetMovement {
    return {
      speed: this.speed,
      direction: this.direction
    };
  }
}
