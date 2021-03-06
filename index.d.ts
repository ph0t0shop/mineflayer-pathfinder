import { Bot } from 'mineflayer';
import { IndexedData } from 'minecraft-data';
import { Item } from 'prismarine-item';
import { Vec3 } from 'vec3';
import { Block } from 'prismarine-block';
import { Entity } from 'prismarine-entity';

declare module 'mineflayer-pathfinder' {
	export function pathfinder(bot: Bot): void;

	export interface Pathfinder {
		thinkTimeout: number;
		readonly goal: goals.Goal | null;
		readonly movements: Movements;

		bestHarvestTool(block: Block): Item | null;
		getPathTo(
			movements: Movements,
			goal: goals.Goal,
			done: (result: ComputedPath) => void,
			timeout?: number
		): void;
		setGoal(goal: goals.Goal, dynamic?: boolean): void;
		setMovements(movements: Movements): void;
		goto(goal: goals.Goal, callback: Callback): void;

		isMoving(): boolean;
		isMining(): boolean;
		isBuilding(): boolean;
		isThinking(): boolean;
	}

	export namespace goals {
		export abstract class Goal {
			public abstract heuristic(node: Move): number;
			public abstract isEnd(node: Move): boolean;
			public abstract hasChanged(): boolean;
		}

		export class GoalBlock extends Goal {
			public constructor(x: number, y: number, z: number);

			public x: number;
			public y: number;
			public z: number;

			public heuristic(node: Move): number;
			public isEnd(node: Move): boolean;
			public hasChanged(): boolean;
		}

		export class GoalNear extends Goal {
			public constructor(x: number, y: number, z: number, range: number);

			public x: number;
			public y: number;
			public z: number;
			public rangeSq: number;

			public heuristic(node: Move): number;
			public isEnd(node: Move): boolean;
			public hasChanged(): boolean;
		}

		export class GoalXZ extends Goal {
			public constructor(x: number, z: number);

			public x: number;
			public z: number;

			public heuristic(node: Move): number;
			public isEnd(node: Move): boolean;
			public hasChanged(): boolean;
		}

		export class GoalY extends Goal {
			public constructor(y: number);

			public y: number;

			public heuristic(node: Move): number;
			public isEnd(node: Move): boolean;
			public hasChanged(): boolean;
		}

		export class GoalGetToBlock extends Goal {
			public constructor(x: number, y: number, z: number);

			public x: number;
			public y: number;
			public z: number;

			public heuristic(node: Move): number;
			public isEnd(node: Move): boolean;
			public hasChanged(): boolean;
		}

		export class GoalCompositeAny extends Goal {
			public goals: Goal[];
			
			public push(goal: Goal): void;
			public heuristic(node: Move): number;
			public isEnd(node: Move): boolean;
			public hasChanged(): boolean;
		}

		export class GoalCompositeAll extends Goal {
			public goals: Goal[];

			public push(goal: Goal): void;
			public heuristic(node: Move): number;
			public isEnd(node: Move): boolean;
			public hasChanged(): boolean;
		}

		export class GoalInvert extends Goal {
			public constructor(goal: Goal);
			
			public goal: Goal;

			public heuristic(node: Move): number;
			public isEnd(node: Move): boolean;
			public hasChanged(): boolean;
		}

		export class GoalFollow extends Goal {
			public constructor(entity: Entity, range: number);

			public x: number;
			public y: number;
			public z: number;
			public entity: Entity;
			public rangeSq: number;

			public heuristic(node: Move): number;
			public isEnd(node: Move): boolean;
			public hasChanged(): boolean;
		}
	}

	export class Movements {
		public constructor(bot: Bot, mcData: IndexedData);

		public bot: Bot;

		public canDig: boolean;
		public dontCreateFlow: boolean;
		public allow1by1towers: boolean;
		public allowFreeMotion: boolean;
		public allowParkour: boolean;
		
		public blocksCantBreak: Set<number>;
		public blocksToAvoid: Set<number>;
		public liquids: Set<number>;
		public scafoldingBlocks: number[];

		public maxDropDown: number;
		public digCost: number;

		public countScaffoldingItems(): number;
		public getScaffoldingItem(): Item | null;
		public getBlock(pos: Vec3, dx: number, dy: number, dz: number): SafeBlock;
		public safeToBreak(block: SafeBlock): boolean;
		public safeOrBreak(block: SafeBlock): number;
		public getMoveJumpUp(node: Move, dir: XZCoordinates, neighbors: Move[]): void;
		public getMoveForward(node: Move, dir: XZCoordinates, neighbors: Move[]): void;
		public getMoveDiagonal(node: Move, dir: XZCoordinates, neighbors: Move[]): void;
		public getMoveDropDown(node: Move, dir: XZCoordinates, neighbors: Move[]): void;
		public getMoveParkourForward(node: Move, dir: XZCoordinates, neighbors: Move[]): void;
		public getMoveJumpUp(node: Move, dir: XZCoordinates, neighbors: Move[]): void;
		public getMoveUp(node: Move, neighbors: Move[]): void;
		public getMoveDown(node: Move, neighbors: Move[]): void;
		public getLandingBlock(node: Move, dir: XZCoordinates): SafeBlock;
		public getNeighbors(node: Move): Move[];
	}

	// this is a class, but its not exported so we use an interface
	export interface Move extends XYZCoordinates {
		remainingBlocks: number;
		cost: number;
		toBreak: Move[];
		toPlace: Move[];
		parkour: boolean;
		hash: string;
	}

	type Callback = (error?: Error) => void;

	export interface ComputedPath {
		status: 'noPath' | 'timeout' | 'success';
		cost: number;
		time: number;
		visitedNodes: number;
		generatedNodes: number;
		path: Move[];
	}

	export interface XZCoordinates {
		x: number;
		z: number;
	}

	export interface XYZCoordinates extends XZCoordinates {
		y: number;
	}

	export interface SafeBlock extends Block {
		safe: boolean;
		physical: boolean;
		liquid: boolean;
		height: number;
	}
}
