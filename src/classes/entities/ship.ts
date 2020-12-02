import { Entity } from './entity';
import { LivingEntity } from './living-entity';
import { Projectile } from './projectile';
import { Location } from '../location';
import { DirectionAction, Nullable, Vector } from '../../models';
import * as moment from 'moment';

const RELOAD_TIME: number = 100;
const MAX_SPEED: number = 10;

export class Ship extends LivingEntity {
  private lastShot: number = 0;

  constructor(location: Location) {
    super('SHIP', location, 5);
  }

  public canShot(): boolean {
    return moment().valueOf() - this.lastShot >= RELOAD_TIME;
  }

  public fire(directionAction: DirectionAction): Nullable<Projectile> {
    if (!this.canShot()) {
      return null;
    }

    const projectile: Projectile = this.world.spawn(new Projectile(
      this.location,
      this
    ));

    projectile.movement.setDirectionByAction(directionAction, this.location.vector);
    projectile.movement.setSpeed(1);

    this.lastShot = moment().valueOf();

    return projectile;
  }

  public setSpeedPower(percent: number): number {
    if (percent < 0) {
      percent = 0;
    } else if (percent > 100) {
      percent = 100;
    }
    this.movement.setSpeed(MAX_SPEED * percent / 100);

    return this.movement.getSpeed();
  }

  public setMovementDirection(directionAction: DirectionAction): Vector {
    this.movement.setDirectionByAction(directionAction, this.location.vector);

    return this.movement.getVelocity();
  }

  public collide(entity: Entity): void {
    this.damage(entity.getMass(), entity);
  }
}
