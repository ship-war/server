import {
  Copyable,
  ID,
  Identifiable,
  nextId
} from '../models';
import { distance } from '../utils';
import { ArrayMap } from './arraymap';
import { Entity, Ship } from './entities';
import { Location } from './location';
import { GameInstance } from './game';

export class World implements Identifiable, Copyable<World> {
  public readonly id: ID;
  public readonly name: string;
  public readonly radius: number;
  public readonly entities: ArrayMap<Entity> = new ArrayMap();

  constructor(radius: number) {
    this.id = nextId();
    this.name = `WORLD_${this.id}`;
    this.radius = radius;
  }

  private removeDeadEntities(): void {
		this.entities.filter(
			(entity: Entity) => entity.isAlive(),
			(entity: Entity) => {
        entity.onDispawn();
        GameInstance.fireEvent('ENTITY_DIE', { entity });
      }
		);
  }

  private isOutOfWorld(entity: Entity): boolean {
    return distance(
      entity.location.x,
      entity.location.y,
      0,
      0
    ) > (this.radius - entity.size);
  }

  public update(): void {
    this.entities.forEach((entity: Entity) => {
      entity.update();
      if (this.isOutOfWorld(entity)) {
        entity.remove();
      }
    });

    this.removeDeadEntities();

    const length: number = this.entities.length;

    if (length < 2) return;

		for (let i = 0; i < length; i++) {
			for (let j = i + 1; j < length; j++) {
				const leftEntity: Entity = this.entities.get(i) as Entity;
				const rightEntity: Entity = this.entities.get(j) as Entity;

				if (!leftEntity.hasParentRelation(rightEntity) && leftEntity.isCollide(rightEntity)) {
					leftEntity.collide(rightEntity);
					rightEntity.collide(leftEntity);
				}
			}
    }
    
    this.removeDeadEntities();
  }

  public spawn<T extends Entity>(entity: T): T {
    this.entities.push(entity);
    entity.onSpawn();
    return entity;
  }

  public spawnShip(): Entity {
    return this.spawn(new Ship(new Location(
      this,
      Math.ceil(Math.cos(Math.random() * Math.PI * 2) * this.radius * 0.5),
      Math.ceil(Math.sin(Math.random() * Math.PI * 2) * this.radius * 0.5)
    )));
  }

  public copy(): World {
    return new World(this.radius);
  }
}
