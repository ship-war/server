import { EntityType, ID } from '../models';
import { Vector } from './vector';
import { Map } from './type';

export type ActionType =
'SET_SPEED' |
'SET_DIRECTION' |
'FIRE';

export type DirectionType = 'POINT' | 'RADIAN' | 'DEGRES';

export interface Action {
  type: ActionType;
}

export interface SetSpeedAction extends Action {
  type: 'SET_SPEED';
  power: number;
}

export interface DirectionAction {
  directionType: DirectionType;
  radian: number;
  degres: number;
  point: Vector;
}

export interface SetDirectionAction extends Action, DirectionAction {
  type: 'SET_DIRECTION';
}

export interface FireAction extends Action, DirectionAction {
  type: 'FIRE';
}

export type ActionResponse = FailActionResponse | SuccessActionResponse;

export interface AActionResponse {
  done: boolean;
}

export interface FailActionResponse extends AActionResponse {
  done: false;
  error: {
    code: string;
  };
}

export interface SuccessActionResponse extends AActionResponse {
  done: true;
  data?: Map
}

export interface AuthenticateRequest {
  username: string;
}

export interface MapResponse {
  map: {
    radius: number;
    id: string;
    entities: Array<NetEntity>;
  };
  users: Array<User>;
}

export interface AuthenticateResponse extends MapResponse {
  user: User;
}

export interface DoActionRequest {
  [action: string]: Action;
}

export interface DoActionResponse {
  [action: string]: ActionResponse;
}

export interface User {
  token: string;
  shipId: string;
  name: string;
}

export interface NetEntity {
  id: ID;
  type: EntityType;
  position: Vector;
  movement: NetMovement;
  radius: number;
  mass: number;
  health: number;
  parent: ID;
}

export interface NetMovement {
  speed: number;
  direction: Vector;
}
