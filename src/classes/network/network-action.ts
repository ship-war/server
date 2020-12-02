import {
  Action,
  ActionResponse,
  ActionType,
  DoActionRequest,
  DoActionResponse,
  Map,
  Opt,
  Nullable,
  SetSpeedAction,
  SetDirectionAction,
  FireAction
} from '../../models';
import { Ship, Projectile } from '../entities';
import { response } from 'express';

type ActionExecutor = (action: Action, ship: Ship) => ActionResponse;

const ACTIONS_MAP: Map<ActionExecutor> = {
  SET_SPEED: setSpeedAction,
  SET_DIRECTION: setDirectionAction,
  FIRE: fireAction
};

function fireAction(action: FireAction, ship: Ship): ActionResponse {
  const projectile: Nullable<Projectile> = ship.fire(action);

  return projectile ? {
    done: true,
    data: {
      id: projectile.id
    }
  } : {
    done: false,
    error: {
      code: 'CAN_NOT_FIRE'
    }
  };
}

function setSpeedAction(action: SetSpeedAction, ship: Ship): ActionResponse {
  return {
    done: true,
    data: {
      speed: ship.setSpeedPower(action.power)
    }
  };
}

function setDirectionAction(action: SetDirectionAction, ship: Ship): ActionResponse {
  return {
    done: true,
    data: {
      direction: ship.setMovementDirection(action)
    }
  };
}

export function processActions(actions: DoActionRequest, ship: Ship): DoActionResponse {
  return Object.keys(actions).reduce((response: DoActionResponse, actionType: ActionType) => {
    const executor: Opt<ActionExecutor> = ACTIONS_MAP[actionType.toUpperCase()] as Opt<ActionExecutor>;

    if (executor) {
      response[actionType.toUpperCase()] = executor(actions[actionType], ship);
    } else {
      response[actionType.toUpperCase()] = {
        done: false
      } as ActionResponse;
    }

    return response;
  }, {} as DoActionResponse);
}