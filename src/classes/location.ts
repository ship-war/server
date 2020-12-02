import { Copyable, Vector } from '../models';
import { World } from './world';
import { distance } from '../utils';

export class Location implements Copyable<Location> {
  private environment: World;
  private readonly coordonate: Vector<number>;

  constructor(world: World, x: number = 0, y: number = 0) {
    this.environment = world;
    this.coordonate = { x, y };
  }

  public get position(): Vector { return this.coordonate; }
  public get x(): number { return this.coordonate.x; }
	public get y(): number { return this.coordonate.y; }
  public get world(): World { return this.environment; }
  public get vector(): Vector { return this.coordonate; }

	public distance(location: Location): number {
    return distance(this.x, this.y, location.x, location.y);
  }
  
  public addVector(vector: Vector): void {
    this.coordonate.x += vector.x;
    this.coordonate.y += vector.y;
  }

	public copy(): Location {
		return new Location(this.world, this.x, this.y);
	}
}
