import { Entity } from './entity';
import { Location } from '../location';
import { Vector } from '../../models';

const MAX_TICK_LIVED: number = 150;

export class Projectile extends Entity {
  constructor(location: Location, owner: Entity) {
    super('PROJECTILE', location, 1, owner);
  }

  public degresVelocity(degres: number, speed: number): this {
    this.movement.setDirectionByDegres(degres);
    this.movement.setSpeed(speed);
    return this;
  }

  public radianVelocity(radian: number, speed: number): this {
    this.movement.setDirectionByRadian(radian);
    this.movement.setSpeed(speed);
    return this;
  }

  public pointVelocity(vector: Vector, speed: number): this {
    this.movement.setDirectionByPoints(this.location.vector, vector);
    this.movement.setSpeed(speed);
    return this;
  }

  protected onUpdate(): void {
    if (this.tickLived >= MAX_TICK_LIVED) {
      this.remove();
    }
  }

  public collide(entity: Entity): void {
    this.remove();
  }
}
