import {
  Copyable,
  EntityType,
  ID,
  Identifiable,
  nextId,
  Vector,
  Nullable,
  NetEntity
} from '../../models';
import { Location } from '../location';
import { Movement } from '../movement';
import { World } from '../world';

export class Entity implements Identifiable, Copyable<Entity> {
  public readonly id: ID;
  public readonly type: EntityType;
  public readonly location: Location;
  protected radius: number;
  public readonly movement: Movement;
  protected shouldRemove: boolean = false;
  protected tickLived: number = 0;
  private parent: Nullable<Entity> = null;

  constructor(type: EntityType, location: Location, radius: number, owner: Nullable<Entity> = null) {
    this.id = nextId();
    this.type = type;
    this.location = location.copy();
    this.radius = radius;
    this.movement = new Movement();
    this.parent = owner;
  }

  public get size(): number { return this.radius; }
  public get owner(): Nullable<Entity> { return this.parent; }
  public get world(): World { return this.location.world; }

  public getMass(): number {
    return this.radius;
  }

  public remove(): void {
    this.shouldRemove = true;
  }

  public isCollide(entity: Entity): boolean {
    return this.getDistanceFromBorder(entity) < 0;
  }

  public isAlive(): boolean {
    return !this.shouldRemove;
  }

  public getOlderParent(): Entity {
    if (!this.owner) {
      return this;
    }
    return this.owner.getOlderParent();
  }

  public hasParentRelation(entity: Entity): boolean {
    return this.getOlderParent().id === entity.getOlderParent().id;
  }

  public own(entity: Entity): boolean {
    if (!entity.owner) {
      return false;
    }
    if (entity.owner.id === this.id) {
      return true;
    }

    return this.own(entity.owner);
  }

  public collide(entity: Entity): void {}
  public onSpawn(): void {}
  protected onUpdate(): void {}
  public onDispawn(): void {}

  public update(): void {
    this.move();
    this.onUpdate();
    this.tickLived ++;
  }

  public move(): void {
    this.location.addVector(this.movement.getVelocity());
  }

  public getDistanceFromCenter(entity: Entity): number {
    return this.location.distance(entity.location);
  }

  public getDistanceFromBorder(entity: Entity): number {
    return this.getDistanceFromCenter(entity) - this.size - entity.size;
  }

  public moveToward(position: Vector): void {
    this.movement.setDirectionByPoints(this.location.position, position);
  }

  public toNetEntity(): NetEntity {
    return {
      id: this.id,
      type: this.type,
      position: this.location.vector,
      movement: this.movement.toNet(),
      radius: this.radius,
      mass: this.getMass(),
      health: 0,
      parent: this.getOlderParent().id
    };
  }

  public copy(): Entity {
    return new Entity(this.type, this.location, this.radius);
  }
}
