import { Entity } from './entity';
import { Location } from '../location';
import {
  EntityType,
  Nullable,
  NetEntity
} from '../../models';

export class LivingEntity extends Entity {

  private maxHealth: number = 10;
  private health: number = 10;

  constructor(
    type: EntityType,
    location: Location,
    radius: number,
    owner: Nullable<Entity> = null
  ) {
    super(type, location, radius, owner);
  }

  public get hp(): number { return this.health; }
  public get maxHp(): number { return this.maxHealth; }

  public setMaxhealth(maxHealth: number): this {
    if (maxHealth < 1) {
      maxHealth = 1;
    }

    this.maxHealth = maxHealth;

    if (this.health > maxHealth) {
      this.health = maxHealth;
    }

    return this;
  }

  public setHealth(health: number): this {
    if (health < 1) {
      health = 1;
    } else if (health > this.maxHealth) {
      health = this.maxHealth;
    }

    this.health = health;

    return this; 
  }

  private addhealth(health: number): number {
    this.health += health;

    if (this.health < 0) {
      this.health = 0;
    } else if (this.health > this.maxHealth) {
      this.health = this.health;
    }

    return this.hp;
  }

  public damage(value: number, damager: Nullable<Entity>): void {
    this.addhealth(-value);
  }

  public heal(value: number, healer: Nullable<Entity>): void {
    this.addhealth(value);
  }

  public isAlive(): boolean {
    return super.isAlive() && this.hp > 0;
  }

  public toNetEntity(): NetEntity {
    return {
      ...super.toNetEntity(),
      health: this.health,
    };
  }
}
