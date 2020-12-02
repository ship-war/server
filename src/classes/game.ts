import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { World } from './world';
import { NullableString, EventType, Map } from '../models';
import { Network } from './network';

const FPS: number = 60;

type EventCallback = (args: Map) => void;

export class Game {
  private readonly mainWorld: World = new World(250);
	private readonly timeBetweenFrame: number;
	private instanceId: NullableString = null;
	public readonly network: Network;
	private readonly eventCallbacks: Map<Array<EventCallback>> = {};

  constructor() {
		this.timeBetweenFrame = 1000 / FPS;
		this.network = new Network(this);
  }

  public start(): void {
		if (this.instanceId) return;

		this.instanceId = uuid();

    console.log('Starting game...');
		this.nextTick(this.instanceId);
	}

	private nextTick(instanceId: NullableString): void {
		if (!this.instanceId || this.instanceId !== instanceId) return;

		const start: number = moment().valueOf();
		this.update();
		const elapsedTime: number = moment().valueOf() - start;

		if (elapsedTime > this.timeBetweenFrame) {
			this.nextTick(instanceId);
		} else {
			setTimeout(() => this.nextTick(instanceId), this.timeBetweenFrame - elapsedTime);
		}
	}

  private update(): void {
    this.mainWorld.update();
  }

  public getWorld(): World {
    return this.mainWorld;
	}
	
	public onEvent(event: EventType, callback: EventCallback): void {
		const key: string = event.toUpperCase();
		if (!this.eventCallbacks[key]) {
			this.eventCallbacks[key] = [];
		}

		this.eventCallbacks[key].push(callback);
	}

	public fireEvent(event: EventType, args: Map): void {
		const callbacks: Array<EventCallback> = this.eventCallbacks[event.toUpperCase()] || [];

		callbacks.forEach((callback: EventCallback) => callback(args));
	}
}

export const GameInstance: Game = new Game();
